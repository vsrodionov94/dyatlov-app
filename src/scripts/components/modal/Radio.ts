import Modal from '../../scenes/Modal';
import Utils from '../../libs/Utils';
import { AnswerData, CheckAudioData } from '../../types';
import api from '../../libs/Api';

export default class Radio {
  private scene: Modal;
  private modalData: CheckAudioData;
  private inputSprite: Phaser.GameObjects.Sprite;
  private sendBtn: Phaser.GameObjects.Sprite;
  private repeatBtn: Phaser.GameObjects.Sprite;
  private text: Phaser.GameObjects.Text;
  private bg: Phaser.GameObjects.TileSprite;
  private input: HTMLInputElement;
  private inputText: Phaser.GameObjects.Text;
  private sound: Phaser.Sound.BaseSound;

  constructor(scene: Modal) {
    this.scene = scene;
    this.modalData = this.scene.state.modalData as CheckAudioData;
    this.createElements();
  }
  
  private createElements() {
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      color: '#fff',
      fontSize: '53px',
      fontFamily: 'NewCodeProLc',
    };
    const { centerX, centerY, width, height } = this.scene.cameras.main;
    this.scene.add.sprite(0, 0, 'lock-bg').setOrigin(0);
    this.bg = this.scene.add.tileSprite(0, 0, width, height, 'pixel').setOrigin(0).setVisible(false);
    Utils.click(this.bg, () => this.onBackgroundClick());

    this.scene.add.sprite(centerX, centerY + 15, 'wave');
    const playBtn = this.scene.add.sprite(centerX, centerY - 170, 'play-btn').setDepth(1);
    Utils.clickButton(this.scene, playBtn, () => { this.playSound(); });
    this.scene.add.text(centerX, centerY + 150, 'Ввести слово', textStyle).setOrigin(0.5);
    this.createForm();

    this.updateState();
  }

  private playSound(): void {
    if (!this.modalData.hasAudio || this.sound?.isPlaying) return;
    this.sound = this.scene.sound.add(`day-${this.modalData.currentDay}`, { volume: 1, loop: false });
    this.sound.play();
  }


  private createForm() {
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

    this.inputSprite = this.scene.add.sprite(centerX, centerY + 300, 'radio-input').setVisible(false);
    this.inputText = this.scene.add.text(this.inputSprite.x, this.inputSprite.y, '', inputTextStyle).setOrigin(0.5);
    this.sendBtn = this.scene.add.sprite(centerX, centerY + 500, 'send-btn').setVisible(false);
    this.repeatBtn = this.scene.add.sprite(centerX, centerY + 500, 'repeat-btn').setVisible(false);
    this.text = this.scene.add.text(centerX, centerY + 300, '', textStyle).setOrigin(0.5, 0).setVisible(false);
    this.createInput();
    Utils.click(this.inputSprite, () => { this.onInputClick(); });
    Utils.clickButton(this.scene, this.sendBtn, () => { this.onSendClick(); });
    Utils.clickButton(this.scene, this.repeatBtn, () => { this.onRepeatClick(); });
  }

  private onSendClick(): void {
    if (this.input.value.length === 0) return;
    this.onBackgroundClick();
    api.tryAnswerAudio(this.getData()).then(data => {
      console.log(data);
      if (!data.error) {
        this.modalData.tryCount = data.tryCount;
        if (data.correctly) {
          this.scene.state.artifacts = data.artifacts;
          this.scene.mainScene.stats.updateArtifacts(data.artifacts);
          this.scene.stats.updateArtifacts(data.artifacts);
          this.updateState();
        } else {
          this.setUncorrectlyState();
        }
      }
    });
  }

  private createInput(): void {
    const root: HTMLDivElement = document.querySelector('#root');
    this.input = document.createElement('input');
    root.append(this.input);
    this.input.setAttribute("id", "radio");
    this.input.setAttribute("autocomplete", "off");
    this.scene.inputs.push(this.input);
  }

  private setUncorrectlyState(): void {
    this.inputSprite.setTexture('radio-input-error');
    this.repeatBtn.setVisible(true);
    this.sendBtn.setVisible(false);
  }

  private onRepeatClick(): void {
    this.repeatBtn.setVisible(false);
    this.sendBtn.setVisible(true);
    this.inputSprite.setTexture('radio-input');
    this.input.value = '';
    this.onBackgroundClick();
    this.updateState();
  }

  private getData(): AnswerData {
    const input = this.input.value.toUpperCase();
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

  private updateState(): void {
    if (!this.modalData.hasAudio) {
      const str = 'ВОЗВРАЩАЙСЯ\nВ ДЕНЬ ЭФИРА';
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
    } else if (this.modalData.tryCount < 0) {
      const str = 'ТЫ ВВЕЛ\nВЕРНОЕ СЛОВО';
      this.text.setText(str);
      this.text.setVisible(true);
      this.inputSprite.setVisible(false);
      this.inputText.setVisible(false);
      this.sendBtn.setVisible(false);
      this.sendBtn.setVisible(false);
    } else {
      this.text.setVisible(false);
      this.inputSprite.setVisible(true);
      this.sendBtn.setVisible(true);
    }
  }
};
