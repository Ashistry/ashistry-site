import fishSprite from "../../assets/images/Easy-Fish-SVG.svg?raw";
import { ActiveStorage, Fish } from "./fish.ts";
import { CSSWidth, CSSHeight } from "./types.ts";
import { activeStorage } from "./fish.ts";

const pondDiv = document.getElementById("pond")!;

// class FishDiv {
// 	private static readonly height: CSSHeight = "100px";
// 	private static readonly width: CSSWidth = "100px";

// 	public constructor(fishToRender: Fish) {}

// 	public createAndAdd() {}
// }

//loop for every Fish instance in activeStorage
function placeSpritesRandomly(activeStorage: ActiveStorage): void {
	const pondWidth = pondDiv.clientWidth;
	const pondHeight = pondDiv.clientHeight;

	const activeStorageLength: number = activeStorage.getLength();

	for (let i = 0; i < activeStorageLength; i++) {
		const fishDiv: HTMLDivElement = document.createElement("div");
		fishDiv.classList.add("fishSpriteDiv");
		fishDiv.innerHTML = fishSprite;
		fishDiv.style.position = "absolute";
		fishDiv.style.width = "100px";
		fishDiv.style.height = "100px";

		const randomX = Math.random() * (pondWidth - fishDiv.clientWidth);
		const randomY = Math.random() * (pondHeight - fishDiv.clientHeight);
		fishDiv.style.left = `${randomX}px`;
		fishDiv.style.top = `${randomY}px`;

		pondDiv.appendChild(fishDiv);
	}
}

//loop for every Fish instance in activeStorage
// export function moveSprite(): void {
// 	const pondWidth = pondDiv.clientWidth;
// 	const pondHeight = pondDiv.clientHeight;
// }

placeSpritesRandomly(activeStorage); //places sprites on reload of page

console.info("rendering module loaded");
