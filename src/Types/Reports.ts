export interface CreateReportPayload {
  user_id: string;
  createdBy: string;
  updatedBy: string;
  report_date: string;
  start_time: string;
  end_time: string;
  description: string;
  assigned_by: string;
  project_id: string;
}

export interface Report {
  id: number;
  orgId: string;
  reportDate: string;
  tasks: Task[];
  userId: string;
}

export interface Task {
  reason: string;
  assignedBy: string;
  createdAt: string;
  createdBy: string;
  description: string;
  duration: number;
  endTime: string;
  id: number;
  projectId: number;
  startTime: string;
  status: string;
  updatedAt: string;
  updatedBy: any;
}
