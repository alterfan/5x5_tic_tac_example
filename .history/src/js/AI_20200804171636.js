import { Defaults } from './Const.js'
import { getStateResult, getBoardCopy, isBetter, checkRow, getEnemyChar } from './Helpers'
export default class AI {
	constructor(scene) {
		this.scene = scene
		this.state = scene.state
		this._betterPosition = 0
	}
	makeMove(matrix) {
		this.matrix = matrix
		this.enemy = getEnemyChar(this.state.whoseTurn)
		this.self = this.state.whoseTurn
		this._betterPosition = 0
		this.bestResult = null
		this.moveResult = null
		this.Ready = false
		setTimeout(() => {
			this.thinking()
		}, 300)
	}
	thinking() {
		for (var i = 0; i < Defaults.ROWS_COLS * Defaults.ROWS_COLS; i++) {
			if (this.matrix[i] == '0') {
				var result = getStateResult(getBoardCopy(this.matrix, i, this.enemy), this.enemy)
				if (this.bestResult == null) {
					this._betterPosition = i
					this.bestResult = result
					this.moveResult = getStateResult(getBoardCopy(this.matrix, i, this.self), this.self)
				} else {
					var better_than = isBetter(result, this.bestResult)
					if (better_than == null) {
						result = getStateResult(getBoardCopy(this.matrix, i, this.self), this.self)
						if (isBetter(result, this.moveResult)) {
							this._betterPosition = i
							this.moveResult = result
						}
					} else {
						if (better_than) {
							this._betterPosition = i
							this.bestResult = result
						}
					}
				}
			}
		}
		if (this.bestResult['5o'] + this.bestResult['5c'] == 0) {
			var count_before = checkRow(this.matrix, 3, this.self)
			var count_before_4 = checkRow(this.matrix, 4, this.self)
			for (var i = 0; i < Defaults.ROWS_COLS * Defaults.ROWS_COLS; i++) {
				if (this.matrix[i] == '0') {
					var tempMatrix = getBoardCopy(this.matrix, i, this.self)
					if (this.bestResult['4o'] == 0) {
						var count = checkRow(tempMatrix, 4, this.self)
						var result = count['closed'] - count_before_4['closed']
						if (result > 0) {
							this._betterPosition = i
						}
						var count = checkRow(tempMatrix, 3, this.self)
						var result = count['opened'] - count_before['opened']
						if (result > 0) {
							this._betterPosition = i
						}
					}
					var count = checkRow(tempMatrix, 4, this.self)
					var result = count['opened']
					if (result > 0) {
						this._betterPosition = i
						break
					}
				}
			}
		}
		for (var i = 0; i < Defaults.ROWS_COLS * Defaults.ROWS_COLS; i++) {
			if (this.matrix[i] == '0') {
				var count = checkRow(getBoardCopy(this.matrix, i, this.self), 5, this.self)
				var result = count['opened'] + count['closed']
				if (result > 0) {
					this._betterPosition = i
					break
				}
			}
		}
		if (this.matrix[this._betterPosition] != '0') {
			alert('superposition! = ' + this._betterPosition + ' = ' + this.matrix[this._betterPosition])
		}
		this.Ready = true
	}
	getBetterPosition() {
		return this._betterPosition
	}
}
