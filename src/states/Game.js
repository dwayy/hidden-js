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

    this.game.input.gamepad.start()

    this.players = this.players.map((_, i) => {
      let player = this.characters[Math.floor(Math.random() * 10)]
      player.human = true
      //TODO: handle one pad / player
      player.pad = this.game.input.gamepad.pad1
      return player;
    })

    this.crosshair = new Crosshair({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'crosshair'
    })

    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    let charactersGroup = this.game.add.group()
    let crosshairsGroup = this.game.add.group()

    this.characters.forEach(c => {
      this.game.add.existing(c.sprite)
      this.game.physics.arcade.enable(c.sprite)
      c.sprite.body.collideWorldBounds = true
      charactersGroup.add(c.sprite)
    })

    this.game.add.existing(this.crosshair)
    this.game.physics.arcade.enable(this.crosshair)
    crosshairsGroup.add(this.crosshair)

    this.cursors = this.input.keyboard.createCursorKeys()

    let space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    space.onDown.add(this.fire, this)

    this.players[0].pad.addCallbacks(this, { onConnect: this.addButtons })

    this.walk = this.game.input.keyboard.addKey(Phaser.Keyboard.A)
    this.run = this.game.input.keyboard.addKey(Phaser.Keyboard.Z)

    this.race = new Race(this.characters, this.game)
    this.race.start()
  }

  addButtons() {
    this.players[0].pad.getButton(Phaser.Gamepad.XBOX360_LEFT_BUMPER).onDown.add(this.fire, this)
    this.players[0].pad.getButton(Phaser.Gamepad.XBOX360_RIGHT_BUMPER).onDown.add(this.fire, this)
  }

  update() {
    if (this.players[0].sprite.alive) {
      if (this.walk.isDown || this.players[0].pad.isDown(Phaser.Gamepad.XBOX360_A)) {
        this.players[0].sprite.forward(50)
      } else if (this.run.isDown || this.players[0].pad.isDown(Phaser.Gamepad.XBOX360_B)) {
        this.players[0].sprite.forward(150)
      } else {
        this.players[0].sprite.forward(0)
      }
    }
    this.crosshair.move(this.cursors)

    let leftStickX = this.players[0].pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
    let leftStickY = this.players[0].pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);

    if (leftStickX) {
      this.crosshair.x += leftStickX * 5;
    }

    if (leftStickY) {
      this.crosshair.y += leftStickY * 5;
    }

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
      this.game.debug.spriteInfo(this.players[0].sprite, 32, 32)
      // this.game.debug.body(this.crosshair)
      this.characters.forEach(c => this.game.debug.body(c.sprite))
    }
  }
}
