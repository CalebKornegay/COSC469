import areCostlyTestsEnabled from "../hooks/areCostlyTestsEnabled";
import getCurrentTabURL from "../hooks/getCurrentTabURL";
import GPTQuery from "../hooks/GPTQuery";
import { TestState } from "../types";

const BrandQuery =
    "The following is the HTML for the footer of a website. Your job is to identify the brand of the website. You may only respond with the brand name itself, or with 'Unknown' if you cannot determine the brand. Footer: ";
const URLQuery =
    "What is the current URL for the following brand. Only respond with the URL itself or with 'Unknown' if you cannot determine the URL. Brand: ";

export default async function FooterCheck(): Promise<TestState> {
    if (!areCostlyTestsEnabled()) {
        return TestState.DISABLED;
    }

    try {
        const footerContent = await new Promise<string | null>((resolve, reject) => {
            chrome.runtime.sendMessage({ action: "getFooter" }, (response) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response.footerContent);
                }
            });
        });

        if (!footerContent) {
            return TestState.INCONCLUSIVE;
        }

        let sanitizedContent = footerContent.replace(/<svg.*?>.*?<\/svg>/g, "");
        sanitizedContent = sanitizedContent.replace(/<path.*?\/>/g, "");

        // Get the brand
        const brandResponse = await GPTQuery(BrandQuery + sanitizedContent);
        console.log("gptBrand: " + brandResponse);

        if (brandResponse.includes("Unknown")) {
            return TestState.INCONCLUSIVE;
        }

        const urlResponse = await GPTQuery(URLQuery + brandResponse)
        console.log("gptUrl: " + urlResponse);
        
        if(urlResponse.includes("Unknown")) {
            return TestState.INCONCLUSIVE;
        }
        
        let currentURL = (await getCurrentTabURL()).replace("https://", "").replace("http://", "").replace("www.", "").split("/")[0].split(".").slice(-2).join(".");
        let possibleURL =  urlResponse.replace("https://", "").replace("http://", "").replace("www.", "").split("/")[0].split(".").slice(-2).join(".");

        console.log("Current URL: " + currentURL);
        console.log("Possible URL: " + possibleURL);
        if(possibleURL !== currentURL) {
            return TestState.FAIL;
        }
        return TestState.PASS;
    } catch (error) {
        console.error(error);
        return TestState.ERROR;
    }
}