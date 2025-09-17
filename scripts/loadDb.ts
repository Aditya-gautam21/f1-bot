import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import OpenAI from "openai";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitters";

import "dotenv/config";
import {metrics, vectors} from "weaviate-client";
import {SimilarityMetric} from "@langchain/community/dist/vectorstores/rockset";

type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

const{
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY
} = process.env

const openai = new OpenAI({apiKey: OPENAI_API_KEY})

const f1Data = [
    'https://en.wikipedia.org/wiki/Formula_One'
]

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, {namespace: ASTRA_DB_NAMESPACE })

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverap: 100
})

const createCollection = async (SimilarityMetric = "dot_product") => {
     const res = await db.createCollection(ASTRA_DB_COLLECTION,{
        vector:
    {
        dimension:1536,
        metric: similarityMetric
    }
        })
    console.log(res)
}

const loadSampleData = async () => {
    const collection = await db.collection(ASTRA_DB_COLLECTION)
    for await (const url of f1Data){
        const content = await scrapePage(url)
        const chunks = await splitter.splitText(content)
        for await (const chunk of chunks){
            const embedding = await openai.embeddings.create({
                model:"text-embedding-3-small",
                input: chunk,
                encoding_format: "float"
            })
            const vector = embedding.data[0].embedding

            const res = await collection.insertOne({
                $vector : vector,
                text: chunk
            })
            console.log(res)
        }
    }
}

const scrapePage = async (url: string) => {
    const loader = new PuppeteerWebBaseLoader(url,  {
        launchOptions: {
            headless: true
        },
        gotoOptions: {
            waitUntil: "domcontentloaded"
        },
        evaluate: async (page,  browser) => {
            const result = await page.evaluate(() => document.body.innerHTML)
            await browser.close()
            return result
        }
    })
    return (await loader.scrape())?.replace(/<[^>]*>?/gm, '')
}

createCollection().then(() => loadSampleData())