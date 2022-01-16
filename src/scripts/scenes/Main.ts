import { modalTypes, stateType } from "../types";
import Utils from './../libs/Utils';
import api from './../libs/Api';
import Stats from './../components/Stats';

export default class Main extends Phaser.Scene {
  public state: stateType;
  public playBtn: Phaser.GameObjects.Sprite;
  public repostBtn: Phaser.GameObjects.Sprite;
  public balls: Phaser.GameObjects.Group;
  private lockBtn: Phaser.GameObjects.Sprite;
  private fileBtn: Phaser.GameObjects.Sprite;
  private radioBtn: Phaser.GameObjects.Sprite;
  private bg: Phaser.GameObjects.Sprite;
  constructor() {
    super('Main');
  }

  public init(state: stateType): void {
    this.state = state;
  }

  public create(): void {
    const { centerX, centerY, width, height } = this.cameras.main;
    this.bg = this.add.sprite(centerX, 0, 'main-bg').setOrigin(0.5, 0);
    this.lockBtn = this.add.sprite(centerX + 260, centerY - 200, 'lock-btn');
    this.fileBtn = this.add.sprite(centerX - 260, centerY + 80, 'file-btn');
    this.radioBtn = this.add.sprite(centerX + 200, centerY + 400, 'radio-btn');
    new Stats(this);
    const faqBtn = this.add.sprite(width - 61, height - 69, 'faq-btn').setOrigin(1);

    Utils.click(this.lockBtn, () => {
      this.state.modal = modalTypes.Lock;
      this.hideBtns();
      this.scene.launch('Modal', this.state);
    });

    Utils.click(this.radioBtn, () => {
      this.state.modal = modalTypes.Radio;
      this.hideBtns();
      this.scene.launch('Modal', this.state);
    });

    Utils.click(this.fileBtn, () => {
      this.state.modal = modalTypes.FileAnswer;
      this.hideBtns();
      this.scene.launch('Modal', this.state);
    });
  }

  public hideBtns() {
    this.bg.setVisible(false);
    this.lockBtn.setVisible(false);
    this.fileBtn.setVisible(false);
    this.radioBtn.setVisible(false);
  }

  public showBtns() {
    this.bg.setVisible(true);
    this.lockBtn.setVisible(true);
    this.fileBtn.setVisible(true);
    this.radioBtn.setVisible(true);
  }

};