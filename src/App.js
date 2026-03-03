import {useState} from 'react';

function Square({value, onSquareClick}) {
    return (<button
        className="square"
        onClick={onSquareClick}
    >
        {value}
    </button>);
}

function Board({xIsNext, squares, onPlay}) {
    function handleClick(i) {
        if (squares[i] || calculateWinner(squares)) {
            return;
        }

        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    const numRows = 3;
    const numCols = 3;
    const rowArray = Array.from({length: numRows}, (_, rowIndex) => rowIndex);

    return (<>
        <div className="status">{status}</div>
        {
            rowArray.map((rowIndex) => (
                <div key={rowIndex} className="board-row">
                    {Array.from({length: numCols}, (_, colIndex) => {
                        const squareIndex = rowIndex * numCols + colIndex;
                        return (
                            <Square
                                key={squareIndex}
                                value={squares[squareIndex]}
                                onSquareClick={() => handleClick(squareIndex)}
                            />
                        );
                    })}
                </div>
            ))
        }
    </>);
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = (currentMove % 2) === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move, moves) => {
        let description;
        if (move === moves.length - 1) {
            description = 'You are at move #' + move;
        } else if (move <= 0) {
            description = 'Go to game start';
        } else {
            description = 'Go to move #' + move;
        }

        let element;
        if (move === moves.length - 1) {
            element = description;
        } else {
            element = <button onClick={() => jumpTo(move)}>{description}</button>;
        }

        return (
            <li key={move}>
                {element}
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    xIsNext={xIsNext}
                    squares={currentSquares}
                    onPlay={handlePlay}
                />
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}