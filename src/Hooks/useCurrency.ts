import { getCurrency } from "@/Utils/generic";
import { useMemo } from "react";

export type Currency = "inr" | "usd";

const useCurrency = (): Currency => {
  return useMemo(() => getCurrency(), []);
};

export default useCurrency;
