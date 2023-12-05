import Onboarding from "@/Layouts/Onboarding";
import Signup from "@/Pages/Signup";
import { message } from "antd";
import { FormattedMessage } from "react-intl";
import { QueryClient, QueryClientProvider } from "react-query";
import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "../Auth";
import LoginPage from "../Pages/Login";
import SetPassword from "../Pages/Setpassword";
import { AxiosError } from "axios";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (count, error: any) => {
        const httpErrorCode = error?.response.status || 500;
        if (httpErrorCode === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userDetails");
        }
        return count < 3 && ![401, 403, 400, 404].includes(httpErrorCode);
      },
    },
    mutations: {
      onError: (error: unknown) => {
        if (
          [403, 401].includes((error as AxiosError).response?.status as number)
        ) {
          message.error(<FormattedMessage id="generic.unAuthorized" />);
        }
      },
    },
  },
});

const Routing = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<Onboarding />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password/" element={<SetPassword />} />
        </Route>
        <Route path="*" element={<ProtectedRoutes />} />
      </Routes>
    </QueryClientProvider>
  );
};
export default Routing;
