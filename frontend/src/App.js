import React, { useState, useMemo } from 'react';
import './App.css';

/**
 * Light theme palette (from work item style guide)
 * primary: #3b82f6, success: #06b6d4, error: #EF4444,
 * background: #f9fafb, surface: #ffffff, text: #111827
 */

// Utility to calculate the winner of a 3x3 Tic Tac Toe board
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /** Determine if there's a winner for the 3x3 grid.
   * @param {Array<string|null>} squares - array of 9 entries
   * @returns {{winner: 'X'|'O'|null, line: number[]|null}} winner and the winning line indices
   */
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diags
    [2, 4, 6],
  ];
  // Check each line for a winner
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

// Single grid square component
function Square({ value, onClick, highlight }) {
  return (
    <button
      type="button"
      className={`ttt-square${highlight ? ' highlight' : ''}`}
      onClick={onClick}
      aria-label={value ? `Cell with ${value}` : 'Empty cell'}
    >
      {value}
    </button>
  );
}

// Board component renders the 3x3 grid of squares
function Board({ squares, onSquareClick, winningLine }) {
  const renderSquare = (i) => {
    const isHighlight = Array.isArray(winningLine) && winningLine.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        highlight={isHighlight}
      />
    );
  };

  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
      {[0, 1, 2].map((row) => (
        <div key={row} className="ttt-row" role="row">
          {[0, 1, 2].map((col) => {
            const idx = row * 3 + col;
            return (
              <div key={idx} role="gridcell" className="ttt-cell">
                {renderSquare(idx)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// Main Game component encapsulating state and logic
function Game() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line: winningLine } = useMemo(
    () => calculateWinner(squares),
    [squares]
  );

  const isDraw = useMemo(
    () => !winner && squares.every((sq) => sq !== null),
    [winner, squares]
  );

  const status = useMemo(() => {
    if (winner) {
      return `Winner: ${winner}`;
    }
    if (isDraw) {
      return 'Draw!';
    }
    return `Next player: ${xIsNext ? 'X' : 'O'}`;
  }, [winner, isDraw, xIsNext]);

  const handleSquareClick = (i) => {
    // Ignore if game is over or square already filled
    if (winner || squares[i]) return;

    const next = squares.slice();
    next[i] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext((prev) => !prev);
  };

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="game-container">
      <div className="game-card">
        <h1 className="title">Tic Tac Toe</h1>

        <div
          className={`status ${
            winner ? 'status-win' : isDraw ? 'status-draw' : 'status-next'
          }`}
          aria-live="polite"
        >
          {status}
        </div>

        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          winningLine={winningLine}
        />

        <div className="controls">
          <button
            type="button"
            className="btn btn-primary"
            onClick={resetGame}
            aria-label="Reset the game to start a new round"
          >
            Reset / New Game
          </button>
        </div>

        <div className="legend">
          <span className="legend-item">
            <span className="badge badge-x">X</span> Player X
          </span>
          <span className="legend-item">
            <span className="badge badge-o">O</span> Player O
          </span>
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Root application entrypoint for the Tic Tac Toe UI. */
  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;
