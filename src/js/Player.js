import Board from './Board.js'
export default class Player {
	constructor(self) {
		this.id = 1
		this.state = self.state
		this.matrix = self.MATRIX
		this.cells = self.CELLS
	}
	getRowCol(row, column) {
		this.matrix[row][column] = 1
		this.cells[row][column] = 1
	}
}
