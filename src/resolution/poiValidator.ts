import { IProofOfInclusion } from "../models/IProofOfInclusion";
import { post } from "../utils/utilsHttp";

// Validates both syntactically and semantically the PoI
export class PoIValidator {
    private readonly node: string;
    private readonly token: string;

    private readonly _POI_ENDPOINT = "api/poi/v1/validate";

    constructor(node: string, token: string) {
        this.node = node;
        this.token = token;
    }

    public async validate(poi: IProofOfInclusion): Promise<{ result: boolean }> {
        const result = (await post(`${this.node}${this._POI_ENDPOINT}`, this.token, poi)) as { valid: boolean };

        return { result: result.valid };
    }

    public extractOutput(poi: IProofOfInclusion): { stateMetadata: string } {
        return { stateMetadata: "" };
    }
}
