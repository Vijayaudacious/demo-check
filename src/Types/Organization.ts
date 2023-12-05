export interface CreateWorkingDay {
  day: string;
  timing: { startTime: string; endTime: string }[];
}
