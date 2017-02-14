/* globals __DEV__ */
import Phaser from 'phaser'
import Hero from '../sprites/Hero'
import Death from '../sprites/Death'

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

    this.game.physics.arcade.enable(this.hero);

    this.cursors = this.input.keyboard.createCursorKeys();

    let space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    space.onDown.add(this.death, this)
  }

  update() {
    if(this.hero.alive) {
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
  }

  death() {
    let x = this.hero.body.x, y = this.hero.body.y
    this.hero.kill()
    this.blood = new Death({
      game: this.game,
      x: x,
      y: y,
      asset: 'death'
    })
    this.game.add.existing(this.blood);
    this.blood.animations.play('death')
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.hero, 32, 32)
    }
  }
}
