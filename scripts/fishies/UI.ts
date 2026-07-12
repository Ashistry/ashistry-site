import { activeStorage, fishFactory, fishStorageManager } from "./fish.js";
import { FishFactory } from "./fish.js";
import { FishUUID } from "./types.ts";
import { Fish } from "./fish.js";
import { placeNewSprite, placeSpritesRandomly } from "./rendering.ts";

const testLogButton: HTMLElement = document.getElementById("logTester")!;
const pondFishButton: HTMLElement = document.getElementById("pondFishButton")!;

export let fishSelected: number = 0;

export function fishSelectedSetZero(): void {
	fishSelected = 0;
}

pondFishButton.addEventListener("click", () => activeStorage.readStorage());

const modal = document.getElementById("myModal")!;

// Get the button that opens the modal
const btn = document.getElementById("myBtn")!;

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0]!;

// When the user clicks on the button, open the modal
btn.onclick = function () {
	modal.style.display = "block";
};

function close(): void {
	modal.style.display = "none";
}

// When the user clicks on <span> (x), close the modal
span.addEventListener("click", () => close());
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
};

function breedFish(): void {
	const selectedFish: Array<HTMLDivElement> = Array.from(
		document.querySelectorAll('[data-selected="true"]'),
	);

	if (selectedFish.length < 2) {
		return;
	}

	const parent1UUID: FishUUID = selectedFish[0]?.dataset.fishUuid as FishUUID;
	const parent2UUID: FishUUID = selectedFish[1]?.dataset.fishUuid as FishUUID;

	const parent1: Fish = fishStorageManager.getFish(parent1UUID);
	const parent2: Fish = fishStorageManager.getFish(parent2UUID);

	placeNewSprite(fishFactory.breedFish(parent1, parent2));
}

const breedFishButton: HTMLElement =
	document.getElementById("breedFishButton")!;
breedFishButton.onclick = function () {
	breedFish();
};

export function select(fishDiv: HTMLDivElement): void {
	if (fishSelected >= 2 && fishDiv.dataset.selected === "false") {
		return;
	}

	switch (fishDiv.dataset.selected) {
		case "false":
			fishDiv.style.border = "3px dashed red";
			fishDiv.style.borderRadius = "100px";
			fishDiv.dataset.selected = "true";
			fishSelected++;
			break;
		default:
			fishDiv.style.border = "0px";
			fishDiv.dataset.selected = "false";
			fishSelected--;
			break;
	}
}

console.info("UI module loaded");
