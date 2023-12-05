export default {
  list: {
    title: {
      incomes: "All Incomes",
      expenses: "All Expenses",
    },
    columns: {
      invoiceNumber: "Invoice Number",
      category: {
        label: "Category",
        placeholder: "Filter by category",
        notFound: "Category not found.",
      },
      date: "Date",
      updatedBy: "Updated By",
      expensesBy: "Expenses By",
      type: "Type",
      modeOfPayment: "Payment Mode",
      modeIncome: {
        label: "Payment Mode",
        filterDropdown: {
          placeholder: "Filter by mode",
        },
      },
      amount: {
        label: "Amount",
        placeholder: {
          minNumber: "Enter min amount",
          maxNumber: "Enter max amount",
        },
      },
      description: "Description",
      attachment: {
        label: "Attachment",
        noFound: "No attachment.",
      },
      action: {
        label: "Action",
      },
    },
    filterTitle: {
      startDate: {
        label: "Start Date",
        placeholder: "Select start Date",
      },
      endDate: {
        label: "End Date",
        placeholder: "Select end Date",
      },
      range: {
        label: "Filter by range",
      },
    },
    deleteModal: {
      title: "Do you want to delete this {type}?",
      message: {
        success: "{type} deleted successfully",
      },
    },
  },
  selectCategory: {
    placeholder: "Select category",
  },
  form: {
    title: {
      create: "Add {type}",
      update: "Update {type}",
    },
    invoiceNo: {
      label: "Invoice no",
      required: "Please enter invoice no",
      placeholder: "Invoice no",
    },
    date: {
      label: "Date",
      required: "Please select date",
      placeholder: "Select date",
    },
    category: {
      label: "Category",
      required: "Please select category",
      placeholder: "Select category",
    },
    expensesBy: {
      label: "Expenses by",
      required: "Please select expenses by",
      placeholder: "Select expenses by",
    },
    modeOfIncome: {
      label: "Payment Mode",
      required: "Please select mode",
      placeholder: "Mode",
    },
    amount: {
      label: "Amount",
      required: "Please enter amount",
      placeholder: "Amount",
    },
    description: {
      label: "Description",
      placeholder: "Description",
    },
    uploadFile: {
      label: "Upload file",
      buttonTitle: "Choose File",
    },
    messages: {
      created: { success: "{type} added successfully" },
      updated: { success: "{type} updated successfully" },
    },
  },
  highcharts: {
    totalCard: {
      totalIncome: "Total Income",
      totalExpenses: "Total Expenses",
    },
    pieChart: {
      title: {
        incomeCategory: "Income Category",
        expensesCategory: "Expenses Category",
      },
    },
    highchartsComponent: {
      title: "Income/Expenses",
      amount: "Amount",
      expenses: "Expenses",
      incomes: "Incomes",
      category: "Category",
      profitLoss: "Profit/Loss",
    },
  },
  filterDropdown: {
    thisMonth: "This Month",
    lastMonth: "Last Month",
    thisQuarter: "This Quarter",
    lastQuarter: "Last Quarter",
    thisYear: "This Year",
    lastYear: "Last Year",
  },
};
