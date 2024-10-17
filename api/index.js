const express = require("express");
const fs = require('fs');
const readline = require('readline');

const port = process.env.PORT || 6969;

const logRequest = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
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

app.listen(port, () => {
    console.log(`server started on port ${port}`);
});
