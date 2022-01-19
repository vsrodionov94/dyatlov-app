import Modal from '../../scenes/Modal';
import Utils from '../../libs/Utils';
import { AnswerData, CheckAudioData } from '../../types';
import api from '../../libs/Api';

export default class Radio {
  private scene: Modal;
  private modalData: CheckAudioData;
  private input: Phaser.GameObjects.Sprite;
  private sendBtn: Phaser.GameObjects.Sprite;
  private repeatBtn: Phaser.GameObjects.Sprite;
  private text: Phaser.GameObjects.Text;
  private bg: Phaser.GameObjects.TileSprite;
  
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

    const playBtn = this.scene.add.sprite(centerX, centerY - 120, 'play-btn');
    Utils.click(playBtn, () => { this.playSound(); });
    this.scene.add.text(centerX, centerY + 150, 'Ввести слово', textStyle).setOrigin(0.5);
    this.createForm();

    this.updateState();
  }

  private playSound(): void {
    if (!this.modalData.hasAudio) return;
    const sound = this.scene.sound.add(`day-${this.modalData.currentDay}`, { volume: 1, loop: false });
    sound.play();
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

    this.input = this.scene.add.sprite(centerX, centerY + 300, 'radio-input').setVisible(false);
    this.sendBtn = this.scene.add.sprite(centerX, centerY + 500, 'send-btn').setVisible(false);
    this.repeatBtn = this.scene.add.sprite(centerX, centerY + 500, 'repeat-btn').setVisible(false);
    this.text = this.scene.add.text(centerX, centerY + 300, '', textStyle).setOrigin(0.5, 0).setVisible(false);

    Utils.click(this.input, () => { this.onInputClick(); });
    Utils.click(this.sendBtn, () => { this.onSendClick(); });
    Utils.click(this.repeatBtn, () => { this.onRepeatClick(); });
  }

  private onSendClick(): void {
    api.tryAnswerAudio(this.getData()).then(data => {
      console.log(data);
      if (!data.error) {
        this.modalData.tryCount = data.tryCount;
        if (data.correctly) {
          this.scene.state.artifacts = data.artifacts;
          this.scene.mainScene.stats.updateArtifacts(data.artifacts);
          this.updateState();
        } else {
          this.setUncorrectlyState();
        }
      }
    });
  }


  private setUncorrectlyState(): void {
    this.input.setTint(0xff0000);
    this.repeatBtn.setVisible(true);
    this.sendBtn.setVisible(false);
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
    if (!this.modalData.hasAudio) {
      const str = 'ВОЗВРАЩАЙСЯ\nВ ДЕНЬ ЭФИРА';
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
    } else if (this.modalData.tryCount < 0) {
      const str = 'ТЫ ВВЕЛ\nВЕРНОЕ СЛОВО';
      this.text.setText(str);
      this.text.setVisible(true);
      this.input.setVisible(false);
      this.sendBtn.setVisible(false);
      this.sendBtn.setVisible(false);
    } else {
      this.text.setVisible(false);
      this.input.setVisible(true);
      this.sendBtn.setVisible(true);
    }
  }
};
