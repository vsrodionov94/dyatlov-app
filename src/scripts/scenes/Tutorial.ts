import Utils from './../libs/Utils';

const langs: Array<{ title: string; text: string }> = [
  {
    title: 'ПРАВИЛА ИГРЫ',
    text: 'Ты готов погрузиться в расследование тайны Перевала Дятлова?\nТвой путь будет непрост. Для начала – не забывай заходить в приложение каждый день и смотреть сериал на Телеканале ТВ-3.\nДля участия в розыгрыше призов тебе необходимо собирать коды в эфире и в трансляциях, а также разгадывать загадки и взаимодействовать с другими игроками.',
  },
  {
    title: 'КОДЫ',
    text: 'Коды выходят в каждой серии в эфире и на трансляциях у SilverName. Будь внимателен, ведь они действительны лишь в день показа и у каждого кода всего 3 попытки на ввод. За каждый верный код ты получаешь по 1 ключу.\nБез ключей ты не сможешь принять участие в розыгрыше!'
  },
  {
    title: 'ЗАГАДКИ',
    text: 'Загадки появляются в приложении в день показа серии. Не забывай расшифровывать их, за каждую загадку ты будешь получать по 5 артефактов.\nНа каждую загадку у тебя будет по 3 попытки.',
  },
  {
    title: 'ВЗАИМОПОМОЩЬ',
    text: 'Каждый день ты можешь взаимодействовать с другими игроками. Ты можешь помогать им или мешать в расследовании. За взаимопомощь ты будешь получать 5 артефактов, но если ты помешаешь и тебе это сойдет с рук, то ты можешь получить 10. Раскрытый обман, напротив, лишает тебя части прогресса.'
  },
  {
    title: 'И В ЗАКЛЮЧЕНИЕ',
    text: 'Ты можешь приглашать не более 3 своих друзей каждый день играть по своей ссылке и каждый друг будет приносить тебе по 2 дополнительных артефакта. Просто нажми на иконку для копирования своей ссылки.\nС полными правилами проведения ты можешь ознакомиться здесь.\nЖелаю удачи!'
  },
];

export default class Tutorial extends Phaser.Scene {
  private stage: number = 0;
  constructor() {
    super('Tutorial');
  }

  public init(data: { stage: number }) {
    if ((data.stage || data.stage === 0) && data.stage < langs.length) this.stage = data.stage;
  }

  public create() {
    const { centerX, height, width } = this.cameras.main;
    this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0.8)');
    this.add.tileSprite(0, 0, width, height, 'pixel').setOrigin(0).setInteractive();

    const backBtn = this.add.sprite(centerX - 50, height - 122, 'close-btn').setOrigin(0.5, 1);
    Utils.click(backBtn, () => { this.scene.stop(); });
    this.createText();
  }

  private createText() {
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      color: '#fff',
      fontSize: '48px',
      fontFamily: 'NewCodeProLc',
      align: 'center',
      wordWrap: { width: 900 },
    };
    const { centerX, centerY } = this.cameras.main;
    const lang = langs[this.stage];
    const title = this.add.text(centerX, centerY - 400, lang.title, textStyle).setOrigin(0.5, 0);
    const text = this.add.text(centerX, title.getBounds().bottom, lang.text, textStyle).setOrigin(0.5, 0);
    this.createCircles(text.getBounds().bottom + 50);
    Utils.click(text, () => {
      this.scene.restart({ stage: this.stage + 1 });
    });
  }

  private createCircles(y: number): void {
    const { centerX } = this.cameras.main;
    const startX = centerX - 80;
    for (let i = 0; i < langs.length; i += 1) {
      const circle = this.add.sprite(startX + i * 35, y, i === this.stage ? 'circle-red' : 'circle');
      Utils.click(circle, () => { this.scene.restart({ stage: i }); });
    }
  }
};
