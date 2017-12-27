import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Functional class contains no state (no constructor). State is "lifted up" to parent
function Square(props) {
    return (
        // props.onClick points to a function "handleClick" belonging to parent
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

// React Component is a fundemental part of React.
// A class extending it uses it's constructor to handle state and render to alter the DOM
class Board extends React.Component {

    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            // Remember () => this.handleClick(i) is equivalent to function() { this.handleClick(i) }
            onClick={() => this.props.onClick(i)}
        />;
    }

    // These render functions seem to replace html view files of angular
    // Nice to have everything in one place but what happened to separation of concerns?
    // Angular pulls logic into HTML with directives which I don't like,
    // React pulls structure into JS. It feels more intuitive but I wonder if it gets annoying too?
    render() {
        // {this.renderSquare(0)} is JSX interpolation syntax to evaluate JS inside our render string
        // JSX and Typescript are completely comparable apparently...
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

// What does the className attribute do?
// Used in JSX instead of HTML class keyword to avoid confusion with JS class keyword
// Same thing using htmlFor instead of for
class Game extends React.Component {
    constructor(props) {
        // super required always
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null), // useful...
                }
            ],
            stepNumber: 0,
            xIsNext: true
        };
    }

    handleClick(i) {
        // slice makes a copy of the array so we are not making changes to original
        // immutability is recommended in react
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        // Do nothing if somebody has already won or the square has already been clicked
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'; //nice. should remember this little pattern
        // setState used to alter the state variable declared in our constructor
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    // handles history traveling
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

// <Game /> renders an instance of the Game Component class above
// Looks similiar to a tag directive in Angular?
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
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
            return squares[a];
        }
    }
    return null;
}
