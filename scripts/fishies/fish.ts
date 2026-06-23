import {
	type RGB,
	type FishUUID,
	type FishName,
	type FishPersonality,
	PersonalityTraits,
} from "./types.js";
import { Utility } from "./utility.js";

export class FishNames {
	private fishNamesArray: Array<string>;

	public constructor(namesToSet: Array<string>) {
		this.fishNamesArray = namesToSet;
	}

	public randomName(maxRetries: number = 3): FishName {
		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			const result = Utility.randomArrayMember(this.fishNamesArray);
			if (result && typeof result === "string") {
				return result as FishName;
			}
			if (attempt === maxRetries) {
				throw new Error(
					`Failed to get a valid fish name after ${maxRetries} attempts.`,
				);
			}
		}
		// TypeScript requires a return here, but this is unreachable
		throw new Error("Unreachable");
	}
}

export const fishNames = new FishNames(["bob", "melissa", "bartholamew"]);

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

export class FishFactory {
	private readonly names: FishNames;

	public constructor(names: FishNames) {
		this.names = names;
	}

	public createFish(
		UUID: FishUUID,
		name: FishName,
		color: RGB,
		personality: FishPersonality,
	): Fish {
		return new Fish(UUID, name, color, personality);
		//add to a storage or do whatever
	}

	public breedFish(parent1: Fish, parent2: Fish): void {
		const childColor = Utility.meanRGB(parent1.color, parent2.color);
		const childName = this.names.randomName();
		const childPersonality = parent1.personality; //placeholder
		const childUUID = crypto.randomUUID();

		this.createFish(childUUID, childName, childColor, childPersonality);
	}
}

export const fishFactory = new FishFactory(fishNames);

export class FishStorage {
	private map: Map<FishUUID, Fish>;

	protected constructor(defaults: Array<[FishUUID, Fish]> = []) {
		this.map = new Map(defaults);
	}

	protected static empty(): FishStorage {
		return new FishStorage();
	}

	protected static fromFish(...fishes: Fish[]): FishStorage {
		return new FishStorage(fishes.map((fish) => [fish.UUID, fish]));
	}

	public getFish(UUID: FishUUID): Fish | undefined {
		return this.map.get(UUID); //TODO: handle undefined
	}

	public addFish(fish: Fish) {
		this.map.set(fish.UUID, fish);
	}

	public removeFish(UUID: FishUUID): void {
		this.map.delete(UUID);
	}

	public readStorage(): void {
		for (const [key, value] of this.map.entries()) {
			console.log(`Key: ${key}, Value: ${JSON.stringify(value)}`);
		}
	}
}

export class ActiveStorage extends FishStorage {
	public static override empty(): ActiveStorage {
		return new ActiveStorage();
	}

	public static override fromFish(...fishes: Fish[]): ActiveStorage {
		return new ActiveStorage(fishes.map((fish) => [fish.UUID, fish]));
	}
}

const redFish: Fish = fishFactory.createFish(
	crypto.randomUUID(),
	"redditor",
	[255, 0, 0],
	[Utility.randEnumValue(PersonalityTraits) as PersonalityTraits],
);

const greenFish: Fish = fishFactory.createFish(
	crypto.randomUUID(),
	"greenhorn",
	[0, 255, 0],
	[Utility.randEnumValue(PersonalityTraits)],
);

const blueFish: Fish = fishFactory.createFish(
	crypto.randomUUID(),
	"bluegill",
	[0, 0, 255],
	[Utility.randEnumValue(PersonalityTraits)],
);

export const activeStorage = ActiveStorage.fromFish(
	redFish,
	greenFish,
	blueFish,
);

export class DeepStorage extends FishStorage {
	public static override empty(): DeepStorage {
		return new DeepStorage();
	}

	public static override fromFish(...fishes: Fish[]): DeepStorage {
		return new DeepStorage(fishes.map((fish) => [fish.UUID, fish]));
	}
}

export const deepStorage = DeepStorage.empty();

export class FishStorageManager {
	activeStorageManaged: ActiveStorage;
	deepStorageManaged: DeepStorage;

	constructor(
		activeStorageManaged: ActiveStorage,
		deepStorageManaged: DeepStorage,
	) {
		this.activeStorageManaged = activeStorageManaged;
		this.deepStorageManaged = deepStorageManaged;
	}

	public getFish(UUID: FishUUID): Fish {
		const fish = this.activeStorageManaged.getFish(UUID);
		if (fish) {
			return fish;
		}

		const deepFish = this.deepStorageManaged.getFish(UUID);
		if (deepFish) {
			return deepFish;
		}

		throw new Error(`Fish with UUID ${UUID} not found`);
	}

	private getFishStorage(UUID: FishUUID): FishStorage {
		const fish = this.activeStorageManaged.getFish(UUID);
		if (fish) {
			return this.activeStorageManaged;
		}

		const deepFish = this.deepStorageManaged.getFish(UUID);
		if (deepFish) {
			return this.deepStorageManaged;
		}

		throw new Error(`Fish with UUID ${UUID} not found in any storage`); //TODO: this should not throw. we should handle this properly at some point.
	}

	public deleteFish(UUID: FishUUID): void {
		const fishToRemoveLocation: FishStorage = this.getFishStorage(UUID);

		fishToRemoveLocation.removeFish(UUID);
	}

	public moveFish(UUID: FishUUID): void {
		const fishToMove: Fish = this.getFish(UUID);
		const fishToMoveOrigin: FishStorage = this.getFishStorage(fishToMove.UUID);

		let destination: FishStorage;
		if (fishToMoveOrigin === this.activeStorageManaged) {
			destination = this.deepStorageManaged;
		} else {
			destination = this.activeStorageManaged;
		}
		destination.addFish(fishToMove);
		fishToMoveOrigin.removeFish(fishToMove.UUID);
	}
}

export const fishStorageManager = new FishStorageManager(
	activeStorage,
	deepStorage,
);

console.info("fish loaded");
