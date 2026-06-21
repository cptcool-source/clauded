const GameState = {
  round: 1,
  resources: { wood: 0, stone: 0, metal: 0 },
  weapon: null,
  playerMaxHP: 100,
  playerArmor: 0,
  totalScore: 0,
  roundScores: [],

  reset() {
    this.round = 1;
    this.resources = { wood: 0, stone: 0, metal: 0 };
    this.weapon = null;
    this.playerMaxHP = 100;
    this.playerArmor = 0;
    this.totalScore = 0;
    this.roundScores = [];
  },

  addRoundScore(score) {
    this.roundScores.push({ round: this.round, score });
    this.totalScore += score;
  },
};

export default GameState;
