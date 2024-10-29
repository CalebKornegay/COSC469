import getCurrentTabURL from "../hooks/getCurrentTabURL";
import GPTQuery from "../hooks/GPTQuery";
import { TestState } from "../types";

export default async function URLCheck(): Promise<TestState> {
    const currenturl = await getCurrentTabURL();

    return await GPTQuery("Does this site look like a phishing URL? Answer 'Yes' or 'No' only please: " + currenturl)
    .then((response) => {
        if (response === "No") {
            return TestState.PASS;
        }
        else if (response === "Yes") {
            return TestState.FAIL;
        }
        else {
            return TestState.UNKNOWN;
        }
    }, (error) => {
        console.error(error);
        return TestState.ERROR;
    });
}
