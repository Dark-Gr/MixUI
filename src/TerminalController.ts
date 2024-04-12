import { execSync } from 'child_process';

export function checkTerminalColorSupport() {
    try {
        const result = execSync('tput colors', { encoding: "utf-8" });
        return parseInt(result, 10);
    } catch (e) {
        return 8;
    }
}

export function switchToAlternateTerminalBuffer() {
    console.log("\x1b[?1049h");
    // execSync('tput smcup');
}

export function switchToMainTerminalBuffer() {
    console.log("\x1b[?1049l");
    // execSync('tput rmcup');
}