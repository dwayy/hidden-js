/* globals __DEV__ */
import Phaser from 'phaser'
import Character from '../sprites/Character'
import Death from '../sprites/Death'
import Crosshair from '../sprites/Crosshair'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    this.characters = Array(10).fill().map((_, i) => {
      return new Character({
        game: this.game,
        x: this.world.centerX + 16 - this.world.width / 2,
        y: this.world.centerY - this.world.height / 2 + 36 * (i + 1),
        asset: 'hero'
      })
    })

    this.character = this.characters[Math.floor(Math.random() * 10)]

    this.crosshair = new Crosshair({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'crosshair'
    })

    let charactersGroup = this.game.add.group()
    let crosshairsGroup = this.game.add.group()

    this.characters.forEach(c => {
      this.game.add.existing(c)
      this.game.physics.arcade.enable(c)
      charactersGroup.add(c)
    })

    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.add.existing(this.character)
    this.game.physics.arcade.enable(this.character)
    charactersGroup.add(this.character)

    this.game.add.existing(this.crosshair)
    this.game.physics.arcade.enable(this.crosshair)
    crosshairsGroup.add(this.crosshair)

    this.cursors = this.input.keyboard.createCursorKeys()

    let space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    space.onDown.add(this.death, this)

    this.walk = this.game.input.keyboard.addKey(Phaser.Keyboard.A)
    this.run = this.game.input.keyboard.addKey(Phaser.Keyboard.Z)
  }

  update() {
    if (this.character.alive) {
      if (this.walk.isDown) {
        this.character.forward(50)
      } else if (this.run.isDown) {
        this.character.forward(150)
      } else {
        this.character.forward(0)
      }
    }
    this.crosshair.move(this.cursors)
  }

  death() {
    let x = this.character.body.x, y = this.character.body.y

    if (Phaser.Rectangle.contains(this.crosshair.getBounds(), x, y)) {
      this.character.kill()
      this.blood = new Death({
        game: this.game,
        x: x,
        y: y,
        asset: 'death'
      })
      this.game.add.existing(this.blood)
      this.blood.animations.play('death')
    }

  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.character, 32, 32)
    }
  }
}
