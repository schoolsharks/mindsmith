import { PaletteColorOptions } from "@mui/material/styles";
import {
  TypographyVariants,
  TypographyVariantsOptions,
} from "@mui/material/styles";

// Extend Palette
declare module "@mui/material/styles" {
  interface Palette {
    sysgrey: {
      main: string;
      secondary: string;
      dark: string;
    };
  }

  interface PaletteOptions {
    sysgrey?: {
      main: string;
      secondary: string;
      dark: string;
    };
  }
}

export {};
