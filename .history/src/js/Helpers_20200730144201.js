import { Defaults, Ids, Types } from './Const.js'
const Dom = {
	// FUNCTION dom element
	getById: function (i) {
		return document.getElementById(i)
	},
}
const Transform = {
	idToColRow: function (id) {
		return {
			row: id[0],
			column: id[1],
		}
	},
}
function switchTurn(whoseTurn) {
	switch (whoseTurn) {
		case 'x':
			whoseTurn = 'o'
			break
		case 'o':
			whoseTurn = 'x'
			break
	}
	return whoseTurn
}
function getChar(board, row, col) {
	if (0 <= row && row < Defaults.ROWS_COLS && 0 <= col && col < Defaults.ROWS_COLS) {
		return board[row * Defaults.ROWS_COLS + col]
	} else {
		return '*'
	}
}
function checkRow(board, rule, symbol) {
	var opened = 0
	var closed = 0
	var winning = 0
	for (var row = 0; row < Defaults.ROWS_COLS; row++) {
		for (var col = 0; col < Defaults.ROWS_COLS; col++) {
			if (getChar(board, row, col) == symbol) {
				// horizontal
				if (col <= Defaults.ROWS_COLS - rule) {
					winning = 1
					while (getChar(board, row, col) == getChar(board, row, col + winning) && winning <= rule) {
						winning += 1
					}
					if (winning == rule) {
						if (getChar(board, row, col + winning) == '0' && getChar(board, row, col - 1) == '0') {
							opened += 1
						} else {
							closed += 1
						}
					}
				}
				// vertical
				if (row <= Defaults.ROWS_COLS - rule) {
					// |
					winning = 1
					while (getChar(board, row, col) == getChar(board, row + winning, col) && winning <= rule) {
						winning += 1
					}
					if (winning == rule) {
						if (getChar(board, row + winning, col) == '0' && getChar(board, row - 1, col) == '0') {
							opened += 1
						} else {
							closed += 1
						}
					}
					// /
					if (col >= rule - 1) {
						winning = 1
						while (getChar(board, row, col) == getChar(board, row + winning, col - winning) && winning <= rule) {
							winning += 1
						}
						if (winning == rule) {
							if (getChar(board, row + winning, col - winning) == '0' && getChar(board, row - 1, col + 1) == '0') {
								opened += 1
							} else {
								closed += 1
							}
						}
					}
					// \o
					if (col <= Defaults.ROWS_COLS - rule) {
						winning = 1
						while (getChar(board, row, col) == getChar(board, row + winning, col + winning) && winning <= rule) {
							winning += 1
						}
						if (winning == rule) {
							if (getChar(board, row + winning, col + winning) == '0' && getChar(board, row - 1, col - 1) == '0') {
								opened += 1
							} else {
								closed += 1
							}
						}
					}
				}
			}
		}
	}
	return { opened: opened, closed: closed }
}
function isBetter(x, y) {
	if (x['5o'] + x['5c'] == y['5o'] + y['5c']) {
		if (x['4o'] == y['4o']) {
			if (x['3o'] == y['3o']) {
				if (x['2o'] == y['2o']) {
					if (x['4c'] == y['4c']) {
						if (x['3c'] == y['3c']) {
							if (x['2c'] == y['2c']) {
								return null
							} else return x['2c'] > y['2c']
						} else return x['3c'] > y['3c']
					} else return x['4c'] > y['4c']
				} else return x['2o'] > y['2o']
			} else return x['3o'] > y['3o']
		} else return x['4o'] > y['4o']
	} else return x['5o'] + x['5c'] > y['5o'] + y['5c']
}
function getStateResult(_board, symbol) {
	var result = {}
	for (var rule = 2; rule <= 6; rule++) {
		var count = checkRow(_board, rule, symbol)
		result[rule + 'o'] = count['opened']
		result[rule + 'c'] = count['closed']
	}
	return result
}
function aiMakeMove(board, player) {
	var enemy = player ? 'o' : 'x'
	var me = player ? 'x' : 'o'
	var best_pos = 0
	var best_result = null
	var move_result = null
	//defense
	for (var i = 0; i < Defaults.ROWS_COLS * Defaults.ROWS_COLS; i++) {
		if (board[i] == '0') {
			var result = getStateResult(getBoardCopy(board, i, enemy), enemy)
			if (best_result == null) {
				best_pos = i
				best_result = result
				move_result = getStateResult(getBoardCopy(board, i, me), me)
			} else {
				var better_than = isBetter(result, best_result)
				if (better_than == null) {
					//get the best of two
					result = getStateResult(getBoardCopy(board, i, me), me)
					if (isBetter(result, move_result)) {
						best_pos = i
						move_result = result
					}
				} else {
					if (better_than) {
						best_pos = i
						best_result = result
					}
				}
			}
		}
	}
	if (best_result['5o'] + best_result['5c'] == 0) {
		//offense
		var count_before = checkRow(board, 3, me)
		var count_before_4 = checkRow(board, 4, me)
		for (var i = 0; i < Defaults.ROWS_COLS * Defaults.ROWS_COLS; i++) {
			if (board[i] == '0') {
				var temp_board = getBoardCopy(board, i, me)
				if (best_result['4o'] == 0) {
					// + best_result['3o']
					var count = checkRow(temp_board, 4, me)
					var result = count['closed'] - count_before_4['closed']
					if (result > 0) {
						best_pos = i
					}
					var count = checkRow(temp_board, 3, me)
					var result = count['opened'] - count_before['opened']
					if (result > 0) {
						best_pos = i
					}
				}
				var count = checkRow(temp_board, 4, me)
				var result = count['opened']
				if (result > 0) {
					best_pos = i
					break
				}
			}
		}
	}
	//win move
	for (var i = 0; i < Defaults.ROWS_COLS * Defaults.ROWS_COLS; i++) {
		if (board[i] == '0') {
			var count = checkRow(getBoardCopy(board, i, me), 5, me)
			var result = count['opened'] + count['closed']
			if (result > 0) {
				best_pos = i
				break
			}
		}
	}
	if (board[best_pos] != '0') {
		alert('superposition! = ' + best_pos + ' = ' + board[best_pos])
	}
	return best_pos
}
function getBoardCopy(board, pos, symbol) {
	var temp_board = []
	for (var i = 0; i < Defaults.ROWS_COLS * Defaults.ROWS_COLS; i++) {
		temp_board.push(board[i])
	}
	temp_board[pos] = symbol
	return temp_board
}
export { Dom, Transform, switchTurn, getStateResult, getChar, getBoardCopy, checkRow, isBetter, aiMakeMove }
