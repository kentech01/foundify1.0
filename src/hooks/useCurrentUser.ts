import { useRecoilState, useRecoilValue } from "recoil";
import { currentUserAtom, userLoadingAtom, userErrorAtom } from "../atoms";

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);
  const isLoading = useRecoilValue(userLoadingAtom);
  const error = useRecoilValue(userErrorAtom);

  return {
    currentUser,
    setCurrentUser,
    isLoading,
    error,
    isAuthenticated: !!currentUser,
  };
};
