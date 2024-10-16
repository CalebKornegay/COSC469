import getCurrentTabURL from "../hooks/getCurrentTabURL";

export default async function dnsCheck() {
    const url = await getCurrentTabURL();
    let query_url = url.replace('https://', '').replace('http://', '').replace('www.', '');
    query_url = query_url.substring(0, query_url.indexOf('/'));
    
    const resp = await fetch('https://dns.google.com/resolve?name=' + query_url + '&rr_type=ALL')
    const json: any = await resp.json()
    return json?.Status === 0 ? true : false;
}
