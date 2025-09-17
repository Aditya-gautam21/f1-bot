const PromptSuggestionButton = ({text, onClick}) => {
    return (
        <button className="prompt-suggestions-button"
        onClick={onClick}>
            {text}
        </button>
    )
}