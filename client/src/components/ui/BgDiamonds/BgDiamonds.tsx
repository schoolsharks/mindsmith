import { Box } from "@mui/material";
import { Diamond, Sparkle } from "lucide-react";
import { DiamondPosition } from "./diamondsPositions";

interface BgDiamondsProps {
  positions: DiamondPosition[];
}
const BgDiamonds: React.FC<BgDiamondsProps> = ({ positions }) => {
  const renderDiamond = ({
    variant,
    color,
    rotation = 0,
    size = 24,
  }: {
    variant: "sharp" | "rounded";
    color: string;
    rotation?: number;
    size?: number;
  }) => {
    if (variant === "sharp") {
      return (
        <Sparkle
          color={color}
          fill={color}
          size={size}
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      );
    } else if (variant === "rounded") {
      return (
        <Diamond
          color={color}
          fill={color}
          size={size}
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      );
    }
  };
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      {positions.map((pos, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            top: pos.top,
            left: pos.left,
            transform: "translate(-50%, -50%)",
          }}
        >
          {renderDiamond(pos)}
        </Box>
      ))}
    </Box>
  );
};

export default BgDiamonds;
