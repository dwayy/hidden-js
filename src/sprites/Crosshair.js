import Phaser from 'phaser'

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
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

}
