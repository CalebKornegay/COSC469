import getCurrentTabURL from "../hooks/getCurrentTabURL";
import GPTQuery from "../hooks/GPTQuery";
import { TestState } from "../types";

export default async function URLCheck(): Promise<TestState> {
    const currenturl = await getCurrentTabURL();

    const response = await GPTQuery("Does this site look like a phishing URL? Answer 'Yes' or 'No' only please: " + currenturl);

    if (response === "No") {
        return TestState.PASS;
    }
    else {
        return TestState.FAIL;
    }
}
