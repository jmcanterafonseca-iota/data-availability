import { IProofOfInclusion } from "../models/IProofOfInclusion";

// Validates both syntactically and semantically the PoI
export class PoIValidator {
    private readonly node: string;
    private readonly token: string;

    private readonly _TRAILS_ENDPOINT = "api/poi/v1/validate";


    constructor(node: string, token: string) {
        this.node = node;
        this.token = token;
    }

    public async validate(poi: IProofOfInclusion): Promise<{ result: boolean }> {

    }

    public async extractOutput(poi: IProofOfInclusion): { stateMetadata: string; } {

    }
}
