import { Character } from '../../../lib/KQStream';

const gold = {
  queen: require('./gold_queen.png'),
  stripes: require('./gold_stripes.png'),
  abs: require('./gold_abs.png'),
  skulls: require('./gold_skulls.png'),
  checks: require('./gold_checks.png')
};
const blue = {
  queen: require('./blue_queen.png'),
  stripes: require('./blue_stripes.png'),
  abs: require('./blue_abs.png'),
  skulls: require('./blue_skulls.png'),
  checks: require('./blue_checks.png')
};
const character = {
  [Character.GoldQueen]: gold.queen,
  [Character.GoldStripes]: gold.stripes,
  [Character.GoldAbs]: gold.abs,
  [Character.GoldSkulls]: gold.skulls,
  [Character.GoldChecks]: gold.checks,
  [Character.BlueQueen]: blue.queen,
  [Character.BlueStripes]: blue.stripes,
  [Character.BlueAbs]: blue.abs,
  [Character.BlueSkulls]: blue.skulls,
  [Character.BlueChecks]: blue.checks
};

const sprites = {
  gold: gold,
  blue: blue,
  character: character,
  snail: require('./snail.png'),
  crown: require('./crown.png')
};

export default sprites;