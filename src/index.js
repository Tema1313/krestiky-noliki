import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button className={props.click ? "square set-click" : "square"} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, j) {
    return (
      <>
        {(this.props.iClick === i && this.props.jClick === j) ?
          <Square
            value={this.props.squares[i][j]}
            onClick={() => this.props.onClick(i, j)}
            click={true}
          /> : 
          <Square
            value={this.props.squares[i][j]}
            onClick={() => this.props.onClick(i, j)}
          />
        }
      </>
    );
  }

  render() {

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0, 0)}
          {this.renderSquare(0, 1)}
          {this.renderSquare(0, 2)}
        </div>
        <div className="board-row">
          {this.renderSquare(1, 0)}
          {this.renderSquare(1, 1)}
          {this.renderSquare(1, 2)}
        </div>
        <div className="board-row">
          {this.renderSquare(2, 0)}
          {this.renderSquare(2, 1)}
          {this.renderSquare(2, 2)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: [
            Array(3).fill(null),
            Array(3).fill(null),
            Array(3).fill(null)
          ],
          lasti: 0,
          lastj: 0
        }
      ],
      xIsNext: true,
      stepNumber: 0,
      iClick: 0,
      jClick: 0
    }
  }

  handleClick(i, j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = [];
    for (let i = 0; i < current.squares.length; i++) {
      squares[i] = current.squares[i].slice();
    }
    if (calculateWinner(squares) || squares[i][j]) {
      return;
    }
    squares[i][j] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{
        squares: squares,
        lasti: i + 1,
        lastj: j + 1
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      iClick: 0,
      jClick: 0
    })
  }

  jumpTo(step, i, j) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      iClick: i,
      jClick: j
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        "Перейти к ходу #" + move + `(${history[move].lasti},${history[move].lastj})` :
        "К началу игры";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move, history[move].lasti, history[move].lastj)}>{desc}</button>
        </li>
      )
    });

    let status;
    if (winner) {
      status = 'Выиграл ' + winner;
    } else {
      status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i, j) => this.handleClick(i, j)}
            iClick={this.state.iClick - 1}
            jClick={this.state.jClick - 1}
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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a[0]][a[1]] && squares[a[0]][a[1]] === (squares[b[0]][b[1]]) && squares[a[0]][a[1]] === squares[c[0]][c[1]]) {
      return squares[a[0]][a[1]];
    }
  }
  return null;
}
