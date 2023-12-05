import { Employee } from "./Employee";

export interface CreateAttendance extends InOutTime {
  date: string;
  orgId: string;
  status: string;
}

export interface UploadEmployeesSheet {
  serialNumber: number;
  id: string;
  attendance: string[];
  inTime: string[];
  outTime: string[];
  employeeName: string;
  employeecode: string;
  present: string;
  apsent: string;
  totalWork: string;
}

export interface AttendanceMark extends InOutTime {
  empId: string;
  empName: string;
  present: string;
  absent: string;
  halfDay: string;
}

export interface Attendance extends InOutTime {
  _id?: string;
  search?: string | null;
  date?: string | undefined;
  empId?: string;
  orgId?: string;
  status?: string;
  totalTime?: number;
}

export type InOutTime = {
  inTime?: string;
  outTime?: string;
};
export interface MarkEmployee extends Employee {
  attendanceStatus?: string;
  inTime: string;
  outTime: string;
  status: string;
}

export interface GetAttendance extends CreateAttendance {
  empId: string;
  id: number;
  totalTime: number;
}

export interface Holiday {
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  repeat: boolean;
  cycle: string;
  leaveType: string;
}

export interface Occurrence {
  endDate: string | null;
  cycle: string;
  day: any;
  date: number;
  month?: number;
}

export interface GetHoliday extends Holiday {
  occurenece: Occurrence;
  _id: string;
  leaveType: string;
}

export interface TimeSheet extends InOutTime {
  date: string;
  empId: string;
  id: number;
  orgId: string;
  status: string;
  totalTime: number;
}
