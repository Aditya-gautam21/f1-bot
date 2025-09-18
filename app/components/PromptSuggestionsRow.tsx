// components/PromptSuggestionsRow.tsx
import React from 'react';
import PromptSuggestionButton  from './PromptSuggestionButton';

interface PromptSuggestionsRowProps {
  onPromptClick: (promptText: string) => void;
}

const PromptSuggestionsRow: React.FC<PromptSuggestionsRowProps> = ({ onPromptClick }) => {
  const prompts = [
    "Who is the current world champion?",
    "Can Max still win the championship?",
    "What is the salary of the mclaren drivers?",
    "what is a red flag?"
  ];

  return (
    <div className="prompt-suggestions-row">
      {prompts.map((prompt, index) => (
        <PromptSuggestionButton
          key={`suggestion-${index}`}  // Use backticks for template literal to make keys unique (e.g., suggestion-0, suggestion-1)
          text={prompt}
          onClick={() => onPromptClick(prompt)}
        />
      ))}
    </div>
  );
};

export default PromptSuggestionsRow;
