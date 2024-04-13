import { execSync } from 'child_process';

export const ESC = "\x1b";

const CLEAR_SCREEN = `${ESC}[2J`;
const RESET_CURSOR = `${ESC}[H`;
const HIDE_CURSOR = `${ESC}[?25l`;
const SHOW_CURSOR = `${ESC}[?25h`;
const ALTERNATE_BUFFER = `${ESC}[?1049h`;
const MAIN_BUFFER = `${ESC}[?1049l`;

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
    console.log(ALTERNATE_BUFFER);
    // execSync('tput smcup');
}

export function switchToMainTerminalBuffer() {
    console.log(MAIN_BUFFER);
    // execSync('tput rmcup');
}

export function hideBlinkCursor() {
    console.log(HIDE_CURSOR);
}

export function showBlinkCursor() {
    console.log(SHOW_CURSOR);
}
