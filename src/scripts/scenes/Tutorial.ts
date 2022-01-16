import Utils from './../libs/Utils';

export default class Tutorial extends Phaser.Scene {
  constructor() {
    super('Tutorial');
  }

  public create() {
    const { centerX, height, width } = this.cameras.main;
    this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0.5)');
    this.add.tileSprite(0, 0, width, height, 'pixel').setOrigin(0).setInteractive();

    const backBtn = this.add.sprite(centerX - 50, height - 122, 'close-btn').setOrigin(0.5, 1);
    Utils.click(backBtn, () => { this.scene.stop(); });
  }
};
