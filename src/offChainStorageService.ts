import { create } from "ipfs-http-client";

export class OffChainStorageService {
    private readonly endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    public async store(content: unknown): Promise<string> {
        const client = create({ url: this.endpoint });

        const response = await client.add(JSON.stringify(content));
        return `${response.cid.toString()}`;
    }
}
