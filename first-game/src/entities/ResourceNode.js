export default class ResourceNode extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, kind, amount) {
    super(scene, x, y, kind);
    this.kind = kind;
    this.remaining = amount;
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // static body
    this.setScale(1.2);
  }

  harvest(amount = 1) {
    this.remaining = Math.max(0, this.remaining - amount);
    this.scene.tweens.add({
      targets: this, scaleX: 1.4, scaleY: 0.9, yoyo: true, duration: 80,
    });
    if (this.remaining <= 0) {
      this.setAlpha(0.3);
      this.body.enable = false;
    }
    return Math.min(amount, this.remaining + amount);
  }

  isDepleted() { return this.remaining <= 0; }
}
