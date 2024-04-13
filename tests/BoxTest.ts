import MixBox from "../src/Widgets/MixBox";
import MixDisplay from "../src/Widgets/MixDisplay";

const display = new MixDisplay();
const box = new MixBox({
    top: "{parent-height} * 0.25",
    left: "{parent-width} * 0.125",
    width: "{parent-width} * 0.75",
    height: "{parent-height} * 0.5",
    foregroundColor: "#ff0000",
    backgroundColor: "#00ff00",
});

const box2 = new MixBox({
    top: 1,
    left: 2,
    width: "{parent-width} - 4",
    height: "{parent-height} - 2",
    foregroundColor: "#0000ff",
    backgroundColor: "#ff00ff",
});

const box3 = new MixBox({
    top: 1,
    left: 2,
    width: "{parent-width} - 4",
    height: "{parent-height} - 2",
    foregroundColor: "#0000ff",
    backgroundColor: "#ff00ff",
});

display.onKeyPress(["q"], () => process.exit(0));

box2.append(box3);
box.append(box2);

display.append(box);
display.render();