export enum TestState {
    PASS = "PASS",
    FAIL = "FAIL",
    PENDING = "PENDING",
    DISABLED = "DISABLED",
    UNKNOWN = "UNKNOWN",
    ERROR = "ERROR",
};

export type Test = {
    name: String;
    status: TestState;
};