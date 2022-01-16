import * as Webfont from '../libs/Webfonts.js';
import bridge from '@vkontakte/vk-bridge';
import { stateType } from '../types.js';
import state from '../state';
import api from './../libs/Api';

class Boot extends Phaser.Scene {
  private fontsReady: boolean;
  private userReady: boolean;
  public state: stateType;

  constructor() {
    super('Boot');
  }

  public init(): void {
    console.log(this.scene.key)
    this.state = state;
    this.fontsReady = true;
    Webfont.load({
      custom: { families: [
        'CODE-PRO-BOLD',
        'NEW_CODEPROBLACK-BLACK',
        'NEW_CODEPROBOLD-NORMAL',
        'NEW_CODEPROLC-REGULAR',
        'NEW_CODEPROLIGHT-LIGHT',
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
    this.userReady = true;
    // api.checkUser({ vkId: this.state.vkId }).then(data => {
    //   console.log(data);
    // });
  }
  
  public start(): void {
    this.scene.stop();
    this.scene.start('Preload', this.state);
  }
}

export default Boot;
