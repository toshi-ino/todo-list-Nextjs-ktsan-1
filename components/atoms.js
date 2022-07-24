import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const todoState = atom({
  key: "todo",
  default: [],
  // default: {
  //   id: null,
  //   title: "",
  //   date: "",
  //   status: "",
  // },
  // effects_UNSTABLE: [persistAtom],

});