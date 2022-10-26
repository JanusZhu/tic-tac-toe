"use strict";

const defaultRow = 3;

const Player = (sign) => {
  this.sign = sign;
  const getSign = () => {
    return sign;
  };
  return { getSign };
};

const gameBoard = (() => {
  let row = defaultRow;
  let length = Math.pow(row, 2);

  const createBoard = (length) => {
    let newBoard = [];
    for (let i = 0; i < length; i++) {
      newBoard.push("");
    }
    return newBoard;
  };

  let board = createBoard(length);
  const setGrid = (i, sign) => {
    board[i] = sign;
  };
  const getGrid = (i) => {
    return board[i];
  };
  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  const getLength = () => {
    return length;
  };

  const getRow = () => {
    return row;
  };
  return { getRow, getLength, setGrid, getGrid, reset };
})();

const displayController = (() => {
  const grids = Array.from(document.querySelectorAll(".grid"));
  const resetBtn = document.querySelector(".reset");
  const title = document.querySelector("#title");
  grids.forEach((grid) => {
    grid.addEventListener("click", () => {
      const index = Number(grid.getAttribute("data-id"));
      if (gameBoard.getGrid(index) !== "") {
        return;
      } else {
        gameController.playRound(index);
        updateBoard();
      }
    });
  });
  resetBtn.addEventListener("click", () => {
    gameBoard.reset();
    gameController.reset();
    updateBoard();
  });
  const updateBoard = () => {
    for (let i = 0; i < grids.length; i++) {
      grids[i].textContent = gameBoard.getGrid(i);
      grids[i].style.color = gameBoard.getGrid(i) === "O" ? "red" : "black";
    }
  };

  const updateTitle = (text) => {
    title.textContent = text;
  };
  return { updateTitle };
})();

const gameController = (() => {
  const player1 = Player("X");
  const player2 = Player("O");
  let round = 0;
  let gameEnd = false;
  const playRound = (index) => {
    if (gameEnd) return;
    gameBoard.setGrid(index, getCurrentSign(round));
    if (getWinner(index, round)) {
      gameEnd = true;
      displayController.updateTitle(
        `Player ${getCurrentSign(round)}'s the winner!`
      );
      return;
    }
    if (round == gameBoard.getLength() - 1) {
      gameEnd = true;
      displayController.updateTitle("This is a tie!");
      return;
    }
    round += 1;
    displayController.updateTitle(`Player ${getCurrentSign(round)}'s turn!`);
  };
  const reset = () => {
    round = 0;
    gameEnd = false;
    displayController.updateTitle("Player X's turn!");
  };

  const getCurrentSign = () => {
    return round % 2 == 0 ? player1.getSign() : player2.getSign();
  };

  const getWinner = (index, round) => {
    const combinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return combinations
      .filter((combination) => combination.includes(index))
      .some((possibleCombination) =>
        possibleCombination.every(
          (index) => gameBoard.getGrid(index) === getCurrentSign(round)
        )
      );
  };

  return { playRound, reset };
})();
