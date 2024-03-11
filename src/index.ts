import * as dotenv from "dotenv";

import { OffChainStorageService } from "./offChainStorageService";
import { App } from "./utils/app";
import { Logger } from "tslog";
import * as ipns from "ipns";
import * as crypto from "libp2p-crypto";

async function run() {
    dotenv.config();

    const { LOG_LEVEL, IPFS_GATEWAY_URL } = process.env;

    App.logger = new Logger({
        minLevel: parseInt(LOG_LEVEL ?? "2", 10)
    });

    const service = new OffChainStorageService(IPFS_GATEWAY_URL);

    const result = await service.store(JSON.stringify({ hello: "world" }));

    App.LDebug(`Object created at: ${result}`);

    const keyPair = await generateRsaKeypair();

    await createIpnsRecord(keyPair, result);
}

async function generateRsaKeypair() {
    //generating an 2048 bit RSA keypair
    const keypair = await crypto.keys.generateKeyPair("RSA", 2048);

    return keypair;
}

/*
Creating an IPNS record with a lifetime
ipns.create(privateKey, value, sequenceNumber, lifetime, [callback])
privateKey (PrivKey RSA Instance): key to be used for cryptographic operations.
value (string): ipfs path of the object to be published.
sequenceNumber (Number): number representing the current version of the record.
lifetime (string): lifetime of the record (in milliseconds).
callback (function): operation result.
*/
async function createIpnsRecord(keypair, cid) {
    let sequenceNumber = 0;
    let lifetime = 1000000; //1000000 milliseconds

    const entryData = await ipns.create(keypair, cid, sequenceNumber, lifetime);
    //Created new IPNS record
    console.log("\nGenerated new IPNS record\n");
    console.log(entryData);
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
