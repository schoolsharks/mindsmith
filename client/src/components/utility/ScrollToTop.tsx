import { useEffect } from "react";

const ScrollToTop = ({behavior}:{behavior?:"smooth"|"instant"|"auto"}) => {
  useEffect(() => {
    window.scrollTo({top:0,behavior:behavior});
  }, []);
  return null;
};

export default ScrollToTop;
