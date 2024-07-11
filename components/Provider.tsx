"use client";

import { RecoilRoot } from "recoil";
import * as React from "react";



export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
      <RecoilRoot>{children}</RecoilRoot>
  );
};
