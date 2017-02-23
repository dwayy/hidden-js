import Phaser from 'phaser'

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
    this.bullets = 5

    let style = {
          font: 'Bangers',
          fill: '#ff0000',
          fontSize: '6',
        }

    this.tint = Math.random() * 0xffffff

    this.text = this.game.add.text(10, 10, this.bullets, style)
    this.text.tint = this.tint
    this.addChild(this.text)
  }

  move(cursors) {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    if (cursors.left.isDown){
      this.body.velocity.x = -300;
    }
    else if (cursors.right.isDown) {
      this.body.velocity.x = 300;
    }
    else if (cursors.up.isDown) {
      this.body.velocity.y = -300;
    }
    else if (cursors.down.isDown) {
      this.body.velocity.y = 300;
    }
  }

  shoot() {
    if (this.bullets === 0) {
      return false
    }
    else {
      this.text.text = --this.bullets
      return true
    }
  }

}
