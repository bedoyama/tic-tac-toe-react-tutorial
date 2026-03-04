import {useState} from 'react';

function Square({value, onSquareClick, className}) {
    return (<button
        className={className}
        onClick={onSquareClick}
    >
        {value}
    </button>);
}

function Board({xIsNext, squares, onPlay, draw}) {
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
        status = "Winner: " + winner.face;
    } else if (draw) {
        status = "It's a draw!";
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
                                className={winner && winner.line.includes(squareIndex) ? 'square winner' : 'square'}
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
    const [moveOrderAsc, setMoveOrderAsc] = useState(true);
    const xIsNext = (currentMove % 2) === 0;
    const currentSquares = history[currentMove];
    const draw = !calculateWinner(currentSquares) && currentMove === 9;

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    function toggleMoveOrder() {
        setMoveOrderAsc(!moveOrderAsc);
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

        return (
            <li key={move}>
                {move === moves.length - 1 ? (
                    description) : (
                    <button onClick={() => jumpTo(move)}>{description}</button>
                )}
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
                    draw={draw}
                />
            </div>
            <div className="game-info">
                <button className="button" onClick={toggleMoveOrder}>Flip move order</button>
                <p>Moves ordered {moveOrderAsc ? 'Ascending' : 'Descending'}</p>
                <ol>{moveOrderAsc ? moves : moves.reverse()}</ol>
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
            return {face: squares[a], line: lines[i]};
        }
    }
    return null;
}