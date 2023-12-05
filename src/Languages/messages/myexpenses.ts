export default {
  list: {
    title: "My All Expenses",
    filters: {
      search: "Search by requested by",
      fromDate: "Select from date",
      toDate: "Select to date",
    },
    columns: {
      requstedBy: "Requested By",
      dateOfExpenses: "Date",
      reasonOfExpenses: "Reason",
      amount: "Amount",
      reportStatus: "Status",
      attechment: "Attachment",
      actionStatus: "Action Status",
    },
    attachment: {
      data: "Attachment",
      noData: "No attachment.",
    },
  },
  request: {
    button: "Request",
    title: {
      add: "Add Request For My Expenses",
    },
    added: "Request added successfully",
    form: {
      date: {
        label: "Date",
        placeholder: "Select date",
        required: "Please select date",
      },
      amount: {
        label: "Amount",
        placeholder: "Amount",
        required: "Please enter amount",
      },
      reason: {
        label: "Reason",
        placeholder: "Reason",
        required: "Please enter reason",
      },
      notify: {
        label: "Select persons to notify",
        placeholder: "Select persons",
      },
      document: {
        label: "Document",
        placeholder: "Select document",
      },
    },
  },
};
