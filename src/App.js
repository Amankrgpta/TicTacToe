import React, { useState } from 'react';
import './App.css';

// function App() {
//   return (
//     <div className="App">
//       {
//         /* <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header> */
//       }
//     </div>
//   );
// }
const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winningLine: [a, b, c],
      };
    }
  }

  return null;
};

const Square = ({ value, onClick, isWinner }) => (
  <button className={`square ${isWinner ? 'winner' : ''}`} onClick={onClick}>
    {value}
  </button>
);

const Board = ({ squares, onClick, winningLine }) => {
  const renderSquare = (i) => (
    <Square key={i} value={squares[i]} onClick={() => onClick(i)} isWinner={winningLine && winningLine.includes(i)} />
  );

  const renderBoardRow = (row) => (
    <div key={row} className="board-row">
      {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
    </div>
  );

  return (
    <div>
      {[0, 1, 2].map((row) => renderBoardRow(row))}
    </div>
  );
};

const Game = () => {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), moveLocation: null }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [sortAsc, setSortAsc] = useState(true);

  const current = history[stepNumber];
  const winnerInfo = calculateWinner(current.squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningLine = winnerInfo ? winnerInfo.winningLine : null;

  const moves = history.map((step, move) => {
    const desc = move ? `Go to move #${move} (${step.moveLocation})` : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)} className={stepNumber === move ? 'current-move' : ''}>
          {desc}
        </button>
      </li>
    );
  });

  const handleSortToggle = () => {
    setSortAsc(!sortAsc);
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const handleClick = (i) => {
    const newHistory = history.slice(0, stepNumber + 1);
    const currentBoard = newHistory[newHistory.length - 1];
    const squares = currentBoard.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? 'X' : 'O';
    setHistory([...newHistory, { squares, moveLocation: `(${Math.floor(i / 3) + 1}, ${i % 3 + 1})` }]);
    setStepNumber(newHistory.length);
    setXIsNext(!xIsNext);
  };

  const getStatus = () => {
    if (winner) {
      return `Winner: ${winner}`;
    } else if (stepNumber === 9) {
      return 'Draw!';
    } else {
      return `Next player: ${xIsNext ? 'X' : 'O'}`;
    }
  };

  const sortedMoves = sortAsc ? moves : moves.slice().reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={handleClick} winningLine={winningLine} />
      </div>
      <div className="game-info">
        <div>{getStatus()}</div>
        <button onClick={handleSortToggle}>Sort {sortAsc ? 'Descending' : 'Ascending'}</button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
};

 export default Game;

// export default App;
