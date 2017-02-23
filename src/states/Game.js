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

    let charactersGroup = this.game.add.group()
    let crosshairsGroup = this.game.add.group()

    this.players = this.players.map((_, i) => {
      let player = this.characters[Math.floor(Math.random() * 10)]
      player.human = true

      //TODO: handle one pad / player
      switch (i) {
        case 0:
          player.pad = this.game.input.gamepad.pad1
        break;
        case 1:
          player.pad = this.game.input.gamepad.pad2
        break;
      }

      player.crosshair =  new Crosshair({
        game: this.game,
        x: this.world.centerX,
        y: this.world.centerY,
        asset: 'crosshair'
      })

      this.game.add.existing(player.crosshair)
      this.game.physics.arcade.enable(player.crosshair)
      crosshairsGroup.add(player.crosshair)

      return player;
    })

    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    this.characters.forEach(c => {
      this.game.add.existing(c.sprite)
      this.game.physics.arcade.enable(c.sprite)
      c.sprite.body.collideWorldBounds = true
      charactersGroup.add(c.sprite)
    })

    this.cursors = this.input.keyboard.createCursorKeys()

    let space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    space.onDown.add(this.fire, this)

    this.players.forEach(p => p.pad.addCallbacks(this, { onConnect: this.addButtons.bind(this, p) }))

    this.walk = this.game.input.keyboard.addKey(Phaser.Keyboard.A)
    this.run = this.game.input.keyboard.addKey(Phaser.Keyboard.Z)

    this.race = new Race(this.characters, this.game)
    this.race.start()
  }

  addButtons(player) {
    player.pad.getButton(Phaser.Gamepad.XBOX360_LEFT_BUMPER).onDown.add(this.fire.bind(this, player), this)
    player.pad.getButton(Phaser.Gamepad.XBOX360_RIGHT_BUMPER).onDown.add(this.fire.bind(this, player), this)
  }

  update() {
    this.players.forEach(p => {
      if (p.sprite.alive) {
        if (this.walk.isDown || p.pad.isDown(Phaser.Gamepad.XBOX360_A)) {
          p.sprite.forward(50)
        } else if (this.run.isDown || p.pad.isDown(Phaser.Gamepad.XBOX360_B)) {
          p.sprite.forward(150)
        } else {
          p.sprite.forward(0)
        }
      }

      let leftStickX = p.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
      let leftStickY = p.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);

      if (leftStickX) {
        p.crosshair.x += leftStickX * 5;
      }

      if (leftStickY) {
        p.crosshair.y += leftStickY * 5;
      }
    })

    this.players[0].crosshair.move(this.cursors)

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

  fire(player) {
    if (player.crosshair.shoot()) {
      this.characters.filter(c => c.sprite.alive).forEach(character => {
        let x = this.players[0].crosshair.body.x + 16, y = this.players[0].crosshair.body.y + 16

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
      this.characters.forEach(c => this.game.debug.body(c.sprite))
    }
  }
}
