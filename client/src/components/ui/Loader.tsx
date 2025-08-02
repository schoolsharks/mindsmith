import { CircularProgress } from "@mui/material";
import Page from "../layout/Page";

const Loader = () => {
  return (
    <Page sx={{ justifyContent: "center", alignItems: "center" }}>
      <CircularProgress />
    </Page>
  );
};

export default Loader;
