import fishSprite from "../../assets/images/Easy-Fish-SVG.svg?raw";
import { ActiveStorage, Fish } from "./fish.ts";
import { CSSWidth, CSSHeight } from "./types.ts";
import { activeStorage } from "./fish.ts";
import { Utility } from "./utility.ts";
import { fishSelected, fishSelectedSetZero, select } from "./UI.ts";

const pondDiv = document.getElementById("pond")!;

const pondWidthAdjustment: number = 100;
const pondHeightAdjustment: number = 100;
const pondWidth: number = pondDiv.clientWidth - pondWidthAdjustment;
const pondHeight: number = pondDiv.clientHeight - pondHeightAdjustment;

const minSpriteAdjustment: number = 0;
const maxSpriteAdjustment: number = 100;

// Tracks each fish's current x/y position, since transform doesn't let us read it back out
const fishPositions = new Map<string, { x: number; y: number }>();

const fishSize = 100;

export function placeSpritesRandomly(activeStorage: ActiveStorage): void {
	const activeStorageContents = activeStorage.readStorage();

	fishSelectedSetZero();
	const spritesOnScreen: NodeList = document.querySelectorAll(".fishSpriteDiv");

	spritesOnScreen.forEach((element: any) => {
		//clear old sprites
		element.remove();
	});

	for (const [uuid, fish] of activeStorageContents) {
		const fishDiv: HTMLDivElement = document.createElement("div");
		fishDiv.classList.add("fishSpriteDiv");
		fishDiv.dataset.fishUuid = uuid;
		fishDiv.innerHTML = fishSprite;
		fishDiv.dataset.selected = "false";
		fishDiv.dataset.name = fish.name;

		const [r, g, b] = fish.color;
		const fishShapes = fishDiv.querySelectorAll("path");
		fishShapes.forEach((shape) => {
			(shape as SVGElement).style.fill = `rgb(${r}, ${g}, ${b})`;
		});

		fishDiv.style.position = "absolute";
		fishDiv.style.width = "100px";
		fishDiv.style.height = "100px";
		fishDiv.onclick = function () {
			select(fishDiv);
		};

		// Smoothly animate any future transform changes over 1s
		fishDiv.style.transition = "transform 1s ease-in-out";

		const randomX = Math.random() * (pondWidth - fishSize);
		const randomY = Math.random() * (pondHeight - fishSize);

		fishPositions.set(uuid, { x: randomX, y: randomY });
		fishDiv.style.transform = `translate(${randomX}px, ${randomY}px)`;

		pondDiv.appendChild(fishDiv);
	}
}

export function placeNewSprite(fish: Fish): void {
	const fishDiv: HTMLDivElement = document.createElement("div");
	fishDiv.classList.add("fishSpriteDiv");
	fishDiv.dataset.fishUuid = fish.UUID;
	fishDiv.innerHTML = fishSprite;
	fishDiv.dataset.selected = "false";
	fishDiv.dataset.name = fish.name;

	const [r, g, b] = fish.color;
	const fishShapes = fishDiv.querySelectorAll("path");
	fishShapes.forEach((shape) => {
		(shape as SVGElement).style.fill = `rgb(${r}, ${g}, ${b})`;
	});

	fishDiv.style.position = "absolute";
	fishDiv.style.width = "100px";
	fishDiv.style.height = "100px";
	fishDiv.onclick = function () {
		select(fishDiv);
	};

	// Smoothly animate any future transform changes over 1s
	fishDiv.style.transition = "transform 1s ease-in-out";

	const randomX = Math.random() * (pondWidth - fishSize);
	const randomY = Math.random() * (pondHeight - fishSize);

	fishPositions.set(fish.UUID, { x: randomX, y: randomY });
	fishDiv.style.transform = `translate(${randomX}px, ${randomY}px)`;

	pondDiv.appendChild(fishDiv);
}

export function moveSprite(): void {
	const fishDivCollection: HTMLCollection = Utility.getFishDivCollection();

	for (let i = 0; i < fishDivCollection.length; i++) {
		const currentFishDiv: HTMLDivElement = fishDivCollection[
			i
		] as HTMLDivElement;

		const uuid = currentFishDiv.dataset.fishUuid!;
		const currentPosition = fishPositions.get(uuid)!;

		const randomAdjustmentX: number = Utility.plusOrMinus(
			Utility.randomInRange(minSpriteAdjustment, maxSpriteAdjustment),
		);
		const randomAdjustmentY: number = Utility.plusOrMinus(
			Utility.randomInRange(minSpriteAdjustment, maxSpriteAdjustment),
		);

		let newX = currentPosition.x + randomAdjustmentX;
		let newY = currentPosition.y + randomAdjustmentY;

		if (newX >= pondWidth) newX = pondWidth;
		if (newX <= 0) newX = 0;
		if (newY >= pondHeight) newY = pondHeight;
		if (newY <= 0) newY = 0;

		fishPositions.set(uuid, { x: newX, y: newY });
		currentFishDiv.style.transform = `translate(${newX}px, ${newY}px)`;
	}
}

placeSpritesRandomly(activeStorage); //places sprites on reload of page

console.info("rendering module loaded");
