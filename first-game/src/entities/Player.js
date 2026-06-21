export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, maxHP) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.body.setSize(28, 28);

    this.maxHP = maxHP;
    this.hp = maxHP;
    this.armor = 0;
    this.speed = 160;
    this.weapon = null;
    this.attackCooldown = 0;
    this.invincible = 0;

    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  update(time, delta) {
    const { up, down, left, right } = this.keys;
    let vx = 0, vy = 0;
    if (left.isDown)  vx = -this.speed;
    if (right.isDown) vx =  this.speed;
    if (up.isDown)    vy = -this.speed;
    if (down.isDown)  vy =  this.speed;

    if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707; }
    this.setVelocity(vx, vy);

    if (this.attackCooldown > 0) this.attackCooldown -= delta;
    if (this.invincible > 0) {
      this.invincible -= delta;
      this.setAlpha(Math.sin(this.invincible / 60) > 0 ? 1 : 0.4);
    } else {
      this.setAlpha(1);
    }
  }

  takeDamage(amount) {
    if (this.invincible > 0) return;
    const actual = Math.max(1, amount - this.armor);
    this.hp = Math.max(0, this.hp - actual);
    this.invincible = 800;
    this.scene.cameras.main.shake(130, 0.01);
    this.scene.events.emit('playerDamaged', actual, this.x, this.y);
    return actual;
  }

  canAttack() { return this.attackCooldown <= 0; }

  triggerAttack() {
    if (!this.weapon) return 0;
    const rate = 1000 / this.weapon.attackSpeed;
    this.attackCooldown = rate;
    return this.weapon.damage;
  }

  isDead() { return this.hp <= 0; }
}
