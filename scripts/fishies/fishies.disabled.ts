// custom types
type RGB = [number, number, number];
type FishUUID = ReturnType<typeof crypto.randomUUID>;
type FishName = string;
type FishPersonality = Array<PersonalityTraits>;

enum PersonalityTraits {
	silly,
	energetic,
	lazy,
}

// personalities will be implemented through keywords which decide what behaviours an individual might perform and at what rate.
// example: a Fish with the "silly" trait may make funny noises more often.

class Utility {
	public static validateRGB(x: unknown): boolean {
		if (!Array.isArray(x) || !x.every((item) => typeof item === "number")) {
			console.error(`${x} is not a valid number array!`);
			return false;
		}

		//length check
		if (x.length !== 3) {
			console.error(`array of numbers ${x} is not 3 long!`);
			return false;
		}

		//range check
		for (const num of x) {
			if (num < 0 || num > 255) {
				console.error(`Invalid value: ${num} must be 0-255`);
				return false;
			}
		}

		return true;
	}

	public static randomArrayMember(array: Array<any>): any {
		const result = array[Math.floor(Math.random() * array.length)];
		return result;
	}

	// Source - https://stackoverflow.com/a/56264925
	// Posted by ILikeFood, modified by community. See post 'Timeline' for change history
	// Retrieved 2026-06-22, License - CC BY-SA 4.0

	public static randEnumValue<T extends object>(enumObj: T): T[keyof T] {
		const enumValues = Object.values(enumObj);
		const index = Math.floor(Math.random() * enumValues.length);

		return enumValues[index];
	}
}

class GameConfig {
	public readonly resetAt: number;
	public readonly tickInterval: number;

	public constructor(resetAt: number, tickInterval: number) {
		this.resetAt = resetAt;
		this.tickInterval = tickInterval;
	}
}

const gameConfig = new GameConfig(1000, 1000);

class LocalStorageManager {
	//todo
}

class SaveManager {
	//state methods
	public getGameState() {}
	public setLocalStorageAsGameState() {}
	public getLocalStorage() {
		//get local storage, then use setLocalStorageAsGameState()
	}

	public setLocalStorage() {
		//get game state and save as local storage
	}
}
const saveManager = new SaveManager(); //since Game is a singleton, we dont need to worry about what Game instance the save manager is associated with

class Game {
	private readonly config: GameConfig;
	private counter: number = 0;
	private timer: ReturnType<typeof setInterval> | undefined = undefined;
	private static instance: Game | null = null;

	private constructor(config: GameConfig) {
		this.config = config;
	}

	public static createGame(gameConfig: GameConfig): Game {
		if (this.instance === null) {
			this.instance = new Game(gameConfig);
		}
		return this.instance;
	}

	// Start the game loop
	public start(): void {
		// if (this.timer !== undefined) return;
		clearInterval(this.timer);
		this.timer = setInterval(() => this.tick(), this.config.tickInterval);
	}

	public stop(): void {
		clearInterval(this.timer);
		this.timer = undefined;
	}

	private tick(): void {
		//some methods that first check if counter is divisible by their respective divisor.
		//note that 0 is divisible by everything.
		//some methods should also have probabilities so everything doesn't happen at once.
		//we reset at a large number.
		//make sure to make these probabilities adjustable to 100% for debugging.
		if (
			this.counter >= this.config.resetAt ||
			this.counter >= Number.MAX_SAFE_INTEGER
		) {
			this.counter = 0;
		} else {
			this.counter++;
		}
	}
}

const game = Game.createGame(gameConfig);

class FishNames {
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

const fishNames = new FishNames(["bob", "melissa", "bartholamew"]);

class Fish {
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

class FishFactory {
	private readonly names: FishNames;

	public constructor(names: FishNames) {
		this.names = names;
	}

	private meanRGB(RGB1: RGB, RGB2: RGB): RGB {
		if (!Utility.validateRGB(RGB1) || !Utility.validateRGB(RGB2)) {
			throw new Error(
				`one of the provided RGB values did not pass the RGB validator! check the log for details.`,
			);
		}

		const result: RGB = [
			(RGB1[0] + RGB2[0]) / 2,
			(RGB1[1] + RGB2[1]) / 2,
			(RGB1[2] + RGB2[2]) / 2,
		];

		if (!Utility.validateRGB(result)) {
			throw new Error(
				`${result} did not pass the RGB validator! check log for details.`,
			);
		} else {
			return result;
		}
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
		const childColor = this.meanRGB(parent1.color, parent2.color);
		const childName = this.names.randomName();
		const childPersonality = parent1.personality; //placeholder
		const childUUID = crypto.randomUUID();

		this.createFish(childUUID, childName, childColor, childPersonality);
	}
}

const fishFactory = new FishFactory(fishNames);

class FishStorage {
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
}

class ActiveStorage extends FishStorage {
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
	[Utility.randEnumValue(PersonalityTraits)],
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

const activeStorage = ActiveStorage.fromFish(redFish, greenFish, blueFish);

class DeepStorage extends FishStorage {
	public static override empty(): DeepStorage {
		return new DeepStorage();
	}

	public static override fromFish(...fishes: Fish[]): DeepStorage {
		return new DeepStorage(fishes.map((fish) => [fish.UUID, fish]));
	}
}

const deepStorage = DeepStorage.empty();

class FishStorageManager {
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

const fishStorageManager = new FishStorageManager(activeStorage, deepStorage);
