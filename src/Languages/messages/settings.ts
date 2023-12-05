const settings = {
  tabs: {
    Profile: {
      general: "General",
      security: "Security",
    },
    organization: {
      general: "General",
      workingHours: "Working Hours",
      holidays: "Holidays",
    },
  },
  holidays: {
    add: {
      modal: {
        add: { success: "Holiday added successfully.", title: "Add Holiday" },
        edit: {
          success: "Holiday updated successfully.",
          title: "Update Holiday",
        },
      },
      form: {
        title: {
          label: "Title",
          placeholder: "Please enter holiday title",
          required: "Please enter title.",
        },
        date: {
          label: "Start Date",
          required: "Please select date",
          placeholder: "Please select date",
        },
        description: {
          label: "Description",
          placeholder: "Please enter description",
          required: "Please enter description",
        },
        repeat: {
          label: "Repeatable",
        },
      },
    },
  },
  workingHours: {
    form: {
      title: "Working Days (All weekdays with a checkbox)",
      footer: "No day selected.",
      to: "to",
      startTime: { placeholder: "Select Start Time" },
      endTime: { placeholder: "Select End Time" },
      messages: {
        success: "Updated successfully",
        error: "Unable to process",
        startTime: "Select start time",
        endTime: "Select end time",
      },
    },
    days: {
      sun: "Sun",
      mon: "Mon",
      tue: "Tue",
      wed: "Wed",
      thu: "Thu",
      fri: "Fri",
      sat: "Sat",
    },
    button: { copy: "Same for all" },
  },
  general: {
    form: {
      name: {
        label: "Name",
        required: "Please enter name",
        placeholder: "Enter name",
      },
      contactNumber: {
        label: "Contact number",
        required: "Please enter contact number",
        validNumber: "Enter valid contact number",
        placeholder: "Enter contact number",
      },
      alternateContactNumber: {
        label: "Alternate contact number",
        required: "Please enter alternate contact number",
        validNumber: "Enter valid alternate contact number",
        placeholder: "Enter alternate contact number",
      },
      maritalStatus: {
        label: "Marital status",
        required: "Please select maritial status",
        placeholder: "Select marital status",
        optionsLabel: {
          unmarried: "Unmarried",
          married: "Married",
        },
      },
      gender: {
        label: "Gender",
        required: "Please select gender",
        placeholder: "Select gender",
        optionsLabel: {
          male: "Male",
          female: "Female",
          other: "Other",
        },
      },
      localAddress: {
        label: "Local address",
        required: "Please enter local address",
        placeholder: "Enter local address",
      },
      permanentAddress: {
        label: "Permanent address (Same as Local Address)",
        required: "Please enter permanent address",
        placeholder: "Enter permanent address",
      },
    },
    message: {
      updated: "Successfully updated details.",
      imageUploaded: "Image uploaded successfully.",
      imageRemove: "Image remove successfully.",
    },
    delete: {
      title: "Are you sure you want to remove the profile image?",
    },
  },
  security: {
    form: {
      currentPassword: {
        label: "Current password",
        required: "Please enter current password",
        placeholder: "Enter current password",
      },
      newPassword: {
        label: "New password",
        required: "Please enter new password",
        message:
          "The password must be 8 characters with 1 uppercase, 1 lowercase, 1 numeric &, 1 special character.",
        placeholder: "Enter new password",
      },
      confirmNewPassword: {
        label: "Confirm new password",
        required: "Please enter confirm new password",
        message: "Password should be same",
        placeholder: "Enter confirm new password",
      },
    },
    message: {
      updated: "Password updated successfully.",
    },
  },
  organization: {
    Details: {
      organizationName: "Organization Name",
      organizationEmail: "Organization Email Address",
      organizationContactNumber: "Organization Contact Number",
      organizationLandlineNumber: "Organization Landline Number",
      businessLocation: "Business Location",
      industry: "Industry",
      prefixId: "Prefix ID",
      registeredAddress: "Registered Address",
      gstNumber: "GSTIN (GST Number)",
      panNumber: "PAN Number",
      tanNumber: "TAN (Tax Deduction/ Collection Account) Number",
    },
    message: {
      logoRemove: "Logo remove successfully",
    },
  },
};

export default settings;
