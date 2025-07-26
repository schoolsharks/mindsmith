import { createTheme } from "@mui/material/styles";

const baseTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#18C4E7",
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
