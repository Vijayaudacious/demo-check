
export interface Role {
  _id: string
  organisationId: string
  createdBy: string
  name: string
  description: string
  isPredefined: boolean
  status: string
  permission: Record<string,any[]>
  createdAt: string
  updatedAt: string
  __v: number
}
