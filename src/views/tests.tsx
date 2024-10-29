import React, { useEffect, useState } from "react";
import { COLORS } from "../const";
import * as TestFiles from "../tests";
import { Test, TestState } from "../types";

const statusIcons = {
  [TestState.PASS]: "✔",
  [TestState.FAIL]: "✘",
  [TestState.PENDING]: "⏳",
  [TestState.DISABLED]: "🚫",
  [TestState.UNKNOWN]: "❔",
  [TestState.ERROR]: "⚠️",
};

type TestProps = {
  colorUpdateFunction: (color: string) => void;
};

export default function Tests({ colorUpdateFunction }: TestProps) {
  const testEntries = Object.entries(TestFiles);

  const [tests, setTests] = useState<Test[]>(() =>
    testEntries.map(([name]) => ({ name, status: TestState.UNKNOWN }))
  );

  const [buttonMessage, setButtonMessage] = useState("Run Tests");
  const [testState, setTestState] = useState<TestState>(TestState.UNKNOWN);

  // Function to determine the overall test state
  const checkTests = (tests: Test[]): TestState => {
    if (tests.some((test) => test.status === TestState.PENDING)) {
      return TestState.PENDING;
    }
    // All tests have completed
    if (tests.some((test) => test.status === TestState.FAIL)) {
      return TestState.FAIL;
    } else if (tests.every((test) => test.status === TestState.DISABLED)) {
      return TestState.DISABLED;
    } else if (tests.every((test) => test.status === TestState.UNKNOWN)) {
      return TestState.UNKNOWN;
    } else {
      return TestState.PASS;
    }
  };

  const runTests = async () => {
    if (buttonMessage === "Running...") return;
    setButtonMessage("Running...");
    setTestState(TestState.PENDING);

    // Reset all test statuses to pending
    setTests((prevTests) =>
      prevTests.map((test) => ({ ...test, status: TestState.PENDING }))
    );

    // Run all tests and update statuses
    const promises = testEntries.map(([name, testFunc], index) =>
      Promise.resolve()
        .then(() => testFunc())
        .then(
          (result: TestState) => {
            setTests((prevTests) => {
              const newTests = [...prevTests];
              newTests[index] = {
                ...newTests[index],
                status: result,
              };
              return newTests;
            });
          },
          () => {
            setTests((prevTests) => {
              const newTests = [...prevTests];
              newTests[index] = {
                ...newTests[index],
                status: TestState.ERROR,
              };
              return newTests;
            });
          }
        )
    );

    await Promise.all(promises);

    setButtonMessage("Run Tests");
  };

  // Update the overall test state whenever individual tests change
  useEffect(() => {
    const overallStatus = checkTests(tests);
    setTestState(overallStatus);
  }, [tests]);

  // Update the color based on the overall test state
  useEffect(() => {
    if (testState === TestState.PENDING) {
      colorUpdateFunction(COLORS.yellow);
    } else if (testState === TestState.PASS) {
      colorUpdateFunction(COLORS.jade);
    } else if (testState === TestState.FAIL) {
      colorUpdateFunction(COLORS.red);
    } else {
      colorUpdateFunction(COLORS.default);
    }
  }, [colorUpdateFunction, testState]);

  return (
    <>
      <div className="RunTestsButton" onClick={runTests}>
        {buttonMessage}
      </div>

      <ul className="TestList">
        {tests.map((test, index) => (
          <li
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid #ccc",
              padding: "1rem",
              marginLeft: "1rem",
              marginRight: "1rem",
              fontSize: "1rem",
            }}
          >
            <span>{test.name}</span>
            <span>{statusIcons[test.status]}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
