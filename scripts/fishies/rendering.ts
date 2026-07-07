import fishSprite from "../../assets/images/Easy-Fish-SVG.svg?raw";
import { Fish } from "./fish.ts";
import { CSSWidth, CSSHeight } from "./types.ts";
import { activeStorage } from "./fish.ts";

export const pondDiv = document.getElementById("pond")!;

export const fishDiv: HTMLElement = document.createElement("div");
fishDiv.innerHTML = fishSprite;
fishDiv.style.position = "absolute";
fishDiv.style.width = "100px"; // adjust as needed
fishDiv.style.height = "100px"; // adjust as needed

class FishDiv {
	private static readonly height: CSSHeight = "100px";
	private static readonly width: CSSWidth = "100px";

	public constructor(fishToRender: Fish) {}

	public createAndAdd() {}
}

export function placeSpriteRandomly(): void {
	//tick will call this function
	pondDiv.appendChild(fishDiv);

	const pondWidth = pondDiv.clientWidth;
	const pondHeight = pondDiv.clientHeight;

	const randomX = Math.random() * (pondWidth - fishDiv.clientWidth);
	const randomY = Math.random() * (pondHeight - fishDiv.clientHeight);

	fishDiv.style.left = `${randomX}px`;
	fishDiv.style.top = `${randomY}px`;
}

placeSpriteRandomly();

console.info("rendering module loaded");
