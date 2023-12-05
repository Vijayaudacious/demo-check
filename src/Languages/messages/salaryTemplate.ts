const earningDeductions = {
  type: {
    label: "Type",
    required: "Please select type",
    placeholder: "Select type",
    options: {
      percentage: "Percentage",
      fixed: "Fixed",
    },
  },
  name: {
    label: "Name",
    placeholder: "Name",
    required: "Please enter name",
  },
  amount: {
    label: {
      amount: "Amount",
      percentage: "Percentage",
    },
    placeholder: {
      amount: "Amount",
      percentage: "Percentage",
    },
    required: {
      amount: "Please enter amount",
      percentage: "Please enter percentage",
    },
  },
};

export default {
  title: "All Salary Templates",
  columns: {
    templateName: "Template Name",
    description: "Description",
    createdDate: "Created At",
    createdBy: "Created By",
    updatedAt: "Last Updated At",
  },
  placeholder: {
    search: "Search by name and description",
    filter: "Filter by created by",
  },
  deleteModal: {
    title: "Do you want to remove this salary template?",
    message: {
      success: "Salary template deleted successfully",
      error:
        "We are not able to delete the salary template, please try again after some time.",
    },
  },
  form: {
    title: {
      update: "Update Salary Template",
      create: "Create Salary Template",
    },
    templateName: {
      label: "Name",
      placeholder: "Template name",
      required: "Please enter template name",
    },
    description: {
      label: "Description",
      placeholder: "Description",
      required: "Please enter description",
    },
    earnings: {
      title: "Earnings",
      ...earningDeductions,
    },
    deductions: {
      title: "Deductions",
      ...earningDeductions,
    },
  },
  messages: {
    createdSuccess: "Salary template created successfully",
    updatedSuccess: "Salary template updated successfully",
  },
  addSalaryTemplateBtn: "Create Salary Template",
};
