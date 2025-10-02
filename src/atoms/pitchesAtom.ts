import { atom } from "recoil";

export const pitchesAtom = atom<any[] | null>({
  key: "pitches",
  default: null,
});
