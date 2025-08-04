import { Box, Typography } from "@mui/material";
import Page from "../../components/layout/Page";
import AllGames from "../../features/games/components/AllGames";

const Home = () => {
  return (
    <Page sx={{ padding: "20px 40px" }}>
      <Typography fontSize={"30px"} fontWeight={"600"} marginTop={"20px"}>
        Your Journey
      </Typography>
      <Typography
        fontSize={"14px"}
        fontWeight={"400"}
        marginTop={"6px"}
        sx={{
          opacity: 0.8,
        }}
      >
        No pressure - just notice what’s going on inside.
      </Typography>
      <Box margin={"20px 0"} flex={1}>
        <AllGames />
      </Box>
    </Page>
  );
};

export default Home;
