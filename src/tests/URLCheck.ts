import getCurrentTabURL from "../hooks/getCurrentTabURL";

export default async function URLCheck() {
  const api_key = localStorage.getItem("api_key");
  console.log(api_key);
  let currenturl = await getCurrentTabURL();
  console.log(currenturl);
  return false;
}
