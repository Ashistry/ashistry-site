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

const minSpriteAdjustment: number = 1;
const maxSpriteAdjustment: number = 25;

function placeSpritesRandomly(activeStorage: ActiveStorage): void {
	const activeStorageContents = activeStorage.readStorage();
	const activeStorageLength: number = activeStorage.getLength();
	const fishSize = 100;

	for (let [FishUUID, Fish] of activeStorageContents) {
		const fishDiv: HTMLDivElement = document.createElement("div");
		fishDiv.classList.add("fishSpriteDiv");
		fishDiv.innerHTML = fishSprite;

		const [r, g, b] = Fish.color;
		const fishShapes = fishDiv.querySelectorAll("path");

		fishShapes.forEach((shape) => {
			(shape as SVGElement).style.fill = `rgb(${r}, ${g}, ${b})`;
		});

		fishDiv.style.position = "absolute";
		fishDiv.style.width = "100px";
		fishDiv.style.height = "100px";

		const randomX = Math.random() * (pondWidth - fishSize); //prevent clipping
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
			Utility.randomInRange(minSpriteAdjustment, maxSpriteAdjustment),
		);
		const randomAdjustmentY: number = Utility.plusOrMinus(
			Utility.randomInRange(minSpriteAdjustment, maxSpriteAdjustment),
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
