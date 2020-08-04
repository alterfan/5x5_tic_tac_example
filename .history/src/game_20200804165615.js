import {} from '../node_modules/phaser/dist/phaser.js'
import GameBoard from './js/GameBoard.js'
var game
function getById(i) {
	return document.getElementById(i)
}
window.onload = () => {
	new Phaser.Game({
		type: Phaser.AUTO,
		width: window.innerWidth,
		height: window.innerHeight,
		backgroundColor: 0x2e76d8,
		seed: Date.now(),
		scale: {
			parent: 'tiktak',
			mode: Phaser.Scale.RESIZE,
			autoCenter: Phaser.Scale.CENTER_BOTH,
			width: window.innerWidth,
			height: window.innerHeight,
		},
		physics: {
			default: 'arcade',
			arcade: {
				gravity: { y: 0 },
				debug: true,
			},
		},
		scene: GameBoard,
	})
	window.focus()
}
