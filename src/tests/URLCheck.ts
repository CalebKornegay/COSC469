import getCurrentTabURL from "../hooks/getCurrentTabURL";
import GPTQuery from "../hooks/GPTQuery";

export default async function URLCheck() {
    const currenturl = await getCurrentTabURL();

    const response = await GPTQuery("Does this site look like a phishing URL? Answer 'Yes' or 'No' only please: " + currenturl);

    if (response === "No") {
        return true;
    }
    else {
        return false;
    }
}
