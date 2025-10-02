import { atom } from "recoil";
import { UserProfile } from "../services/api";

export const currentUserAtom = atom<UserProfile | null>({
  key: "currentUser",
  default: null,
});

export const userLoadingAtom = atom<boolean>({
  key: "userLoading",
  default: false,
});

export const userErrorAtom = atom<string | null>({
  key: "userError",
  default: null,
});
