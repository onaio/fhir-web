/** interface that describes plan definition objects from OpenSRP */
export interface PlanDefinition {
  action?: [];
  date: string;
  effectivePeriod?: {
    end: string;
    start: string;
  };
  experimental?: Readonly<false>;
  goal?: [];
  identifier: string;
  jurisdiction: Array<{
    code: string;
  }>;
  name: string;
  serverVersion?: number;
  status: string;
  title: string;
  useContext?: [];
  version: string;
}

export interface AssignLocationsAndPlans {
  fromDate: string;
  jurisdiction: string;
  organization: string;
  plan: string;
  toDate: string | null;
}
