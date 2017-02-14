import Phaser from 'phaser'

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)

    this.scale .setTo(1 / 16, 1 / 16);
    this.animations.add('death', Array(5).fill().map((_, i) => i), 10, false);
  }

}
