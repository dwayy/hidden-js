/* globals __DEV__ */
import Phaser from 'phaser'
import Character from '../sprites/Character'
import Death from '../sprites/Death'
import Crosshair from '../sprites/Crosshair'
import Race from '../ia/Race'

export default class extends Phaser.State {
  init (players) {
      console.log('Starting with ' + players + ' players')
      this.players = Array(players).fill()
  }
  preload () {}

  create () {
    this.characters = Array(10).fill().map((_, i) => {
      return {
          sprite: new Character({
            game: this.game,
            x: this.world.centerX + 16 - this.world.width / 2,
            y: this.world.centerY - this.world.height / 2 + 36 * (i + 1),
            asset: 'hero'
          }),
          speed: 0,
          human: false
      }
    })

    this.character = this.characters[Math.floor(Math.random() * 10)]
    this.character.human = true

    this.crosshair = new Crosshair({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'crosshair'
    })

    let charactersGroup = this.game.add.group()
    let crosshairsGroup = this.game.add.group()

    this.characters.forEach(c => {
      this.game.add.existing(c.sprite)
      this.game.physics.arcade.enable(c.sprite)
      c.sprite.body.collideWorldBounds = true
      charactersGroup.add(c.sprite)
    })

    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.add.existing(this.character.sprite)
    this.game.physics.arcade.enable(this.character.sprite)
    charactersGroup.add(this.character.sprite)

    this.game.add.existing(this.crosshair)
    this.game.physics.arcade.enable(this.crosshair)
    crosshairsGroup.add(this.crosshair)

    this.cursors = this.input.keyboard.createCursorKeys()

    let space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    space.onDown.add(this.fire, this)

    this.walk = this.game.input.keyboard.addKey(Phaser.Keyboard.A)
    this.run = this.game.input.keyboard.addKey(Phaser.Keyboard.Z)

    this.race = new Race(this.characters, this.game)
    this.race.start()
  }

  update() {
    if (this.character.sprite.alive) {
      if (this.walk.isDown) {
        this.character.sprite.forward(50)
      } else if (this.run.isDown) {
        this.character.sprite.forward(150)
      } else {
        this.character.sprite.forward(0)
      }
    }
    this.crosshair.move(this.cursors)

    let aliveChars = this.characters.filter(c => c.sprite.alive)
    let winner = undefined

    if (aliveChars.some(c => {
      winner = c.human
      return c.sprite.body.blocked.right
    })) {
      this.race.stop()
      this.state.start('End', false, false, winner)
    }

    aliveChars.filter(c => !c.human).forEach(c => c.sprite.forward(c.speed))
  }

  fire() {
    if (this.crosshair.shoot()) {
      this.characters.filter(c => c.sprite.alive).forEach(character => {
        let x = this.crosshair.body.x + 16, y = this.crosshair.body.y + 16

        if (Phaser.Rectangle.contains(character.sprite.getBounds(), x, y)) {
          character.sprite.kill()
          let blood = new Death({
            game: this.game,
            x: x,
            y: y,
            asset: 'death'
          })
          this.game.add.existing(blood)
          blood.animations.play('death').killOnComplete = true
        }

      })
    }
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.character.sprite, 32, 32)
      this.game.debug.body(this.crosshair)
      this.characters.forEach(c => this.game.debug.body(c.sprite))
    }
  }
}
