import Phaser from 'phaser'

export default class extends Phaser.State {

  init (human) {
    this.human = human
  }
  preload () {}

  create () {
    const bannerText = (this.human ? 'PLAYER ' + this.human: 'COMPUTER') + ' WINS'
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText)
    banner.font = 'Bangers'
    banner.padding.set(10, 16)
    banner.fontSize = 40
    banner.fill = '#77BFA3'
    banner.smoothed = false
    banner.anchor.setTo(0.5)

    this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(this.restart, this)
  }

  restart() {
    this.state.start('Menu')
  }

}
