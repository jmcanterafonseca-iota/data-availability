import { Logger } from "tslog";
import { App } from "../utils/app";

import {} from "ipfs-http-client";

import * as dotenv from "dotenv";
import { ResourceResolver } from "./resourceResolver";

async function run() {
    dotenv.config();

    const { LOG_LEVEL, RESOURCE, NODE, TOKEN, IPFS_GATEWAY_URL } = process.env;

    App.logger = new Logger({
        minLevel: parseInt(LOG_LEVEL ?? "2", 10)
    });

    if (!NODE) {
        App.LError("Please provide a node from which resolve resources");
        process.exit(-1);
    }

    if (!RESOURCE) {
        App.LError("Usage: RESOURCE=urn:resource:iota:ebsi:0x12345... index.js");
        process.exit(-1);
    }

    const resolver = new ResourceResolver(NODE, TOKEN, IPFS_GATEWAY_URL);

    const data = await resolver.resolve(RESOURCE);

    App.LDebug(new TextDecoder().decode(data));
}

run()
    .then(() => {
        App.LDebug("Operation Finished ok");
        process.exit(-1);
    })
    .catch(err => {
        App.LError(JSON.stringify(err));
        process.exit(-1);
    });
