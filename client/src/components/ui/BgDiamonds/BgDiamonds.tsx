import { Box, keyframes } from "@mui/material";
import { Diamond, Sparkle } from "lucide-react";
import { DiamondPosition } from "./diamondsPositions";

interface BgDiamondsProps {
  positions: DiamondPosition[];
  animation?: boolean;
}
const BgDiamonds: React.FC<BgDiamondsProps> = ({
  positions,
  animation = false,
}) => {
  // Animation keyframes
  const floatAnimation = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  `;

  // const twinkleAnimation = keyframes`
  //   0% { 
  //     opacity: 0.6; 
  //     filter: drop-shadow(0 0 2px rgb(255, 255, 255));
  //   }
  //   25% { 
  //     opacity: 1; 
  //     filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 12px rgba(255, 255, 255, 0.4));
  //   }
  //   50% { 
  //     opacity: 0.8; 
  //     filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.6));
  //   }
  //   75% { 
  //     opacity: 1; 
  //     filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.5));
  //   }
  //   100% { 
  //     opacity: 0.6; 
  //     filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.3));
  //   }
  // `;

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
    const baseIconStyles = {
      transform: `rotate(${rotation}deg)`,
    };

    if (variant === "sharp") {
      return (
        <Sparkle
          color={color}
          fill={color}
          size={size}
          style={baseIconStyles}
        />
      );
    } else if (variant === "rounded") {
      return (
        <Diamond
          color={color}
          fill={color}
          size={size}
          style={baseIconStyles}
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
            ...(animation && {
              animation: `${floatAnimation} ${
                4 + (index % 3)
              }s ease-in-out infinite`,
              // animationDelay: `${index * 0.5}s`,
              opacity: 0.8,
              transition: "all 0.3s ease-in-out",
              /* "&:hover": {
                animation: `${twinkleAnimation} 0.6s ease-in-out infinite`,
                transform: "translate(-50%, -50%) scale(1.1)",
              }, */
            }),
          }}
        >
          {renderDiamond(pos)}
        </Box>
      ))}
    </Box>
  );
};

export default BgDiamonds;
