'use client';

import Image from 'next/image';
import f1GPTLogo from './assets/f1gptlogo.png';
import { useChat } from "@ai-sdk/react";
import { Message } from "ai";  // Correct import for Message type
import Bubble from "@/app/components/Bubble";
import LoadingBubble from "@/app/components/LoadingBubble";
import PromptSuggestionsRow from "@/app/components/PromptSuggestionsRow";

export default function Home() {
  const {
    append,
    isLoading,
    messages,
    input,
    handleInputChange,
    handleSubmit,
    error  // Added for optional error handling
  } = useChat({
    api: '/api/chat'  // Specify your API endpoint here (e.g., for streaming responses)
  });

  const noMessages = !messages || messages.length === 0;

  const handlePrompt = (promptText: string) => {
    const msg: Message = {
      id: typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2, 9), // fallback id
      content: promptText,
      role: "user"
    };
    append(msg);
  };

  return (
    <main>
      <Image
        src={f1GPTLogo}
        width={250}
        height={250}
        alt="F1GPT Logo"
        priority
      />
      <section className={noMessages ? '' : 'populated'}>
        {noMessages ? (
          <>
            <p className="starter-text">
              The ultimate place for f1 fans!
            </p>
            <br />
            <PromptSuggestionsRow onPromptClick={handlePrompt} />
          </>
        ) : (
          <>
            {messages.map((message, index) => (
              <Bubble key={`message-${index}`} message={message} />
            ))}
            {isLoading && <LoadingBubble />}
          </>
        )}
      </section>
      {error && <p className="error">Error: {error.message}</p>}  // Optional: Display errors
      <form onSubmit={handleSubmit}>
        <input
          className="question-box"
          onChange={handleInputChange}
          value={input}
          placeholder="Ask me something"
        />
        <input type="submit" />
      </form>
    </main>
  );
}
