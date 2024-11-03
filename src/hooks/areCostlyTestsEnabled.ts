export default function areCostlyTestsEnabled(): boolean {
    return localStorage.getItem('costly_tests') === '1';
}