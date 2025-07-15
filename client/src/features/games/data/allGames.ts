import whatLifeBeenLikeIcon from "../../../assets/images/gameIcons/what-life-been-like.webp";
import feelYourFeelingsIcon from "../../../assets/images/gameIcons/feel-your-feeling.webp";
import yourBounceBackStyleIcon from "../../../assets/images/gameIcons/your-bounce-back-style.webp";
import brainyBitsIcon from "../../../assets/images/gameIcons/brainy-bits.webp";
import whatLifeBeenLikeCardGraphic from "../../../assets/images/gameCardGraphics/what-life-been-like.webp";
import feelYourFeelingsCardGraphic from "../../../assets/images/gameCardGraphics/feel-your-feeling.webp";
import yourBounceBackStyleCardGraphic from "../../../assets/images/gameCardGraphics/your-bounce-back-style.webp";
import brainyBitsCardGraphic from "../../../assets/images/gameCardGraphics/brainy-bits.webp";

export interface Game {
  id: string;
  name: string;
  icon: string;
  cardGraphic: {
    image: string;
    position: {
      top: string;
      left: string;
    };
  };
  theme: {
    primary: {
      main: string;
      light: string;
    };
    secondary: {
      main: string;
    };
  };
}
const games: Game[] = [
  {
    id: "what-life-been-like",
    name: "What Life’s Been Like?",
    icon: whatLifeBeenLikeIcon,
    cardGraphic: {
      image: whatLifeBeenLikeCardGraphic,
      position: {
        top: "0",
        left: "0",
      },
    },
    theme: {
      primary: {
        main: "#A4B56E",
        light: "#F4FFD4",
      },
      secondary: {
        main: "#F6DC6B",
      },
    },
  },
  {
    id: "feel-your-feelings",
    name: "Feel Your Feelings",
    icon: feelYourFeelingsIcon,
    cardGraphic: {
      image: feelYourFeelingsCardGraphic,
      position: {
        top: "0",
        left: "70%",
      },
    },
    theme: {
      primary: {
        main: "#FFA1A2",
        light: "#FFD6ED",
      },
      secondary: {
        main: "#8DD1FF",
      },
    },
  },
  {
    id: "your-bounce-back-style",
    name: "Your Bounce-Back Style",
    icon: yourBounceBackStyleIcon,
    cardGraphic: {
      image: yourBounceBackStyleCardGraphic,
      position: {
        top: "0",
        left: "70%",
      },
    },
    theme: {
      primary: {
        main: "#FECA2A",
        light: "#FFEFA8",
      },
      secondary: {
        main: "#A4B56E",
      },
    },
  },
  {
    id: "the-brainy-bits",
    name: "The Brainy Bits",
    icon: brainyBitsIcon,
    cardGraphic: {
      image: brainyBitsCardGraphic,
      position: {
        top: "0",
        left: "0",
      },
    },
    theme: {
      primary: {
        main: "#A4DBFF",
        light: "#D6E5FF",
      },
      secondary: {
        main: "#FFD6ED",
      },
    },
  },
];

export { games };
