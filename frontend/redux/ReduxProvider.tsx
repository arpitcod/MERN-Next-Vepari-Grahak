"use client"; // 👈 આ જરૂરી છે

import { Provider } from "react-redux";
import store from "./store";


export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
