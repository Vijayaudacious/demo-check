import { Signup } from "@/Types/Signup";
import { apiCaller } from "../Utils/RestApi";
export const login = ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ token: string }> =>
  apiCaller(
    `/login`,
    {
      email,
      password,
    },
    "post"
  );

export const regeneratePassword = ({
  newPassword,
  confirmPassword,
  id,
  token,
}: {
  newPassword: string;
  confirmPassword: string;
  id: any;
  token: any;
}): Promise<{ token: string }> =>
  apiCaller(
    `/${id}/password/reset/${token}`,
    {
      newPassword,
      confirmPassword,
    },
    "patch"
  );

export const signup = async (data: Signup) =>
  (await apiCaller(`/create`, data, "POST", undefined, "customer")).data;
