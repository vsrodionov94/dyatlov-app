import { stateType } from "../types";

const startBg: string = require('../../assets/images/start-screen/bg.png');
const startBtn: string = require('../../assets/images/start-screen/btn.png');
const mainBg: string = require('../../assets/images/main-screen/bg.png');
const fileBtn: string = require('../../assets/images/main-screen/file-btn.png');
const radioBtn: string = require('../../assets/images/main-screen/radio-btn.png');
const lockBtn: string = require('../../assets/images/main-screen/lock-btn.png');
const faqBtn: string = require('../../assets/images/faq/btn.png');
const keysIcon: string = require('../../assets/images/stats/keys.png');
const artifactsIcon: string = require('../../assets/images/stats/artifacts.png');
const inviteIcon: string = require('../../assets/images/stats/invite.png');
const pixel: string = require('../../assets/images/pixel.png');
const whitePixel: string = require('../../assets/images/white-pixel.jpg');
const lockBg: string = require('../../assets/images/modal/lock-bg.png');
const lockInput: string = require('../../assets/images/modal/lock-input.png');
const radioInput: string = require('../../assets/images/modal/radio-input.png');
const sendBtn: string = require('../../assets/images/modal/send-btn.png');
const repeatBtn: string = require('../../assets/images/modal/repeat-btn.png');
const backBtn: string = require('../../assets/images/modal/back-btn.png');
const playBtn: string = require('../../assets/images/modal/play-btn.png');
const answerBg: string = require('../../assets/images/modal/file-answer-bg.png');
const answerHelpBtn: string = require('../../assets/images/modal/file-answer-help-btn.png');
const answerUnhelpBtn: string = require('../../assets/images/modal/file-answer-unhelp-btn.png');
const sendBg: string = require('../../assets/images/modal/file-send-bg.png');
const sendHelpBtn: string = require('../../assets/images/modal/file-send-help-btn.png');
const sendUnhelpBtn: string = require('../../assets/images/modal/file-send-unhelp-btn.png');
const sendSkipBtn: string = require('../../assets/images/modal/file-send-skip-btn.png');
const avatar: string = require('../../assets/images/modal/avatar.png');

class Preload extends Phaser.Scene {
  public state: stateType;
  constructor() {
    super('Preload');
  }


  public init(state: stateType): void {
    this.state = state;
    console.log(this.scene.key)
  }

  public preload(): void {
    this.load.image('start-bg', startBg);
    this.load.image('start-btn', startBtn);
    this.load.image('main-bg', mainBg);
    this.load.image('file-btn', fileBtn);
    this.load.image('radio-btn', radioBtn);
    this.load.image('lock-btn', lockBtn);
    this.load.image('keys-icon', keysIcon);
    this.load.image('artifacts-icon', artifactsIcon);
    this.load.image('invite-icon', inviteIcon);
    this.load.image('faq-btn', faqBtn);
    this.load.image('pixel', pixel);
    this.load.image('white-pixel', whitePixel);
    this.load.image('lock-bg', lockBg);
    this.load.image('lock-input', lockInput);
    this.load.image('radio-input', radioInput);
    this.load.image('send-btn', sendBtn);
    this.load.image('repeat-btn', repeatBtn);
    this.load.image('back-btn', backBtn);
    this.load.image('play-btn', playBtn);
    this.load.image('answer-bg', answerBg);
    this.load.image('answer-help-btn', answerHelpBtn);
    this.load.image('answer-unhelp-btn', answerUnhelpBtn);
    this.load.image('send-bg', sendBg);
    this.load.image('send-help-btn', sendHelpBtn);
    this.load.image('send-unhelp-btn', sendUnhelpBtn);
    this.load.image('send-skip-btn', sendSkipBtn);
    this.load.image('avatar', avatar);
  }

  public create(): void {
    this.scene.stop()
    this.scene.start('Start', this.state);
  }

}

export default Preload;
