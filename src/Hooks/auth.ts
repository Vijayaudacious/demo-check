import { signup } from "@/Services/auth";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const useSignupMutation = () => {
  return useMutation(signup);
};
