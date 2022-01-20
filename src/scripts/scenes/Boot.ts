import * as Webfont from '../libs/Webfonts.js';
import { StateType } from '../types.js';
import state from '../state';
import bridge from '@vkontakte/vk-bridge';

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
    bridge.send('VKWebAppInit');
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
  }
  

  public update(): void {
    if (this.fontsReady) {
      this.fontsReady = false;
      this.start();
    }
  }
  
  public start(): void {
    this.scene.stop();
    this.scene.start('Preload', this.state);
  }
}

export default Boot;
