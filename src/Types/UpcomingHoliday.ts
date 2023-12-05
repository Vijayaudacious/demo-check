export interface UpcomingHoliday {
  occurenece: Occurenece;
  _id: string;
  description: string;
  title: string;
  startDate: string;
  leaveType: string;
  repeat: boolean;
  requestedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Occurenece {
  endDate: string;
  cycle: string;
  day: number;
  date: number;
  month: number;
}
