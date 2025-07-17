import bgm1 from "../../assets/sounds/bgm/mindsmith-bgm.mp3";
// import bgm2 from "../../assets/sounds/bgm/pixel-dreams-259187.mp3";
// import bgm3 from "../../assets/sounds/bgm/puzzle-game-bright-casual-video-game-music-249202.mp3";
import transition1 from "../../assets/sounds/sfx/transition-coat-121423.mp3";

import sfx1 from "../../assets/sounds/sfx/interface-124464.mp3";
import sfx2 from "../../assets/sounds/sfx/level-up-191997.mp3";

const soundsMapper = {
  BGM_1: bgm1,
//   BGM_2: bgm2,
//   BGM_3: bgm3,

  TRANSITION_1: transition1,
  MESSAGE_SEND: sfx1,
  MESSAGE_RECIEVE: sfx2,
};

export type SoundKey = keyof typeof soundsMapper;

export const getSound = (key: SoundKey): string => {
  return soundsMapper[key];
};
