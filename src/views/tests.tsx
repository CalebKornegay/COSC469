import React, { useEffect, useState } from "react";
import {colors} from "../const/colors";
import * as TestFiles from "../tests";

const statusIcons = {
    pass: "✔",
    fail: "✘",
    pending: "⏳",
};

type TestState = "pass" | "fail" | "pending";

type Test = {
    name: String;
    status: TestState;
};

type TestProps = {
    colorUpdateFunction: (color: string) => void;
};

export default function Tests({ colorUpdateFunction }: TestProps) {
    const testEntries = Object.entries(TestFiles);

    const [tests, setTests] = useState<Test[]>(() =>
        testEntries.map(([name]) => ({ name, status: "pending" }))
    );

    const [buttonMessage, setButtonMessage] = useState("Run Tests");
    const [testState, setTestState] = useState<TestState | undefined>(undefined);

    const checkTests = (tests: Test[]): boolean => {
        for (let i = 0; i < tests.length; i++) {
            if (tests[i].status === "fail") {
                return false;
            }
        }
        return true;
    };

    const runTests = async () => {
        if (buttonMessage === "Running...") return;
        setButtonMessage("Running...");
        setTestState("pending");
        

        // Reset all test statuses to pending
        setTests((prevTests) =>
        prevTests.map((test) => ({ ...test, status: "pending" }))
        );

        // Run all tests and update statuses
        const promises = testEntries.map(([name, testFunc], index) =>
        Promise.resolve()
            .then(() => testFunc())
            .then(
            (result) => {
                setTests((prevTests) => {
                const newTests = [...prevTests];
                newTests[index] = {
                    ...newTests[index],
                    status: result ? "pass" : "fail",
                };
                return newTests;
                });
            },
            () => {
                setTests((prevTests) => {
                const newTests = [...prevTests];
                newTests[index] = { ...newTests[index], status: "fail" };
                return newTests;
                });
            }
            )
        );

        await Promise.all(promises);

        
        setTests((prevTests) => {
            const allPassed = checkTests(prevTests);
            setTestState(allPassed ? "pass" : "fail");
            return prevTests;
        });
        
        setButtonMessage("Run Tests");
    };

    useEffect(() => {
        // console.log(testState);
        if (testState === "pass") {
        colorUpdateFunction(colors.jade);
        } else if (testState === "fail") {
        colorUpdateFunction(colors.red);
        }
        else if (testState === "pending") {
        colorUpdateFunction(colors.yellow);
        }
        else {
        colorUpdateFunction(colors.default);
        }}, [colorUpdateFunction, testState]);

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
