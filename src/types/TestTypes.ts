export enum TestState {
    PASS = "PASS",
    FAIL = "FAIL",
    PENDING = "PENDING",
    DISABLED = "DISABLED",
    UNKNOWN = "UNKNOWN",
    ERROR = "ERROR",
    INCONCLUSIVE = "INCONCLUSIVE",
};

export type Test = {
    name: String;
    status: TestState;
};

export type TestHistory = {
    url: String;
    timestamp: String;
    results: Test[];
};