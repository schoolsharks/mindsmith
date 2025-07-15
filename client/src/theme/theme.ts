import { createTheme } from "@mui/material/styles";

const baseTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FFA1A2",
    },
    // sysgrey: {
    //   main: "#303030",
    //   secondary: "#6F6F6F",
    //   dark: "#101010",
    // },
  },
  typography: {
    fontFamily: '"Inter",  sans-serif',
    fontSize: 16,
  },
});

export const theme = baseTheme;
