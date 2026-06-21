export default class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    const W = 400, H = 20, X = 200, Y = 280;
    const bg  = this.add.graphics().fillStyle(0x333355).fillRect(X, Y, W, H);
    const bar = this.add.graphics();
    this.add.text(400, 240, 'Loading...', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);

    this.load.on('progress', v => {
      bar.clear().fillStyle(0x66aaff).fillRect(X, Y, W * v, H);
    });

    // Generate placeholder textures programmatically so the game works
    // before real sprite assets are added.
    this.load.on('complete', () => this.generateTextures());
  }

  generateTextures() {
    const g = this.make.graphics({ add: false });
    const gen = (key, w, h, fn) => { g.clear(); fn(g); g.generateTexture(key, w, h); };

    // PLAYER (32x32) — top-down warrior
    gen('player', 32, 32, g => {
      g.fillStyle(0x000000, 0.2).fillEllipse(16, 28, 20, 8);
      g.fillStyle(0x1a3a7a).fillEllipse(16, 20, 26, 22);
      g.fillStyle(0x2255cc).fillEllipse(16, 18, 20, 16);
      g.fillStyle(0x3366ff, 0.5).fillEllipse(14, 14, 10, 8);
      g.fillStyle(0xffcc88).fillCircle(16, 9, 7);
      g.fillStyle(0x1a3a7a).fillEllipse(16, 6, 16, 10);
      g.fillStyle(0x3366ff).fillRect(13, 3, 6, 3);
      g.fillStyle(0x000000).fillCircle(13, 10, 1.5).fillCircle(19, 10, 1.5);
      g.fillStyle(0xffffff, 0.9).fillTriangle(14, 14, 18, 14, 16, 11);
    });

    // TREE (40x40)
    gen('tree', 40, 40, g => {
      g.fillStyle(0x6b3d2e).fillRect(17, 28, 7, 12);
      g.fillStyle(0x145214).fillCircle(20, 18, 16);
      g.fillStyle(0x228b22).fillCircle(20, 17, 14);
      g.fillStyle(0x228b22).fillCircle(11, 21, 10);
      g.fillStyle(0x228b22).fillCircle(29, 21, 10);
      g.fillStyle(0x33aa33).fillCircle(17, 13, 9);
      g.fillStyle(0x55cc44).fillCircle(15, 11, 5);
      g.fillStyle(0x77ee66, 0.5).fillCircle(14, 10, 3);
    });

    // STONE (32x30)
    gen('stone', 32, 30, g => {
      g.fillStyle(0x000000, 0.2).fillEllipse(17, 28, 24, 6);
      g.fillStyle(0x667788).fillEllipse(15, 15, 28, 22);
      g.fillStyle(0x556677).fillEllipse(18, 17, 18, 15);
      g.fillStyle(0x8899aa).fillEllipse(10, 10, 14, 9);
      g.fillStyle(0xbbccdd, 0.7).fillEllipse(8, 8, 7, 4);
      g.lineStyle(1.5, 0x445566, 0.8).beginPath()
       .moveTo(14, 7).lineTo(16, 16).lineTo(14, 22).strokePath();
    });

    // METAL ORE (30x28)
    gen('metal', 30, 28, g => {
      g.fillStyle(0x000000, 0.2).fillEllipse(16, 26, 22, 6);
      g.fillStyle(0x334455).fillEllipse(15, 15, 26, 22);
      g.fillStyle(0x223344).fillEllipse(15, 15, 18, 16);
      g.fillStyle(0x2266bb).fillTriangle(9, 16, 7, 6, 12, 14);
      g.fillStyle(0x3377cc).fillTriangle(15, 14, 13, 4, 18, 12);
      g.fillStyle(0x2266bb).fillTriangle(21, 15, 19, 7, 24, 14);
      g.fillStyle(0x66aaff, 0.8).fillTriangle(10, 14, 8, 8, 12, 13);
      g.fillStyle(0x88ccff, 0.6).fillTriangle(15, 12, 14, 6, 17, 11);
      g.fillStyle(0xffffff, 0.9).fillCircle(16, 6, 2).fillCircle(22, 10, 1.5).fillCircle(10, 9, 1);
    });

    // RABBIT (24x24)
    gen('rabbit', 24, 24, g => {
      g.fillStyle(0x000000, 0.15).fillEllipse(13, 23, 14, 4);
      g.fillStyle(0xddccaa).fillEllipse(13, 16, 16, 13);
      g.fillStyle(0xeeddbb).fillCircle(12, 9, 7);
      g.fillStyle(0xeeddbb).fillEllipse(8, 3, 5, 11);
      g.fillStyle(0xeeddbb).fillEllipse(16, 3, 5, 11);
      g.fillStyle(0xffaaaa).fillEllipse(8, 3, 2.5, 7);
      g.fillStyle(0xffaaaa).fillEllipse(16, 3, 2.5, 7);
      g.fillStyle(0x000000).fillCircle(9, 9, 1.5).fillCircle(15, 9, 1.5);
      g.fillStyle(0xffffff).fillCircle(8.5, 8.5, 0.6).fillCircle(14.5, 8.5, 0.6);
      g.fillStyle(0xffaaaa).fillCircle(12, 11, 1.2);
    });

    // WOLF (34x28)
    gen('wolf', 34, 28, g => {
      g.fillStyle(0x000000, 0.2).fillEllipse(18, 26, 28, 6);
      g.fillStyle(0x888899).fillEllipse(19, 17, 28, 20);
      g.fillStyle(0x666677).fillEllipse(24, 14, 16, 12);
      g.fillStyle(0xaaaaaa).fillEllipse(8, 16, 14, 12);
      g.fillStyle(0x999999).fillEllipse(4, 18, 8, 7);
      g.fillStyle(0x555566).fillTriangle(5, 7, 3, 1, 9, 6);
      g.fillStyle(0x555566).fillTriangle(13, 6, 11, 0, 17, 5);
      g.fillStyle(0xccccbb).fillEllipse(19, 19, 10, 8);
      g.fillStyle(0xffcc00).fillCircle(6, 14, 2.5);
      g.fillStyle(0x000000).fillCircle(6, 14, 1.2);
      g.fillStyle(0xffffff).fillCircle(5.5, 13.5, 0.6);
      g.fillStyle(0x111111).fillEllipse(3, 19, 4, 3);
    });

    // BEAR (44x40)
    gen('bear', 44, 40, g => {
      g.fillStyle(0x000000, 0.25).fillEllipse(23, 38, 36, 8);
      g.fillStyle(0x6b3d1e).fillEllipse(23, 24, 38, 32);
      g.fillStyle(0x7a4a2a).fillCircle(22, 12, 13);
      g.fillStyle(0x995533).fillEllipse(22, 16, 14, 10);
      g.fillStyle(0x6b3d1e).fillCircle(12, 4, 6);
      g.fillStyle(0x6b3d1e).fillCircle(32, 4, 6);
      g.fillStyle(0x995533).fillCircle(12, 4, 3);
      g.fillStyle(0x995533).fillCircle(32, 4, 3);
      g.fillStyle(0xaa8855).fillEllipse(23, 27, 22, 18);
      g.fillStyle(0x000000).fillCircle(16, 10, 3).fillCircle(28, 10, 3);
      g.fillStyle(0xffffff).fillCircle(15, 9, 1.2).fillCircle(27, 9, 1.2);
      g.fillStyle(0x111111).fillEllipse(22, 17, 9, 6);
    });

    // BOAR (38x30)
    gen('boar', 38, 30, g => {
      g.fillStyle(0x000000, 0.2).fillEllipse(20, 28, 30, 7);
      g.fillStyle(0x5c3d26).fillEllipse(21, 18, 34, 24);
      g.fillStyle(0x3d2417).fillEllipse(26, 13, 16, 10);
      g.fillStyle(0x6b4a33).fillEllipse(8, 15, 16, 14);
      g.fillStyle(0x8b6a4a).fillEllipse(4, 16, 8, 7);
      g.fillStyle(0xeeddaa).fillEllipse(2, 20, 4, 7);
      g.fillStyle(0xeeddaa).fillEllipse(6, 21, 4, 7);
      g.fillStyle(0x6b4a33).fillEllipse(10, 8, 7, 5);
      g.fillStyle(0xff3300).fillCircle(8, 11, 2.5);
      g.fillStyle(0x000000).fillCircle(8, 11, 1.2);
      g.fillStyle(0xaa7755).fillEllipse(22, 22, 16, 10);
    });

    // RAPTOR (40x34)
    gen('raptor', 40, 34, g => {
      g.fillStyle(0x000000, 0.2).fillEllipse(21, 32, 32, 7);
      g.fillStyle(0x1a5028).fillEllipse(28, 20, 16, 9);
      g.fillStyle(0x3a7d44).fillEllipse(19, 19, 30, 24);
      g.fillStyle(0x8db87a).fillEllipse(19, 22, 18, 14);
      g.fillStyle(0x1a5028).fillRect(14, 12, 3, 15);
      g.fillStyle(0x1a5028).fillRect(20, 11, 3, 16);
      g.fillStyle(0x2d6e35).fillEllipse(7, 12, 16, 12);
      g.fillStyle(0x3a7d44).fillEllipse(5, 15, 10, 7);
      g.fillStyle(0xffffff).fillRect(2, 13, 2, 3).fillRect(5, 12, 2, 4).fillRect(8, 13, 2, 3);
      g.fillStyle(0xffdd00).fillCircle(6, 9, 3.5);
      g.fillStyle(0x000000).fillEllipse(6, 9, 2.5, 3.5);
      g.fillStyle(0xffffff).fillCircle(5, 8, 1);
      g.fillStyle(0xccbb88).fillTriangle(4, 26, 1, 32, 8, 30);
    });

    // TRICERATOPS (60x50)
    gen('triceratops', 60, 50, g => {
      g.fillStyle(0x000000, 0.3).fillEllipse(31, 48, 50, 10);
      g.fillStyle(0x4a6741).fillEllipse(33, 30, 48, 38);
      g.fillStyle(0x7a9a70).fillEllipse(33, 33, 30, 24);
      g.fillStyle(0x3a5530).fillEllipse(33, 20, 34, 18);
      g.fillStyle(0x6b4a3e).fillEllipse(9, 20, 18, 32);
      g.fillStyle(0xaa6655).fillEllipse(9, 20, 12, 24);
      g.fillStyle(0xff8866, 0.5).fillEllipse(9, 20, 6, 16);
      g.fillStyle(0x4a6741).fillEllipse(14, 28, 24, 20);
      g.fillStyle(0xddcc88).fillTriangle(5, 22, 2, 10, 9, 22);
      g.fillStyle(0xddcc88).fillTriangle(16, 20, 13, 8, 20, 20);
      g.fillStyle(0xddcc88).fillTriangle(5, 33, 1, 38, 8, 32);
      g.fillStyle(0x000000).fillCircle(15, 26, 3.5);
      g.fillStyle(0xffffff).fillCircle(14, 25, 1.3);
      g.fillStyle(0x3a5530).fillRect(20, 42, 8, 8).fillRect(38, 42, 8, 8);
    });

    // T-REX (70x58)
    gen('trex', 70, 58, g => {
      g.fillStyle(0x000000, 0.35).fillEllipse(36, 55, 58, 10);
      g.fillStyle(0x3a2818).fillEllipse(50, 30, 24, 16);
      g.fillStyle(0x5a3e2b).fillEllipse(33, 30, 50, 44);
      g.fillStyle(0x9a7a5a).fillEllipse(31, 36, 28, 26);
      g.fillStyle(0x3a2818).fillEllipse(33, 18, 38, 22);
      g.fillStyle(0x5a3e2b).fillEllipse(11, 24, 28, 20);
      g.fillStyle(0x3a2818).fillEllipse(9, 18, 22, 12);
      g.fillStyle(0x6a4e3b).fillEllipse(9, 27, 20, 10);
      g.fillStyle(0xffffff)
       .fillRect(2, 21, 2.5, 5).fillRect(6, 20, 2.5, 6)
       .fillRect(10, 20, 2.5, 6).fillRect(14, 21, 2.5, 5);
      g.fillStyle(0x4a3020).fillEllipse(21, 34, 7, 12);
      g.fillStyle(0x3a2010).fillEllipse(20, 41, 5, 7);
      g.fillStyle(0xccbb88).fillTriangle(17, 44, 15, 50, 21, 47);
      g.fillStyle(0xff6600).fillCircle(10, 18, 5);
      g.fillStyle(0x000000).fillEllipse(10, 18, 3.5, 5);
      g.fillStyle(0xffffff).fillCircle(9, 16, 1.5);
      g.lineStyle(1, 0x3a2818, 0.5);
      for (let i = 0; i < 5; i++) {
        g.beginPath().moveTo(27 + i * 5, 14).lineTo(24 + i * 5, 32).strokePath();
      }
    });

    // ARROW (16x6) — crude bow
    gen('arrow', 16, 6, g => {
      g.fillStyle(0x8b6914).fillRect(0, 2, 11, 2);
      g.fillStyle(0xccaa44).fillTriangle(11, 0, 16, 3, 11, 6);
      g.fillStyle(0xffffff, 0.5).fillRect(0, 2, 4, 1);
      g.fillStyle(0xdd4444, 0.7).fillRect(0, 2, 2, 2);
    });

    // SLING SHOT (10x10) — small stone
    gen('sling_shot', 10, 10, g => {
      g.fillStyle(0x888899).fillCircle(5, 5, 4);
      g.fillStyle(0xaaaacc).fillCircle(4, 4, 2);
      g.fillStyle(0xffffff, 0.4).fillCircle(3, 3, 1);
    });

    // SPEAR PROJ (22x6) — long piercing bolt, pointed both ends
    gen('spear_proj', 22, 6, g => {
      g.fillStyle(0x8899ee).fillRect(4, 2, 14, 2);
      g.fillStyle(0xaabbff).fillTriangle(18, 0, 22, 3, 18, 6);
      g.fillStyle(0x6677bb).fillTriangle(4, 0, 0, 3, 4, 6);
      g.fillStyle(0xddeeff, 0.5).fillRect(5, 2, 6, 1);
    });

    // BOLT (16x8) — thick crossbow bolt
    gen('bolt', 16, 8, g => {
      g.fillStyle(0x7a4a1e).fillRect(0, 3, 11, 3);
      g.fillStyle(0xdd8844).fillTriangle(11, 0, 16, 4, 11, 8);
      g.fillStyle(0xeecc88).fillRect(0, 3, 3, 1);
      g.fillStyle(0x553311).fillRect(0, 5, 4, 2);
    });

    // FIRE ARROW (18x8) — arrow with flaming tip
    gen('fire_arrow', 18, 8, g => {
      g.fillStyle(0x8b6914).fillRect(0, 3, 10, 2);
      g.fillStyle(0xff4400).fillTriangle(10, 1, 15, 4, 10, 7);
      g.fillStyle(0xff8800).fillTriangle(11, 2, 15, 4, 11, 6);
      g.fillStyle(0xffdd00).fillCircle(14, 4, 2);
      g.fillStyle(0xffffff, 0.6).fillCircle(13, 3, 1);
      g.fillStyle(0xdd4444, 0.7).fillRect(0, 3, 2, 2);
    });

    // ORB (32x32) — layered glow, tintable; used for all projectiles
    gen('orb', 32, 32, g => {
      g.fillStyle(0xffffff, 0.06).fillCircle(16, 16, 15);
      g.fillStyle(0xffffff, 0.13).fillCircle(16, 16, 12);
      g.fillStyle(0xffffff, 0.25).fillCircle(16, 16, 9);
      g.fillStyle(0xffffff, 0.50).fillCircle(16, 16, 6);
      g.fillStyle(0xffffff, 0.82).fillCircle(16, 16, 4);
      g.fillStyle(0xffffff, 1.00).fillCircle(16, 16, 2);
    });

    // PIXEL_SQ (8x8) — white square, tintable; used for trails
    gen('pixel_sq', 8, 8, g => {
      g.fillStyle(0xffffff, 1.0).fillRect(0, 0, 8, 8);
    });

    g.destroy();
    this.scene.start('Menu');
  }

  create() {}
}
