export default {
  title: {
    new: "New Employee",
    update: "Update Employee",
  },
  form: {
    name: {
      label: "Full name",
      placeholder: "Enter full name",
      required: "Please enter name",
    },
    fatherName: {
      label: "Father/ husband name",
      placeholder: "Enter father/ husband name",
    },
    panCard: {
      label: "Pan card number",
      placeholder: "Enter pan card number",
    },
    salary: {
      label: "Salary",
      placeholder: "Enter salary",
      required: "Please enter salary",
    },
    salaryTemplate: {
      label: "Assign Template",
      placeholder: "Select salary template",
    },
    email: {
      label: "Email",
      placeholder: "Enter email address",
      required: "Please enter email address",
      validmail: "Please enter valid email address",
    },
    contactNumber: {
      label: "Contact number",
      placeholder: "Enter contact number",
      required: "Please enter contact number",
      validnumber: "Please enter valid contact number",
    },
    allocatedLeaves: {
      label: "Leaves",
    },
    roles: {
      label: "Roles",
    },
    manager: {
      label: "Managers",
    },
    employeeCode: {
      label: "Employee code",
      placeholder: "Enter employee code",
      required: "Please enter employee code",
    },
    gender: {
      label: "Gender",
      placeholder: "Select gender",
      required: "Please select gender",
      options: {
        male: "Male",
        female: "Female",
        other: "Other",
      },
    },
    maritialStatus: {
      label: "Marital status",
      placeholder: "Select marital status",
      options: {
        unmarried: "Unmarried",
        married: "Married",
      },
    },
    dob: {
      label: "Date of Birth",
      placeholder: "Select date of birth",
      required: "Please select date of birth",
    },
    joiningDate: {
      label: "Joining date",
      placeholder: "Select joining date",
      required: "Please select joining date",
    },
    localAddress: {
      label: "Local address",
      placeholder: "Enter local address",
      required: "Please enter local address",
    },
    permanentAddress: {
      label: "Permanent address (Same as Local Address)",
      placeholder: "Enter permanent address",
      required: "Please enter permanent address",
    },
    previousOrg: {
      name: {
        label: "Previous org name",
        placeholder: "Enter previous organization name",
      },
      startDate: {
        label: "Start date",
        placeholder: "Select start date",
      },
      endDate: {
        label: "End date",
        placeholder: "Select end date",
      },
      salary: {
        label: "Last withdrawn salary",
        placeholder: "Enter last withdrawn salary",
      },
    },
    education: {
      institution: {
        label: "School/University name",
        placeholder: "Enter school/university name",
      },
      course: {
        label: "Degree/Class",
        placeholder: "Enter degree/class",
      },
      year: {
        label: "Passing Year",
        placeholder: "Enter passing year",
      },
      specialization: {
        label: "Specialization",
        placeholder: "Enter specialization",
      },
      grade: {
        label: "Grade",
        placeholder: "Enter grade",
      },
    },
    documents: {
      title: {
        add: "Add Document",
        update: "Update Document",
      },
      form: {
        documentName: {
          label: "Document Name",
          required: "Please enter document name",
          placeholder: "Enter document name",
        },
        document: {
          label: "Document",
          placeholder: " Please Select File",
        },
      },
    },
  },
  messages: {
    create: "Employee created successfully",
    update: "Employee details updated successfully",
    archived: "User archived successfully",
    unarchived: "User unarchived successfully",
    deleted: "User deleted successfully",
    document: {
      limit: "Image must smaller than 2MB!",
      title: "Do you want to delete this document?",
      delete: "{document} deleted successfully",
      update: "{document} updated successfully",
      add: "{document} added successfully",
      noPreview: {
        text: "Click to show {document}",
        tooltip: "Preview is not availabe for {document}.",
      },
    },
    resetPassword: "Reset password Successfully",
    notLoggedIn: "The user has not logged in yet",
  },
  profile: {
    details: {
      createdDate: "Created Date:",
      joiningDate: "Joining Date:",
      roles: "Roles",
      permanentAddress: "Permanent Address",
    },
    resetPassword: {
      title: "Regenerate Password",
      confirm: "Do you want to regenerate the password?",
    },
  },
  steps: {
    employeeDetails: {
      title: "Employee details",
      description: "Provide Basic Information About the Profile",
    },
    personalDetails: {
      title: "Personal details",
      description: "Provide personal details of the employee",
    },
    employeementDetails: {
      title: "Employment details",
      description: "Provide details about past employment",
    },
    educationDetails: {
      title: "Educational details",
      description: "Provide educational background of employee",
    },
    documents: {
      title: "Documents",
      description:
        "Any supporting documents, like Aadhar, PAN, or Certificates",
    },
    salary: {
      title: "Salary Details",
      description: "Provide salary details of the employee",
    },
  },
  employeeList: {
    title: {
      employeesList: "Employees List",
      archivedList: "Archived List",
      filterByRoles: "Filter by roles",
      filterBy: "Filter by",
      startDate: "Start date",
      endDate: "End date",
    },
    pageHeaderTitle: {
      allEmployees: "All Employees",
      allArchivedEmployees: "All Archived Employees",
    },
    columns: {
      name: "Name",
      email: "Email",
      contactNo: "Contact No.",
      gender: "Gender",
      roles: "Roles",
      remainingLeaves: "Remaining leaves",
      lastLogin: "Last Login At",
      createdDate: "Created Date",
      joiningDate: "Joining Date",
      action: "Action",
      unarchived: "Unarchived",
      delete: "Delete",
      update: "Update",
      archive: "Archive",
    },
    confirmModalTitle: {
      unarchived: " Do you want to Unarchived {name}?",
      delete: "Do you want to permanently delete this employee",
      archive:
        "Once you archive {name} they can no longer login to the system. Are you sure, you still want to archive?",
    },
    placeholder: {
      search: "Search by name, email, contact number",
      filterBy: "Select filter date",
      startDate: "Select start date",
      endDate: "Select end date",
    },
    tooltip: {
      upgrade: "Upgrade",
      addUsers:
        "You have already added {totalUsers} users {Link} your plan to add more.",
      deleteUser: "You cannot be a delete user {Link} your plan to delete.",
    },
    optionsLable: {
      loggedIn: "Logged in",
      notLoggedIn: "Not Logged in",
    },
  },
  employeeTabs: {
    profileOverview: "Profile Overview",
    leaves: "Leaves",
    feedback: "Feedback",
  },
};
