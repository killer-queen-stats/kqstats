import {
  // Subtypes
  Position,
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
  'gold': Team.Gold,
  'blue': Team.Blue,
};

const maidens = {
  'maidenWings': Maiden.Warrior,
  'maidenSpeed': Maiden.Speed,
};

const maps = {
  'mapDay': GameMap.Day,
  'mapNight': GameMap.Night,
  'mapDusk': GameMap.Dusk,
};

const orientations = {
  'false': CabOrientation.BlueOnLeft,
  'true': CabOrientation.GoldOnLeft,
};

const victories = {
  'military': VictoryType.Military,
  'economic': VictoryType.Econimic,
  'snail': VictoryType.Snail,
};

const booleans = {
  'false': false,
  'true': true,
};

function position(x: string, y: string): Position {
  return {
    x: Number(x),
    y: Number(y)
  };
}

export function playernames(value: string[]): PlayerNames {
  // This is for when player cards get implemented.
  // Return an empty object for now.
  return {};
}

export function playerKill(value: string[]): PlayerKill {
  const [x, y, by, killed] = value;
  return {
    pos: position(x, y),
    killed: Number(killed),
    by: Number(by),
  };
}

export function blessMaiden(value: string[]): BlessMaiden {
  const [x, y, team] = value;
  return {
    pos: position(x, y),
    team: teams[team],
  };
}

export function reserveMaiden(value: string[]): ReserveMaiden {
  const [x, y, character] = value;
  return {
    pos: position(x, y),
    character: Number(character),
  };
}

export function unreserveMaiden(value: string[]): UnreserveMaiden {
  const [x, y, _, character] = value;
  return {
    pos: position(x, y),
    character: Number(character),
  };
}

export function useMaiden(value: string[]): UseMaiden {
  const [x, y, type, character] = value;
  return {
    pos: position(x, y),
    type: maidens[type],
    character: Number(character),
  };
}

export function glance(value: string[]): Glance {
  const [attacker, target] = value;
  return {
    attacker: Number(attacker),
    target: Number(target),
  };
}

export function carryFood(value: string[]): CarryFood {
  const [character] = value;
  return {
    character: Number(character),
  };
}

export function gameStart(value: string[]): GameStart {
  const [map, orientation] = value;
  return {
    map: maps[map],
    orientation: orientations[orientation],
  };
}

export function gameEnd(value: string[]): GameEnd {
  const [map, orientation, duration] = value;
  return {
    map: maps[map],
    orientation: orientations[orientation],
    duration: Number(duration),
  };
}

export function victory(value: string[]): Victory {
  const [team, type] = value;
  return {
    team: teams[team],
    type: victories[type],
  };
}

export function spawn(value: string[]): Spawn {
  const [character, isAI] = value;
  return {
    character: Number(character),
    isAI: booleans[isAI],
  };
}

export function getOnSnail(value: string[]): GetOnSnail {
  const [x, y, character] = value;
  return {
    pos: position(x, y),
    character: Number(character),
  };
}

export function getOffSnail(value: string[]): GetOffSnail {
  const [x, y, _, character] = value;
  return {
    pos: position(x, y),
    character: Number(character),
  };
}

export function snailEat(value: string[]): SnailEat {
  const [x, y, rider, eaten] = value;
  return {
    pos: position(x, y),
    rider: Number(rider),
    eaten: Number(eaten),
  };
}

export function snailEscape(value: string[]): SnailEscape {
  const [x, y, character] = value;
  return {
    pos: position(x, y),
    character: Number(character)
  };
}

export function berryDeposit(value: string[]): BerryDeposit {
  const [x, y, character] = value;
  return {
    pos: position(x, y),
    character: Number(character)
  };
}

export function berryKickIn(value: string[]): BerryKickIn {
  const [x, y, character] = value;
  return {
    pos: position(x, y),
    character: Number(character)
  };
}
