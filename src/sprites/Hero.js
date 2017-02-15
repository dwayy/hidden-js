import Phaser from 'phaser'

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)

    this.animations.add('down', Array(8).fill().map((_, i) => i), 10, true);
    this.animations.add('up', Array(8).fill().map((_, i) => i + 8), 10, true);
    this.animations.add('left', Array(8).fill().map((_, i) => i + 16), 10, true);
    this.animations.add('right', Array(8).fill().map((_, i) => i + 24), 10, true);
  }

  move(cursors) {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    if (cursors.left.isDown){
      this.body.velocity.x = -150;
      this.animations.play('left');
      this.currentFrame = 16;
    }
    else if (cursors.right.isDown) {
      this.body.velocity.x = 150;
      this.animations.play('right');
      this.currentFrame = 24;
    }
    else if (cursors.up.isDown) {
      this.body.velocity.y = -150;
      this.animations.play('up');
      this.currentFrame = 8;
    }
    else if (cursors.down.isDown) {
      this.body.velocity.y = 150;
      this.animations.play('down');
      this.currentFrame = 0;
    }
    else {
      this.animations.stop();
      this.frame = this.currentFrame;
    }
  }

}
