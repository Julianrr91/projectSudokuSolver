class SudokuSolver {
  //function solveSudoku, isSafe and transform is the
  //https://www.geeksforgeeks.org/sudoku-backtracking-7/

  validate(puzzleString) {
    if (!puzzleString || puzzleString === "") {
      return { error: "Required field missing" };
    }
    if (puzzleString.length != 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    }
    if (/[^0-9.]/g.test(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    }
    return true;
  }

  letterToNumber(row) {
    let letterConvert = row.toString().toUpperCase().charCodeAt(0) - 64;
    return parseInt(letterConvert);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let grid = this.transform(puzzleString);
    row = this.letterToNumber(row);

    if (grid[row - 1][column - 1] !== 0) {
      return true;
    }
    for (let i = 0; i < 9; i++) {
      if (grid[row - 1][i] == value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let grid = this.transform(puzzleString);
    row = this.letterToNumber(row);
    if (grid[row - 1][column - 1] !== 0) {
      return true;
    }
    for (let i = 0; i < 9; i++) {
      if (grid[i][column - 1] == value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let grid = this.transform(puzzleString);
    row = this.letterToNumber(row);
    if (grid[row - 1][column - 1] !== 0) {
      return true;
    }
    let startRow = row - (row % 3),
      startCol = column - (column % 3);
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (grid[i + startRow][j + startCol] == value) {
          return false;
        }
    return true;
  }

  checkPlacement(puzzleString, coordinate, value) {
    if (!puzzleString || !coordinate || (!value && value !== 0)) {
      return { error: "Required field(s) missing" };
    }

    if (this.validate(puzzleString) != true) {
      return this.validate(puzzleString);
    }
    const row = coordinate.split("")[0];
    const column = coordinate.split("")[1];
    if (
      coordinate.length !== 2 ||
      !/[a-i]/i.test(row) ||
      !/[1-9]/.test(column)
    ) {
      return { error: "Invalid coordinate" };
    }

    if (!/[1-9]/.test(value) || isNaN(value) || value < 1 || value > 9) {
      return { error: "Invalid value" };
    }
    return true;
  }

  solveSudoku(grid, row, col) {
    let N = 9;
    if (row == N - 1 && col == N) return grid;
     if (col == N) {
      row++;
      col = 0;
    }
    if (grid[row][col] != 0) return this.solveSudoku(grid, row, col + 1);

    for (let num = 1; num < 10; num++) {
      if (this.isSafe(grid, row, col, num)) {
        grid[row][col] = num;
        if (this.solveSudoku(grid, row, col + 1)) return grid;
      }
      grid[row][col] = 0;
    }
    return false;
  }

  isSafe(grid, row, col, num) {
    for (let x = 0; x <= 8; x++) if (grid[row][x] == num) return false;

    for (let x = 0; x <= 8; x++) if (grid[x][col] == num) return false;

    let startRow = row - (row % 3),
      startCol = col - (col % 3);

    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (grid[i + startRow][j + startCol] == num) return false;

    return true;
  }

  transform(puzzleString) {
    let N = 9;
    let grid = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    let row = -1;
    let col = 0;
    for (let i = 0; i < puzzleString.length; i++) {
      if (i % N == 0) {
        row++;
      }
      if (col % N == 0) {
        col = 0;
      }

      grid[row][col] = puzzleString[i] === "." ? 0 : +puzzleString[i];
      col++;
    }
    return grid;
  }

  transformBack(grid) {
    return grid.flat().join("");
  }

  solve(puzzleString) {
    let checkedValidate = this.validate(puzzleString);
    if (checkedValidate != true) {
      return checkedValidate;
    }

    let grid = this.transform(puzzleString);
    let solved = this.solveSudoku(grid, 0, 0);
    if (!solved) {
      return false;
    }
    let solvedString = this.transformBack(solved);
    return solvedString;
  }
}

module.exports = SudokuSolver;
