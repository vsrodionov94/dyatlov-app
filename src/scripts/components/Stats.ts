import Main from './../scenes/Main';
import Modal from './../scenes/Modal';

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
    const keyIcon = this.scene.add.sprite(this.x, this.y, 'keys-icon').setOrigin(0);
    const keyIconGeom = keyIcon.getBounds();
    this.keysCount = this.scene.add.text(keyIconGeom.right + 30, keyIconGeom.centerY, String(this.scene.state.keys), textStyle).setOrigin(0, 0.5);

    const artifactsIcon = this.scene.add.sprite(keyIconGeom.left, keyIconGeom.bottom + 13, 'artifacts-icon').setOrigin(0);
    const artifactsIconGeom = artifactsIcon.getBounds();
    this.artifactsCount = this.scene.add.text(artifactsIconGeom.right + 30, artifactsIconGeom.centerY, String(this.scene.state.artifacts), textStyle).setOrigin(0, 0.5);

    const inviteIcon = this.scene.add.sprite(artifactsIconGeom.left, artifactsIconGeom.bottom + 13, 'invite-icon').setOrigin(0);
    const inviteIconGeom = inviteIcon.getBounds();
    const inviteStr = `${this.scene.state.invites} / 3`
    this.inviteCount = this.scene.add.text(inviteIconGeom.right + 30, inviteIconGeom.centerY, inviteStr, textStyle).setOrigin(0, 0.5);
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
