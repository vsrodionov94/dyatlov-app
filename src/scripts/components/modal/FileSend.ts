import Modal from '../../scenes/Modal';
import Utils from '../../libs/Utils';
import { AnswerUserData, ModalTypes, RandomUserData, TrySendUserData } from '../../types';
import api from '../../libs/Api';
import { MAX_TRY_COUNT } from '../../constants';
import { Data } from 'phaser';

export default class FileSend {
  private scene: Modal;
  private modalData: RandomUserData;

  constructor(scene: Modal) {
    this.scene = scene;
    console.log(this.scene.state.modalData);
    this.modalData = this.scene.state.modalData as RandomUserData;
    this.scene.add.sprite(0, 0, 'send-bg').setOrigin(0);
    this.createZone();
    if (this.modalData.user) {
      this.createElements();
      this.createUserInfo();
    } else {
      this.createPlaceHolder();
    }
  }
  
  private createElements() {
    const { centerX, centerY } = this.scene.cameras.main;
    const helpBtn = this.scene.add.sprite(centerX - 445, centerY + 500, 'send-help-btn').setOrigin(0, 0.5);
    const skipBtn = this.scene.add.sprite(helpBtn.getBounds().right + 30, centerY + 500, 'send-skip-btn').setOrigin(0, 0.5);
    const unhelpBtn = this.scene.add.sprite(skipBtn.getBounds().right + 30, centerY + 500, 'send-unhelp-btn').setOrigin(0, 0.5);

    Utils.clickButton(this.scene, helpBtn, () => { this.onHelpClick();});
    Utils.clickButton(this.scene, skipBtn, () => { this.onSkipClick();});
    Utils.clickButton(this.scene, unhelpBtn, () => { this.onUnhelpClick();});
  }

  private onHelpClick(): void {
    this.sendAnswer(true);
  }

  private onSkipClick(): void {
    this.getNewUser();
  }

  private getNewUser(): void {
    api.getRandomUser({ vkId: this.scene.state.vkId }).then(data => {
      this.scene.state.modalData = data;
      this.scene.state.modal = ModalTypes.FileSend;
      this.scene.scene.restart(this.scene.state);
    });
  }

  private onUnhelpClick(): void {
    this.sendAnswer(false);
  }

  private sendAnswer(answer: boolean): void {
    const data: AnswerUserData = {
      vkId: this.scene.state.vkId,
      foreignId: this.modalData.user.id,
      helped: answer,
    };
    api.trySendUser(data).then(data => {
      if (!data.error) {
        this.modalData.tryCount = data.tryCount;
        this.getNewUser();
      }
    });
  }

  private createZone(): void {
    const { centerX, centerY } = this.scene.cameras.main;

    const zone = this.scene.add.zone(centerX + 230, centerY - 180, 480, 150).setDropZone(undefined, () => {});
    Utils.click(zone, () => {
      api.getUserForAnswer({ vkId: this.scene.state.vkId }).then(data => {
        this.scene.state.modalData = data;
        this.scene.state.modal = ModalTypes.FileAnswer;
        this.scene.scene.restart(this.scene.state);
      });
    });
  }

  private createPlaceHolder(): void {
    const str = Utils.checkTryCount(this.modalData.tryCount) ? 'у тебя больше нет попыток' : 'нет новых анкет';
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'CodeProBold',
      fontSize: '40px',
      color: '#000000'
    };
    const { centerX, centerY } = this.scene.cameras.main;

    this.scene.add.text(centerX, centerY + 120, str, textStyle).setOrigin(0.5);
  }

  private createUserInfo() {
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      color: '#000',
      fontSize: '38px',
      fontFamily: 'NewCodeProLc',
      wordWrap: { width: 500 }
    };
    const { centerY } = this.scene.cameras.main;

    const { name, sex, age, id, photo } = this.modalData.user;
    const avatar = this.scene.add.sprite(151, centerY + 50, 'avatar').setOrigin(0, 0.5);
    this.loadAvatarAsset({ id, photo }).then(() => {
      const key = `avatar-${id}`;
      const texture = this.scene.textures.exists(key) ? key : 'avatar';
      const sprite = this.scene.add.sprite(avatar.x, avatar.y, texture);
      const halfWidth = avatar.displayWidth / 2
      const circle = this.scene.add.graphics({ x: avatar.x + halfWidth, y: avatar.y }).fillCircle(0, 0, halfWidth).setVisible(false);
      const mask = new Phaser.Display.Masks.GeometryMask(this.scene, circle);
      sprite.setDisplaySize(avatar.displayWidth, avatar.displayHeight).setOrigin(0, 0.5).setMask(mask);
    });
    const avatarGeom = avatar.getBounds();
    this.scene.add.text(avatarGeom.right + 90, avatarGeom.centerY - 20, name, textStyle).setOrigin(0, 0.5);
    this.scene.add.text(avatarGeom.right + 87, avatarGeom.bottom, sex, textStyle);
    this.scene.add.text(avatarGeom.right + 87, avatarGeom.bottom + 35, age, textStyle);
  }

  private loadAvatarAsset(data: { id: number, photo: string }): Promise<boolean> {
    return new Promise(resolve => {
      const { id, photo } = data;
      const key = `avatar-${id}`;
      if (this.scene.textures.exists(key)) return resolve(true);
      this.scene.load.image(key, photo);
      this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => resolve(true));
      this.scene.load.start();
    });
  }
};
