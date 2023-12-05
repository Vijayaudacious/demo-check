const dashboard = {
  fullCalendar: {
    title: "My Leave Calendar",
    description:
      "To apply for leaves, click on any date or select a range of dates.",
  },
  addLeaveForm: {
    title: "Request for Leave",
    lable: "Title",
    description: "Explain reason",
    startDate: "Start date",
    endDate: "End date",
    options: {
      fullDate: "Full Day",
      firstHalf: "First Half",
      secondHalf: "Second Half",
    },
    apiSuccess: "Leave apply successfully",
  },
  card: {
    title: {
      employee: "Total Active Employees",
      project: "Total Projects",
      holiday: "Upcoming Holiday",
      noHoliday: "No upcoming holiday",
      todayHoliday: "Today is holiday",
      leave: "Employees on leave",
      noLeave: "Everyone is working.",
    },
  },
  leaveType: {
    firstHalf: "First Half",
    secondHalf: "Second Half",
  },
};

export default dashboard;
