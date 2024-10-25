import { BASEURL } from "../const";
import getCurrentTabURL from "../hooks/getCurrentTabURL";
import { TestState } from "../types";

export default async function CERTCheck(): Promise<TestState>{
    const url = await getCurrentTabURL();
    let query_url = url.replace('https://', '').replace('http://', '').replace('www.', '');
    query_url = query_url.substring(0, query_url.indexOf('/'));
    
    const resp = await fetch(`${BASEURL}/cert/url=${query_url}`);
    const json: any = await resp.json();
    console.log(json);
    return TestState.FAIL;
}
