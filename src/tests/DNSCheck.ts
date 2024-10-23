import getCurrentTabURL from "../hooks/getCurrentTabURL";

export default async function dnsCheck() {
    const url = await getCurrentTabURL();
    let query_url = url.replace('https://', '').replace('http://', '').replace('www.', '');
    query_url = query_url.substring(0, query_url.indexOf('/'));
    
    const resp = await fetch('https://dns.google.com/resolve?name=' + query_url + '&rr_type=A');
    const json: any = await resp.json();

    let ttl: number | undefined = undefined;
    for (let i = 0; i < json?.Answer?.length; ++i) {
        ttl = json?.Answer?.[i]?.TTL;
        if (ttl && ttl > 3000) {
            console.log('ttl: ' + ttl);
            return false;
        }
    }

    for (let i = 0; i < json?.Authority?.length; ++i) {
        ttl = json?.Authority?.[i]?.TTL;
        if (ttl && ttl > 3000) {
            console.log('ttl: ' + ttl);
            return false;
        }
    }

    console.log('A record status: ' + (json?.Status === 0));
    return json?.Status === 0;
}
