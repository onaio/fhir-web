import type { IGroup } from "@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup";
import { id, identifier, active, unitOfMeasure, materialNumber, isAttractiveItem, availability, condition, appropriateUsage, accountabilityPeriod, photoURL, type, name } from "../../constants";
import type { TFunction } from "@opensrp/i18n";

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


  export type ValidationRulesFactory = (t: TFunction) => {[key in keyof GroupFormFields]: Rule[]}
