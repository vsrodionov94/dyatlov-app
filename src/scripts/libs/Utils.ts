import { MAX_TRY_COUNT } from "../constants";

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

  public static clickButton(scene: Phaser.Scene, button: any, action: () => void): void {
    button.setInteractive();
    button.on('pointerdown', (): void => {
    
      button.press = true;
      button.increase = false;
      let counter: number = 0;
      let interval = scene.time.addEvent({ delay: 5, callback: () => {
        if (button.scale > 0.85 && !button.increase) {
          let scale: number = button.scale - 0.1;
          button.scale = Number(scale.toFixed(2));
        }
        counter++;
        if (counter >= 2) interval.remove(false);
      }, callbackScope: scene, loop: true });
    });
  
    button.on('pointerout', (): void => {
      if (button.press) {
        button.press = false;
        button.increase = true;
        let interval = scene.time.addEvent({ delay: 10, callback: () => {
          if (button.scale < 1 && button.increase) {
            let scale: number = button.scale + 0.05;
            button.scale = Number(scale.toFixed(2));
          }
          if (button.scale >= 1) interval.remove(false);
        }, callbackScope: scene, loop: true });
      }
    });
  
    button.on('pointerup', (): void => {
      if (button.press) {
        button.press = false;
        button.increase = true;
        let interval = scene.time.addEvent({ delay: 10, callback: () => {
          if (button.scale < 1 && button.increase) {
            let scale: number = button.scale + 0.05;
            button.scale = Number(scale.toFixed(2));
          }
          if (button.scale >= 1) interval.remove(false);
        }, callbackScope: scene, loop: true });
        action();
      }
    });
    
  }

  public static setHoverEffect(btn: Phaser.GameObjects.Sprite): void {
    btn.on('pointerover',() => { btn.setAlpha(0.8); });
    btn.on('pointerout',() => { btn.setAlpha(1); });
  }

  public static checkTryCount = (count: number): boolean => count > 0 && count >= MAX_TRY_COUNT;
};
