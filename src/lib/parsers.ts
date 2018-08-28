import {
  // Subtypes
  Team,
  Maiden,
  GameMap,
  CabOrientation,
  VictoryType,
  // Event types
  PlayerNames,
  PlayerKill,
  BlessMaiden,
  ReserveMaiden,
  UnreserveMaiden,
  UseMaiden,
  Glance,
  CarryFood,
  GameStart,
  GameEnd,
  Victory,
  Spawn,
  GetOnSnail,
  GetOffSnail,
  SnailEat,
  SnailEscape,
  BerryDeposit,
  BerryKickIn,
} from './models/KQStream';

const teams = {
  'Red': Team.Gold,
  'Gold': Team.Gold,
  'Blue': Team.Blue,
};

const maidens = {
  'maiden_wings': Maiden.Warrior,
  'maiden_speed': Maiden.Speed,
};

const maps = {
  'map_day': GameMap.Day,
  'map_night': GameMap.Night,
  'map_dusk': GameMap.Dusk,
};

const orientations = {
  'False': CabOrientation.BlueGold,
  'True': CabOrientation.GoldBlue,
};

const victories = {
  'military': VictoryType.Military,
  'economic': VictoryType.Econimic,
  'snail': VictoryType.Snail,
};

const booleans = {
  'False': false,
  'True': true,
};

export function playernames(value: string): PlayerNames {
  // Not sure what the values of the message mean,
  // so just return an empty object for now.
  return {};
}

export function playerKill(value: string): PlayerKill {
  const [x, y, by, killed] = value.split(',');
  return {
    pos: {
      x: Number(x),
      y: Number(y),
    },
    killed: Number(killed),
    by: Number(by),
  };
}

export function blessMaiden(value: string): BlessMaiden {
  const [x, y, team] = value.split(',');
  return {
    pos: {
      x: Number(x),
      y: Number(y),
    },
    team: teams[team],
  };
}

export function reserveMaiden(value: string): ReserveMaiden {
  const [x, y, character] = value.split(',');
  return {
    pos: {
      x: Number(x),
      y: Number(y),
    },
    character: Number(character),
  };
}

export function unreserveMaiden(value: string): UnreserveMaiden {
  const [x, y, _, character] = value.split(',');
  return {
    pos: {
      x: Number(x),
      y: Number(y),
    },
    character: Number(character),
  };
}

export function useMaiden(value: string): UseMaiden {
  const [x, y, type, character] = value.split(',');
  return {
    pos: {
      x: Number(x),
      y: Number(y),
    },
    type: maidens[type],
    character: Number(character),
  };
}

export function glance(value: string): Glance {
  const [attacker, target] = value.split(',');
  return {
    attacker: Number(attacker),
    target: Number(target),
  };
}

export function carryFood(value: string): CarryFood {
  const [character] = value.split(',');
  return {
    character: Number(character),
  };
}

export function gameStart(value: string): GameStart {
  const [map, orientation] = value.split(',');
  return {
    map: maps[map],
    orientation: orientations[orientation],
  };
}

export function gameEnd(value: string): GameEnd {
  const [map, orientation, duration] = value.split(',');
  return {
    map: maps[map],
    orientation: orientations[orientation],
    duration: Number(duration),
  };
}

export function victory(value: string): Victory {
  const [team, type] = value.split(',');
  return {
    team: teams[team],
    type: victories[type],
  };
}

export function spawn(value: string): Spawn {
  const [character, isAI] = value.split(',');
  return {
    character: Number(character),
    isAI: booleans[isAI],
  };
}

export function getOnSnail(value: string): GetOnSnail {
  const [x, y, character] = value.split(',');
  return {
    pos: {
      x: Number(x),
      y: Number(y),
    },
    character: Number(character),
  };
}

export function getOffSnail(value: string): GetOffSnail {
  const [x, y, _, character] = value.split(',');
  return {
    pos: {
      x: Number(x),
      y: Number(y),
    },
    character: Number(character),
  };
}

export function snailEat(value: string): SnailEat {
  const [x, y, rider, eaten] = value.split(',');
  return {
    pos: {
      x: Number(x),
      y: Number(y),
    },
    rider: Number(rider),
    eaten: Number(eaten),
  };
}

export function snailEscape(value: string): SnailEscape {
  const [x, y, character] = value.split(',');
  return {
    pos: {
      x: Number(x),
      y: Number(y)
    },
    character: Number(character)
  };
}

export function berryDeposit(value: string): BerryDeposit {
  const [x, y, character] = value.split(',');
  return {
    pos: {
      x: Number(x),
      y: Number(y)
    },
    character: Number(character)
  };
}

export function berryKickIn(value: string): BerryKickIn {
  const [x, y, character] = value.split(',');
  return {
    pos: {
      x: Number(x),
      y: Number(y)
    },
    character: Number(character)
  };
}
