import GameState from '../GameState.js';
import Player from '../entities/Player.js';
import ResourceNode from '../entities/ResourceNode.js';
import { RESOURCE_QUOTA, BASE_SCORE, ROUND_TIME_BASE, TIME_MULTIPLIER } from '../config/rounds.js';

const MAP_W = 800, MAP_H = 600;
const NODE_COUNTS = { tree: 14, stone: 10, metal: 6 };

export default class ResourceScene extends Phaser.Scene {
  constructor() { super('Resource'); }

  create() {
    this.cameras.main.setBackgroundColor(0x2d5016);
    this.physics.world.setBounds(0, 0, MAP_W, MAP_H);

    this._spawnDecor();
    this._spawnNodes();

    this.player = new Player(this, 400, 300, GameState.playerMaxHP);
    this.physics.add.overlap(this.player, this.nodes, (p, node) => {
      if (!node.isDepleted()) {
        const harvested = node.harvest(1);
        GameState.resources[node.kind === 'tree' ? 'wood' : node.kind] += harvested;
        this._updateHUD();
      }
    });

    this._buildHUD();
    this.startTime = Date.now();

    // Click-to-move-to-node for accessibility
    this.input.on('pointerdown', ptr => {
      if (ptr.rightButtonDown()) return;
      // Attack handled in CombatScene; here just harvests via overlap
    });
  }

  _spawnDecor() {
    const g = this.add.graphics();
    // Scattered grass patches
    for (let i = 0; i < 40; i++) {
      g.fillStyle(0x3a6b1a, 0.5)
       .fillRect(
         Phaser.Math.Between(10, MAP_W - 10),
         Phaser.Math.Between(10, MAP_H - 10),
         Phaser.Math.Between(8, 22),
         Phaser.Math.Between(4, 10),
       );
    }
  }

  _spawnNodes() {
    this.nodes = this.physics.add.staticGroup();
    const place = (key, kind, count) => {
      for (let i = 0; i < count; i++) {
        const x = Phaser.Math.Between(60, MAP_W - 60);
        const y = Phaser.Math.Between(60, MAP_H - 60);
        const node = new ResourceNode(this, x, y, key, 3);
        node.kind = kind;
        this.nodes.add(node, true);
      }
    };
    place('tree',  'wood',  NODE_COUNTS.tree);
    place('stone', 'stone', NODE_COUNTS.stone);
    place('metal', 'metal', NODE_COUNTS.metal);
  }

  _buildHUD() {
    const FONT  = '"Press Start 2P", monospace';
    const base  = { fontFamily: FONT, fontSize: '8px', fill: '#00ff66', stroke: '#000', strokeThickness: 2 };
    const hg    = this.add.graphics().setScrollFactor(0).setDepth(18);
    hg.lineStyle(2, 0x00ff44, 0.7).strokeRect(6, 6, 210, 86);
    hg.fillStyle(0x000000, 0.75).fillRect(7, 7, 208, 84);
    this.hudRound = this.add.text(14, 14, 'RND 1: GATHER RESOURCES', { ...base, fill: '#ffdd00' }).setScrollFactor(0).setDepth(20);
    this.hudWood  = this.add.text(14, 36, '', base).setScrollFactor(0).setDepth(20);
    this.hudStone = this.add.text(14, 56, '', base).setScrollFactor(0).setDepth(20);
    this.hudMetal = this.add.text(14, 76, '', base).setScrollFactor(0).setDepth(20);
    this.hudTip   = this.add.text(400, MAP_H - 18, 'WALK INTO RESOURCES TO COLLECT', {
      fontFamily: FONT, fontSize: '7px', fill: '#336633',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(20);
    this._updateHUD();
  }

  _updateHUD() {
    const r = GameState.resources;
    const q = RESOURCE_QUOTA;
    const fmt = (v, need, label) => `${label}: ${v}/${need}${v >= need ? ' OK' : ''}`;
    this.hudWood.setText(fmt(r.wood,  q.wood,  'WOOD'));
    this.hudStone.setText(fmt(r.stone, q.stone, 'STONE'));
    this.hudMetal.setText(fmt(r.metal, q.metal, 'METAL'));

    if (r.wood >= q.wood && r.stone >= q.stone && r.metal >= q.metal) {
      this._completeRound();
    }
  }

  _completeRound() {
    if (this._done) return;
    this._done = true;

    const elapsed = Date.now() - this.startTime;
    const timeBonus = Math.max(0, ROUND_TIME_BASE - elapsed) * TIME_MULTIPLIER;
    const score = Math.floor(BASE_SCORE + timeBonus);
    GameState.addRoundScore(score);
    GameState.round = 2;

    this.add.text(400, 260, `ROUND CLEAR!\n+${score} PTS`, {
      fontFamily: '"Press Start 2P", monospace', fontSize: '22px', fill: '#ffdd00',
      stroke: '#000', strokeThickness: 5, align: 'center',
    }).setOrigin(0.5).setDepth(30);

    this.time.delayedCall(1800, () => this.scene.start('Weapon'));
  }

  update(time, delta) {
    if (!this._done) this.player.update(time, delta);
  }
}
