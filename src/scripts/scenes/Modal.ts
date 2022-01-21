import { StateType, ModalTypes, CheckAudioData } from "../types";
import Lock, { CustomInput } from './../components/modal/Lock';
import Main from './Main';
import Radio from './../components/modal/Radio';
import FileAnswer from './../components/modal/FileAnswer';
import FileSend from './../components/modal/FileSend';
import Utils from './../libs/Utils';
import Stats from './../components/Stats';

const audioSrc = {
  day0: require('../../assets/sound/day-0.wav'),
  day1: require('../../assets/sound/day-1.wav'),
  day2: require('../../assets/sound/day-2.wav'),
  day3: require('../../assets/sound/day-3.wav'),
  day7: require('../../assets/sound/day-7.wav'),
  day8: require('../../assets/sound/day-8.wav'),
  day9: require('../../assets/sound/day-9.wav'),
  day10: require('../../assets/sound/day-10.wav'),
};
export default class Modal extends Phaser.Scene {
  public state: StateType;
  public mainScene: Main;
  public inputs: Array<CustomInput | HTMLInputElement>;
  public stats: Stats;
  private faqBtn: Phaser.GameObjects.Sprite;

  constructor() {
    super('Modal');
  }

  public preload(): void {
    if (this.state.modal === ModalTypes.Radio) {
      const data = this.state.modalData as CheckAudioData;
      const hasAudio = data.hasAudio;
      if (!Utils.checkTryCount(data.tryCount) && hasAudio) {
        this.load.audio(`day-${data.currentDay}`, audioSrc[`day${data.currentDay}`]);
      }
    }
  }

  public init(state: StateType): void {
    this.inputs = [];
    this.cameras.main.setBackgroundColor('#181818');
    this.state = state;
    this.mainScene = this.scene.get('Main') as Main;
    this.stats = new Stats(this);
  }

  public create(): void {
    if (this.state.modalData === null) this.scene.stop();
    this.createModalElements();
    this.createBackBtn();
    this.createFaqBtn();
  }
  
  private createModalElements(): void {
    switch (this.state.modal) {
      case ModalTypes.Lock:
        new Lock(this);
        break;
      case ModalTypes.Radio:
        new Radio(this);
        break;
      case ModalTypes.FileAnswer:
        new FileAnswer(this);
        break;
      case ModalTypes.FileSend:
        new FileSend(this);
        break;
      default: 
        this.scene.stop();
        break;
    }
  }


  private createBackBtn(): void {
    const { centerX, height } = this.cameras.main;
    const backBtn = this.add.sprite(centerX - 50, height - 122 - 29, 'back-btn');
    Utils.clickButton(this, backBtn, () => {
      this.scene.stop();
      this.mainScene.showBtns();
      this.state.modalData = null;
      this.inputs.forEach(el => {
        el?.blur();
        el?.remove();
        this.sound.stopAll();
      });
    });
  }

  private createFaqBtn(): void {
    const { width, height } = this.cameras.main;
    this.faqBtn = this.add.sprite(width - 132, height - 140, 'faq-btn');
    let stage = 1;
    switch (this.state.modal) {
      case ModalTypes.Radio:
        stage = 2;
        break;
      case ModalTypes.FileAnswer:
        stage = 3;
        break;
      case ModalTypes.FileSend:
        stage = 3;
        break;
    }

    Utils.clickButton(this, this.faqBtn, () => {
      this.inputs.forEach(el => {
        el?.blur();
      });
      this.scene.launch('Tutorial', { stage });
    });
  }
};