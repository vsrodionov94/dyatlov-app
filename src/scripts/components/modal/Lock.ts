import Modal from './../../scenes/Modal';
import Utils from './../../libs/Utils';

export default class Lock {
  private scene: Modal;
  constructor(scene: Modal) {
    this.scene = scene;
    this.createElements();
  }
  
  private createElements() {
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      color: '#fff',
      fontSize: '53px',
      fontFamily: 'NEW_CODEPROLIGHT-LIGHT',
    };
    const { centerX, centerY, height } = this.scene.cameras.main;
    this.scene.add.sprite(0, 0, 'lock-bg').setOrigin(0);
    this.scene.add.sprite(centerX, centerY - 120, 'lock-btn');
    this.scene.add.text(centerX, centerY + 100, 'Ввод ключа', textStyle).setOrigin(0.5);
    const input = this.scene.add.sprite(centerX, centerY + 250, 'lock-input');
    const sendBtn = this.scene.add.sprite(centerX, centerY + 500, 'send-btn');
    const backBtn = this.scene.add.sprite(centerX - 50, height - 122, 'back-btn').setOrigin(0.5, 1);
    Utils.click(backBtn, () => {
      this.scene.scene.stop();
      this.scene.mainScene.showBtns();
    })
  }
};
