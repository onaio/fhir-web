import { Rule } from "antd/es/form";
import { GroupFormFields, ValidationRulesFactory } from "./types";
import { TFunction } from "@opensrp/i18n";
import { id, identifier, active, unitOfMeasure, name, type, materialNumber, isAttractiveItem, availability, condition, appropriateUsage, accountabilityPeriod, photoURL } from "../../constants";
import { TypeOfGroup, UnitOfMeasure } from "../CommodityAddEdit/utils";

/** extract file from an input event */
export const normalizeFileInputEvent = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    const fileList = e?.fileList
    return fileList[0]
  };

  /** factory to create default validation rules */
export function defaultValidationRulesFactory(t: TFunction) {
    return {

        [id]: [{ type: 'string' }] as Rule[],
        [identifier]: [{ type: 'string' }] as Rule[],
        [name]: [
            { type: 'string', message: t('Must be a valid string') },
        ] as Rule[],
        [active]: [{ type: 'boolean' },] as Rule[],
        [type]: [{ type: 'enum', enum: Object.values(TypeOfGroup) }] as Rule[],
        [unitOfMeasure]: [{ type: 'enum', enum: Object.values(UnitOfMeasure)}] as Rule[],
        [materialNumber]: [{ type: 'string' }] as Rule[],
        [isAttractiveItem]: [{ type: 'boolean' }] as Rule[],
        [availability]: [{ type: 'string' }] as Rule[],
        [condition]: [{ type: 'string' }] as Rule[],
        [appropriateUsage]: [{ type: 'string' }] as Rule[],
        [accountabilityPeriod]: [{ type: 'number' }] as Rule[],
        [photoURL]: [{type: "object"}] as Rule[]
    }
}