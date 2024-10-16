import getCurrentTabURL from "../hooks/getCurrentTabURL";
import GPTQuery from "../hooks/GPTQuery";

export default async function URLCheck() {
    const currenturl = await getCurrentTabURL();

    console.log("Does this site look like a phishing URL? Answer 'yes' or 'no' only please: " + currenturl);

    GPTQuery("Does this site look like a phishing URL? Answer 'Yes' or 'No' only please: " + currenturl)
        .then(response => {
            console.log("ChatGPT Response:", response);  // The response will be a string with ChatGPT's answer
            if(response == "Yes") {
                return true;
            }
            else {
                return false;
            };
        })
        .catch(error => {
            console.error("Error:", error);
    });

  return false;
}
