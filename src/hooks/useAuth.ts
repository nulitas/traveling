import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectCurrentToken,
} from "@/store/modules/authSlice";

export const useAuth = () => {
  const currentUser = useSelector(selectCurrentUser);
  const currentToken = useSelector(selectCurrentToken);

  const isAuthenticated = !!currentToken;

  return {
    currentUser,
    currentToken,
    isAuthenticated,
  };
};
