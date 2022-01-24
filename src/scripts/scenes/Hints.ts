export default class Hints extends Phaser.Scene {
  public hints: Phaser.GameObjects.Group
  constructor() {
    super('Hints');
  }

  public create(){
    this.hints = this.add.group();
  }
}
