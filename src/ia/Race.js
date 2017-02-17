import Phaser from 'phaser'

export default class {

  constructor (characters, game) {
    this.characters = characters
    this.game = game
  }

  start() {
    this.timer = this.game.time.create()
    this.timer.loop(Phaser.Timer.SECOND * 1, this.setSpeed, this)
    this.timer.start()
  }

  stop() {
    this.timer.destroy()
    this.characters.filter(c => c.sprite.alive).forEach(c => {
      c.speed = 0
    })
  }

  setSpeed() {
    this.characters.filter(c => c.sprite.alive).forEach(c => {
      let i = Math.floor(Math.random() * 10)
      if (i < 2) {
        c.speed = 50
      }
      else if (i < 6) {
        c.speed = 50
      }
      else {
        c.speed = 0
      }
    })
  }

}
