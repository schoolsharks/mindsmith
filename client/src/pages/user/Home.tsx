import { Box, Typography } from "@mui/material";
import Page from "../../components/layout/Page";
import AllGames from "../../features/games/components/AllGames";
import DownloadButton from "../../features/reports/components/DownloadButton";

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
        No pressure — just notice what’s going on inside.
      </Typography>
      <Box marginTop={"20px"} flex={1}>
        <AllGames />
      </Box>
      <DownloadButton />
    </Page>
  );
};

export default Home;
