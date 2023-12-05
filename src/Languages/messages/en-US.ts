import { SUPPORTED_LAGUAGES } from "../constants";
import projects from "./Projects";
import attendance from "./attendance";
import breadcrumbs from "./breadcrumbs";
import categories from "./categories";
import dashboard from "./dashboard";
import employee from "./employee";
import generic from "./generic";
import holiday from "./holiday";
import incomesExpenses from "./incomesExpenses";
import listView from "./listView";
import login from "./login";
import myexpenses from "./myexpenses";
import number from "./numbers";
import payrollProcessing from "./payrollProcessing";
import planLimitations from "./planLimitations";
import project from "./project";
import reports from "./reports";
import resetPassword from "./resetPassword";
import roles from "./roles";
import salaryTemplate from "./salaryTemplate";
import settings from "./settings";
import sidebar from "./sidebar";
import signup from "./signup";

export default {
  [SUPPORTED_LAGUAGES.ENGLISH]: {
    generic,
    attendance,
    holiday,
    breadcrumbs,
    settings,
    dashboard,
    resetPassword,
    employee,
    projects,
    planLimitations,
    reports,
    project,
    salaryTemplate,
    sidebar,
    roles,
    listView,
    categories,
    login,
    signup,
    incomesExpenses,
    payrollProcessing,
    number,
    myexpenses,
  },
};
