import { activeStorage } from "./fish.js";
import { PersonalityTraits } from "./types.ts";

const testLogButton: HTMLElement = document.getElementById("logTester")!;
const pondFishButton: HTMLElement = document.getElementById("pondFishButton")!;

function testLog(): void {
	console.log("hello");
}

pondFishButton.addEventListener("click", () => activeStorage.readStorage());
testLogButton.addEventListener("click", testLog);

(window as any).PersonalityTraits = PersonalityTraits;

export { testLog };
