import { Currency } from "@/Pages/Payment/Plans";
import { Plan } from "@/Types/Payment";
import { apiCaller } from "@/Utils/RestApi";

export const getPlans = async (): Promise<{ data: Plan[] }> =>
  (await apiCaller("/plans", undefined, "GET", undefined, "payments")).data;

export const createSubscription = async ({
  planId,
  currency,
}: {
  planId: string;
  currency: Currency;
}): Promise<any> =>
  (
    await apiCaller(
      `/subscription/${planId}`,
      { currency },
      "POST",
      undefined,
      "payments"
    )
  ).data;

export const createCard = async ({ token }: { token: string }): Promise<any> =>
  (await apiCaller(`/card/${token}`, undefined, "POST", undefined, "payments"))
    .data;
