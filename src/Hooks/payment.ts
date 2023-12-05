import { createCard, createSubscription, getPlans } from "@/Services/payment";
import { useMutation, useQuery, useQueryClient } from "react-query";

const QUERY_KEYS = {
  PLANS_LIST: "plans-list",
};

export const usePlans = () =>
  useQuery([QUERY_KEYS.PLANS_LIST], () => getPlans());

export const useCreateCardMutation = () => useMutation(createCard);

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation(createSubscription, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.PLANS_LIST]);
    },
  });
};
