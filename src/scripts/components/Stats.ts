import Main from './../scenes/Main';
import Modal from './../scenes/Modal';
import Utils from './../libs/Utils';
import bridge from '@vkontakte/vk-bridge';

export default class Stats {
  private keysCount: Phaser.GameObjects.Text;
  private artifactsCount: Phaser.GameObjects.Text;
  private inviteCount: Phaser.GameObjects.Text;
  private x: number;
  private y: number;
  private scene: Main | Modal;

  constructor(scene: Main | Modal) {
    this.x = 76;
    this.y = 185;
    this.scene = scene;
    this.createElements();
  }

  private createElements() {
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      color: '#fff',
      fontSize: '53px',
      fontFamily: 'NewCodeProLc',
    };
    const halfWidth = 71;
    const keyIcon = this.scene.add.sprite(this.x + halfWidth, this.y + halfWidth, 'keys-icon').setDepth(2);
    const keyIconGeom = keyIcon.getBounds();
    this.keysCount = this.scene.add.text(keyIconGeom.right + 30, keyIconGeom.centerY, String(this.scene.state.keys), textStyle).setOrigin(0, 0.5).setDepth(2);

    const artifactsIcon = this.scene.add.sprite(this.x + halfWidth, keyIconGeom.bottom + 13 + halfWidth, 'artifacts-icon').setDepth(2);
    const artifactsIconGeom = artifactsIcon.getBounds();
    this.artifactsCount = this.scene.add.text(artifactsIconGeom.right + 30, artifactsIconGeom.centerY, String(this.scene.state.artifacts), textStyle).setOrigin(0, 0.5).setDepth(2);

    const inviteIcon = this.scene.add.sprite(this.x + halfWidth, artifactsIconGeom.bottom + 13 + halfWidth, 'invite-icon').setDepth(2);
    const inviteIconGeom = inviteIcon.getBounds();
    const inviteStr = `${this.scene.state.invites} / 3`
    this.inviteCount = this.scene.add.text(inviteIconGeom.right + 30, inviteIconGeom.centerY, inviteStr, textStyle).setOrigin(0, 0.5).setDepth(2);

    Utils.clickButton(this.scene, inviteIcon, () => {
      bridge.send("VKWebAppShare", { "link": `vk.com/app8055103#${this.scene.state.vkId}` });
    });
  }

  public updateKeys(keys: number): void {
    this.keysCount.setText(String(keys));
  }

  public updateArtifacts(artifacts: number): void {
    this.artifactsCount.setText(String(artifacts));
  }

  public updateInvite(invites: number): void {
    this.inviteCount.setText(`${invites} / 3`);
  }
};
