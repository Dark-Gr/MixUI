import { execSync } from 'child_process';

export const ESC = "\x1b";
export const CLEAR_SCREEN = `${ESC}[2J`;
export const RESET_CURSOR = `${ESC}[H`;

export function checkTerminalColorSupport() {
    try {
        const result = execSync('tput colors', { encoding: "utf-8" });
        return parseInt(result, 10);
    } catch (e) {
        return 8;
    }
}

export function clearScreenAndResetCursor() {
    console.log(CLEAR_SCREEN + RESET_CURSOR);
}

export function switchToAlternateTerminalBuffer() {
    console.log("\x1b[?1049h");
    // execSync('tput smcup');
}

export function switchToMainTerminalBuffer() {
    console.log("\x1b[?1049l");
    // execSync('tput rmcup');
}

export function hideBlinkCursor() {
    console.log("\x1b[?25l");
}

export function showBlinkCursor() {
    console.log("\x1b[?25h");
}
