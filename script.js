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
  const setRow = (newRow) => {
    row = newRow;
    length = Math.pow(row, 2);
    board = createBoard(length);
  };
  return { setRow, getRow, getLength, setGrid, getGrid, reset };
})();

const displayController = (() => {
  const root = document.querySelector(":root");

  const resetBtn = document.querySelector(".reset");
  const resizeBtn = document.querySelector(".resize");
  const title = document.querySelector("#title");
  let grids = Array.from(document.querySelectorAll(".grid"));
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

  resizeBtn.addEventListener("click", () => {
    const newRow = Number(prompt("Enter a new row/column number (from 2-5)."));
    if (!newRow | (newRow > 5) | (newRow < 2)) return;
    //reset row and length
    gameBoard.setRow(newRow);
    //reset grids
    gameBoard.reset();
    gameController.reset();
    //create new html
    renderBoard();
    const newGrids = Array.from(document.querySelectorAll(".grid"));
    newGrids.forEach((grid) => {
      grid.addEventListener("click", () => {
        const index = Number(grid.getAttribute("data-id"));
        if (gameBoard.getGrid(index) !== "") {
          return;
        } else {
          gameController.playRound(index);
          updateBoard();
          console.log("pressed");
        }
      });
    });
  });
  const renderBoard = () => {
    root.style.setProperty("--row-num", gameBoard.getRow());
    const board = document.querySelector(".board");
    while (board.firstChild) {
      board.removeChild(board.firstChild);
    }
    for (let i = 0; i < gameBoard.getLength(); i++) {
      const div = document.createElement("div");
      div.className = "grid";
      div.setAttribute("data-id", i);
      board.appendChild(div);
    }
  };
  const updateBoard = () => {
    grids = Array.from(document.querySelectorAll(".grid"));
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
    const createCombinations = () => {
      let newCombinations = [];
      const row = gameBoard.getRow();
      const column = gameBoard.getRow();
      //get row comb
      for (let i = 0; i < row; i++) {
        let rowComb = [];
        for (let j = 0; j < column; j++) {
          rowComb.push(i * row + j);
        }
        newCombinations.push(rowComb);
      }
      //get column comb
      for (let i = 0; i < column; i++) {
        let colComb = [];
        for (let j = 0; j < row; j++) {
          colComb.push(j * row + i);
        }
        newCombinations.push(colComb);
      }
      //get diagnal comb

      let diagnalComb1 = [];
      let k = 0;
      for (let j = 0; j < row; j++) {
        diagnalComb1.push(k);
        k += row + 1;
      }

      newCombinations.push(diagnalComb1);

      let diagnalComb2 = [];
      k = column - 1;
      for (let j = 0; j < row; j++) {
        diagnalComb2.push(k);
        k += row - 1;
      }
      newCombinations.push(diagnalComb2);

      return newCombinations;
    };

    const combinations = createCombinations();
    console.log(combinations);
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
