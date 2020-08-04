import { Defaults } from './Const.js'
import AI from './AI.js'
import Cell from './Cell.js'
import * as Helper from './Helpers.js'
export default class Board extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene)
		this.scene = scene
		this.state = scene.state
		this.sideCellsCount = Defaults.ROWS_COLS
		this.cellSize = Defaults.CELL_SIZE
		this.width = this.sideCellsCount * this.cellSize
		this.height = this.sideCellsCount * this.cellSize
		this.x = x
		this.y = y
		this.AI = new AI(this)
		this.last_move = true
		this.moves = 0
		this._matrix = new Array()
		for (var i = 0; i < this.sideCellsCount * this.sideCellsCount; i++) this._matrix.push('0')
		this.cell_matrix = object_matrix(this._matrix.chunk(this.sideCellsCount))
		this.create()
	}
	create() {
		for (const row in this.cell_matrix) {
			const cell_row = this.cell_matrix[row]
			for (const col in this.cell_matrix[row]) {
				this.cell_matrix[row][col] = new Cell(
					this.scene,
					[row, col],
					this.cellSize * row,
					this.cellSize * col,
					this.cellSize,
					this
				)
				this.cell_matrix[row][col].setInteractive()
				this.cell_matrix[row][col]
			}
		}
		const x = this.scene.scale.width / 2 - this.width / 2
		const y = this.scene.scale.height / 2 - this.width / 2
		Phaser.Display.Align.In.Center(this, this.scene.add.zone(x, y))
		this.scene.graphics.setPosition(this.x, this.y)
		this.setScale(1 / this.scene.game.device.os.pixelRatio)
	}
	addCells() {
		const m = object_matrix(this._matrix.chunk(5))
		for (let i = 0; i < this.sideCellsCount + 3; i++) {
			if (m[i] == undefined) {
				m[i] = {}
				this.cell_matrix[i] = {}
				for (let n = 0; n < this.sideCellsCount + 3; n++) {
					m[i][n] = '0'
					this.cell_matrix[i][n] = new Cell(
						this.scene,
						[i, n],
						this.cellSize * i,
						this.cellSize * n,
						this.cellSize,
						this
					)
					this.cell_matrix[i][n].setInteractive()
				}
			}
			for (let n = 0; n < this.sideCellsCount + 3; n++) {
				if (m[i][n] == undefined) {
					m[i][n] = '0'
					this.cell_matrix[i][n] = new Cell(
						this.scene,
						[i, n],
						this.cellSize * i,
						this.cellSize * n,
						this.cellSize,
						this
					)
					this.cell_matrix[i][n].setInteractive()
				}
			}
		}
		this.sideCellsCount = Object.keys(m).length
		this.height = this.width = this.sideCellsCount * this.cellSize
		const x = this.scene.scale.width / 2 - this.width / 2
		const y = this.scene.scale.height / 2 - this.height / 2
		Phaser.Display.Align.In.Center(this, this.scene.add.zone(x, y))
		this.scene.graphics.setPosition(this.x, this.y)
		for (let row = 0; row < this.sideCellsCount; row++) {
			for (let column = 0; column < this.sideCellsCount; column++) {
				this.cell_matrix[row][column].update()
			}
		}
	}
	makeMove(cell) {
        const self=this 
		if (this.state.whoseTurn == 'x') {
            console.log('cell: ', cell)
			const pos = cell.id.reduce((a, b) => parseInt(b * 5) + parseInt(a))
			this.draw(pos)
			this.state.whoseTurn = 'o'
		} else if (this.state.whoseTurn == 'o') {
			this.AI.makeMove(this.matrix, self.draw)
		}
		let count = 0
		this._matrix.forEach((val) => {
			if (val != '0') count++
		})
		const sixteenPrecents = parseInt(this._matrix.length * 0.6)
		if (count >= sixteenPrecents) this.addCells()
	}
	draw(pos) {
		const row = parseInt(pos / 5)
		const col = pos - row * 5
		if (this._matrix[pos] == '0') {
			this._matrix[pos] = this.last_move ? 'x' : 'o'
			const x = this.x + col * 100 + 50
			const y = this.y + row * 100 + 50
			this.cell_matrix[col][row].char = this.scene.add.image(x, y, this._matrix[pos])
			this.checkWinner()
			return true
		} else {
			return false
		}
	}
	checkWinner() {
		var winner = this.winLine(this._matrix)
		if (!winner) {
			this.last_move = !this.last_move
			if (!this.last_move) {
				setTimeout(() => {
					this.makeMove()
				}, 1)
			}
		} else {
			this.endGameScreen()
		}
	}
	endGameScreen() {
		this.scene.state.gameEnd = true
		this.scene.graphics.destroy()
		for (let row = 0; row < this.sideCellsCount; row++) {
			for (let column = 0; column < this.sideCellsCount; column++) {
				if (this.cell_matrix[row][column].char !== null) this.cell_matrix[row][column].char.destroy()
				this.cell_matrix[row][column].destroy()
				delete this.cell_matrix[row][column]
			}
		}
		const button_img = this.scene.add.image(0, 0, 'play_again')
		const x = this.scene.scale.width / 2
		const y = this.scene.scale.height / 2 - button_img.height / 2
		const button = this.scene.add.zone(x, y, button_img.width, button_img.height)
		const text = this.state.whoseTurn == 'x' ? 'ПОБЕДА' : 'ВЫ ПРОИГРАЛИ'
		const winner_text = this.scene.add.text(x, y, text, { font: 'Tahoma' })
		winner_text.setOrigin(0.5, -2).setFontSize(80)
		button.setInteractive()
		Phaser.Display.Align.In.Center(winner_text, this.scene.add.zone(x, y - 200))
		Phaser.Display.Align.In.Center(button_img, this.scene.add.zone(x, y))
		Phaser.Display.Align.In.Center(button, this.scene.add.zone(x, y))
		button.on('pointerdown', (pointer) => {
			this.scene.scene.restart()
		})
	}
	winLine() {
		var rule = 5
		var winning = 0
		for (var row = 0; row < this.sideCellsCount; row++) {
			for (var col = 0; col < this.sideCellsCount; col++) {
				if (Helper.getChar(this.matrix, row, col) != '0') {
					// horizontal
					if (col <= this.sideCellsCount - rule) {
						winning = 1
						while (Helper.getChar(this.matrix, row, col) == Helper.getChar(this.matrix, row, col + winning)) {
							winning += 1
						}
						if (winning >= rule) {
							return { row: row, col: col, count: winning, dx: 1, dy: 0 }
						}
					}
					// vertical
					if (row <= this.sideCellsCount - rule) {
						// |
						winning = 1
						while (Helper.getChar(this.matrix, row, col) == Helper.getChar(this.matrix, row + winning, col)) {
							winning += 1
						}
						if (winning >= rule) {
							return { row: row, col: col, count: winning, dx: 0, dy: 1 }
						}
						// /
						if (col >= rule - 1) {
							winning = 1
							while (
								Helper.getChar(this.matrix, row, col) == Helper.getChar(this.matrix, row + winning, col - winning)
							) {
								winning += 1
							}
							if (winning >= rule) {
								return { row: row, col: col, count: winning, dx: -1, dy: 1 }
							}
						}
						// \o
						if (col <= this.sideCellsCount - rule) {
							winning = 1
							while (
								Helper.getChar(this.matrix, row, col) == Helper.getChar(this.matrix, row + winning, col + winning)
							) {
								winning += 1
							}
							if (winning >= rule) {
								return { row: row, col: col, count: winning, dx: 1, dy: 1 }
							}
						}
					}
				}
			}
		}
		return false
	}
	get matrix() {
		return this._matrix
	}
}
Array.prototype.chunk = function (length) {
	if (!this.length) {
		return []
	}
	return [this.slice(0, length)].concat(this.slice(length).chunk(length))
}
function object_matrix(arr) {
	var obj = Object.assign({}, arr)
	for (const r in obj) {
		obj[r] = Object.assign({}, obj[r])
	}
	return obj
}
