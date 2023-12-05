import { createContext } from "react";

export const ReportContext = createContext<{
  fromDate?: string;
  toDate?: string;
}>({});

export const ReportProvider = ReportContext.Provider;
