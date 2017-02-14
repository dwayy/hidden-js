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

}
