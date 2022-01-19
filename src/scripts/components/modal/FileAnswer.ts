import Modal from '../../scenes/Modal';
import Utils from '../../libs/Utils';
import { AnswerUserData, ModalTypes, UserForAnswerData } from '../../types';
import api from '../../libs/Api';
import { MAX_TRY_COUNT } from '../../constants';

export default class FileAnswer {
  private scene: Modal;
  private modalData: UserForAnswerData;

  constructor(scene: Modal) {
    this.scene = scene;
    this.modalData = this.scene.state.modalData as UserForAnswerData;
    this.scene.add.sprite(0, 0, 'answer-bg').setOrigin(0);
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
    const helpBtn = this.scene.add.sprite(centerX - 286, centerY + 500, 'answer-help-btn').setOrigin(0, 0.5);
    const unhelpBtn = this.scene.add.sprite(helpBtn.getBounds().right + 30, centerY + 500, 'answer-unhelp-btn').setOrigin(0, 0.5);

    Utils.click(helpBtn, () => { this.onHelpClick();});
    Utils.click(unhelpBtn, () => { this.onUnhelpClick();});
  }

  private onHelpClick(): void {
    this.sendAnswer(true);
  }

  private getNextUser(): void {
    api.getUserForAnswer({ vkId: this.scene.state.vkId }).then(data => {
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
    api.tryAnswerUser(data).then(data => {
      if (!data.error) {
        this.scene.state.artifacts = data.artifacts;
        this.scene.mainScene.stats.updateArtifacts(data.artifacts);
        this.getNextUser();
      }
    });
  }

  private createZone(): void {
    const { centerX, centerY } = this.scene.cameras.main;

    const zone = this.scene.add.zone(centerX - 230, centerY - 180, 480, 150).setDropZone(undefined, () => {});
    Utils.click(zone, () => {
      api.getRandomUser({ vkId: this.scene.state.vkId }).then(data => {
        console.log('getRandom', data);
        this.scene.state.modalData = data;
        this.scene.state.modal = ModalTypes.FileSend;
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
    const mask = new Phaser.Display.Masks.BitmapMask(this.scene, avatar);
    this.loadAvatarAsset({ id, photo }).then(() => {
      const key = `avatar-${id}`;
      const texture = this.scene.textures.exists(key) ? key : 'avatar';
      const sprite = this.scene.add.sprite(avatar.x, avatar.y, texture);
      sprite.setDisplaySize(avatar.displayWidth, avatar.displayHeight)
        .setMask(mask).setOrigin(0, 0.5);
    });
    const avatarGeom = avatar.getBounds();
    this.scene.add.text(avatarGeom.right + 90, avatarGeom.centerY - 20, name, textStyle).setOrigin(0, 0.5);
    this.scene.add.text(avatarGeom.right + 87, avatarGeom.bottom, sex, textStyle);
    this.scene.add.text(avatarGeom.right + 87, avatarGeom.bottom + 50, age, textStyle);
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
