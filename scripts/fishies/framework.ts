import { Utility } from "./utility";

// Types
export type RGB = [number, number, number];
export type FishUUID = ReturnType<typeof crypto.randomUUID>;
export type FishName = string;
export type FishPersonality = Array<PersonalityTraits>;

export enum PersonalityTraits {
	silly,
	energetic,
	lazy,
}

// Config
export class GameConfig {
	public readonly resetAt: number;
	public readonly tickInterval: number;

	public constructor(resetAt: number, tickInterval: number) {
		this.resetAt = resetAt;
		this.tickInterval = tickInterval;
	}
}

export const gameConfig = new GameConfig(1000, 1000);

// Save Manager
export class SaveManager {
	public getGameState() {
		// TODO
	}

	public setLocalStorageAsGameState() {
		// TODO
	}

	public getLocalStorage() {
		// TODO
	}

	public setLocalStorage() {
		// TODO
	}
}

export const saveManager = new SaveManager();

// Re-export Utility
export { Utility };
