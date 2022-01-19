import { CheckKeyData, AnswerData } from '../../types';
import Modal from './../../scenes/Modal';
import Utils from './../../libs/Utils';
import api from './../../libs/Api';

export default class Lock {
  private scene: Modal;
  private modalData: CheckKeyData;
  private input: Phaser.GameObjects.Sprite;
  private sendBtn: Phaser.GameObjects.Sprite;
  private repeatBtn: Phaser.GameObjects.Sprite;
  private text: Phaser.GameObjects.Text;
  private bg: Phaser.GameObjects.TileSprite;

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
    const { centerX, centerY, width, height } = this.scene.cameras.main;
    this.scene.add.sprite(0, 0, 'lock-bg').setOrigin(0);
    this.bg = this.scene.add.tileSprite(0, 0, width, height, 'pixel').setOrigin(0).setVisible(false);
    Utils.click(this.bg, () => { this.onBackgroundClick(); });
    this.scene.add.sprite(centerX, centerY - 120, 'lock-btn');
    this.scene.add.text(centerX, centerY + 100, 'Ввод ключа', textStyle).setOrigin(0.5);
    this.createForm();
    this.updateState();
  }

  private createForm(): void {
    const { centerX, centerY } = this.scene.cameras.main;
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      color: '#fff',
      fontSize: '93px',
      fontFamily: 'NewCodeProLc',
      align: 'center',
      wordWrap: { width: 700 },
    };
    this.input = this.scene.add.sprite(centerX, centerY + 250, 'lock-input').setVisible(false);
    this.sendBtn = this.scene.add.sprite(centerX, centerY + 500, 'send-btn').setVisible(false);
    this.repeatBtn = this.scene.add.sprite(centerX, centerY + 500, 'repeat-btn').setVisible(false);
    this.text = this.scene.add.text(centerX, centerY + 250, '', textStyle).setOrigin(0.5, 0).setVisible(false);

    Utils.click(this.input, () => { this.onInputClick(); });
    Utils.click(this.sendBtn, () => { this.onSendClick(); });
    Utils.click(this.repeatBtn, () => { this.onRepeatClick(); });
  }

  private onSendClick(): void {
    api.tryAnswerKey(this.getData()).then(data => {
      console.log(data);
      if (!data.error) {
        this.modalData.tryCount = data.tryCount;
        if (data.correctly) {
          this.scene.state.keys = data.keys;
          this.scene.mainScene.stats.updateKeys(data.keys);
          this.updateState();
        } else {
          this.setUncorrectlyState();
        }
      }
    });
  }


  private setUncorrectlyState(): void {
    this.repeatBtn.setVisible(true);
    this.sendBtn.setVisible(false);
    this.input.setTint(0xff0000);
    console.log(123)
  }

  private onRepeatClick(): void {
    this.repeatBtn.setVisible(false);
    this.sendBtn.setVisible(true);
    this.input.setTint(0xffffff);
  }

  private getData(): AnswerData {
    const input = '';
    return {
      vkId: this.scene.state.vkId,
      answer: input,
    };
  }

  private onInputClick(): void {
    this.bg.setVisible(true);
  }

  private onBackgroundClick(): void {
    this.bg.setVisible(false);

  }

  private updateState(): void {
    if (!this.modalData.hasKey) {
      const str = 'ИЩИ КОДЫ\nВ ЭФИРЕ';
      this.text.setText(str);
      this.text.setVisible(true);
      this.input.setVisible(false);
      this.sendBtn.setVisible(false);
    } else if (Utils.checkTryCount(this.modalData.tryCount)) {
      const str = 'У ТЕБЯ БОЛЬШЕ\nНЕТ ПОПЫТОК';
      this.text.setText(str);
      this.text.setVisible(true);
      this.input.setVisible(false);
      this.sendBtn.setVisible(false);
      this.repeatBtn.setVisible(false);
    } else {
      this.text.setVisible(false);
      this.input.setVisible(true);
      this.sendBtn.setVisible(true);
    }
  }

};
