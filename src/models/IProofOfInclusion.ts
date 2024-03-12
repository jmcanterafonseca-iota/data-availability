export interface IProofOfInclusion {
    milestone: unknown;
    block: {
        payload: {
            type: number;
            outputs: {
                type: number;
                aliasId?: string;
                stateIndex?: number;
                stateMetatadata?: string;
            }[];
        };
    };
}
