import {
  SetWorkingDays,
  addHoliday,
  addOrganisationDetail,
  deleteHoliday,
  deleteOrganizationLogo,
  editOrganisationDetail,
  getHolidays,
  getWorkingDays,
  organisationDetail,
  updateHoliday,
} from "@/Services/Organization";
import { useMutation, useQuery, useQueryClient } from "react-query";

const QUERY_KEYS = {
  DELETE_LOGO: "delete_logo",
  ORGANIZATION_DETAILS: "organization-detail",
  HOLIDAY_LIST: "holiday-list",
  GET_WORKING_DAY: "get-working-day",
};

export const useCreateOrganizationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(addOrganisationDetail, {
    onSuccess: () => {
      queryClient.invalidateQueries(["Add-organizationDetails"]);
    },
  });
};

export const useUpdateOrganizationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(editOrganisationDetail, {
    onSuccess: () => {
      queryClient.invalidateQueries(["Edit-organizationDetails"]);
    },
  });
};

export const useOrganization = () =>
  useQuery([QUERY_KEYS.ORGANIZATION_DETAILS], () => organisationDetail());

export const useDeleteOrganizationLogoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteOrganizationLogo, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.DELETE_LOGO]);
    },
  });
};

export const useSetWorkingDaysMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(SetWorkingDays, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.ORGANIZATION_DETAILS]);
      queryClient.invalidateQueries([QUERY_KEYS.GET_WORKING_DAY]);
    },
  });
};

export const useHolidays = (filters: Parameters<typeof getHolidays>[0]) =>
  useQuery([QUERY_KEYS.HOLIDAY_LIST, filters], () => getHolidays(filters));

export const useAddHolidayMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(addHoliday, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.HOLIDAY_LIST]);
    },
  });
};

export const useUpdateHolidayMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(updateHoliday, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.HOLIDAY_LIST]);
    },
  });
};

export const useDeleteHolidayMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteHoliday, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.HOLIDAY_LIST]);
    },
  });
};
export const useGetWorkingDays = () =>
  useQuery([QUERY_KEYS.GET_WORKING_DAY], () => getWorkingDays());
