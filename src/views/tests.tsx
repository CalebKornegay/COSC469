import React from "react";
import { useState } from "react";

const statusIcons = {
  pass: "✔",
  fail: "✘",
  pending: "⏳",
};

type Test = {
  name: String;
  status: "pass" | "fail" | "pending";
};

export default function Tests() {
  const [tests, setTests] = useState<Test[]>([
    { name: "Test 1", status: "pass" },
    { name: "Test 2", status: "fail" },
    { name: "Test 3", status: "pending" },
  ]);
  return (
    <ul className="TestList">
      {tests.map((test, index) => (
        <li
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #ccc",
            padding: "1rem 0",
          }}
        >
          <span>{test.name}</span>
          <span>{statusIcons[test.status]}</span>
        </li>
      ))}
    </ul>
  );
}
