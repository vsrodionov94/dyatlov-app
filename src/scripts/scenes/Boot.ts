import * as Webfont from '../libs/Webfonts.js';
import bridge from '@vkontakte/vk-bridge';
import { StateType } from '../types.js';
import state from '../state';
import api from './../libs/Api';

class Boot extends Phaser.Scene {
  private fontsReady: boolean;
  private userReady: boolean;
  public state: StateType;

  constructor() {
    super('Boot');
  }

  public init(): void {
    console.log(this.scene.key)
    this.state = state;
    this.fontsReady = false;
    Webfont.load({
      custom: { families: [
      'CodeProBold', 
      'NewCodeProBlack',
      'NewCodeProBold',
      'NewCodeProLc',
      'NewCodeProLight',
    ] },
      active: () => { this.fontsReady = true },
    });
    this.checkUser();
  }
  

  public update(): void {
    if (this.fontsReady && this.userReady) {
      this.fontsReady = false;
      this.start();
    }
  }

  private checkUser(): void {
    // bridge.send('VKWebAppInit');
    // bridge.send("VKWebAppGetUserInfo").then(userInfo => {

    // });
    this.state.vkId = 23755036;
    api.checkUser({ vkId: this.state.vkId }).then(data => {
      this.state.artifacts = data.artifacts;
      this.state.invites = data.inviteCount;
      this.state.keys = data.keys;
      this.state.tutorial = data.tutorial;
      this.userReady = true;
    });
  }
  
  public start(): void {
    this.scene.stop();
    this.scene.start('Preload', this.state);
  }
}

export default Boot;
