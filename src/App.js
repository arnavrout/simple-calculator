import React, {useState} from 'react';
import './App.css';
import './Calculator.css';
import * as math from 'mathjs';

function App() {

  //state to manage input field
  const [input, setInput] = useState('');
  
  //state to manage scientific calculate buttons display
  const [showScientificButtons, setShowScientificButtons] = useState(false);

  //state to manage history button
  const [history, setHistory] = useState([]);

  //state to manage opeartions history display
  const [showHistory, setShowHistory] = useState(false);

  const MAX_HISTORY_LENGTH = 5; //we can see upto last 5 operations performed

  const handleButtonClick = (value) => {
    // Handling the equals button to evaluate the expression
    if (value === '=') {

      //Handling the modulus operation
      try {
        let result = math.evaluate(input);
        if (input.includes('%')) {
          const parts = input.split('%');
          if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            const num = parseFloat(parts[0]);
            const percentage = parseFloat(parts[1]);
            result = (num * (percentage / 100)).toFixed(2);
          }
        }

        if (isNaN(result) || !isFinite(result)) {
          throw new Error('Error');
        }

        setInput(result.toString());
        setHistory((prevHistory) => {
          const newHistory = [...prevHistory];
          if (newHistory.length >= MAX_HISTORY_LENGTH) {
            newHistory.pop();
          }
          newHistory.unshift(input);
          return newHistory;
        });
      } catch (error) {
        setInput('Error! Press CE');
      }
    }  

    // Handling the clear button to clear the input
    else if (value === 'C') {
      setInput('');
    }

    // Handling the back button to  remove the last character
    else if (value === 'B') {
      if (input !== 'Invalid √ Input! Press CE' && input !== 'Error! Press CE' && input !== 'Invalid EXP Input! Press CE') {
        setInput(input.slice(0, -1));
      }
    } 

    else if (value === 'Next') {
      // Toggling the visibility of scientific buttons
      setShowScientificButtons((prev) => !prev);
    } 

    else if (value === 'History') {
      // Toggling the visibility of history button
      setShowHistory((prev) => !prev);
    } 

    //Handling the modulous operation
    else if (value === '√') {
      try {
        const num = parseFloat(input);
        if (isNaN(num)) {
          throw new Error('Invalid √ Input! Press CE');
        }
        const result = Math.sqrt(num).toFixed(2);
        setInput(result.toString());
        setHistory((prevHistory) => {
          const newHistory = [...prevHistory];
          if (newHistory.length >= MAX_HISTORY_LENGTH) {
            newHistory.pop();
          }
          newHistory.unshift(`√(${num}) = ${result}`);
          return newHistory;
        });
      } catch (error) {
        setInput(error.message);
      }
    } 

    // Handling the exponential operation
    else if (value === 'EXP') {
      try {
        const num = parseFloat(input);
        if (isNaN(num)) {
          throw new Error('Invalid EXP Input! Press CE');
        }
        const result = Math.exp(num).toFixed(2);
        setInput(result.toString());
        setHistory((prevHistory) => {
          const newHistory = [...prevHistory];
          if (newHistory.length >= MAX_HISTORY_LENGTH) {
            newHistory.pop();
          }
          newHistory.unshift(`e^(${num}) = ${result}`);
          return newHistory;
        });
      } catch (error) {
        setInput(error.message);
      }
    } 

    else {
      //For all other buttons, appending the value to the input with handling error messages
      if (input !== 'Invalid √ Input! Press CE' && input !== 'Error! Press CE' && input !== 'Invalid EXP Input! Press CE') {
        setInput(input + value);
      }
    }

  };

  //Adding the keyboard support so that user can input using keyboard also
  const handleKeyDown = (event) => {
    const key = event.key;
    //Validating input fileds (numbers, operators, etc.)
    if (/[0-9+\-*/.=%]/.test(key)) {
      handleButtonClick(key);
    } else if (key === 'Backspace') {
      event.preventDefault();
      handleButtonClick('B');
    } else if (key === 'Enter') {
      event.preventDefault();
      handleButtonClick('=');
    }
  };

  //Function to display the last 5 operations history
  const renderHistory = () => {
    return history.map((item, index) => (
      <span key={index}>{item}, </span>
    ));
  };
  

  return (
    <div>
    <h1 className='textCenter'>Calculator</h1>

    <div className='container flex flexCol itemsCenter'>
    <div className="row">
      <input className='input' type='text' placeholder='calculate here!' value={input} readOnly onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} />
    </div>
      <div className="row">
        <button className='button' onClick={() => handleButtonClick('7')}>7</button>
        <button className='button' onClick={() => handleButtonClick('8')}>8</button>
        <button className='button' onClick={() => handleButtonClick('9')}>9</button>
        <button className='button' onClick={() => handleButtonClick('*')}>X</button>
      </div>
      <div className="row">
        <button className='button' onClick={() => handleButtonClick('4')}>4</button>
        <button className='button' onClick={() => handleButtonClick('5')}>5</button>
        <button className='button' onClick={() => handleButtonClick('6')}>6</button>
        <button className='button' onClick={() => handleButtonClick('-')}>-</button>
      </div>
      <div className="row">
        <button className='button' onClick={() => handleButtonClick('1')}>1</button>
        <button className='button' onClick={() => handleButtonClick('2')}>2</button>
        <button className='button' onClick={() => handleButtonClick('3')}>3</button>
        <button className='button' onClick={() => handleButtonClick('+')}>+</button>
      </div>
      <div className="row">
        <button className='button' onClick={() => handleButtonClick('0')}>0</button>
        <button className='button' onClick={() => handleButtonClick('.')}>.</button>
        <button className='equalbutton' onClick={() => handleButtonClick('=')}>=</button>
        <button className='button' onClick={() => handleButtonClick('/')}>/</button>
      </div>
      <div className="rowResult">
        <button className='button' onClick={() => handleButtonClick('C')}>CE</button>
        <button className='button' onClick={() => handleButtonClick('B')}>&#x21A9;</button>
        <button className='button' onClick={() => handleButtonClick('History')}>H</button>
        <button className='button' onClick={() => handleButtonClick('Next')} >&#x4E2A;</button>
      </div>

      {/* Scientific Calculators Buttons */}
      {showScientificButtons && (
          <div className="row">
            <button className='button' onClick={() => handleButtonClick('%')}>%</button>
            <button className='button' onClick={() => handleButtonClick('√')}>√</button>
            <button className='button' onClick={() => handleButtonClick('EXP')}>EXP</button>
          </div>
        )}
        {showHistory && history.length > 0 && (
          <div className="history-container">
          <h2  className='textHistory'>History</h2>
          <div>{renderHistory()}</div>
          </div>
        )}
    </div>
    </div>
  );
}

export default App;