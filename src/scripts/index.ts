import '../css/style.css';
import * as Phaser from 'phaser';

import Boot from './scenes/Boot';
import Preload from './scenes/Preload';
import Start from './scenes/Start';
import Modal from './scenes/Modal';
import Main from './scenes/Main';
import Tutorial from './scenes/Tutorial';

function gcd(num1: number, num2: number): number {
  while (num1 && num2) num1 > num2 ? num1 %= num2 : num2 %= num1;
  num1 += num2;
  return num1;
}

window.onload = (): void => {
  setTimeout((): void => {
    let width: number = 0;
    let height: number = 0;
    let root: any = document.querySelector('#root');
    let clientHeight: number = Math.round(document.body.clientHeight);
    let clientWidth: number = Math.round(document.body.clientWidth);
    let canvasHeight: number = 1920;
    let canvasWidth: number = 1080;
 
    let x: number = canvasWidth / gcd(canvasHeight, canvasWidth);
    let y: number = canvasHeight / gcd(canvasHeight, canvasWidth);
  
    if (clientHeight / y > clientWidth / x) {
      width = clientWidth;
      height = clientWidth / x * y;
    } else {
      width = clientHeight / y * x;
      height = clientHeight;
    }
  
    root.style.height = height + 'px';
    root.style.width = width + 'px';

    let config = {
      type: Phaser.CANVAS,
      width: canvasWidth,
      height: canvasHeight,
      parent: 'root',
      render: { transparent: true },
      scene: [Boot, Preload, Start, Main, Modal, Tutorial],

    }
    
    const game: Phaser.Game = new Phaser.Game(config);
    window.addEventListener('resize', (): void => {
      game.scale.resize(canvasWidth, canvasHeight);
    }, false);

  }, 100);
}
