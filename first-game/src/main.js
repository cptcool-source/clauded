import BootScene     from './scenes/BootScene.js';
import MenuScene     from './scenes/MenuScene.js';
import ResourceScene from './scenes/ResourceScene.js';
import WeaponScene   from './scenes/WeaponScene.js';
import PrepScene     from './scenes/PrepScene.js';
import CombatScene   from './scenes/CombatScene.js';
import ScoreScene    from './scenes/ScoreScene.js';

new Phaser.Game({
  type: Phaser.CANVAS,
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scene: [BootScene, MenuScene, ResourceScene, WeaponScene, PrepScene, CombatScene, ScoreScene],
});
