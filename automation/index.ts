const fs = require('fs');
const OpenAI = require('openai');
const readline = require('readline');

const api_key: string = "API_KEY"; // Could use ENV variable here if we want
const BASEURL: string = "https://phish.gannaway.co";
const BrandQuery: string =
    "The following is the HTML for the footer of a website. Your job is to identify the brand of the website. You may only respond with the brand name itself, or with 'Unknown' if you cannot determine the brand. Footer: ";
const URLQuery: string =
    "What is the current URL for the following brand. Only respond with the URL itself or with 'Unknown' if you cannot determine the URL. Brand: ";
const DatabaseFile: string = "./db.txt"; // Doesn't exist

const tests: string[] = ["cert", "db", "dns", "footer", "ml", "url"];

type test_result = {
    website: string,
    cert?: boolean,
    db?: boolean,
    dns?: boolean,
    footer?: boolean,
    ml?: boolean,
    url?: boolean
};

async function GPTQuery(query: string) : Promise<string> {
    const openai = new OpenAI({
        apiKey: api_key ?? undefined,
        dangerouslyAllowBrowser: true,
    });

    return new Promise( (resolve, reject) => {
        openai.chat.completions.create({
            messages: [{ role: "system", content: query }],
            model: "gpt-4o",
        }).then(((resp: any) => {
            resolve(resp?.choices?.[0]?.message?.content ?? "");
        })).catch(((_: any) => {
            reject("An error occured while querying OpenAI. Is your key valid?");
        }));
    });
}

async function CERTCheck(url: string): Promise<string> {
    try{
        let query_url = url.replace('https://', '').replace('http://', '').replace('www.', '');
        let place = query_url.indexOf('/');
        query_url = query_url.substring(0, place < 0 ? query_url.length : place);
        
        const resp = await fetch(`${BASEURL}/cert/?url=${query_url}`);
        const json: any = await resp.json();
        return json.trusted ? "pass" : "fail";
    } catch (error) {
        console.log(error);
        return "disabled";
    }
}

async function CheckAgainstDatabase(url: string): Promise<string> {
    try {
        let httpurl = url.replace("https://", "http://");

        const response = await fetch(`${BASEURL}/db/?url=${httpurl}`);
        const data = await response.json();

        if (data["error"]) return "disabled";
        if (data["isKnownPhishingSite"] === 0) return "pass";
        return "fail";
    } catch (error) {
        console.error("Error:", error);
        return "disabled";
    }
}

async function dnsCheck(url: string): Promise<string> {
    try {
        let query_url = url.replace('https://', '').replace('http://', '').replace('www.', '');
        let place = query_url.indexOf('/');
        query_url = query_url.substring(0, place < 0 ? query_url.length : place);
        
        const resp = await fetch('https://dns.google.com/resolve?name=' + query_url + '&rr_type=A');
        const json: any = await resp.json();

        let ttl: number | undefined = undefined;
        for (let i = 0; i < json?.Answer?.length; ++i) {
            ttl = json?.Answer?.[i]?.TTL;
            if (ttl && ttl > 3600) {
                console.log('ttl: ' + ttl);
                return "fail";
            }
        }

        for (let i = 0; i < json?.Authority?.length; ++i) {
            ttl = json?.Authority?.[i]?.TTL;
            if (ttl && ttl > 3600) {
                console.log('ttl: ' + ttl);
                return "fail";
            }
        }

        console.log('A record status: ' + (json?.Status === 0));
        return json?.Status === 0 ? "pass" : "fail";
    } catch (error) {
        console.log(error);
        return "disabled";
    }
}

async function FooterCheck(url: string): Promise<string> {
    try {
        const footerContent = await fetch(url)
        .then(resp => {
            return document.querySelector("footer")?.outerHTML;
        });

        if (!footerContent) {
            return "disabled";
        }

        let sanitizedContent = footerContent.replace(/<svg.*?>.*?<\/svg>/g, "");
        sanitizedContent = sanitizedContent.replace(/<path.*?\/>/g, "");

        // Get the brand
        const brandResponse = await GPTQuery(BrandQuery + sanitizedContent);
        console.log("gptBrand: " + brandResponse);

        if (brandResponse.includes("Unknown")) {
            return "disabled";
        }

        const urlResponse = await GPTQuery(URLQuery + brandResponse)
        console.log("gptUrl: " + urlResponse);
        
        if(urlResponse.includes("Unknown")) {
            return "disabled";
        }
        
        let currentURL = url.replace("https://", "").replace("http://", "").replace("www.", "").split("/")[0].split(".").slice(-2).join(".");
        let possibleURL =  urlResponse.replace("https://", "").replace("http://", "").replace("www.", "").split("/")[0].split(".").slice(-2).join(".");

        console.log("Current URL: " + currentURL);
        console.log("Possible URL: " + possibleURL);
        if(possibleURL !== currentURL) {
            return "fail";
        }
        return "pass";
    } catch (error) {
        console.error(error);
        return "disabled";
    }
}

async function MLCheck(url: string): Promise<string> {
    try{
        const response = await fetch(`${BASEURL}/ml/?url=${url}`);
        const data = await response.json();
        console.log(data['isPhishing'])
        if (data["error"]) return "disabled";
        if (data["isPhishing"] >= 0.60) return "fail";
        return "pass";
    } catch (error) {
        console.log(error);
        return "disabled";
    }
}

async function URLCheck(url: string): Promise<string> {
    return await GPTQuery("Does this site look like a phishing URL? Answer 'Yes' or 'No' only please: " + url)
    .then((response) => {
        if (response === "No") {
            return "pass";
        }
        else if (response === "Yes") {
            return "fail";
        }
        else {
            return "disabled";
        }
    }, (error) => {
        console.error(error);
        return "disabled";
    });
}

const fileStream = fs.createReadStream(DatabaseFile);

const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
});

for await (const line of rl) {
    const website: string = line.trim();
    const results: string[] = await Promise.all([ CERTCheck(website), CheckAgainstDatabase(website), dnsCheck(website), FooterCheck(website), MLCheck(website), URLCheck(website)]);
    let json: test_result = {website: website};
    results.forEach((result, index) => {
        json[tests[index]] = result === "fail" ? false : true;
    })
    console.log(json);
}

export {};
