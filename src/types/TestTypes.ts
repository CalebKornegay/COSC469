export enum TestState {
    PASS,
    FAIL,
    PENDING,
    DISABLED,
    UNKNOWN,
};

export type Test = {
    name: String;
    status: TestState;
};