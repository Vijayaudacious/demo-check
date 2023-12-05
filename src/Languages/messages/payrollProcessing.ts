export default {
  list: {
    title: "All Payrolls",
    filters: {
      search: {
        placeholder: "Search by employee code",
      },
    },
    column: {
      empId: "Employee Code",
      empName: "Name",
      presentDay: "Present Day",
      absentDay: "Absent Day",
      lwp: "LWP",
      paidDay: "Paid Day",
      grossSalary: "Gross Salary",
      netPay: "Net Pay",
      breakdown: "View Breakdown",
      paySlip: "Pay Slip",
    },
    breakdown: {
      title: "Salary Breakdown",
      button: "View",
      notFound: "No templaye assigned",
    },
    footer: {
      text: "Preview the input template",
      title: "Payroll input template",
      content: "Demo format for the sheet which employees",
    },
  },
  payslip: {
    title: "Payslip for the month {month}",
    forMonth: "Month {month}",
    workingDays: "Total Working Days: {days}",
    presentDays: "Total Present Days: {days}",
    name: "Name: {name}",
    employeeId: "Employee ID: {empId}",
    netSalary: "Net Salary:- {amount}",
    grossSalary: "Gross Salary:- {amount}",
    table: {
      head: "Salary Head",
      amount: "Amount",
    },
    noData: "No {type}",
    total: "Total",
    seffix: "Only",
    button: {
      loading: "Loading document...",
      success: "Download now",
    },
  },
};
