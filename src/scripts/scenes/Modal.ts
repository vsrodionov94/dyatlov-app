import { stateType, modalTypes } from "../types";
import Lock from './../components/modal/Lock';
import Main from './Main';
import Radio from './../components/modal/Radio';
import FileAnswer from './../components/modal/FileAnswer';
import FileSend from './../components/modal/FileSend';

export default class Modal extends Phaser.Scene {
  public state: stateType;
  public mainScene: Main;

  constructor() {
    super('Modal');
  }

  public init(state: stateType): void {
    this.state = state;
    console.log(this.scene.key);
    this.mainScene = this.scene.get('Main') as Main;
  }

  public create(): void {
    switch (this.state.modal) {
      case modalTypes.Lock:
        new Lock(this);
        break;
      case modalTypes.Radio:
        new Radio(this);
        break;
      case modalTypes.FileAnswer:
        new FileAnswer(this);
        break;
      case modalTypes.FileSend:
        new FileSend(this);
        break;
      default: 
        this.scene.stop();
        break;
    }
  }
};