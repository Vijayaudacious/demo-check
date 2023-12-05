export interface Leave extends HalfDayLeaves {
  userId: string;
  _id: string;
  createdBy: string;
  requestedBy: string;
  totalCountDay: number;
  status: string;
  description: string;
  reason: string;
  startDate: string;
  endDate: string;
  countForPL: number;
  halfDayLeaves: HalfDayLeaves;
  requestedAt: string
}

export interface HalfDayLeaves {
  startDate: string;
  startDateHalfDayDetails: number;
  endDate: string;
  endDateHalfDayDetails: number;
}
