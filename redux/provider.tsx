"use client";
import { ReactNode, useState } from "react";
import { makeStore, RootState } from "./store";
import { Provider } from "react-redux";

const ReduxProvider = ({
  children,
  preloadedState,
}: {
  children?: ReactNode;
  preloadedState?: Partial<RootState>;
}) => {
  // Using the lazy initializer function (only runs on the first render)
  const [store] = useState(() => makeStore(preloadedState));

  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
