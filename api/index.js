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

async function check_certificate_authority(cert) {
    // console.log(cert.CN);
    try {
        const fileStream = fs.createReadStream('certs.txt');

        const rl = readline.createInterface({
            input: fileStream,
            // crlfDelay: Infinity,
        });

        let sub_root, root, root_comp;
        if (cert.CCC2 !== undefined) {
            sub_root = cert.CCC2?.subject?.CN;
            root = cert.CCC2?.issuer?.CN;
            root_comp = cert.CCC2?.issuer?.O;
        }

        for await (let line of rl) {
            line = line.trim().split('___');
            if (line.includes(sub_root) || line.includes(root) || line.includes(root_comp)) {
                return true;
            }
        }

        return false;
    } catch (err) {
        console.error(`Error reading file: ${err}`);
        return true;
    }
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
            // resolve(JSON.stringify(response));
            resolve(response);
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
        const cert = await get_peer_certificate(url);
        return res.send({ trusted: await check_certificate_authority(cert) });
    } catch(error) {
        return res.status(400).send( { error: error });
    }
});

app.get("/ml", async (req, res) => {
    let { url } = req.query;
    if (!url) {
        return res.status(400).send({ error: "url parameter is required" });
    }    

    const child = spawn('python3', ['../python/checkurl.py', url], {
        shell: false,
    });

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
