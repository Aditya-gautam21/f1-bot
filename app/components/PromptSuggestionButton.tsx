// components/PromptSuggestionButton.tsx
import React from 'react';

interface PromptSuggestionButtonProps {
  text: string;
  onClick: () => void;
}

const PromptSuggestionButton: React.FC<PromptSuggestionButtonProps> = ({ text, onClick }) => {
  return (
    <button onClick={onClick} className="prompt-suggestion-button">
      {text}
    </button>
  );
};

export default PromptSuggestionButton;  // Ensure this default export is present
