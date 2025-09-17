import PromptSuggestionButton from './PromptSuggestionButton'

const PromptSuggestionsRow = (onPromptClick) => {
    const prompts = [
        "Who is the current world champion?",
        "Can Max still win the championship?",
        "What is the salary of the mclaren drivers?",
        "what is a red flag?"
    ]
return (
    <div className="prompt-suggestions-row">
        {prompts.map((prompt, index) => <PromptSuggestionButton key={'suggestion-${index}'}
        text={prompt}
        onClick={() => onPromptClick(prompt)}/>)}
    </div>
)
}

export default PromptSuggestionsRow