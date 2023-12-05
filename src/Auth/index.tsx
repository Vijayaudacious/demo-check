import { Loader } from "@/Components/Loader";
import { useOrganization } from "@/Hooks/organization";
import useIsLoggedIn from "@/Hooks/useIsLoggedIn";
import { getAllPermission, userProfile } from "@/Services/Users";
import get from "lodash/get";
import React, { createContext } from "react";
import { useQuery } from "react-query";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

//layout
const DashboardLayout = React.lazy(() => import("@/Layouts/DashboardLayout"));

//Pages
const PageNotFound = React.lazy(() => import("@/Components/404"));
const Dashboard = React.lazy(() => import("@/Pages/Dashboard"));
const SecurityChangePassword = React.lazy(
  () => import("@/Pages/Settings/Profile/SecuritySection")
);

export const PermissionContext = createContext<any>(null);
export const UserContext = createContext<any>(null);
export const PlanContext = createContext<any>(null);

const ProtectedRoutes = () => {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const {
    data: permissions,
    isLoading,
    isSuccess,
  } = useQuery("userAuthPermission", getAllPermission, {
    enabled: isLoggedIn,
    onError: () => {
      localStorage.removeItem("authToken");
      navigate("/login");
    },
  });
  const { data } = useQuery("userData", userProfile, {
    enabled: isLoggedIn,
  });

  const { data: organization } = useOrganization();
  const plan = get(organization, "data.planId", {});
  const contextValue = plan !== null ? plan : {};

  const permissionAuth: Record<string, string> = get(permissions, "data", {});
  const hasExpired = get(permissions, "data.expire", false);
  const canPayment = get(permissions, "data.permission", false);
  const signedInUserData = get(data, "data.data", {});

  const { users, roles, leaves } = permissionAuth;

  return isLoggedIn ? (
    isSuccess ? (
      <PlanContext.Provider value={contextValue}>
        <PermissionContext.Provider value={permissionAuth}>
          <UserContext.Provider value={signedInUserData}>
            <React.Suspense
              fallback={<Loader isLoading centered size="large" />}
            >
              <Routes>
                {!hasExpired && (
                  <Route path="/" element={<DashboardLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    {/* deprecated path */}
                    <Route
                      path="/settings/employee"
                      element={<Navigate to="/settings/profile" />}
                    />
                    <Route
                      path="/settings/security"
                      element={<SecurityChangePassword />}
                    />
                  </Route>
                )}
                <Route path="*" element={<PageNotFound />} />
              </Routes>
              <Outlet />
            </React.Suspense>
          </UserContext.Provider>
        </PermissionContext.Provider>
      </PlanContext.Provider>
    ) : (
      <Loader isLoading={isLoading} size="large" centered />
    )
  ) : (
    <Navigate
      to={`/login?returnUrl=${encodeURIComponent(pathname + search)}`}
    />
  );
};

export default ProtectedRoutes;
