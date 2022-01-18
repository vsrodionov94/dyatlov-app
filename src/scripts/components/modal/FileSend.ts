import Modal from '../../scenes/Modal';
import Utils from '../../libs/Utils';
import { ModalTypes } from '../../types';

export default class FileSend {
  private scene: Modal;
  constructor(scene: Modal) {
    this.scene = scene;
    this.createElements();
    this.createUserInfo();
  }
  
  private createElements() {
    const { centerX, centerY, height } = this.scene.cameras.main;
    this.scene.add.sprite(0, 0, 'send-bg').setOrigin(0);
    const helpBtn = this.scene.add.sprite(centerX - 445, centerY + 500, 'send-help-btn').setOrigin(0, 0.5);
    const skipBtn = this.scene.add.sprite(helpBtn.getBounds().right + 30, centerY + 500, 'send-skip-btn').setOrigin(0, 0.5);
    const unhelpBtn = this.scene.add.sprite(skipBtn.getBounds().right + 30, centerY + 500, 'send-unhelp-btn').setOrigin(0, 0.5);
    
    const backBtn = this.scene.add.sprite(centerX - 50, height - 122, 'back-btn').setOrigin(0.5, 1);
    Utils.click(backBtn, () => {
      this.scene.scene.stop();
      this.scene.mainScene.showBtns();
    });

    const zone = this.scene.add.zone(centerX + 230, centerY - 180, 480, 150).setDropZone(undefined, () => {});
    Utils.click(zone, () => {
      this.scene.state.modal = ModalTypes.FileAnswer;
      this.scene.scene.restart(this.scene.state);
    });
  }

  private createUserInfo() {
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      color: '#000',
      fontSize: '38px',
      fontFamily: 'NewCodeProLc',
      wordWrap: { width: 500 }
    };
    const { centerX, centerY } = this.scene.cameras.main;

    const avatar = this.scene.add.sprite(151, centerY + 50, 'avatar').setOrigin(0, 0.5);
    const avatarGeom = avatar.getBounds();
    const nameStr = 'Констанция Константинопольская';
    const name = this.scene.add.text(avatarGeom.right + 90, avatarGeom.centerY - 20, nameStr, textStyle).setOrigin(0, 0.5);

    const sexStr = 'пол: женский'
    const sex = this.scene.add.text(avatarGeom.right + 87, avatarGeom.bottom, sexStr, textStyle);

    const ageStr = 'возраст: 46'
    const age = this.scene.add.text(avatarGeom.right + 87, sex.getBounds().bottom, ageStr, textStyle);
  }
};
