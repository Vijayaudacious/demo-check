import { apiCaller } from "../Utils/RestApi";

export const getSettings = async () =>
  (await apiCaller(`/public`, undefined, "GET", undefined, "settings")).data;
