const r = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const WEAPON_TYPES = [
  {
    type: 'Sling', proj: 'orb', projScale: 0.40, rangePx: 220,
    baseDmg: [8, 14], baseSpd: [2.2, 3.4], pSpeed: 380,
    pierce: false, icon: '🪨', color: 0xbbbbbb,
    desc: 'FAST. LOW DMG.',
  },
  {
    type: 'Crude Bow', proj: 'orb', projScale: 0.60, rangePx: 320,
    baseDmg: [14, 24], baseSpd: [1.0, 1.6], pSpeed: 460,
    pierce: false, icon: '🏹', color: 0xccaa44,
    desc: 'BALANCED.',
  },
  {
    type: 'Spear', proj: 'orb', projScale: 0.55, rangePx: 400,
    baseDmg: [28, 44], baseSpd: [0.5, 0.9], pSpeed: 420,
    pierce: true, icon: '🗡️', color: 0x8899ee,
    desc: 'PIERCES ENEMIES.',
  },
  {
    type: 'Crossbow', proj: 'orb', projScale: 0.85, rangePx: 480,
    baseDmg: [40, 60], baseSpd: [0.4, 0.7], pSpeed: 540,
    pierce: false, icon: '⚡', color: 0xdd8844,
    desc: 'SLOW. HEAVY DMG.',
  },
  {
    type: 'Fire Bow', proj: 'orb', projScale: 0.80, rangePx: 340,
    baseDmg: [18, 30], baseSpd: [0.9, 1.4], pSpeed: 440,
    pierce: false, icon: '🔥', color: 0xff6600,
    desc: 'FIRE DAMAGE.',
  },
];

const MODIFIERS = [
  'Sharp', 'Heavy', 'Swift', 'Ancient', 'Crude', 'Balanced', 'Reinforced', 'Makeshift',
];

function _makeWeapon(base) {
  const mod = MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)];
  return {
    name:        `${mod} ${base.type}`,
    type:        base.type,
    icon:        base.icon,
    proj:        base.proj,
    projScale:   base.projScale || 0.65,
    color:       base.color,
    rangePx:     base.rangePx,
    pSpeed:      base.pSpeed,
    pierce:      base.pierce,
    desc:        base.desc,
    damage:      r(...base.baseDmg),
    attackSpeed: parseFloat((Math.random() * (base.baseSpd[1] - base.baseSpd[0]) + base.baseSpd[0]).toFixed(2)),
  };
}

export function generateWeapon() {
  return _makeWeapon(WEAPON_TYPES[Math.floor(Math.random() * WEAPON_TYPES.length)]);
}

// Returns one of each weapon type (shuffled) so player always sees all options
export function generateWeaponChoices(count = 5) {
  return [...WEAPON_TYPES]
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map(_makeWeapon);
}
