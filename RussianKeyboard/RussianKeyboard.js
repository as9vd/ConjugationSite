import "./RussianKeyboard.css";

const RUSSIAN_ALPHABET = [
    'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м',
    'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ',
    'ы', 'ь', 'э', 'ю', 'я',
];

function RussianKeyboard(props) {
    // Whenever one of the letters are clicked mate.
    const handleButtonClick = (letter) => {
        const updatedInput = props.inputValue + letter;
        props.setInputValue(updatedInput);
        props.inputRef.current.focus();
    };

    return (
        <div>
            <div className="alphabet-grid">
                {RUSSIAN_ALPHABET.map((letter) => (
                    <button
                        className="letter-button"
                        key={letter}
                        onClick={() => handleButtonClick(letter)}
                    >
                        {letter}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default RussianKeyboard;
