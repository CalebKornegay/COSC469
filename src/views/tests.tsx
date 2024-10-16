import React from "react";
import { useState } from "react";
import * as TestFiles from "../tests";

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
    const testEntries = Object.entries(TestFiles);

    const [tests, setTests] = useState<Test[]>(() =>
        testEntries.map(([name]) => ({ name, status: "pending" }))
    );

    const [buttonMessage, setButtonMessage] = useState("Run Tests");

    const runTests = async () => {
        if (buttonMessage === "Running...") return;
        setButtonMessage("Running...");

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

        setButtonMessage("Run Tests");
    };

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
                padding: "1rem 0",
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
