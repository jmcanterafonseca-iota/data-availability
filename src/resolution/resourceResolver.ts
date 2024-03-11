import { ITrail } from "../models/ITrail";
import { App } from "../utils/app";
import { Sha256 } from "@iota/crypto.js";
import { Converter } from "@iota/util.js";

export class ResourceResolver {
    private readonly node: string;
    private readonly token: string;
    private readonly ipfsGateway: string;

    private readonly _TRAILS_ENDPOINT = "api/ext/v1/trails";

    constructor(node: string, token: string, ipfsGateway: string) {
        this.node = node;
        this.token = token;
        this.ipfsGateway = ipfsGateway;
    }

    public async resolve(resourceID: string): Promise<Uint8Array> {
        const trailID = this.toTrailD(resourceID);

        const { locator, fingerprint } = await this.resolveTrail(trailID);

        const data = await this.resolveLocator(this.ipfsGateway, locator);

        const receivedFingerprint = Converter.bytesToHex(Sha256.sum256(data));
        const locatorFingerprint = fingerprint.substring("ni:///sha-256;".length);

        if (receivedFingerprint !== locatorFingerprint) {
            App.LError("Fingerprints do not match", receivedFingerprint, locatorFingerprint);
            throw new Error("Fingerprints_Do_Not_Match");
        }

        return data;
    }

    private toTrailD(resource: string): string {
        return resource.replace("resource", "trail");
    }

    private async resolveTrail(trailID: string): Promise<{ locator: string; fingerprint: string }> {
        const headers = new Headers();
        if (this.token) {
            headers.set("Authorization", `Bearer ${this.token}`);
        }
        const response = await fetch(`${this.node}/${this._TRAILS_ENDPOINT}/${trailID}`, { headers });

        if (response.status !== 200) {
            App.LError("Unable to resolve trail", trailID, response.status);
            throw new Error("Cannot_Resolve_Resource_Trail");
        }

        const trailData = (await response.json()) as ITrail;
        const record = trailData.trail.record;
        const immutable = trailData.trail.immutable;

        if (immutable.type !== "RESOURCE:1.0") {
            App.LError("Invalid Trail Type", immutable.type);
            throw new Error("Invalid_Trail");
        }

        if (!record.locator) {
            throw new Error("Resource_Locator_Not_Present");
        }

        if (!record.fingerprint) {
            throw new Error("Resource_Fingerprint_Not_Present");
        }

        return { locator: record.locator, fingerprint: record.fingerprint };
    }

    private async resolveLocator(ipfsGateway: string, locator: string): Promise<Uint8Array> {
        App.LDebug("Retrieving content", locator);

        const response = await fetch(locator);

        if (response.status === 200) {
            const buffer = await response.arrayBuffer();

            return new Uint8Array(buffer);
        } else {
            App.LError("Locator not found", response.status);
            throw new Error("Locator_Not_Found");
        }
    }
}
