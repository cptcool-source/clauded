import GameState from '../GameState.js';
import { generateWeaponChoices } from '../config/weapons.js';
import { BASE_SCORE } from '../config/rounds.js';

const FONT = '"Press Start 2P", monospace';

export default class WeaponScene extends Phaser.Scene {
  constructor() { super('Weapon'); }

  create() {
    const { width: W, height: H } = this.scale;
    this.add.rectangle(W / 2, H / 2, W, H, 0x06060e);
    this.startTime = Date.now();

    // Header
    this.add.text(W / 2, 22, 'CHOOSE YOUR WEAPON', {
      fontFamily: FONT, fontSize: '13px', fill: '#ffdd00',
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5);
    this.add.text(W / 2, 48, 'THIS CARRIES YOU THROUGH ALL COMBAT', {
      fontFamily: FONT, fontSize: '6px', fill: '#666688',
    }).setOrigin(0.5);

    const choices = generateWeaponChoices(5);
    const CARD_W = 140, CARD_H = 230, GAP = 10;
    const totalW = choices.length * CARD_W + (choices.length - 1) * GAP;
    const startX = (W - totalW) / 2;

    choices.forEach((weapon, i) => {
      const cx = startX + i * (CARD_W + GAP) + CARD_W / 2;
      this._drawCard(cx, H / 2 + 18, CARD_W, CARD_H, weapon, () => this._select(weapon));
    });
  }

  _drawCard(cx, cy, w, h, weapon, onSelect) {
    const bg = this.add.rectangle(cx, cy, w, h, 0x0e1422)
      .setStrokeStyle(2, 0x334466)
      .setInteractive({ useHandCursor: true });

    // Icon
    this.add.text(cx, cy - h / 2 + 20, weapon.icon, { fontSize: '28px' }).setOrigin(0.5);

    // Name
    this.add.text(cx, cy - h / 2 + 52, weapon.name, {
      fontFamily: FONT, fontSize: '7px', fill: '#eeddaa',
      wordWrap: { width: w - 12 }, align: 'center',
    }).setOrigin(0.5);

    // Desc / pierce badge
    const descColor = weapon.pierce ? '#88ffcc' : '#556688';
    this.add.text(cx, cy - h / 2 + 74, weapon.pierce ? '>> PIERCING <<' : weapon.desc, {
      fontFamily: FONT, fontSize: '6px', fill: descColor, align: 'center',
      wordWrap: { width: w - 12 },
    }).setOrigin(0.5);

    // Stat bars
    const stats = [
      { label: 'DMG',  value: weapon.damage,       max: 64,   color: 0xff4444 },
      { label: 'RATE', value: weapon.attackSpeed,   max: 3.5,  color: 0x44aaff },
      { label: 'RANGE',value: weapon.rangePx,       max: 500,  color: 0x44ff88 },
      { label: 'VEL',  value: weapon.pSpeed,        max: 560,  color: 0xffaa44 },
    ];

    stats.forEach((s, si) => {
      const sy = cy - 52 + si * 34;
      this.add.text(cx - w / 2 + 8, sy, s.label, {
        fontFamily: FONT, fontSize: '6px', fill: '#778899',
      });
      const barMaxW = w - 16;
      const ratio   = Math.min(1, s.value / s.max);
      this.add.rectangle(cx, sy + 14, barMaxW, 6, 0x111a22);
      this.add.rectangle(cx - barMaxW / 2 + (barMaxW * ratio) / 2, sy + 14, barMaxW * ratio, 6, s.color);
      this.add.text(cx + w / 2 - 6, sy + 10, String(Math.round(s.value)), {
        fontFamily: FONT, fontSize: '6px', fill: '#cccccc',
      }).setOrigin(1, 0);
    });

    bg.on('pointerover', () => { bg.setFillColor(0x182038); bg.setStrokeStyle(2, 0x6688cc); });
    bg.on('pointerout',  () => { bg.setFillColor(0x0e1422); bg.setStrokeStyle(2, 0x334466); });
    bg.on('pointerdown', onSelect);
  }

  _select(weapon) {
    GameState.weapon = weapon;
    GameState.round  = 3;

    const elapsed = Date.now() - this.startTime;
    const score   = Math.max(0, Math.floor(BASE_SCORE - elapsed * 0.03));
    GameState.addRoundScore(score);

    this.scene.start('Prep');
  }
}
