export declare const updateResponse: {
    ok: boolean;
    redirected: boolean;
    status: number;
    statusText: string;
    type: string;
    url: string;
};
export declare const plansListResponse: {
    identifier: string;
    version: string;
    name: string;
    title: string;
    status: string;
    date: string;
    effectivePeriod: {
        start: string;
        end: string;
    };
    useContext: {
        code: string;
        valueCodableConcept: string;
    }[];
    jurisdiction: {
        code: string;
    }[];
    serverVersion: number;
    goal: {
        id: string;
        description: string;
        priority: string;
        target: {
            measure: string;
            detail: {
                detailQuantity: {
                    value: number;
                    comparator: string;
                    unit: string;
                };
            };
            due: string;
        }[];
    }[];
    action: {
        identifier: string;
        prefix: number;
        title: string;
        description: string;
        code: string;
        timingPeriod: {
            start: string;
            end: string;
        };
        reason: string;
        goalId: string;
        subjectCodableConcept: {
            text: string;
        };
        taskTemplate: string;
    }[];
}[];
export declare const createPlan: {
    identifier: string;
    name: string;
    title: string;
    status: string;
    date: string;
    effectivePeriod: {
        start: string;
        end: string;
    };
    useContext: {
        code: string;
        valueCodableConcept: string;
    }[];
    jurisdiction: {
        code: string;
    }[];
    goal: never[];
    action: never[];
};
