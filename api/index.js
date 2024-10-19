const express = require("express");
const fs = require('fs');
const readline = require('readline');
const tls = require('tls');

const port = process.env.PORT || 6969;

const logRequest = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
}

async function get_peer_certificate(url) {
    return new Promise( (resolve, reject) => {
        const socket = tls.connect({host: url, port: 443, rejectUnauthorized: false, servername: 'localhost'}, () => {
            const cert = socket.getPeerCertificate(true);
            const response = {
                CN: cert?.subject?.CN,
                issuer: cert?.issuer,
                issuerInfo: cert?.infoAccess,
                CCC1: {
                    subject: cert?.issuerCertificate?.subject,
                    issuer: cert?.issuerCertificate?.issuer,
                    issuerInfo: cert?.issuerCertificate?.infoAccess
                },
                CCC2: {
                    subject: cert?.issuerCertificate?.issuerCertificate?.subject,
                    issuer: cert?.issuerCertificate?.issuerCertificate?.issuer,
                    issuerInfo: cert?.issuerCertificate?.issuerCertificate?.infoAccess
                },
                CCC3: {
                    subject: cert?.issuerCertificate?.issuerCertificate?.issuerCertificate?.subject,
                    issuerInfo: cert?.issuerCertificate?.issuerCertificate?.issuerCertificate?.infoAccess
                }
            };
            // console.log(JSON.stringify(response));
            resolve(JSON.stringify(response));
        });
        socket.on('error', (error) => {
            reject(JSON.stringify({reason : error}));
        });
    });
}

async function isUrlInFile(filePath, targetUrl) {
    try {
        const fileStream = fs.createReadStream(filePath);

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });

        for await (const line of rl) {
            if (line.trim() === targetUrl.trim()) {
                return 1;
            }
        }

        return 0;
    } catch (err) {
        console.error(`Error reading file: ${err}`);
        return 0;
    }
}

const app = express();
app.use(logRequest);

app.get("/", (req, res) => {
    res.send("Hello From Express");
});

app.get("/check", async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).send({ error: "url parameter is required" });
    }

    const isInFile = await isUrlInFile("ALL-feeds-URLS.lst", url);
	return res.send({isKnown: isInFile});
});

app.get("/cert", async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).send({ error : "url parameter is required" });
    }
    return res.send(await get_peer_certificate(url));
});

app.listen(port, () => {
    console.log(`server started on port ${port}`);
});
