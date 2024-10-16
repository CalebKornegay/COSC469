import React from "react";
import Button from "../components/button";

export default function CookieClicker() {
  const [count, setCount] = React.useState(0);
  return (
    <>
      <h1>Cookie Clicker</h1>
      <h2>{count}</h2>
      <Button text="Click" onClick={() => setCount(count + 1)} />
    </>
  );
}
