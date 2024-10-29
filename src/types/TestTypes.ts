export enum TestState {
    PASS,
    FAIL,
    PENDING,
    DISABLED,
    UNKNOWN,
    ERROR
};

export type Test = {
    name: String;
    status: TestState;
};