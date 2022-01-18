import { GetData, ModalTypes, StateType, ModalData } from "../types";
import Utils from './../libs/Utils';
import Stats from './../components/Stats';
import api from './../libs/Api';

export default class Main extends Phaser.Scene {
  public state: StateType;
  public playBtn: Phaser.GameObjects.Sprite;
  public repostBtn: Phaser.GameObjects.Sprite;
  public balls: Phaser.GameObjects.Group;
  private lockBtn: Phaser.GameObjects.Sprite;
  private fileBtn: Phaser.GameObjects.Sprite;
  private radioBtn: Phaser.GameObjects.Sprite;
  private faqBtn: Phaser.GameObjects.Sprite;
  private bg: Phaser.GameObjects.Sprite;
  public stats: Stats;
  private getData: GetData;

  constructor() {
    super('Main');
  }

  public init(state: StateType): void {
    this.state = state;
    this.getData = { vkId: this.state.vkId };
  }

  public create(): void {
    this.bg = this.add.sprite(0, 0, 'main-bg').setOrigin(0);
    this.createButtons();
    this.setListeners();

    this.stats = new Stats(this);
  }

  private setListeners(): void {
    Utils.click(this.lockBtn, () => { this.onLockClick(); });
    Utils.click(this.radioBtn, () => { this.onRadioClick(); });
    Utils.click(this.fileBtn, () => { this.onFileClick(); });
    Utils.click(this.faqBtn, () => { this.onFaqClick(); });
  }

  private createButtons(): void {
    const { centerX, centerY, width, height } = this.cameras.main;
    this.lockBtn = this.add.sprite(centerX + 260, centerY - 200, 'lock-btn');
    this.fileBtn = this.add.sprite(centerX - 260, centerY + 80, 'file-btn');
    this.radioBtn = this.add.sprite(centerX + 200, centerY + 400, 'radio-btn');
    this.faqBtn = this.add.sprite(width - 61, height - 69, 'faq-btn').setOrigin(1);
  }

  private onLockClick(): void {
    this.hideBtns();

    api.checkKey(this.getData).then(data => {
      if (!data.error) this.openModal(data, ModalTypes.Lock);
      else this.showBtns();
    }).catch(() => {
      this.showBtns();
    });
  }

  private onFaqClick(): void {
    this.scene.launch('Tutorial');
  }

  private onFileClick(): void {
    this.hideBtns();

    api.getUserForAnswer(this.getData).then(data => {
      if (!data.error) this.openModal(data, ModalTypes.FileAnswer);
      else this.showBtns();
    }).catch(() => {
      this.showBtns();
    });
  }

  private onRadioClick(): void {
    this.hideBtns();

    api.checkAudio(this.getData).then(data => {
      if (!data.error) this.openModal(data, ModalTypes.Radio);
      else this.showBtns();
    }).catch(() => {
      this.showBtns();
    });
  }

  private openModal(data: ModalData, type: ModalTypes): void {
    this.state.modalData = data;
    this.state.modal = type;
    this.scene.launch('Modal', this.state);
  }

  public hideBtns(): void {
    this.bg.setVisible(false);
    this.lockBtn.setVisible(false);
    this.fileBtn.setVisible(false);
    this.radioBtn.setVisible(false);
  }

  public showBtns(): void {
    this.bg.setVisible(true);
    this.lockBtn.setVisible(true);
    this.fileBtn.setVisible(true);
    this.radioBtn.setVisible(true);
  }
};