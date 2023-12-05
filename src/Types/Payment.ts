import { DefaultFields } from "./generic";

export interface Plan extends DefaultFields {
  accessControl: AccessControl;
  _id: string;
  name: string;
  description?: string;
  amount?: Amount;
  isVisible: boolean;
  productId: string;
  pricingId: string;
  duration: number;
  status: string;
  createdAt: string;
  updatedAt: string;

  /** @deprecated */
  moduleList: any[];
}

export type AccessControlType = Partial<
  Counter & DataVisibility & { application: number }
>;
export interface AccessControl {
  projects: AccessControlType;
  users: AccessControlType;
  leaves: AccessControlType;
  reports: AccessControlType;
  attendance: AccessControlType;
}

export interface Counter {
  count: number;
  deletable: boolean;
  addon: boolean;
}

export interface DataVisibility {
  dataVisibility: DataVisibilityKeys;
}

export interface DataVisibilityKeys {
  prev: number;
  next: number;
}

export interface Amount {
  usd: number;
  inr: any;
  _id: string;
}
