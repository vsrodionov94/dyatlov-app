import { CheckKeyData, AnswerData } from '../../types';
import Modal from './../../scenes/Modal';
import Utils from './../../libs/Utils';
import api from './../../libs/Api';

export default class Lock {
  private scene: Modal;
  private modalData: CheckKeyData;
  private inputSprite: Phaser.GameObjects.Sprite;
  private sendBtn: Phaser.GameObjects.Sprite;
  private repeatBtn: Phaser.GameObjects.Sprite;
  private text: Phaser.GameObjects.Text;
  private bg: Phaser.GameObjects.TileSprite;
  private input: HTMLInputElement;
  private inputText: Phaser.GameObjects.Text;

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

    const inputTextStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      color: '#000',
      fontSize: '83px',
      fontFamily: 'NewCodeProLc',
      align: 'center',
    };

    this.inputSprite = this.scene.add.sprite(centerX, centerY + 250, 'lock-input').setVisible(false);
    this.inputText = this.scene.add.text(this.inputSprite.x, this.inputSprite.y, '', inputTextStyle).setOrigin(0.5);
    this.sendBtn = this.scene.add.sprite(centerX, centerY + 500, 'send-btn').setVisible(false);
    this.repeatBtn = this.scene.add.sprite(centerX, centerY + 500, 'repeat-btn').setVisible(false);
    this.text = this.scene.add.text(centerX, centerY + 250, '', textStyle).setOrigin(0.5, 0).setVisible(false);

    this.createInput();

    Utils.click(this.inputSprite, () => { this.onInputClick(); });
    Utils.click(this.sendBtn, () => { this.onSendClick(); });
    Utils.click(this.repeatBtn, () => { this.onRepeatClick(); });
  }

  private onSendClick(): void {
    api.tryAnswerKey(this.getData()).then(data => {
      this.input.value = '';
      if (!data.error) {
      this.modalData.tryCount = data.tryCount;
        if (data.correctly) {
          this.scene.state.keys = data.keys;
          this.scene.mainScene.stats.updateKeys(data.keys);
          this.scene.stats.updateArtifacts(data.keys);
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
    this.inputSprite.setTexture('lock-input-error');
  }

  private onRepeatClick(): void {
    this.repeatBtn.setVisible(false);
    this.sendBtn.setVisible(true);
    this.inputSprite.setTexture('lock-input');
    this.input.value = '';
    this.onBackgroundClick();  
    this.updateState();
  }

  private getData(): AnswerData {
    const input = this.input.value;
    return { vkId: this.scene.state.vkId, answer: input };
  }

  private onInputClick(): void {
    this.bg.setVisible(true);
    this.input.style.display = 'block';
    this.input.focus();
    this.inputText.setVisible(false);
  }

  private onBackgroundClick(): void {
    this.bg.setVisible(false);
    this.input.style.display = 'none';
    this.input.blur();
    this.inputText.setVisible(true).setText(this.input.value);
  }

  private createInput(): void {
    const root: HTMLDivElement = document.querySelector('#root');
    this.input = document.createElement('input');
    root.append(this.input);
    this.input.setAttribute("id", "lock");
    this.input.setAttribute("autocomplete", "off");
    this.scene.inputs.push(this.input);
  }
  
  private updateState(): void {
    if (!this.modalData.hasKey) {
      const str = 'ИЩИ КОДЫ\nВ ЭФИРЕ';
      this.text.setText(str);
      this.text.setVisible(true);
      this.inputSprite.setVisible(false);
      this.sendBtn.setVisible(false);
    } else if (Utils.checkTryCount(this.modalData.tryCount)) {
      const str = 'У ТЕБЯ БОЛЬШЕ\nНЕТ ПОПЫТОК';
      this.text.setText(str);
      this.text.setVisible(true);
      this.inputSprite.setVisible(false);
      this.sendBtn.setVisible(false);
      this.repeatBtn.setVisible(false);
    } else {
      this.text.setVisible(false);
      this.inputSprite.setVisible(true);
      this.sendBtn.setVisible(true);
    }
  }

};
