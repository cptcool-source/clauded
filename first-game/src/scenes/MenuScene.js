import GameState from '../GameState.js';

const FONT = '"Press Start 2P", monospace';

export default class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create() {
    GameState.reset();

    const { width: W, height: H } = this.scale;
    this.add.rectangle(W / 2, H / 2, W, H, 0x06060e);

    // Grid background
    const g = this.add.graphics();
    g.lineStyle(1, 0x0d0d22, 1);
    for (let x = 0; x <= W; x += 32) { g.beginPath().moveTo(x, 0).lineTo(x, H).strokePath(); }
    for (let y = 0; y <= H; y += 32) { g.beginPath().moveTo(0, y).lineTo(W, y).strokePath(); }

    // Title
    this.add.text(W / 2, 100, 'SURVIVE', {
      fontFamily: FONT, fontSize: '52px', fill: '#00ff66',
      stroke: '#003311', strokeThickness: 8,
    }).setOrigin(0.5);
    this.add.text(W / 2, 155, 'A SURVIVAL SHOOTER', {
      fontFamily: FONT, fontSize: '9px', fill: '#446644',
    }).setOrigin(0.5);

    // Divider
    this.add.graphics().lineStyle(1, 0x224422, 1)
      .beginPath().moveTo(W / 2 - 200, 180).lineTo(W / 2 + 200, 180).strokePath();

    // Round info
    const lines = [
      ['RND 1', 'GATHER RESOURCES',    '#aaaaaa'],
      ['RND 2', 'CHOOSE YOUR WEAPON',  '#aaaaaa'],
      ['RND 3', 'CRAFT & PREPARE',     '#aaaaaa'],
      ['RND 4-8', 'SURVIVE ANIMALS',   '#ffaa44'],
      ['RND 9-11', 'FACE DINOSAURS!',  '#ff4444'],
    ];
    lines.forEach(([rnd, desc, col], i) => {
      this.add.text(W / 2 - 190, 200 + i * 34, rnd, {
        fontFamily: FONT, fontSize: '7px', fill: '#ffdd00',
      });
      this.add.text(W / 2 - 80, 200 + i * 34, desc, {
        fontFamily: FONT, fontSize: '7px', fill: col,
      });
    });

    // Start button
    const btn = this.add.text(W / 2, H - 100, 'PRESS TO START', {
      fontFamily: FONT, fontSize: '16px', fill: '#ffffff',
      stroke: '#000', strokeThickness: 4,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.tweens.add({ targets: btn, alpha: 0.25, yoyo: true, repeat: -1, duration: 600 });
    btn.on('pointerdown', () => this.scene.start('Resource'));

    // Controls
    this.add.text(W / 2, H - 50, 'WASD: MOVE     CLICK: SHOOT', {
      fontFamily: FONT, fontSize: '7px', fill: '#334433',
    }).setOrigin(0.5);
  }
}
