import GameState from '../GameState.js';

const FONT = '"Press Start 2P", monospace';

export default class ScoreScene extends Phaser.Scene {
  constructor() { super('Score'); }

  create() {
    const { width: W, height: H } = this.scale;
    this.add.rectangle(W / 2, H / 2, W, H, 0x06060e);

    const survived = GameState.round - 1;
    const won      = survived >= 11;

    // Header
    this.add.text(W / 2, 32, won ? 'VICTORY!' : 'GAME OVER', {
      fontFamily: FONT, fontSize: '32px',
      fill: won ? '#00ff66' : '#ff2222',
      stroke: '#000', strokeThickness: 6,
    }).setOrigin(0.5);

    this.add.text(W / 2, 76, `SURVIVED: ${survived} ROUNDS`, {
      fontFamily: FONT, fontSize: '9px', fill: '#aaaaaa',
    }).setOrigin(0.5);

    // Divider
    this.add.graphics().lineStyle(1, 0x224444, 1)
      .beginPath().moveTo(100, 100).lineTo(W - 100, 100).strokePath();

    // Per-round breakdown
    this.add.text(W / 2, 112, 'ROUND BREAKDOWN', {
      fontFamily: FONT, fontSize: '7px', fill: '#446666',
    }).setOrigin(0.5);

    const roundNames = {
      1:'GATHER', 2:'WEAPON', 3:'PREP',
      4:'RABBITS', 5:'WOLVES', 6:'BEARS',
      7:'BOARS', 8:'ANIMALS', 9:'RAPTORS',
      10:'TRIKE', 11:'T-REX',
    };

    GameState.roundScores.forEach((entry, i) => {
      const y   = 136 + i * 24;
      const lbl = `RND ${entry.round}: ${roundNames[entry.round] || '???'}`;
      this.add.text(110, y, lbl, { fontFamily: FONT, fontSize: '7px', fill: '#778899' });
      this.add.text(W - 110, y, `+${entry.score}`, {
        fontFamily: FONT, fontSize: '7px', fill: '#ffcc44',
      }).setOrigin(1, 0);
    });

    // Total
    const totalY = 136 + GameState.roundScores.length * 24 + 8;
    this.add.graphics().lineStyle(1, 0x334455, 1)
      .beginPath().moveTo(100, totalY).lineTo(W - 100, totalY).strokePath();
    this.add.text(W - 110, totalY + 8, `TOTAL: ${GameState.totalScore}`, {
      fontFamily: FONT, fontSize: '9px', fill: '#ffffff',
    }).setOrigin(1, 0);

    // Play again
    const btn = this.add.text(W / 2, H - 52, 'PLAY AGAIN', {
      fontFamily: FONT, fontSize: '14px', fill: '#00ff66',
      stroke: '#000', strokeThickness: 4,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.tweens.add({ targets: btn, alpha: 0.3, yoyo: true, repeat: -1, duration: 700 });
    btn.on('pointerdown', () => this.scene.start('Menu'));
  }
}
