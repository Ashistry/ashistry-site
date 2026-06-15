// fish breeding will be active.
// fish will have genetics-determined personalities with tomodachi style adlibs.

//fish have an internal id and a NAME that players can give it. the name is random at first from a selected list. id takes the first empty slot or counts up one. a fish being removed should free up it's id for a new fish, not moving remaining

// custom types
type RGB = [number, number, number];
type FishId = number;
type FishName = string;

// GAME FRAMEWORK
class Main {
	//stay global

	private static counter: number = 0;
	private static timer: ReturnType<typeof setInterval>;

	private static tick(): void {
		//some methods that first check if counter is divisible by their respective divisor.
		//note that 0 is divisible by everything.
		//some methods should also have probabilities so everything doesn't happen at once.
		//we reset at a large number.
		//make sure to make these probabilities adjustable to 100% for debugging.
		++Main.counter;
	}

	// Start the game loop
	public static start(): void {
		clearInterval(Main.timer);
		Main.timer = setInterval(() => Main.tick(), gameConfig.tickInterval);
	}

	public static stop(): void {
		clearInterval(Main.timer);
	}
}

// class DeveloperMode {
// 	//stay global
// 	private static readonly probabilityModifier: number = 1; //unimplemented
// 	private static readonly devMode: boolean = true; //unimplemented

// 	public static writeGameState() {
// 		if (DeveloperMode.devMode != true) {
// 			console.log("nice try");
// 		} else {
// 			//do the thing
// 		}
// 	} // unimplemented
// }

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

class GameConfig {
	public readonly resetAt: number;
	public readonly tickInterval: number;

	public constructor(resetAt: number, tickInterval: number) {
		this.resetAt = resetAt;
		this.tickInterval = tickInterval;
	}
}

class PlayerConfig {}

//framework instances
const gameConfig = new GameConfig(1000, 1000);
const saveManager = new SaveManager();

// FISH

class FishNames {
	public namesToSet: Array<string>;

	public constructor(namesToSet: Array<string>) {
		this.namesToSet = namesToSet;
		this.fishNamesArray = namesToSet;
	}

	private fishNamesArray: Array<string>;

	public randomName(): string {
		const result = Utility.randomArrayMember(this.fishNamesArray);
		if (typeof result !== "string") {
			throw new Error(`${result} is not a string!`);
			//TODO: this should never be able to happen. maybe i can make it so it retries for a different name rather than throwing?
			// that should only retry a certain amount of times before genuinely Throwing then.
		} else {
			return result;
		}
	}
}

class Fish {
	public readonly id: FishId;
	public readonly name: FishName;
	public readonly color: RGB;

	public constructor(id: FishId, name: FishName, color: RGB) {
		this.id = id;
		this.name = name;
		this.color = color;
	}
}

class FishFactory {}

class FishStorage {
	private map: Map<FishId, Fish>;

	private constructor(defaults: Array<[FishId, Fish]> = []) {
		this.map = new Map(defaults);
	}

	public static empty(): FishStorage {
		return new FishStorage();
	}

	public static fromFish(...fishes: Fish[]): FishStorage {
		return new FishStorage(fishes.map((fish) => [fish.id, fish]));
	}

	public getFish(id: FishId): Fish | undefined {
		return this.map.get(id);
	}

	public addFish(fish: Fish) {
		this.map.set(fish.id, fish);
	}

	public removeFish(id: FishId): void {
		this.map.delete(id);
	}
}

class IdManager {
	private idSet: Set<FishId> = new Set([1, 2, 3]);

	public createFishId(): FishId {
		let counter: number = 1; //technically we always expect 1-3 to be taken because of ancestors, but let's be thorough. its o(n) anyway.

		while (this.idSet.has(counter) === true) {
			counter++;
		}

		this.addFishId(counter);
		return counter;
		// return that id
	}

	private addFishId(id: FishId): void {
		this.idSet.add(id);
	}

	public removeFishId(id: FishId): void {
		this.idSet.delete(id);
	}
}

class FishManager {
	//has authority over all the FishStorage instances as a group
	private storage: FishStorage;
	private deepStorage: FishStorage;
	private fishNames: FishNames;

	public constructor(options: {
		storage: FishStorage;
		deepStorage: FishStorage;
		fishNames: FishNames;
	}) {
		this.storage = options.storage;
		this.deepStorage = options.deepStorage;
		this.fishNames = options.fishNames;
	}

	public getFishById(id: FishId): Fish {
		const fish = this.storage.getFish(id);
		if (fish) {
			return fish;
		}

		const deepFish = this.deepStorage.getFish(id);
		if (deepFish) {
			return deepFish;
		}

		throw new Error(`Fish with id ${id} not found`);
	}

	private getFishStorageById(id: FishId): FishStorage {
		const fish = this.storage.getFish(id);
		if (fish) {
			return this.storage;
		}

		const deepFish = this.deepStorage.getFish(id);
		if (deepFish) {
			return this.deepStorage;
		}

		throw new Error(`Fish with id ${id} not found in any storage`); //TODO: this should not throw. we should handle this properly at some point.
	}

	public deleteFish(id: FishId): void {
		const fishToRemoveLocation: FishStorage = this.getFishStorageById(id);

		fishToRemoveLocation.removeFish(id);
		idManager.removeFishId(id);
	}

	public moveFish(id: FishId, destination: FishStorage): void {
		const fishToMove: Fish = this.getFishById(id);
		const fishToMoveOrigin: FishStorage = this.getFishStorageById(
			fishToMove.id,
		);

		if (destination === fishToMoveOrigin) {
			console.info(
				`fish with id ${id} already lives in ${destination}, nothing will happen.`,
			);
			return;
		}

		switch (destination) {
			case this.storage:
				this.storage.addFish(fishToMove);
				fishToMoveOrigin.removeFish(fishToMove.id);
				break;
			case this.deepStorage:
				this.deepStorage.addFish(fishToMove);
				fishToMoveOrigin.removeFish(fishToMove.id);
				break;
			default:
				throw new Error(
					`destination ${destination} is invalid! no fish will be moved.`,
				);
		}
	}

	public breedFish(parentOneId: FishId, parentTwoId: FishId): void {
		const parentOneRGB: RGB = this.getFishById(parentOneId).color;
		const parentTwoRGB: RGB = this.getFishById(parentTwoId).color;

		const newRGB: RGB = Utility.meanRGB(parentOneRGB, parentTwoRGB);

		//we won't add it anywhere, the player will be prompted to ask where they would like to put the new Fish.
	} //TODO: personality, id and name assignment
}

//instantiations
const idManager = new IdManager();
const storage = FishStorage.fromFish(
	new Fish(1, "redditor", [255, 0, 0]),
	new Fish(2, "greenhorn", [0, 255, 0]),
	new Fish(3, "blues", [0, 0, 255]),
);
const deepStorage = FishStorage.empty();
const fishNames = new FishNames(["bob", "melissa", "bartholamew"]);
const fishManager = new FishManager({ storage, deepStorage, fishNames });

// GAMEPLAY

// UTILITY
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

	public static meanRGB(RGB1: RGB, RGB2: RGB): RGB {
		const result: RGB = [
			(RGB1[0] + RGB2[0]) / 2,
			(RGB1[1] + RGB2[1]) / 2,
			(RGB1[2] + RGB2[2]) / 2,
		];
		return result;
	}

	public static randomArrayMember(array: Array<any>): any {
		const result = array[Math.floor(Math.random() * array.length)];
		return result;
	}
}
//Main.start()
