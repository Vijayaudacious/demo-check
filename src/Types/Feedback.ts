export interface CreateFeedbackPayload {
  name: string;
  feedbackSummary: string;
  ratings: number;
}

export interface FeedbackType {
  _id: string;
  createdBy: CreatedBy;
  feedbackSummary: string;
  employeId: EmployeId;
  ratings: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreatedBy {
  _id: string;
  Employee_ID: string;
  name: string;
  email: string;
}

export interface EmployeId {
  _id: string;
  Employee_ID: string;
  name: string;
  email: string;
}
