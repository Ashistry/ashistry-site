// fish breeding will be active.
// fish will have genetics-determined personalities with tomodachi style adlibs.

//fish have an internal id and a NAME that players can give it. the name is random at first from a selected list

// custom types
type RGB = [number, number, number];
type FishId = string;

// GAME FRAMEWORK
class Main {
	//stay global
	private static readonly resetAt: number = 1000;
	private static counter: number = 0;
	private static readonly tickInterval: number = 1000; //ms

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
		setInterval(() => Main.tick(), Main.tickInterval);
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
}

class LocalStorageManager {
	public getLocalStorage() {
		//get local storage, then use setLocalStorageAsGameState()
	}

	public setLocalStorage() {
		//get game state and save as local storage
	}
}

//framework instances
const localStorageManager = new LocalStorageManager();
const saveManager = new SaveManager();

// FISH

class Fish {
	public readonly id: string;
	public readonly color: RGB;

	public constructor(id: string, color: RGB) {
		this.id = id;
		this.color = color;
	}
}

class FishStorage {
	private map: Map<string, Fish>;

	public constructor(defaults: Array<[FishId, Fish]> = []) {
		this.map = new Map(defaults);
	}

	public getFish(id: FishId): Fish | undefined {
		return this.map.get(id);
	}

	public setFish(id: FishId, fish: Fish) {}

	public removeFish(fishToDeleteId: FishId): void {
		this.map.delete(fishToDeleteId);
	}
}

class FishManager {
	//has authority over all the FishStorage instances as a group
	private storage: FishStorage;
	private deepFishStorage: FishStorage;

	public constructor(storage: FishStorage, deepFishStorage: FishStorage) {
		this.storage = storage;
		this.deepFishStorage = deepFishStorage;
	}
	private getFishById(id: FishId): Fish {
		const fish = this.storage.getFish(id);
		if (fish) {
			//found in this.fishStorage
			return fish;
		}

		const deepFish = this.deepFishStorage.getFish(id);
		if (deepFish) {
			// found in this.deepFishStorage
			return deepFish;
		}

		throw new Error(`Fish with id ${id} not found`);
	}

	private getFishLocationById(id: FishId): FishStorage {
		const fish = this.storage.getFish(id);
		if (fish) {
			//found in this.fishStorage
			return this.storage;
		}

		const deepFish = this.deepFishStorage.getFish(id);
		if (deepFish) {
			// found in this.deepFishStorage
			return this.deepFishStorage;
		}

		throw new Error(`Fish with id ${id} not found in any storage`);
	}

	public removeFish(id: FishId): void {} //TODO

	public moveFish(id: FishId, destination: FishStorage): void {
		const fishToMove: Fish = this.getFishById(id);
		const fishToMoveOrigin: FishStorage = this.getFishLocationById(
			fishToMove.id,
		);

		if (destination === fishToMoveOrigin) {
			console.warn(
				`fish with id ${id} already lives in ${destination}, nothing will happen.`,
			);
			return;
		}

		switch (destination) {
			case this.storage:
				this.storage.setFish(fishToMove.id, fishToMove);
				fishToMoveOrigin.removeFish(fishToMove.id);
				break;
			case this.deepFishStorage:
				this.deepFishStorage.setFish(fishToMove.id, fishToMove);
				fishToMoveOrigin.removeFish(fishToMove.id);
				break;
			default:
				throw new Error("location is invalid! no fish will be moved.");
		}
	}

	//@ts-expect-error
	public breedFish(parentOneId: FishId, parentTwoId: FishId): Fish {} //TODO
}

//instantiations
const fishStorage = new FishStorage([
	["ancestorRed", new Fish("ancestorRed", [255, 0, 0])],
	["ancestorGreen", new Fish("ancestorGreen", [0, 255, 0])],
	["ancestorBlue", new Fish("ancestorBlue", [0, 0, 255])],
]);

const deepFishStorage = new FishStorage();
const fishManager = new FishManager(fishStorage, deepFishStorage);

// GAMEPLAY

// UTILITY
function validateRGB(x: unknown): boolean {
	// Type guard
	if (!Array.isArray(x) || !x.every((item) => typeof item === "number")) {
		console.error(`${x} is not a valid number array!`);
		return false;
	}

	// Length check
	if (x.length !== 3) {
		console.error(`array of numbers ${x} is not 3 long!`);
		return false;
	}

	// Range check
	for (const num of x) {
		if (num < 0 || num > 255) {
			console.error(`Invalid value: ${num} (must be 0-255)`);
			return false;
		}
	}

	return true;
}

//Main.start();
