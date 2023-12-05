export default {
  form: {
    title: { new: "New Project", update: "Update Project" },
    project: {
      label: "Project name",
      placeholder: "Enter project name",
      required: "Please enter project name",
    },
    managerName: {
      label: "Manager name",
      required: "Please select manager name",
    },
    projectDates: {
      title: "Project Dates",
      startDate: {
        label: "Start date",
        placeholder: "Select start date",
        required: "Please select start date",
      },
      estimatedDate: {
        label: "Estimated date",
        placeholder: "Select estimated",
      },
      endDate: {
        label: "End date",
        placeholder: "Select start date",
      },
    },
  },
  delete: {
    title: "Do you want to remove this project?",
    warning:
      "If you delete the project, all the reports provided by employees for this project, will also be deleted.",
    error:
      "We are not able to delete the project, please try again after some time.",
  },
  list: {
    title: "All Projects",
    column: {
      projectName: "Project Name",
      projectManager: "Project Manager",
      createdBy: "Created By",
      updatedBy: "Updated By",
      startDate: "Start Date",
      estimatedDate: "Estimated End Date",
      endDate: "End Date",
      createdAt: "Created At",
      updatedAt: "Updated At",
    },
    filters: {
      projectName: {
        placeholder: "Search by project name",
      },
      startDate: {
        placeholder: "Select start date",
      },
      endDate: {
        placeholder: "Select end date",
      },
      createdBy: {
        title: "Created by/Manager name",
      },
    },
  },
  message: {
    created: "Project added successfully.",
    updated: "Project updated successfully.",
    deleted: "Project Deleted Successfully.",
  },
};
