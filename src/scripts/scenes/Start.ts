import { StateType } from '../types';
import Utils from './../libs/Utils';

export default class Start extends Phaser.Scene {
  public state: StateType;
  constructor() {
    super('Start');
  }

  public init(state: StateType): void {
    this.state = state;
    console.log(this.scene.key)
  }
  
  public create(): void {
    const { centerX, centerY } = this.cameras.main;
    const bgTexture = 'start-bg';
    this.add.sprite(centerX, 0, bgTexture).setOrigin(0.5, 0);
    const btn = this.add.sprite(centerX, centerY + 300, 'start-btn').setInteractive();
    const action = () => {
      this.scene.stop();
      this.scene.start('Main', this.state);
    }
    Utils.setHoverEffect(btn);
    Utils.click(btn, () => { action(); });
  }
};
