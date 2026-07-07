import fishSprite from "../../assets/images/Easy-Fish-SVG.svg?raw";
import { ActiveStorage, Fish } from "./fish.ts";
import { CSSWidth, CSSHeight } from "./types.ts";
import { activeStorage } from "./fish.ts";
import { Utility } from "./utility.ts";

const pondDiv = document.getElementById("pond")!;

const pondWidthAdjustment: number = 100;
const pondHeightAdjustment: number = 100;
const pondWidth: number = pondDiv.clientWidth - pondWidthAdjustment;
const pondHeight: number = pondDiv.clientHeight - pondHeightAdjustment;

function placeSpritesRandomly(activeStorage: ActiveStorage): void {
	const activeStorageLength: number = activeStorage.getLength();
	const fishSize = 100; // known size, since clientWidth/Height are 0 pre-append

	for (let i = 0; i < activeStorageLength; i++) {
		const fishDiv: HTMLDivElement = document.createElement("div");
		fishDiv.classList.add("fishSpriteDiv");
		fishDiv.innerHTML = fishSprite;
		fishDiv.style.position = "absolute";
		fishDiv.style.width = "100px";
		fishDiv.style.height = "100px";

		const randomX = Math.random() * (pondWidth - fishSize);
		const randomY = Math.random() * (pondHeight - fishSize);
		fishDiv.style.left = `${randomX}px`;
		fishDiv.style.top = `${randomY}px`;

		pondDiv.appendChild(fishDiv);
	}
}

export function moveSprite(): void {
	const fishDivCollection: HTMLCollection =
		document.getElementsByClassName("fishSpriteDiv");

	for (let i = 0; i < fishDivCollection.length; i++) {
		const currentFishDiv: HTMLDivElement = fishDivCollection[
			i
		] as HTMLDivElement;

		const randomAdjustmentX: number = Utility.plusOrMinus(
			Utility.randomInRange(1, 50),
		);
		const randomAdjustmentY: number = Utility.plusOrMinus(
			Utility.randomInRange(1, 50),
		);

		let currentLeft: number = parseInt(currentFishDiv.style.left) || 0;
		let currentTop: number = parseInt(currentFishDiv.style.top) || 0;

		let newLeft = currentLeft + randomAdjustmentX;
		let newTop = currentTop + randomAdjustmentY;

		if (newLeft >= pondWidth) newLeft = pondWidth;
		if (newLeft <= 0) newLeft = 0;
		if (newTop >= pondHeight) newTop = pondHeight;
		if (newTop <= 0) newTop = 0;

		currentFishDiv.style.left = `${newLeft}px`;
		currentFishDiv.style.top = `${newTop}px`;
	}
}

placeSpritesRandomly(activeStorage); //places sprites on reload of page

console.info("rendering module loaded");
