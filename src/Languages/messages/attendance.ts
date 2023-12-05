const attendance = {
  list: {
    title: "Employee Attendance Sheet",
    placeholder: "Select employee",
    upload: "Upload",
    export: "Export",
    markAttendance: "Mark Attendance",
    search: "Search by employee name",
    columns: {
      employeeId: "Employee ID",
      employeeName: "Employee Name",
      totalWorkingDay: "Total Working Day",
      totalPresent: "Total Present",
      totalAbsent: "Total Absent",
    },
  },
  markAttendance: {
    list: {
      title: "Mark attendance",
      filterLabel: {
        calendar: "Calendar",
      },
      columns: {
        present: "Present",
        absent: "Absent",
        halfDay: "Half Day",
        inTime: "In Time",
        outTime: "Out Time",
      },
    },
    apiSuccess: "Attendance updated successfully.",
  },
  timeSheet: {
    header: {
      totalPresent: "Total Present",
      totalAbsent: "Total Absent",
      totalWorkingDay: "Total Working day",
      totalOverTime: "Total Over Time",
      totalLeavesTaken: "Total Leaves Taken",
      totalAvailableLeaves: "Total Available Leaves",
      days: "{days, plural,=0 {{days} Day} one {{days} Day} other {{days} Days}}",
      hours:
        "{hours, plural,=0 {{hours} Hour} one {{hours} Hour} other {{hours} Hours}}",
    },
    columns: {
      date: "Date",
      status: "Status",
      inTime: "In Time",
      outTime: "Out Time",
      totalWorkingHours: "Total working Hours",
      remaningTime: "Remaning Time",
    },
    tooltip: {
      updateWorkingDay: "Click to set working time for {weekname}",
    },
  },
};

export default attendance;
