import { getSettings } from "@/Services/settings";
import { useQuery } from "react-query";

export const useSettings = () => useQuery(["settings"], () => getSettings());
