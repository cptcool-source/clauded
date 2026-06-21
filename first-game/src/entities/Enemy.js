const STATE = { PATROL: 0, CHASE: 1, ATTACK: 2 };

const DEATH_COLORS = {
  rabbit: 0xd4a96a, wolf: 0x9999bb, bear: 0x8b5e3c,
  boar: 0x7a5533, raptor: 0x44aa55, triceratops: 0x5a8050, trex: 0x7a4e2b,
};

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type, stats) {
    super(scene, x, y, type);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    this.type       = type;
    this.maxHP      = stats.hp;
    this.hp         = stats.hp;
    this.speed      = stats.speed;
    this.damage     = stats.damage;
    this.aggroRadius  = stats.aggroRadius;
    this.attackRange  = stats.attackRange;
    this.attackRate   = stats.attackRate;
    this.xpValue    = stats.xp;

    this.state        = STATE.PATROL;
    this.attackCooldown = 0;
    this.patrolTimer  = 0;
    this.patrolVx     = 0;
    this.patrolVy     = 0;

    // Low-HP flash state
    this._lowHpFlashing = false;
    this._lowHpTween    = null;

    // Floating HP bar
    this.hpBarBg = scene.add.rectangle(x, y - 24, 40, 5, 0x440000);
    this.hpBarFg = scene.add.rectangle(x, y - 24, 40, 5, 0x00cc44);
    this.hpBarBg.setDepth(10);
    this.hpBarFg.setDepth(11);
  }

  update(time, delta, player) {
    if (!this.active) return;

    const dx   = player.x - this.x;
    const dy   = player.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (this.attackCooldown > 0) this.attackCooldown -= delta;

    if (dist < this.aggroRadius) {
      this.state = dist < this.attackRange ? STATE.ATTACK : STATE.CHASE;
    } else {
      this.state = STATE.PATROL;
    }

    if (this.state === STATE.CHASE) {
      const nx = dx / dist, ny = dy / dist;
      this.setVelocity(nx * this.speed, ny * this.speed);
    } else if (this.state === STATE.ATTACK) {
      this.setVelocity(0, 0);
      if (this.attackCooldown <= 0) {
        this.attackCooldown = this.attackRate;
        player.takeDamage(this.damage);
        this._playAttackAnim(player.x, player.y);
      }
    } else {
      this.patrolTimer -= delta;
      if (this.patrolTimer <= 0) {
        this.patrolTimer = Phaser.Math.Between(1500, 3500);
        const angle = Math.random() * Math.PI * 2;
        this.patrolVx = Math.cos(angle) * this.speed * 0.4;
        this.patrolVy = Math.sin(angle) * this.speed * 0.4;
      }
      this.setVelocity(this.patrolVx, this.patrolVy);
    }

    // HP bar — color shifts green → yellow → red
    const ratio   = this.hp / this.maxHP;
    const hpColor = ratio > 0.6 ? 0x00cc44 : ratio > 0.3 ? 0xddcc00 : 0xff2222;
    const barW    = 40 * ratio;
    this.hpBarBg.setPosition(this.x, this.y - 24);
    this.hpBarFg.setPosition(this.x - (40 - barW) / 2, this.y - 24);
    this.hpBarFg.setSize(Math.max(0, barW), 5);
    this.hpBarFg.setFillStyle(hpColor);
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);

    // Hit flash via tint (independent of alpha so low-HP pulse still works)
    this.setTint(0xff6666);
    this.scene.time.delayedCall(100, () => { if (this.active) this.clearTint(); });

    // Begin low-HP alpha pulse below 25%
    if (!this._lowHpFlashing && this.hp > 0 && this.hp / this.maxHP < 0.25) {
      this._lowHpFlashing = true;
      this._startLowHpFlash();
    }

    if (this.hp <= 0) this.die();
  }

  knockback(fromX, fromY, force) {
    if (!this.body || !this.body.enable) return;
    const dx  = this.x - fromX;
    const dy  = this.y - fromY;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    this.body.velocity.x += (dx / len) * force;
    this.body.velocity.y += (dy / len) * force;
  }

  _startLowHpFlash() {
    this._lowHpTween = this.scene.tweens.add({
      targets: this, alpha: 0.3,
      yoyo: true, repeat: -1, duration: 110, ease: 'Linear',
    });
  }

  _playAttackAnim(targetX, targetY) {
    const line = this.scene.add.graphics().setDepth(19);
    line.lineStyle(2, 0xff3300, 0.8)
      .beginPath().moveTo(this.x, this.y).lineTo(targetX, targetY).strokePath();
    this.scene.tweens.add({ targets: line, alpha: 0, duration: 160, onComplete: () => line.destroy() });

    const ring = this.scene.add.graphics().setDepth(22);
    ring.lineStyle(3, 0xff0000, 1).strokeCircle(targetX, targetY, 18);
    this.scene.tweens.add({ targets: ring, scaleX: 2.8, scaleY: 2.8, alpha: 0, duration: 320, onComplete: () => ring.destroy() });

    const flash = this.scene.add.rectangle(400, 300, 800, 600, 0xff0000, 0.22).setDepth(21);
    this.scene.tweens.add({ targets: flash, alpha: 0, duration: 180, onComplete: () => flash.destroy() });
  }

  _pixelExplosion() {
    const color     = DEATH_COLORS[this.type] || 0xff4444;
    const numChunks = this.maxHP > 200 ? 16 : this.maxHP > 50 ? 12 : 8;
    const baseSize  = this.maxHP > 300 ? 9  : this.maxHP > 100 ? 6  : 4;

    for (let i = 0; i < numChunks; i++) {
      const chunk = this.scene.add.graphics().setDepth(15);
      const sz    = Phaser.Math.Between(Math.max(2, baseSize - 2), baseSize + 4);
      chunk.fillStyle(color, 1.0).fillRect(-sz / 2, -sz / 2, sz, sz);
      if (Math.random() < 0.4) {
        chunk.fillStyle(0xffffff, 0.7).fillRect(-sz / 4, -sz / 4, sz / 2, sz / 2);
      }
      chunk.setPosition(
        this.x + Phaser.Math.Between(-this.displayWidth  * 0.3, this.displayWidth  * 0.3),
        this.y + Phaser.Math.Between(-this.displayHeight * 0.3, this.displayHeight * 0.3)
      );
      const angle = (i / numChunks) * Math.PI * 2 + (Math.random() - 0.5) * 0.7;
      const speed = Phaser.Math.Between(55, 170);
      const grav  = Phaser.Math.Between(25, 70);
      this.scene.tweens.add({
        targets: chunk,
        x: chunk.x + Math.cos(angle) * speed,
        y: chunk.y + Math.sin(angle) * speed + grav,
        alpha: 0,
        angle: Phaser.Math.Between(-180, 180),
        duration: Phaser.Math.Between(350, 650),
        ease: 'Power1',
        onComplete: () => chunk.destroy(),
      });
    }

    // White burst at death point
    const burst = this.scene.add.graphics().setDepth(16);
    burst.fillStyle(0xffffff, 0.85).fillCircle(this.x, this.y, this.displayWidth * 0.65);
    this.scene.tweens.add({ targets: burst, alpha: 0, scaleX: 2.0, scaleY: 2.0, duration: 180, onComplete: () => burst.destroy() });
  }

  die() {
    if (this._lowHpTween) {
      this._lowHpTween.stop();
      this._lowHpTween = null;
    }

    this._pixelExplosion();

    this.hpBarBg.destroy();
    this.hpBarFg.destroy();
    this.setActive(false);
    this.body.enable = false;
    this.setVisible(false);

    this.scene.events.emit('enemyDied', this);

    // Defer destroy so tween callbacks above can finish safely
    this.scene.time.delayedCall(700, () => {
      if (this.scene) this.destroy();
    });
  }

  isDead() { return this.hp <= 0; }
}
