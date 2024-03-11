export interface ITrail {
    trail: {
        id: string;
        record: {
            locator: string;
            fingerprint: string;
        };
        immutable: {
            type: string;
        };
    };
    meta: {
        created: string;
        updated: string;
        stateControllerAddress: string;
    };
}
