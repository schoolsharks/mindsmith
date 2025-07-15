export interface DiamondPosition {
  top: string;
  left: string;
  variant: "rounded" | "sharp";
  color: string;
  rotation?: number;
  size: number;
}
const positions1: DiamondPosition[] = [
  {
    top: "10%",
    left: "15%",
    variant: "rounded",
    color: "#ffffffd6",
    rotation: 0,
    size: 16,
  },
  {
    top: "15%",
    left: "30%",
    variant: "sharp",
    color: "#ffffff",
    rotation: 30,
    size: 32,
  },
  {
    top: "18%",
    left: "80%",
    variant: "sharp",
    color: "#ffffff",
    size: 14,
  },
  {
    top: "80%",
    left: "80%",
    variant: "sharp",
    color: "#ffffff",
    size: 20,
    rotation: 24,
  },
  {
    top: "90%",
    left: "50%",
    variant: "sharp",
    color: "#ffffff",
    rotation: 45,
    size: 32,
  },
];

// Being used in what life been like splash screen

const positions2: DiamondPosition[] = [
  {
    color: "#a4b56e6f",
    left: "3%",
    top: "0%",
    variant: "rounded",
    size: 10,
    rotation: 0,
  },
  {
    color: "#A4B56E",
    left: "23%",
    top: "10%",
    variant: "sharp",
    size: 20,
    rotation: 30,
  },
    {
    color: "#a4b56eff",
    left: "5%",
    top: "90%",
    variant: "sharp",
    size: 12,
    rotation: 30,
  },
    {
    color: "#a4b56eff",
    left: "80%",
    top: "95%",
    variant: "sharp",
    size: 25,
    rotation: 30,
  },
    {
    color: "#a4b56e82",
    left: "92%",
    top: "106%",
    variant: "rounded",
    size: 18,
  },
];

export { positions1, positions2 };
