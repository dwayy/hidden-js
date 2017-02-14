/* globals __DEV__ */
import Phaser from 'phaser'
import Hero from '../sprites/Hero'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    this.hero = new Hero({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'hero'
    })

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.add.existing(this.hero);

    this.hero.animations.add('down', Array(8).fill().map((_, i) => i), 10, true);
    this.hero.animations.add('up', Array(8).fill().map((_, i) => i + 8), 10, true);
    this.hero.animations.add('left', Array(8).fill().map((_, i) => i + 16), 10, true);
    this.hero.animations.add('right', Array(8).fill().map((_, i) => i + 24), 10, true);

    this.game.physics.arcade.enable(this.hero);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.hero.body.velocity.x = 0;
    this.hero.body.velocity.y = 0;

    if (this.cursors.left.isDown){
      this.hero.body.velocity.x = -150;
      this.hero.animations.play('left');
      this.frame = 16;
    }
    else if (this.cursors.right.isDown) {
      this.hero.body.velocity.x = 150;
      this.hero.animations.play('right');
      this.frame = 24;
    }
    else if (this.cursors.up.isDown) {
      this.hero.body.velocity.y = -150;
      this.hero.animations.play('up');
      this.frame = 8;
    }
    else if (this.cursors.down.isDown) {
      this.hero.body.velocity.y = 150;
      this.hero.animations.play('down');
      this.frame = 0;
    }
    else {
      this.hero.animations.stop();
      this.hero.frame = this.frame;
    }
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.hero, 32, 32)
    }
  }
}
