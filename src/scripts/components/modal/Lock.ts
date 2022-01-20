import { CheckKeyData, AnswerData } from '../../types';
import Modal from './../../scenes/Modal';
import Utils from './../../libs/Utils';
import api from './../../libs/Api';

export class CustomInput {
  private text: Phaser.GameObjects.Text;
  private sprite: Phaser.GameObjects.Sprite;
  private input: HTMLInputElement;
  private id: number;
  private x: number;
  private y: number;
  private scene: Phaser.Scene;
  private bg: Phaser.GameObjects.TileSprite;

  constructor(scene: Phaser.Scene, x: number, y: number, id: number, bg: Phaser.GameObjects.TileSprite) {
    this.scene = scene;
    this.id = id;
    this.x = x;
    this.y = y;
    this.bg = bg;
    this.create();
  }

  private create(): void {
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      color: '#000',
      fontSize: '83px',
      fontFamily: 'NewCodeProLc',
      align: 'center',
    };
    this.sprite = this.scene.add.sprite(this.x, this.y, 'lock-input').setOrigin(0, 0.5);
    const spriteGeom = this.sprite.getBounds();
    this.text = this.scene.add.text(spriteGeom.centerX, spriteGeom.centerY, '', textStyle).setOrigin(0.5);
    Utils.click(this.sprite, () => { this.onClick(); });
    this.createFormInput();
  }

  private createFormInput(): void {
    const root: HTMLDivElement = document.querySelector('#root');
    this.input = document.createElement('input');
    root.append(this.input);
    this.input.className = 'lock';
    this.input.setAttribute("id", `lock-${this.id}`);
    this.input.setAttribute("autocomplete", "off");
    this.input.setAttribute("maxlength", "1");
  }

  private onClick(): void {
    this.input.style.display = 'block';
    this.input.focus();
    this.text.setVisible(false);
    this.bg.setVisible(true);
  }

  public clearInput(): void {
    this.input.value = '';
    this.text.setText(this.input.value);
  }

  public setError(): void {
    this.sprite?.setTexture('lock-input-error');
  }
  
  public clearError(): void {
    this.sprite?.setTexture('lock-input');
    this.clearInput();
  }

  public blur(): void {
    this.input.blur();
    this.input.style.display = 'none';
    this.text.setVisible(true);
    this.text.setText(this.input.value);
  } 

  
  public remove(): void {
    this.input.remove();
  }

  public get value(): string {
    return this.input.value;
  }

  public setVisible(visibility: boolean): void {
    this.text.setVisible(visibility);
    this.sprite.setVisible(visibility);
  }
}

export default class Lock {
  private scene: Modal;
  private modalData: CheckKeyData;
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
    this.bg = this.scene.add.tileSprite(0, 0, width, height, 'pixel').setOrigin(0).setDepth(5).setVisible(false);
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


    this.sendBtn = this.scene.add.sprite(centerX, centerY + 500, 'send-btn').setVisible(false);
    this.repeatBtn = this.scene.add.sprite(centerX, centerY + 500, 'repeat-btn').setVisible(false);
    this.text = this.scene.add.text(centerX, centerY + 250, '', textStyle).setOrigin(0.5, 0).setVisible(false);

    this.createInput();

    Utils.click(this.sendBtn, () => { this.onSendClick(); });
    Utils.click(this.repeatBtn, () => { this.onRepeatClick(); });
  }

  private onSendClick(): void {
    api.tryAnswerKey(this.getData()).then(data => {
      if (!data.error) {
      this.modalData.tryCount = data.tryCount;
        if (data.correctly) {
          this.scene.state.keys = data.keys;
          this.scene.mainScene.stats.updateKeys(data.keys);
          this.scene.stats.updateKeys(data.keys);
          this.scene.inputs.forEach((el: CustomInput) => { el?.clearInput(); });
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
    this.scene.inputs.forEach((el: CustomInput) => {
      el.setError();
    });
  }

  private onRepeatClick(): void {
    this.repeatBtn.setVisible(false);
    this.sendBtn.setVisible(true);
    this.scene.inputs.forEach((el: CustomInput) => { el.clearError(); });
    this.onBackgroundClick();  
    this.updateState();
  }

  private getData(): AnswerData {
    let input = '';
    this.scene.inputs.forEach((el: CustomInput) => { input += el.value; });
    return { vkId: this.scene.state.vkId, answer: input };
  }

  private onBackgroundClick(): void {
    this.bg.setVisible(false);
    this.scene.inputs.forEach(el => el.blur());
  }

  private createInput(): void {
    const { centerX, centerY } = this.scene.cameras.main;
    const inputY = centerY + 250;
    const width = 96;
    const offestX = 12;
    let inputX = centerX - width * 4 - offestX * 3 - 5 ;
    
    for (let i = 1; i <= 6; i += 1) {
      inputX += width + offestX;
      const input = new CustomInput(this.scene, inputX, inputY, i, this.bg);
      this.scene.inputs.push(input);
    }
  }
  
  private updateState(): void {
    if (!this.modalData.hasKey) {
      const str = 'ИЩИ КОДЫ\nВ ЭФИРЕ';
      this.text.setText(str);
      this.text.setVisible(true);
      this.scene.inputs.forEach((el: CustomInput) => { el.setVisible(false); });
      this.sendBtn.setVisible(false);
    } else if (Utils.checkTryCount(this.modalData.tryCount)) {
      const str = 'У ТЕБЯ БОЛЬШЕ\nНЕТ ПОПЫТОК';
      this.text.setText(str);
      this.text.setVisible(true);
      this.scene.inputs.forEach((el: CustomInput) => { el.setVisible(false); });
      this.sendBtn.setVisible(false);
      this.repeatBtn.setVisible(false);
    } else {
      this.text.setVisible(false);
      this.scene.inputs.forEach((el: CustomInput) => { el.setVisible(true);; })
      this.sendBtn.setVisible(true);
    }
  }

};
