import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import OpenAI from "openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import "dotenv/config";

type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

const {
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY
} = process.env;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

const f1DataUrl = 'https://en.wikipedia.org/wiki/Formula_One';

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100
});

const createCollection = async (metric: SimilarityMetric = "dot_product") => {
    try {
        const res = await db.createCollection(ASTRA_DB_COLLECTION, {
            vector: {
                dimension: 1536,
                metric: metric
            }
        });
        console.log("Collection created:", res);
    } catch (e) {
        console.log("Collection may already exist.");
    }
};

const loadSampleData = async () => {
    const collection = await db.collection(ASTRA_DB_COLLECTION);
    console.log(`Scraping data from ${f1DataUrl}...`);

    const loader = new PuppeteerWebBaseLoader(f1DataUrl);
    const docs = await loader.load();
    const content = docs[0].pageContent;

    const chunks = await splitter.splitText(content);
    console.log(`Processing ${chunks.length} chunks...`);

    const batchSize = 50;
    for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        console.log(`Processing batch ${i / batchSize + 1}...`);

        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: batch,
            encoding_format: "float"
        });

        for (let j = 0; j < embedding.data.length; j++) {
            const vector = embedding.data[j].embedding;
            const textChunk = batch[j];

            await collection.insertOne({
                $vector: vector,
                text: textChunk
            });
        }
    }

    console.log("Data loading complete.");
};

const main = async () => {
    await createCollection();
    await loadSampleData();
};

main();