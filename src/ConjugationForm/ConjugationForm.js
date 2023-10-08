import './ConjugationForm.css';
import { useEffect, useState, useRef } from "react";

// https://gyazo.com/c203a3866f47d2b37bbba6114462bb72
// ^ That's what I eventually want this shit looking like.
function ConjugationForm(props) {
    const [questionObj, setQuestionObj] = useState(null)
    const [answer, setAnswer] = useState("")
    const [isCorrect, setIsCorrect] = useState(null);

    const speak = () => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(props.questionObj["infinitive"]);
        utterance.lang = 'ru-RU';
        synth.speak(utterance);
    };

    // Set the answer so we can compare it to the form input.
    useEffect(() => {
        let isValidQuestion = (setQuestionObj !== null)
        if (isValidQuestion) {
            setQuestionObj(props.questionObj)
            setAnswer(props.questionObj["answer"])
        }
    }, [props.questionObj])

    useEffect(() => {
        if (isCorrect !== null) {
            const timer = setTimeout(() => {
                setIsCorrect(null); // Reset correctness after animation.
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isCorrect]);

    // If nothing's been initialised.
    if (questionObj === null) {
        return;
    }

    function handleInputChange(event) { // <input>
        props.setInputValue(event.target.value);
    };

    function onClickSubmit() {
        if (props.inputValue === answer) {
            console.log("Good!")
            setIsCorrect(true);
            props.setInputValue(""); // Reset it.
            if (props.questionIdx == props.questionSetSize - 1) {
                props.setQuestionIdx(0)
            } else {
                props.setQuestionIdx(props.questionIdx + 1)
            }
        } else {
            console.log("Wrong answer lad.")
            setIsCorrect(false);
        }
    }

    return (
        <div className="question-container">
            {<div className="question-card">
                <div className="text-container">
                    <p className='sentence-text'><strong>Question: </strong>{props.questionObj["subject"]} ________.</p>
                    <div className="infinitive-container">
                        <p className="infinitive-text"><strong>Infinitive:</strong> {props.questionObj["infinitive"]} ({props.questionObj["infinitive_meaning"]})</p>
                        <button className="speak-button" onClick={speak}>🐙</button>
                    </div>
                </div>
                <div className="input-and-button-container">
                    <input ref={props.inputRef}
                        value={props.inputValue} onChange={handleInputChange} className="answer-input" type="text" />
                    <div className="submit-and-emoji-container">
                        <button
                            disabled={isCorrect !== null}
                            onClick={onClickSubmit}
                            className="submit-button">
                            Submit
                        </button>
                        <p className={`correctness-emoji ${isCorrect === true ? 'growAndShine' : isCorrect === false ? 'shake' : ''}`}>
                            🗿
                        </p>
                    </div>
                </div>
            </div>}
        </div>
    );
}

export default ConjugationForm;
