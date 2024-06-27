import MixBox from "../src/Widgets/MixBox";
import MixDisplay from "../src/Widgets/MixDisplay";

const display = new MixDisplay();
const box = new MixBox({
    top: "{parent-height} * 0.25",
    left: "{parent-width} * 0.125",
    width: "{parent-width} * 0.75",
    height: "{parent-height} * 0.5",
    style: {
        border: {
            rounded: true,
            foregroundColor: "#3277a8"
        }
    }
});

const box2 = new MixBox({
    top: 1,
    left: 2,
    width: "{parent-width} - 4",
    height: "{parent-height} - 2",
    style: {
        border: {
            labelBreakRounded: false,
            rounded: true,
            foregroundColor: "#db2a5f"
        }
    },
    label: "Hello, World!",
});

const box3 = new MixBox({
    top: "{parent-height} * 0.25",
    left: "{parent-width} * 0.25",
    width: "{parent-width} * 0.5",
    height: "{parent-height} * 0.5",
    style: {
        border: {
            rounded: true,
            foregroundColor: "#2adb59",
        },
        backgroundColor: "#2adbb5"
    }
});

display.onKeyPress(["q"], () => process.exit(0));

box2.append(box3);
box.append(box2);

display.append(box);
display.render();