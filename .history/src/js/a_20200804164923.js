import { Defaults } from './Const.js'
import { getStateResult, getBoardCopy, isBetter, checkRow } from './Helpers'
export default function aiMakeMove(matrix, player) {
    var enemy = player ? 'o' : 'x'
    var me = player ? 'x' : 'o'
    var best_pos = 0
    var best_result = null
    var move_result = null
    //defense
    for (var i = 0; i < Defaults.ROWS_COLS * Defaults.ROWS_COLS; i++) {
        if (matrix[i] == '0') {
            var result = getStateResult(getBoardCopy(matrix, i, enemy), enemy)
            if (best_result == null) {
                best_pos = i
                best_result = result
                move_result = getStateResult(getBoardCopy(matrix, i, me), me)
            }
            else {
                var better_than = isBetter(result, best_result)
                if (better_than == null) {
                    //get the best of two
                    result = getStateResult(getBoardCopy(matrix, i, me), me)
                    if (isBetter(result, move_result)) {
                        best_pos = i
                        move_result = result
                    }
                }
                else {
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
        var count_before = checkRow(matrix, 3, me)
        var count_before_4 = checkRow(matrix, 4, me)
        for (var i = 0; i < Defaults.ROWS_COLS * Defaults.ROWS_COLS; i++) {
            if (matrix[i] == '0') {
                var tempMatrix = getBoardCopy(matrix, i, me)
                if (best_result['4o'] == 0) {
                    // + best_result['3o']
                    var count = checkRow(tempMatrix, 4, me)
                    var result = count['closed'] - count_before_4['closed']
                    if (result > 0) {
                        best_pos = i
                    }
                    var count = checkRow(tempMatrix, 3, me)
                    var result = count['opened'] - count_before['opened']
                    if (result > 0) {
                        best_pos = i
                    }
                }
                var count = checkRow(tempMatrix, 4, me)
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
        if (matrix[i] == '0') {
            var count = checkRow(getBoardCopy(matrix, i, me), 5, me)
            var result = count['opened'] + count['closed']
            if (result > 0) {
                best_pos = i
                break
            }
        }
    }
    if (matrix[best_pos] != '0') {
        alert('superposition! = ' + best_pos + ' = ' + matrix[best_pos])
    }
    return best_pos
}
