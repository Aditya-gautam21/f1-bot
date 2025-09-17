'use client';

import Image from 'next/image';
import f1GPTLogo from './assets/f1gptlogo.png';
import { useChat } from "ai/react"
import { Message } from "ai"
import Bubble from "@/app/components/Bubble";
import LoadingBubble from "@/app/components/LoadingBubble";
import PromptSuggestionsRow from "@/app/components/PromptSuggestionsRow";

export default function Home() {
    const {append, isLoading, messages, input, handleInputChange, handleSubmit} = useChat();

    const noMessages = !messages || messages.length === 0;

    const handlePrompt = (promptText) => {
const msg = {
    id:crypto.randomUUID(),
    content: promptText,
    role:"user"
}
append(msg)
    }

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
                    <p className={"starter-text"}>
                        The ultimate place for f1 fans!
                    </p>
                    <br/>
                    <PromptSuggestionsRow onPromptClick = {handlePrompt}/>
                </>
            ) : (
                <>
                {messages.map((message,index) => <Bubble key={'message-${index'} message={message}/>)}
                {isLoading && <LoadingBubble/>}
                </>
            )}
        </section>
         <form onSubmit={handleSubmit}>
                <input className="question-box" onChange={handleInputChange} value={input} placeholder="Ask me something"/>
                 <input type="submit"/>
            </form>
    </main>
  );
}
