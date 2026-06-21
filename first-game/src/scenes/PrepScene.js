import GameState from '../GameState.js';

const FONT = '"Press Start 2P", monospace';

export default class PrepScene extends Phaser.Scene {
  constructor() { super('Prep'); }

  create() {
    const { width: W, height: H } = this.scale;
    this.add.rectangle(W / 2, H / 2, W, H, 0x06060e);

    const g = this.add.graphics();
    g.lineStyle(1, 0x0d0d22, 1);
    for (let x = 0; x <= W; x += 32) { g.beginPath().moveTo(x, 0).lineTo(x, H).strokePath(); }
    for (let y = 0; y <= H; y += 32) { g.beginPath().moveTo(0, y).lineTo(W, y).strokePath(); }

    this.add.text(W / 2, 30, 'ROUND 3: PREPARE', {
      fontFamily: FONT, fontSize: '14px', fill: '#ffdd00',
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5);

    const w = GameState.weapon;

    // Weapon summary box
    const bx = W / 2, by = 90;
    const bg = this.add.graphics();
    bg.lineStyle(2, 0x446688, 0.8).strokeRect(bx - 200, by - 28, 400, 56);
    bg.fillStyle(0x000000, 0.7).fillRect(bx - 199, by - 27, 398, 54);
    this.add.text(bx, by - 14, `${w.icon}  ${w.name}`, {
      fontFamily: FONT, fontSize: '10px', fill: '#eeddaa',
    }).setOrigin(0.5);
    const pierceTag = w.pierce ? '  [PIERCING]' : '';
    this.add.text(bx, by + 8, `DMG: ${w.damage}  RATE: ${w.attackSpeed}/s  RNG: ${w.rangePx}${pierceTag}`, {
      fontFamily: FONT, fontSize: '7px', fill: '#88aabb',
    }).setOrigin(0.5);

    // Upgrades
    this.add.text(W / 2, 150, 'SPEND RESOURCES ON UPGRADES:', {
      fontFamily: FONT, fontSize: '7px', fill: '#668866',
    }).setOrigin(0.5);

    const upgrades = [
      { label: '+25 MAX HP',  cost: { wood: 3 },  apply: () => { GameState.playerMaxHP += 25; } },
      { label: '+10 ARMOR',   cost: { stone: 3 }, apply: () => { GameState.playerArmor += 10; } },
      { label: '+6 DAMAGE',   cost: { metal: 2 }, apply: () => { GameState.weapon.damage += 6; } },
    ];

    this.upgradeTexts = {};
    upgrades.forEach((upg, i) => {
      const y       = 185 + i * 72;
      const costStr = Object.entries(upg.cost).map(([k, v]) => `${v} ${k.toUpperCase()}`).join(' + ');

      const btn = this.add.text(W / 2, y, `[ ${upg.label} ]`, {
        fontFamily: FONT, fontSize: '11px', fill: '#00ff88',
        stroke: '#000', strokeThickness: 3,
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      this.add.text(W / 2, y + 20, `COST: ${costStr}`, {
        fontFamily: FONT, fontSize: '7px', fill: '#446655',
      }).setOrigin(0.5);

      const countTxt = this.add.text(W / 2, y + 36, '', {
        fontFamily: FONT, fontSize: '6px', fill: '#888',
      }).setOrigin(0.5);
      this.upgradeTexts[i] = countTxt;

      btn.on('pointerover', () => btn.setStyle({ fill: '#aaffcc' }));
      btn.on('pointerout',  () => btn.setStyle({ fill: '#00ff88' }));
      btn.on('pointerdown', () => {
        const r         = GameState.resources;
        const canAfford = Object.entries(upg.cost).every(([k, v]) => r[k] >= v);
        if (!canAfford) {
          btn.setStyle({ fill: '#ff4444' });
          this.time.delayedCall(400, () => btn.setStyle({ fill: '#00ff88' }));
          return;
        }
        Object.entries(upg.cost).forEach(([k, v]) => { r[k] -= v; });
        upg.apply();
        this._refreshResources();
        const n = parseInt(countTxt.text.replace(/\D/g, '') || '0') + 1;
        countTxt.setText(`PURCHASED x${n}`);
      });
    });

    this._buildResourceDisplay(W, H);

    const ready = this.add.text(W / 2, H - 52, '[ START COMBAT ]', {
      fontFamily: FONT, fontSize: '13px', fill: '#ffffff',
      stroke: '#000', strokeThickness: 4,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.tweens.add({ targets: ready, alpha: 0.3, yoyo: true, repeat: -1, duration: 750 });
    ready.on('pointerdown', () => { GameState.round = 4; this.scene.start('Combat'); });
  }

  _buildResourceDisplay(W, H) {
    const r       = GameState.resources;
    this.resTxt   = this.add.text(W / 2, H - 96,
      `WOOD:${r.wood}  STONE:${r.stone}  METAL:${r.metal}`,
      { fontFamily: FONT, fontSize: '7px', fill: '#667788' }
    ).setOrigin(0.5);
  }

  _refreshResources() {
    const r = GameState.resources;
    this.resTxt.setText(`WOOD:${r.wood}  STONE:${r.stone}  METAL:${r.metal}`);
  }
}
