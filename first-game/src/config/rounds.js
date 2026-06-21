export const RESOURCE_QUOTA = { wood: 10, stone: 8, metal: 5 };
export const ROUND_TIME_BASE = 90000; // ms for scoring
export const TIME_MULTIPLIER = 0.05;
export const BASE_SCORE = 1000;

export const COMBAT_ROUNDS = {
  4:  { waves: [{ type: 'rabbit',      count: 6  }] },
  5:  { waves: [{ type: 'wolf',        count: 8  }] },
  6:  { waves: [{ type: 'bear',        count: 4  }] },
  7:  { waves: [{ type: 'boar',        count: 6  }, { type: 'wolf', count: 4 }] },
  8:  { waves: [{ type: 'bear',        count: 4  }, { type: 'wolf', count: 8 }] },
  9:  { waves: [{ type: 'raptor',      count: 6  }] },
  10: { waves: [{ type: 'triceratops', count: 3  }] },
  11: { waves: [{ type: 'trex',        count: 1  }, { type: 'raptor', count: 4 }] },
};

export const ENEMY_STATS = {
  rabbit:      { hp: 20,  speed: 78,  damage: 5,  aggroRadius: 800, attackRange: 30,  attackRate: 1500, xp: 10,  tint: 0xd4a96a },
  wolf:        { hp: 50,  speed: 130, damage: 15, aggroRadius: 800, attackRange: 40,  attackRate: 1200, xp: 25,  tint: 0x7a7a8a },
  bear:        { hp: 150, speed: 91,  damage: 30, aggroRadius: 800, attackRange: 50,  attackRate: 2000, xp: 60,  tint: 0x8b5e3c },
  boar:        { hp: 80,  speed: 143, damage: 20, aggroRadius: 800, attackRange: 45,  attackRate: 1400, xp: 35,  tint: 0x6b4c3b },
  raptor:      { hp: 90,  speed: 208, damage: 25, aggroRadius: 800, attackRange: 45,  attackRate: 800,  xp: 50,  tint: 0x3a7d44 },
  triceratops: { hp: 400, speed: 104, damage: 50, aggroRadius: 800, attackRange: 70,  attackRate: 2500, xp: 150, tint: 0x4a6741 },
  trex:        { hp: 800, speed: 156, damage: 80, aggroRadius: 800, attackRange: 80,  attackRate: 1800, xp: 400, tint: 0x5a3e2b },
};
