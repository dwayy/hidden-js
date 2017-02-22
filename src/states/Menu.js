import Phaser from 'phaser'

export default class extends Phaser.State {

  init () {}
  preload () {}

  create () {
    const players = ' PLAYERS';
    const heights = [-300, -200, -100];
    this.items = [];

    this.currentIndex = 0;

    [2, 3, 4].forEach((e, i) => {
      let item = this.add.text(this.world.centerX, this.game.height + heights[i], e + players)
      item.font = 'Bangers'
      item.padding.set(10, 16)
      item.fontSize = 40
      item.fill = '#77BFA3'
      item.smoothed = false
      item.anchor.setTo(0.5)
      item.stroke = '#000000'
      this.items.push(item)
    })

    this.items[this.currentIndex].strokeThickness = 6;

    let cursors = this.input.keyboard.createCursorKeys()
    cursors.down.onDown.add(this.down, this)
    cursors.up.onDown.add(this.up, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(this.start, this)
  }

  down() {
    this.items[this.currentIndex].strokeThickness = 0
    this.currentIndex++
    if(this.currentIndex >= 3) {
      this.currentIndex = 0
    }
    this.items[this.currentIndex].strokeThickness = 6
  }

  up() {
    this.items[this.currentIndex].strokeThickness = 0
    this.currentIndex--
    if(this.currentIndex < 0) {
      this.currentIndex = 2
    }
    this.items[this.currentIndex].strokeThickness = 6
  }

  start() {
    // currentIndex + 2 is the number of players
    this.state.start('Game', true, false, this.currentIndex + 2)
  }

}
