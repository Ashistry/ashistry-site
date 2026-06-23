import {
	FishUUID,
	FishName,
	RGB,
	FishPersonality,
	PersonalityTraits,
	gameConfig,
} from "./framework";
import { Utility } from "./utility";

// Fish
export class Fish {
	public readonly UUID: FishUUID;
	public readonly name: FishName;
	public readonly color: RGB;
	public readonly personality: FishPersonality;

	public constructor(
		UUID: FishUUID,
		name: FishName,
		color: RGB,
		personality: FishPersonality,
	) {
		this.UUID = UUID;
		this.name = name;
		this.color = color;
		this.personality = personality;
	}
}

// Fish Names
export class FishNames {
	private fishNamesArray: Array<string>;

	public constructor(namesToSet: Array<string>) {
		this.fishNamesArray = namesToSet;
	}

	public randomName(maxRetries: number = 3): FishName {
		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			const result = Utility.randomArrayMember(this.fishNamesArray);
			if (typeof result === "string") {
				return result as FishName;
			}
		}
		throw new Error("Failed to get random name after retries");
	}
}

export const fishNames = new FishNames(["bob", "melissa", "bartholamew"]);

// Fish Factory
export class FishFactory {
	public static createFish(): Fish {
		return new Fish(
			crypto.randomUUID(),
			fishNames.randomName(),
			[
				Math.floor(Math.random() * 256),
				Math.floor(Math.random() * 256),
				Math.floor(Math.random() * 256),
			],
			[Utility.randEnumValue(PersonalityTraits)],
		);
	}

	public static breedFish(parent1: Fish, parent2: Fish): Fish {
		const meanRGB: RGB = [
			Math.round((parent1.color[0] + parent2.color[0]) / 2),
			Math.round((parent1.color[1] + parent2.color[1]) / 2),
			Math.round((parent1.color[2] + parent2.color[2]) / 2),
		];

		return new Fish(crypto.randomUUID(), fishNames.randomName(), meanRGB, [
			Utility.randEnumValue(PersonalityTraits),
		]);
	}
}

// Fish Storage
export class FishStorage {
	protected storage: Map<FishUUID, Fish> = new Map();

	public getFish(UUID: FishUUID): Fish | undefined {
		return this.storage.get(UUID);
	}

	public addFish(fish: Fish): void {
		this.storage.set(fish.UUID, fish);
	}

	public removeFish(UUID: FishUUID): void {
		this.storage.delete(UUID);
	}
}

export class ActiveStorage extends FishStorage {}

export class DeepStorage extends FishStorage {}

// Fish Storage Manager
export class FishStorageManager {
	private activeStorage: ActiveStorage;
	private deepStorage: DeepStorage;

	public constructor(activeStorage: ActiveStorage, deepStorage: DeepStorage) {
		this.activeStorage = activeStorage;
		this.deepStorage = deepStorage;
	}

	public getFish(UUID: FishUUID): Fish | undefined {
		return this.activeStorage.getFish(UUID) || this.deepStorage.getFish(UUID);
	}

	public deleteFish(UUID: FishUUID): void {
		this.activeStorage.removeFish(UUID);
		this.deepStorage.removeFish(UUID);
	}

	public moveFish(UUID: FishUUID): void {
		const fish = this.activeStorage.getFish(UUID);
		if (fish) {
			this.activeStorage.removeFish(UUID);
			this.deepStorage.addFish(fish);
		} else {
			const deepFish = this.deepStorage.getFish(UUID);
			if (deepFish) {
				this.deepStorage.removeFish(UUID);
				this.activeStorage.addFish(deepFish);
			}
		}
	}
}

// Game
export class Game {
	private static instance: Game;
	private config: typeof gameConfig;
	private counter: number = 0;
	private intervalId: number | null = null;

	private constructor() {
		this.config = gameConfig;
	}

	public static getInstance(): Game {
		if (!Game.instance) {
			Game.instance = new Game();
		}
		return Game.instance;
	}

	public start(): void {
		this.intervalId = window.setInterval(
			() => this.tick(),
			this.config.tickInterval,
		);
	}

	public stop(): void {
		if (this.intervalId !== null) {
			window.clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	public tick(): void {
		this.counter++;
		if (this.counter >= this.config.resetAt) {
			this.counter = 0;
		}
	}
}

export const game = Game.getInstance();
