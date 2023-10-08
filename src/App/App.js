import ConjugationForm from '../ConjugationForm/ConjugationForm';
import RussianKeyboard from '../RussianKeyboard/RussianKeyboard';
import { useState, useEffect, useRef } from 'react';
import './App.css';

// To increment, you'd:
// 1. Add to VERBS,
// 2. Generate a file in IndividualVerbQuestionSets,
// 3. Append to IndividualVerbConjugations.
const VERBS = ['требовать', 'разрушать', 'танцевать', 'ронять', 'поощрять', 'летать', 'хватать', 'ждать', 'улучшать', 'пинать',
  'поднимать', 'плавить', 'измерять', 'пренебрегать', 'заказывать', 'рисовать', 'лизать', 'практиковать', 'претендовать', 'обещать',
  'предотвращать', 'ударять', 'рекомендовать', 'сидеть', 'петь', 'спать', 'храпеть', 'проливать', 'красть', 'ремонтировать',
  'брать', 'делать', 'думать', 'использовать', 'иметь', 'начинать', 'помогать', 'бежать', 'покидать', 'держать',
  'давать', 'изменять', 'позволять', 'открывать', 'любить', 'покупать', 'строить', 'вырезывать', 'убивать', 'продавать',
  'тянуть', 'признавать', 'соглашать', 'избегать', 'умолять', 'кипятить', 'праздновать', 'готовить', 'целовать', 'исследовать',
  'верить', 'вить', 'врать', 'шептать', 'уставать', 'вредить', 'лазить', 'находить', 'звать', 'исчезать',
  'кашлять', 'глотать', 'есть', 'создавать', 'кушать']

VERBS.sort()
const ALL = 'All'

function App() {
  const [bank, setBank] = useState(null)
  const [questions, setQuestions] = useState([]);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [inputValue, setInputValue] = useState(''); // Whatever the bloke types into the <input>.

  // This is the JSON we've got currently loaded.
  const [currentQuestionSet, setCurrentQuestionSet] = useState('бежать')
  const [loading, setLoading] = useState(true);
  const [conjugationMappings, setConjugationMappings] = useState([])
  const [currentConjugationSet, setCurrentConjugationSet] = useState("")
  const [conjugationVisibility, setConjugationVisibility] = useState(true)

  const inputRef = useRef();

  useEffect(() => {
    // 1. Question Bank: this is what I have to resort to if I can't pay server costs. Lol.
    // This is 'All'.
    fetch('/ConjugationSite/IndividualVerbQuestionSets/бежать.json', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        setBank(data);
        preloadQuestions(data); // Preload 150 questions after bank is initialized.
        console.log("Got the bank ready.")
      })
      .catch(error => {
        console.log("Error occured mate: ", error)
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });

    fetch('/ConjugationSite/IndividualVerbConjugations.json', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        setConjugationMappings(data);
        setCurrentConjugationSet(data[currentQuestionSet])
        console.log("Got the bank ready.")
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch(error => {
        console.log("Error occured mate: ", error)
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });

  }, []); // Run when component mounts.

  useEffect(() => {
    if (inputValue.length > 0) {
      console.log("Input mate:", inputValue)
    } else {
      console.log("Empty input as of now.")
    }
  }, [inputValue])

  const preloadQuestions = (data) => {
    let preloadedQuestions = [];
    for (let i = 0; i < 150; i++) {
      const randomIndex = Math.floor(Math.random() * Object.keys(data).length);
      const randomKey = Object.keys(data)[randomIndex];
      preloadedQuestions.push(data[randomKey]);
    }
    setQuestions(preloadedQuestions);
  };

  // If nothing's been initialised yet, show spinner babe.
  if (!bank || loading) {
    return <div className="app-container">
      <p className="loading-txt">Loading...</p>
    </div>;
  }

  if (Object.keys(bank).length === 0) {
    return <div className="app-container">
      <p className="loading-txt">No questions. Weird. Someone touched my JSON.</p>
    </div>;
  }

  function handleSelectChange(event) {
    setLoading(true)
    if (event.target.value === ALL) {
      setCurrentQuestionSet(ALL);
      setLoading(false)
    } else {
      let fileName = event.target.value + ".json"
      fetch('/ConjugationSite/IndividualVerbQuestionSets/' + fileName, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => {
          setBank(data);
          preloadQuestions(data); // Preload 150 questions after bank is initialized.
          console.log("Updated bank mate.")
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        })
        .catch(error => {
          console.log("Error occured mate: ", error)
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        })

      setCurrentQuestionSet(event.target.value)
      setCurrentConjugationSet(conjugationMappings[event.target.value])
    }
  }

  function onToggleClick() {
    setConjugationVisibility(!conjugationVisibility)
  }

  return (
    <div className={`app-container ${loading ? 'fade-out' : 'fade-in'}`}>
      {loading ? (
        <p className="loading-txt fade-out">Loading...</p>
      ) : (
        <div className="container">
          <select className="verb-select" value={currentQuestionSet} onChange={handleSelectChange}>
            {/* As of now, selecting All does nowt. Needs fixing. */}
            {VERBS.map((verb) => (
              <option className="verb-option" key={verb}>{verb}</option>
            ))}
          </select>
          <div className="conjugation-set">
            {currentConjugationSet.map((conjugation) => (
              <p key={conjugation} className={conjugationVisibility ? 'visible-conj' : 'hidden-conj'}>
                {conjugation}
              </p>
            ))}
            <button className="toggle-button" onClick={onToggleClick}>Toggle Visibility</button>
          </div>
          <ConjugationForm
            questionObj={questions[questionIdx]}
            questionIdx={questionIdx}
            questionSetSize={questions.length}
            inputRef={inputRef}
            inputValue={inputValue}
            setInputValue={setInputValue}
            setQuestionIdx={setQuestionIdx}
          />
          <RussianKeyboard
            inputRef={inputRef}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
        </div>
      )}
    </div>
  );
}

export default App;
