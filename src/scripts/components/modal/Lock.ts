import { CheckKeyData, AnswerData } from '../../types';
import Modal from './../../scenes/Modal';
import Utils from './../../libs/Utils';
import api from './../../libs/Api';

export default class Lock {
  private scene: Modal;
  private modalData: CheckKeyData;
  private input: Phaser.GameObjects.Sprite;
  private sendBtn: Phaser.GameObjects.Sprite;
  private text: Phaser.GameObjects.Text;

  constructor(scene: Modal) {
    this.scene = scene;
    this.modalData = this.scene.state.modalData as CheckKeyData;
    this.createElements();
  }
  
  private createElements(): void {
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      color: '#fff',
      fontSize: '53px',
      fontFamily: 'NewCodeProLc',
    };
    const { centerX, centerY } = this.scene.cameras.main;
    this.scene.add.sprite(0, 0, 'lock-bg').setOrigin(0);
    this.scene.add.sprite(centerX, centerY - 120, 'lock-btn');
    this.scene.add.text(centerX, centerY + 100, 'Ввод ключа', textStyle).setOrigin(0.5);
    this.createForm();
  }

  private createForm(): void {
    const { centerX, centerY } = this.scene.cameras.main;
    this.input = this.scene.add.sprite(centerX, centerY + 250, 'lock-input');
    this.sendBtn = this.scene.add.sprite(centerX, centerY + 500, 'send-btn');

    Utils.click(this.input, () => { this.onInputClick(); });
    Utils.click(this.sendBtn, () => { this.onSendClick(); });
    
  }

  private onSendClick(): void {
    api.tryAnswerKey(this.getData()).then(data => {
      if (!data.error) {
        this.modalData.tryCount = data.tryCount;
        if (data.correctly) {
          this.scene.state.keys = data.keys;
          this.scene.mainScene.stats.updateKeys(data.keys);
        }
        this.updateState();
      }
    });
  }

  private getData(): AnswerData {
    const input = '';
    return {
      vkId: this.scene.state.vkId,
      answer: input,
    };
  }

  private onInputClick(): void {

  }

  private onBackgroundClick(): void {

  }

  private updateState(): void {
    if (!this.modalData.hasKey) {
      const str = 'Приходи в день эфира';
      this.text.setText(str);
      this.text.setVisible(true);
      this.input.setVisible(false);
      this.sendBtn.setVisible(false);
    } else if (Utils.checkTryCount(this.modalData.tryCount)) {
      const str = 'Все попытки потрачены';
      this.text.setText(str);
      this.text.setVisible(true);
      this.input.setVisible(false);
      this.sendBtn.setVisible(false);
    } else if (this.modalData.tryCount < 0) {
      const str = 'Ответил уже правильно';
      this.text.setText(str);
      this.text.setVisible(true);
      this.input.setVisible(false);
      this.sendBtn.setVisible(false);
    } else {
      this.text.setVisible(false);
      this.input.setVisible(true);
      this.sendBtn.setVisible(true);
    }
  }

};
