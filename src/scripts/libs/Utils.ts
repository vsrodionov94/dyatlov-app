
export default class Utils {
  public static click(object: any, action: () => void, maxMoveCounter: number = 3): void {
    object.setInteractive();
    let moveCounter: number = 0;
  
    object.on('pointerdown', (): void => {
      object.xDown = object.x;
      object.yDown = object.y;
      object.press = true;
    });
  
    object.on('pointermove', (): void => {
      if (object.press) moveCounter++;
    });
  
    object.on('pointerout', (): void => {
      if (object.press) {
        moveCounter = 0;
        object.press = false;
      }
    });
  
    object.on('pointerup', (): void => {
      let x: number;
      let y: number;
  
      if (object.xDown >= object.x) x = object.xDown - object.x;
      else x = object.x - object.xDown;
  
      if (object.yDown >= object.y) y = object.yDown - object.y;
      else y = object.y - object.yDown;
      
      if (object.press && moveCounter < maxMoveCounter && x < 5 && y < 5) {
        object.press = false;
        action();
      } else if (object.press) {
        object.press = false;
      }
      moveCounter = 0;
    });
  }

  public static setHoverEffect(btn: Phaser.GameObjects.Sprite): void {
    btn.on('pointerover',() => { btn.setAlpha(0.8); });
    btn.on('pointerout',() => { btn.setAlpha(1); });
  }
};