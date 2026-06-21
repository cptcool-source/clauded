import GameState from '../GameState.js';
import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import { COMBAT_ROUNDS, ENEMY_STATS, BASE_SCORE, ROUND_TIME_BASE, TIME_MULTIPLIER } from '../config/rounds.js';

const MAP_W = 800, MAP_H = 600;
const FONT = '"Press Start 2P", monospace';
const CHARGE_TIME = 1500; // ms to reach full charge (3× damage)

export default class CombatScene extends Phaser.Scene {
  constructor() { super('Combat'); }

  create() {
    this.cameras.main.setBackgroundColor(0x0a120a);
    this.physics.world.setBounds(0, 0, MAP_W, MAP_H);

    this._drawTerrain();

    this.player = new Player(this, 400, 300, GameState.playerMaxHP);
    this.player.weapon = GameState.weapon;
    this.player.armor  = GameState.playerArmor;
    this.player.setDepth(10);

    this.projectiles = this.physics.add.group();
    this.enemies     = this.physics.add.group();

    // Single global overlap — critical: do NOT create per-shot overlaps
    this.physics.add.overlap(
      this.projectiles, this.enemies,
      this._onProjectileHit, null, this
    );

    this.events.on('playerDamaged', (amount, x, y) => {
      this._showDamageNumber(x, y - 20, amount, 0xff2222);
    });

    this.events.on('enemyDied', () => this._onEnemyKilled());

    // Charge shot state
    this._isCharging      = false;
    this._chargeStartTime = 0;
    this._chargeGraphic   = this.add.graphics().setDepth(20);

    // Combo state
    this._combo      = 0;
    this._comboTimer = null;

    // Freeze-frame state
    this._frozen = false;

    this._buildHUD();
    this.input.setDefaultCursor('none');
    this.crosshair = this.add.graphics().setDepth(30);

    this.input.on('pointerdown', ptr => {
      if (ptr.button !== 0 || this._dead) return;
      this._startCharge();
    });
    this.input.on('pointerup', ptr => {
      if (ptr.button !== 0) return;
      this._releaseCharge();
    });

    if (GameState.round >= 9) {
      this._doBossIntro();
    } else {
      this._spawnWave();
    }

    this.startTime      = Date.now();
    this._transitioning = false;
    this._dead          = false;
  }

  // ── Terrain ────────────────────────────────────────────────────────────────

  _drawTerrain() {
    const g = this.add.graphics();
    g.fillStyle(0x0a120a).fillRect(0, 0, MAP_W, MAP_H);
    g.lineStyle(1, 0x111811, 1);
    for (let x = 0; x <= MAP_W; x += 32) {
      g.beginPath().moveTo(x, 0).lineTo(x, MAP_H).strokePath();
    }
    for (let y = 0; y <= MAP_H; y += 32) {
      g.beginPath().moveTo(0, y).lineTo(MAP_W, y).strokePath();
    }
    for (let i = 0; i < 28; i++) {
      const tx = Math.floor(Phaser.Math.Between(0, MAP_W / 32 - 1)) * 32;
      const ty = Math.floor(Phaser.Math.Between(0, MAP_H / 32 - 1)) * 32;
      g.fillStyle(0x182818, 0.9).fillRect(tx + 1, ty + 1, 30, 30);
    }
  }

  // ── Wave spawning ──────────────────────────────────────────────────────────

  _spawnWave() {
    const config = COMBAT_ROUNDS[GameState.round];
    if (!config) return;

    config.waves.forEach(wave => {
      for (let i = 0; i < wave.count; i++) {
        const edge = Phaser.Math.Between(0, 3);
        let x, y;
        if      (edge === 0) { x = Phaser.Math.Between(20, MAP_W - 20); y = -50; }
        else if (edge === 1) { x = MAP_W + 50; y = Phaser.Math.Between(20, MAP_H - 20); }
        else if (edge === 2) { x = Phaser.Math.Between(20, MAP_W - 20); y = MAP_H + 50; }
        else                 { x = -50; y = Phaser.Math.Between(20, MAP_H - 20); }
        const enemy = new Enemy(this, x, y, wave.type, ENEMY_STATS[wave.type]);
        enemy.setDepth(9);
        this.enemies.add(enemy);
      }
    });
  }

  // ── Boss intro (rounds 9+) ─────────────────────────────────────────────────

  _doBossIntro() {
    const rnd     = GameState.round;
    const isFinal = rnd === 11;
    const isTrike = rnd === 10;

    const flashR = isFinal ? 220 : isTrike ? 160 : 80;
    const flashG = isFinal ? 0   : isTrike ? 60  : 160;
    const text   = isFinal ? 'T-REX INCOMING!' : isTrike ? 'TRICERATOPS!' : 'RAPTORS!';
    const col    = isFinal ? '#ff2222' : isTrike ? '#ffaa22' : '#88ff44';
    const sz     = isFinal ? '24px' : '20px';

    this.cameras.main.flash(700, flashR, flashG, 0);
    this.cameras.main.shake(900, isFinal ? 0.022 : 0.014);

    const txt = this.add.text(MAP_W / 2, MAP_H / 2, text, {
      fontFamily: FONT, fontSize: sz, fill: col,
      stroke: '#000', strokeThickness: 6,
    }).setOrigin(0.5).setDepth(35).setAlpha(0);

    this.tweens.add({ targets: txt, alpha: 1, duration: 180 });
    this.tweens.add({ targets: txt, scaleX: 1.15, scaleY: 1.15, yoyo: true, repeat: 3, duration: 300 });

    this.time.delayedCall(isFinal ? 2000 : 1500, () => {
      this.tweens.add({ targets: txt, alpha: 0, duration: 250, onComplete: () => txt.destroy() });
      this._spawnWave();
    });
  }

  // ── HUD ────────────────────────────────────────────────────────────────────

  _buildHUD() {
    const hg = this.add.graphics().setDepth(18);
    hg.lineStyle(2, 0x00ff44, 0.7).strokeRect(6, 6, 240, 76);
    hg.fillStyle(0x000000, 0.75).fillRect(7, 7, 238, 74);
    hg.lineStyle(2, 0xff4444, 0.7).strokeRect(MAP_W - 166, 6, 160, 36);
    hg.fillStyle(0x000000, 0.75).fillRect(MAP_W - 165, 7, 158, 34);

    const f  = { fontFamily: FONT, fontSize: '8px', fill: '#00ff44', stroke: '#000', strokeThickness: 2 };
    const fy = { fontFamily: FONT, fontSize: '8px', fill: '#ffdd00', stroke: '#000', strokeThickness: 2 };
    const fb = { fontFamily: FONT, fontSize: '8px', fill: '#88ccff', stroke: '#000', strokeThickness: 2 };
    const fr = { fontFamily: FONT, fontSize: '8px', fill: '#ff4444', stroke: '#000', strokeThickness: 2 };

    this.hudRound = this.add.text(14, 14, '', fy).setDepth(20);
    this.hudHP    = this.add.text(14, 34, '', f).setDepth(20);
    this.hudWpn   = this.add.text(14, 54, '', fb).setDepth(20);
    this.hudCount = this.add.text(MAP_W - 158, 16, '', fr).setDepth(20);

    this._updateHUD();
  }

  _updateHUD() {
    const rnd   = GameState.round;
    const names = { 4: 'RABBITS', 5: 'WOLVES', 6: 'BEARS', 7: 'BOARS', 8: 'ANIMALS', 9: 'RAPTORS', 10: 'TRIKE', 11: 'T-REX!!!' };
    this.hudRound.setText(`RND ${rnd}: ${names[rnd] || '???'}`);
    this.hudHP.setText(`HP: ${Math.ceil(this.player.hp)} / ${this.player.maxHP}`);
    const w = GameState.weapon;
    this.hudWpn.setText(`WPN: ${w.type.toUpperCase()}`);
    this.hudCount.setText(`ENEMIES: ${this.enemies.countActive(true)}`);
  }

  // ── Charge shot ────────────────────────────────────────────────────────────

  _startCharge() {
    this._isCharging      = true;
    this._chargeStartTime = Date.now();
  }

  _releaseCharge() {
    if (!this._isCharging) return;
    this._isCharging = false;
    if (this._dead || !this.player.canAttack()) return;
    const ptr = this.input.activePointer;
    this._fireCharged(ptr.x, ptr.y);
  }

  _fireCharged(screenX, screenY) {
    const elapsed     = Date.now() - this._chargeStartTime;
    const chargeLevel = Math.min(1.0, elapsed / CHARGE_TIME);
    const w           = GameState.weapon;
    const angle       = Math.atan2(screenY - this.player.y, screenX - this.player.x);
    const baseDmg     = this.player.triggerAttack();
    const totalDmg    = Math.round(baseDmg * (1 + chargeLevel * 2)); // 1× to 3×
    const isCrit      = Math.random() < 0.15;

    const baseScale = w.projScale || 0.65;
    const projScale = baseScale + chargeLevel * 0.8;

    const proj = this.projectiles.create(this.player.x, this.player.y, 'orb');
    if (!proj) return;

    proj.setTint(isCrit ? 0xffffff : w.color);
    proj.setScale(projScale);
    proj.setDepth(8);
    proj.damage   = totalDmg;
    proj.isCrit   = isCrit;
    proj.pierce   = w.pierce   || false;
    proj.hitColor = w.color    || 0xffcc44;
    proj.body.setVelocity(Math.cos(angle) * w.pSpeed, Math.sin(angle) * w.pSpeed);

    this._startProjectileTrail(proj, isCrit ? 0xffffff : w.color, projScale);

    // Muzzle flash — scales with charge
    const fx = this.player.x + Math.cos(angle) * 22;
    const fy = this.player.y + Math.sin(angle) * 22;
    const flashSz = 6 + chargeLevel * 12;
    const fl = this.add.graphics().setDepth(25);
    fl.fillStyle(w.color, 0.9).fillCircle(fx, fy, flashSz)
      .fillStyle(0xffffff, 0.8).fillCircle(fx, fy, flashSz * 0.4);
    this.tweens.add({ targets: fl, alpha: 0, scaleX: 2, scaleY: 2, duration: 100, onComplete: () => fl.destroy() });

    if (chargeLevel >= 0.8) this.cameras.main.shake(50, 0.003);

    const ttl = (w.rangePx / w.pSpeed) * 1000 + 60;
    this.time.delayedCall(ttl, () => { if (proj.active) proj.destroy(); });
  }

  _startProjectileTrail(proj, color, scale) {
    const timer = this.time.addEvent({
      delay: 32,
      loop: true,
      callback: () => {
        if (!proj || !proj.active) { timer.remove(); return; }
        const g  = this.add.graphics().setDepth(7);
        const sz = Math.max(2, scale * 6);
        g.fillStyle(color, 0.5).fillRect(proj.x - sz / 2, proj.y - sz / 2, sz, sz);
        this.tweens.add({ targets: g, alpha: 0, scaleX: 0.15, scaleY: 0.15, duration: 200, onComplete: () => g.destroy() });
      },
      callbackScope: this,
    });
  }

  // ── Hit detection ──────────────────────────────────────────────────────────

  _onProjectileHit(proj, enemy) {
    if (!proj.active || !enemy.active) return;

    let dmg = proj.damage;
    if (proj.isCrit) {
      dmg = Math.round(dmg * 1.5);
      this._showCritText(enemy.x, enemy.y);
      this.cameras.main.shake(80, 0.006);
    }

    enemy.takeDamage(dmg);
    enemy.knockback(proj.x, proj.y, 230);

    const numColor = proj.isCrit ? 0xffffff : (proj.hitColor || 0xffcc44);
    this._showDamageNumber(enemy.x, enemy.y, dmg, numColor);
    this._showHitSparks(proj.x, proj.y, proj.hitColor || 0xffcc44, proj.isCrit);

    if (!proj.pierce) proj.destroy();
  }

  // ── Enemy killed ───────────────────────────────────────────────────────────

  _onEnemyKilled() {
    this._freezeFrame(55);

    this._combo++;
    if (this._comboTimer) this._comboTimer.remove();
    this._comboTimer = this.time.delayedCall(2000, () => { this._combo = 0; this._comboTimer = null; });
    if (this._combo >= 3) this._showComboText(this._combo);

    // Slight delay so active-count settles before checking wave clear
    this.time.delayedCall(80, () => {
      if (!this._transitioning && this.enemies.countActive(true) === 0) {
        this._roundWon();
      }
    });
  }

  _freezeFrame(ms) {
    if (this._frozen) return;
    this._frozen = true;
    this.physics.world.pause();
    this.time.delayedCall(ms, () => {
      this.physics.world.resume();
      this._frozen = false;
    });
  }

  // ── Visual effects ─────────────────────────────────────────────────────────

  _showHitSparks(x, y, color, isCrit = false) {
    const g       = this.add.graphics().setDepth(20);
    const n       = isCrit ? 12 : 8;
    const baseLen = isCrit ? 20 : 13;

    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2;
      const len   = baseLen + Phaser.Math.Between(-4, 5);
      const sr    = isCrit ? 5 : 3;
      g.lineStyle(isCrit ? 3 : 2, i % 2 === 0 ? 0xffffff : color, 0.95)
       .beginPath()
       .moveTo(x + Math.cos(angle) * sr,         y + Math.sin(angle) * sr)
       .lineTo(x + Math.cos(angle) * (sr + len),  y + Math.sin(angle) * (sr + len))
       .strokePath();
    }
    g.fillStyle(0xffffff, isCrit ? 1.0 : 0.85).fillCircle(x, y, isCrit ? 7 : 4);

    this.tweens.add({
      targets: g,
      scaleX: isCrit ? 2.4 : 1.9, scaleY: isCrit ? 2.4 : 1.9,
      alpha: 0,
      duration: isCrit ? 300 : 210,
      onComplete: () => g.destroy(),
    });
  }

  _showDamageNumber(x, y, damage, color = 0xffcc44) {
    const hex  = `#${color.toString(16).padStart(6, '0')}`;
    const size = Math.min(11, 7 + Math.floor(damage / 8));
    const txt  = this.add.text(
      x + Phaser.Math.Between(-10, 10), y,
      `-${damage}`,
      { fontFamily: FONT, fontSize: `${size}px`, fill: hex, stroke: '#000', strokeThickness: 2 }
    ).setOrigin(0.5).setDepth(26);
    this.tweens.add({ targets: txt, y: y - 52, alpha: 0, duration: 880, ease: 'Power2', onComplete: () => txt.destroy() });
  }

  _showCritText(x, y) {
    const txt = this.add.text(x, y - 30, 'CRIT!', {
      fontFamily: FONT, fontSize: '14px', fill: '#ffffff',
      stroke: '#ff2200', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(29);
    this.tweens.add({
      targets: txt, y: y - 72, scaleX: 1.5, scaleY: 1.5, alpha: 0,
      duration: 700, ease: 'Power2Out', onComplete: () => txt.destroy(),
    });
  }

  _showComboText(count) {
    const palettes = ['#ffdd00', '#ffaa00', '#ff6600', '#ff0066', '#ff00ff', '#00ffff'];
    const col  = palettes[Math.min(count - 3, palettes.length - 1)];
    const size = Math.min(20, 12 + (count - 3) * 2);
    const txt  = this.add.text(MAP_W / 2, 185, `COMBO x${count}!`, {
      fontFamily: FONT, fontSize: `${size}px`, fill: col,
      stroke: '#000', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(28);
    this.tweens.add({
      targets: txt, y: 120, scaleX: 1.4, scaleY: 1.4, alpha: 0,
      duration: 1000, ease: 'Power2Out', onComplete: () => txt.destroy(),
    });
  }

  // ── Round flow ─────────────────────────────────────────────────────────────

  _roundWon() {
    this._transitioning = true;
    const elapsed = Date.now() - this.startTime;
    const score   = Math.floor(BASE_SCORE + Math.max(0, ROUND_TIME_BASE - elapsed) * TIME_MULTIPLIER);
    GameState.addRoundScore(score);

    this.cameras.main.flash(220, 255, 255, 255);

    this.add.text(MAP_W / 2, MAP_H / 2 - 40, 'ROUND', {
      fontFamily: FONT, fontSize: '28px', fill: '#ffdd00', stroke: '#000', strokeThickness: 5,
    }).setOrigin(0.5).setDepth(30);
    this.add.text(MAP_W / 2, MAP_H / 2 + 10, 'CLEAR!', {
      fontFamily: FONT, fontSize: '28px', fill: '#00ff88', stroke: '#000', strokeThickness: 5,
    }).setOrigin(0.5).setDepth(30);
    this.add.text(MAP_W / 2, MAP_H / 2 + 55, `+${score} PTS`, {
      fontFamily: FONT, fontSize: '14px', fill: '#ffffff', stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(30);

    GameState.round++;
    this.time.delayedCall(700, () => {
      this.cameras.main.fade(450, 0, 0, 0);
      this.time.delayedCall(450, () => {
        if (GameState.round > 11) this.scene.start('Score');
        else this.scene.restart();
      });
    });
  }

  _playerDied() {
    if (this._dead) return;
    this._dead = true;

    this.input.setDefaultCursor('default');
    this.add.rectangle(MAP_W / 2, MAP_H / 2, MAP_W, MAP_H, 0x000000, 0.8).setDepth(28);
    this.add.text(MAP_W / 2, 190, 'YOU DIED', {
      fontFamily: FONT, fontSize: '36px', fill: '#ff2222', stroke: '#000', strokeThickness: 6,
    }).setOrigin(0.5).setDepth(30);
    this.add.text(MAP_W / 2, 270, `ROUNDS: ${GameState.round - 1}`, {
      fontFamily: FONT, fontSize: '14px', fill: '#ffffff', stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(30);
    this.add.text(MAP_W / 2, 310, `SCORE: ${GameState.totalScore}`, {
      fontFamily: FONT, fontSize: '14px', fill: '#ffdd00', stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(30);

    this.time.delayedCall(3200, () => {
      this.input.setDefaultCursor('default');
      this.scene.start('Score');
    });
  }

  // ── Main loop ──────────────────────────────────────────────────────────────

  update(time, delta) {
    if (this._dead) return;

    // Charge ring (always drawn, even during freeze)
    this._chargeGraphic.clear();
    if (this._isCharging) {
      const elapsed = Date.now() - this._chargeStartTime;
      const t       = Math.min(1.0, elapsed / CHARGE_TIME);
      const w       = GameState.weapon;
      const rad     = 18 + t * 22;
      const pulse   = Math.sin(Date.now() / 90) * 0.5 + 0.5;

      this._chargeGraphic.lineStyle(2 + t * 3, w.color, 0.35 + t * 0.5 + pulse * 0.15);
      this._chargeGraphic.strokeCircle(this.player.x, this.player.y, rad);

      if (t > 0.5) {
        const ia = (t - 0.5) * 2;
        this._chargeGraphic.lineStyle(2, 0xffffff, ia * 0.7);
        this._chargeGraphic.strokeCircle(this.player.x, this.player.y, rad * 0.55);
      }
    }

    // During freeze-frame: skip all game updates, just redraw crosshair
    if (this._frozen) {
      this._drawCrosshair();
      return;
    }

    this.player.update(time, delta);

    const ptr = this.input.activePointer;
    this.player.setRotation(
      Math.atan2(ptr.y - this.player.y, ptr.x - this.player.x) + Math.PI / 2
    );

    this.enemies.getChildren().forEach(e => { if (e.active) e.update(time, delta, this.player); });

    if (this.player.isDead()) this._playerDied();

    this._drawCrosshair();
    this._updateHUD();
  }

  _drawCrosshair() {
    const ptr = this.input.activePointer;
    const cx = ptr.x, cy = ptr.y;
    this.crosshair.clear()
      .lineStyle(2, 0x00ff88, 0.95)
      .strokeCircle(cx, cy, 9)
      .beginPath().moveTo(cx - 18, cy).lineTo(cx - 11, cy).strokePath()
      .beginPath().moveTo(cx + 11, cy).lineTo(cx + 18, cy).strokePath()
      .beginPath().moveTo(cx, cy - 18).lineTo(cx, cy - 11).strokePath()
      .beginPath().moveTo(cx, cy + 11).lineTo(cx, cy + 18).strokePath();
  }
}
