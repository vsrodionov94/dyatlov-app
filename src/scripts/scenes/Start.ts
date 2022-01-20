import { StateType } from '../types';
import Utils from './../libs/Utils';
import bridge from '@vkontakte/vk-bridge';
import api from './../libs/Api';

export default class Start extends Phaser.Scene {
  public state: StateType;
  private startCheck: boolean;

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
    Utils.setHoverEffect(btn);
    Utils.click(btn, () => { this.checkUser(); });
  }

  private checkUser(): void {
    if (this.startCheck) return;
    this.startCheck = true;
    // api.checkUser({ vkId: this.state.vkId, hash: '' }).then(data => {
    //   this.state.artifacts = data.artifacts;
    //   this.state.invites = data.inviteCount;
    //   this.state.keys = data.keys;
    //   this.state.tutorial = data.tutorial;
    //   this.scene.stop();
    //   this.scene.start('Main', this.state);
    // }).catch(e => { this.startCheck = false; });
    bridge.send("VKWebAppGetUserInfo").then(userInfo => {
      this.state.vkId = userInfo.id;
      const hash = location.hash;
      console.log(hash);
      console.log(location);
      api.checkUser({ vkId: this.state.vkId, ref: hash }).then(data => {
        this.state.artifacts = data.artifacts;
        this.state.invites = data.inviteCount;
        this.state.keys = data.keys;
        this.state.tutorial = data.tutorial;
        this.scene.stop();
        this.scene.start('Main', this.state);
      }).catch(e => { this.startCheck = false; });
    }).catch(e => { this.startCheck = false; });
  }
};
