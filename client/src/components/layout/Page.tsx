import { Stack, SxProps } from "@mui/material";
import React, { useEffect, useState } from "react";

const Page = ({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: SxProps;
}) => {
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setInnerHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Stack minHeight={innerHeight} flex={1} sx={{ ...sx, transition: "all 0.3s ease" }}>
      {children}
    </Stack>
  );
};

export default Page;
