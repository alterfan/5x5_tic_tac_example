export default class Cell extends Phaser.GameObjects.Zone {
	constructor(scene, id, x, y, size, container) {
		super(scene)
		this.scene = scene
		this.id = id
		this.container = container
		this.x = x
		this.y = y
		this.value = 0
		this.char = null
		this.depth = 1000
		this.height = this.width = size * scene.scale.zoom
		this.scene.graphics.strokeRectShape(this)
		this.container.add(this)
	}
	onOver(check) {
		this.scene.graphics.fillStyle(check == null ? 0x94bbf1 : 0xffcafe)
		this.scene.graphics.fillRect(this.x, this.y, 100, 100)
		this.scene.graphics.fillStyle(0xffffff)
		this.scene.graphics.strokeRectShape(this)
	}
	onOut() {
		this.scene.graphics.fillStyle(0x2e76d8)
		this.scene.graphics.fillRect(this.x, this.y, 100, 100)
		this.scene.graphics.strokeRectShape(this)
	}
	onClick() {
		this.scene.graphics.strokeRectShape(this)
	}
	update() {
		const x = this.scene.graphics.x + this.x + this.width / 2
		const y = this.scene.graphics.y + this.y + this.height / 2
		if (this.char != null) this.char.setPosition(x, y)
	}
}
