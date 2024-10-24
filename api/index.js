const express = require("express");
const fs = require('fs');
const readline = require('readline');
const tls = require('tls');
const { spawn } = require('child_process');

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

app.get("/db", async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).send({ error: "url parameter is required" });
    }

    const isInFile = await isUrlInFile("ALL-feeds-URLS.lst", url);
	return res.send({isKnownPhishingSite: isInFile});
});

app.get("/cert", async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).send({ error : "url parameter is required" });
    }
    try {
        return res.send({ cert: await get_peer_certificate(url)});
    } catch(error) {
        return res.status(400).send( { error: error });
    }
});

app.get("/ml", async (req, res) => {
    let { url } = req.query;
    if (!url) {
        return res.status(400).send({ error: "url parameter is required" });
    }

    //perform input sanitization
    url = await url.replaceAll("\"", "");
    url = await url.replaceAll("'", "");
    url = await url.replaceAll(";", "");
    url = await url.replaceAll(":", "");
    url = await url.replaceAll(" ", "");
    url = await url.replaceAll("&", "");
    url = await url.replaceAll("|", "");
    url = await url.replaceAll(">", "");
    url = await url.replaceAll("<", "");
    url = await url.replaceAll("(", "");
    url = await url.replaceAll(")", "");
    url = await url.replaceAll("{", "");
    url = await url.replaceAll("}", "");
    url = await url.replaceAll("[", "");
    url = await url.replaceAll("]", "");

    //perform ML model call
    const child = spawn('python3', ['feature_extraction.py', url]);

    let childstdout = '';
    let childstderr = '';

    child.stdout.on('data', (data) => {
        childstdout += data;
    });

    child.stderr.on('data', (data) => {
        childstderr += data;
    });

    child.on('close', (code) => {
        if (code === 0) {
            childstdout = childstdout.replace(/\r?\n|\r/g, "");
            return res.send({ isPhishing: childstdout });
        } else {
            return res.status(400).send({ error: childstderr });
        }
    });

});

app.listen(port, () => {
    console.log(`server started on port ${port}`);
});
