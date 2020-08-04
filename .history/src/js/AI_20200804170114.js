import { Defaults } from './Const.js'
import { getStateResult, getBoardCopy, isBetter, checkRow } from './Helpers'
export default class AI {
	constructor(scene) {
		this.bestPosition = 0
	}
	makeMove(matrix, player) {
		console.log('player: ', player)
		this.enemy = player ? 'o' : 'x'
		this.self = player ? 'x' : 'o'
		this.bestPosition = 0
		this.bestResult = null
		this.moveResult = null
		//defense
		for (var i = 0; i < Defaults.ROWS_COLS * Defaults.ROWS_COLS; i++) {
			if (matrix[i] == '0') {
				var result = getStateResult(getBoardCopy(matrix, i, this.enemy), this.enemy)
				if (this.bestResult == null) {
					this.bestPosition = i
					this.bestResult = result
					this.moveResult = getStateResult(getBoardCopy(matrix, i, this.self), this.self)
				} else {
					var better_than = isBetter(result, this.bestResult)
					if (better_than == null) {
						//get the best of two
						result = getStateResult(getBoardCopy(matrix, i, this.self), this.self)
						if (isBetter(result, this.moveResult)) {
							this.bestPosition = i
							this.moveResult = result
						}
					} else {
						if (better_than) {
							this.bestPosition = i
							this.bestResult = result
						}
					}
				}
			}
		}
		if (this.bestResult['5o'] + this.bestResult['5c'] == 0) {
			//offense
			var count_before = checkRow(matrix, 3, this.self)
			var count_before_4 = checkRow(matrix, 4, this.self)
			for (var i = 0; i < Defaults.ROWS_COLS * Defaults.ROWS_COLS; i++) {
				if (matrix[i] == '0') {
					var tempMatrix = getBoardCopy(matrix, i, this.self)
					if (this.bestResult['4o'] == 0) {
						// + best_result['3o']
						var count = checkRow(tempMatrix, 4, this.self)
						var result = count['closed'] - count_before_4['closed']
						if (result > 0) {
							this.bestPosition = i
						}
						var count = checkRow(tempMatrix, 3, this.self)
						var result = count['opened'] - count_before['opened']
						if (result > 0) {
							this.bestPosition = i
						}
					}
					var count = checkRow(tempMatrix, 4, this.self)
					var result = count['opened']
					if (result > 0) {
						this.bestPosition = i
						break
					}
				}
			}
		}
		//win move
		for (var i = 0; i < Defaults.ROWS_COLS * Defaults.ROWS_COLS; i++) {
			if (matrix[i] == '0') {
				var count = checkRow(getBoardCopy(matrix, i, this.self), 5, this.self)
				var result = count['opened'] + count['closed']
				if (result > 0) {
					this.bestPosition = i
					break
				}
			}
		}
		if (matrix[this.bestPosition] != '0') {
			alert('superposition! = ' + this.bestPosition + ' = ' + matrix[this.bestPosition])
		}
		return this.bestPosition
	}
}
