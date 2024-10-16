import getCurrentTabURL from "../hooks/getCurrentTabURL";

export default async function CheckAgainstDatabase() {
  const baseurl = "https://phish.gannaway.co/check/";

  const currenturl = await getCurrentTabURL();

  let httpurl = currenturl.replace("https", "http");

  return false;
}
