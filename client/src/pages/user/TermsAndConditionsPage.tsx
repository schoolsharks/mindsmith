import { Box, Typography, useTheme } from "@mui/material";
import Page from "../../components/layout/Page";

const TermsAndConditions = () => {
  const theme = useTheme();
  return (
    <Page sx={{ backgroundSize: "contain" }}>
      {/* <Row sx={{ marginTop: "40px" }}>
        <BackButton />
        <Typography variant="h1">Terms & Conditions</Typography>
      </Row> */}
      <Box
        padding={"24px"}
        margin={"50px 20px 0"}
        bgcolor={theme.palette.primary.main}
      >
        <Typography>
          This game is designed for fun and educational purposes only!
          <br />
          <br />
          No real data will be collected, stored, or shared during the game.
          <br />
          <br />
          All inputs will be erased after the game concludes unless you
          explicitly request to stay connected for follow-up discussions or
          insights.
          <br />
          <br />
          Enjoy the experience without any worries!
        </Typography>
      </Box>
    </Page>
  );
};

export default TermsAndConditions;
