import {useSelector} from "react-redux";
import {RootState} from "../Redux/store";

export const useDarkMode = () => {
  return useSelector((state: RootState) => state.darkmode.darkmode);
};
