import Hints from "../scenes/Hints";

export default class Hint extends Phaser.GameObjects.Text {
  
  public scene: Hints;
  public delay: number;
  public bg: Phaser.GameObjects.Graphics;

  constructor (scene: Hints, y: number, text: string, delay: number) {
    super(scene, scene.cameras.main.centerX, scene.cameras.main.centerY + y, text, {
      fontFamily: 'NewCodeProLc',
      fontSize: '80px',
      color: '#FFFFFF',
      wordWrap: { width: 800 },
      align: 'center',
    })
    this.init(scene, delay);
  }

  static create(scene: Hints, y: number, text: string, delay: number): Hint {
    const newHint: Hint = new Hint(scene, y, text, delay);

    if (scene.hints.children.entries.length > 0) {
        scene.time.addEvent({
        delay: 400,
        callback: (): void => {
          newHint.setVisible(true);
          newHint.bg.setVisible(true);
        }
      });
    } else {
      newHint.setVisible(true);
      newHint.bg.setVisible(true);
    }

    scene.hints.children.entries.forEach((hint: Hint) => {
      hint?.scrollDown(newHint.height + 40);
    });
    scene.hints.add(newHint);
    return newHint;
  }
  
  private init(scene: Hints, delay: number): void {
    this.scene = scene;
    this.delay = delay;
    this.scene.add.existing(this);
    this.setVisible(false);

    this.setDepth(this.y + 1).setOrigin(0.5);
    this.createBg();
    this.faidOutAnim();
  }
  
  private createBg(): void {
    this.bg = this.scene.add.graphics();
    this.bg.fillStyle(0x000000, 0.6)
    .fillRoundedRect(this.x - (this.width + 50) / 2, this.y - (this.height + 20) / 2, this.width + 50, this.height + 20, 20)
    .setDepth(this.y).setVisible(false);
  }

  private faidOutAnim(): void {
    const tween: Phaser.Tweens.Tween = this.scene?.tweens.add({
      delay: this.delay * 1000,
      targets: [ this, this.bg ],
      alpha: 0,
      duration: 300,
      onComplete: () => {
        this.bg.destroy();
        this.destroy();
        tween.remove();
      },
      onCompleteParams: this,
    })
  } 

  private scrollDown(value: number) {
    const tween: Phaser.Tweens.Tween = this.scene?.tweens.add({
      targets: [ this, this.bg ],
      y: `+=${value}`,
      duration: 400,
      onComplete: () => {
        tween.remove();
      },
      onCompleteParams: this,
    })
  }


}