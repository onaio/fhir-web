import { IGroup } from "@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup";
import { id, identifier, active, unitOfMeasure, materialNumber, isAttractiveItem, availability, condition, appropriateUsage, accountabilityPeriod, photoURL, type, name } from "fhir-group-management/src/constants";


export interface GroupFormFields {
    [id]?: string;
    [identifier]?: string;
    [active]?: boolean;
    [name]?: string;
    [type]?: string;
    [unitOfMeasure]?: IGroup['type'];
    initialObject?: IGroup;
    [materialNumber]?: string;
    [isAttractiveItem]?: string;
    [isAttractiveItem]?: string;
    [availability]?: string;
    [condition]?: string;
    [appropriateUsage]?: string;
    [accountabilityPeriod]?: Number;
    [photoURL]?: File
  }