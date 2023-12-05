export default {
  list: {
    searchPlaceholder: "Search by requested by, title, status",
    columns: {
      startDate: "Start Date",
      endDate: "End Date",
      leaveCount: "Leave Count",
      requestedBy: "Requested By",
      title: "Title",
      description: "Description",
      status: "Status",
      requestAt: "Request At",
      action: "Action",
      approve: "Approve",
      reject: "Reject",
      totalDays:"Total Days",
    },
    filter: {
      startDate: {
        title: "Start date",
        placeholder: "Select start date",
      },
      endDate: {
        title: "End date",
        placeholder: "Select end date",
      },
    },
    actionModal: {
      approve: {
        title: "Do you want to approve leave",
        message: "Leave approved successfully",
      },
      rejected: {
        title: "Reason of reject leave",
        requiredMessage: "Please enter reason of reject leave",
        message: "Leave rejected successfully",
      },
    },
  },
};
