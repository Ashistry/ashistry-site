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
		Main.timer = setInterval(() => Main.tick(), Main.tickInterval);
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
	public readonly name: string;
	public readonly color: RGB;

	public constructor(id: string, name: string, color: RGB) {
		this.id = id;
		this.name = name;
		this.color = color;
	}
}

class FishStorage {
	private map: Map<string, Fish>;

	private constructor(defaults: Array<[FishId, Fish]> = []) {
		this.map = new Map(defaults);
	}

	public static empty(): FishStorage {
		return new FishStorage();
	}

	public static fromFish(...fishes: Fish[]): FishStorage {
		return new FishStorage(fishes.map(fish => [fish.id, fish]));
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

class FishManager {
	//has authority over all the FishStorage instances as a group
	private storage: FishStorage;
	private deepStorage: FishStorage;

	public constructor(options: {
		storage: FishStorage;
		deepStorage: FishStorage;
	}) {
		this.storage = options.storage;
		this.deepStorage = options.deepStorage;
	}
	public getFishById(id: FishId): Fish {
		const fish = this.storage.getFish(id);
		if (fish) {
			//found in this.fishStorage
			return fish;
		}

		const deepFish = this.deepStorage.getFish(id);
		if (deepFish) {
			// found in this.deepStorage
			return deepFish;
		}

		throw new Error(`Fish with id ${id} not found`);
	}

	private getFishStorageById(id: FishId): FishStorage {
		const fish = this.storage.getFish(id);
		if (fish) {
			//found in this.fishStorage
			return this.storage;
		}

		const deepFish = this.deepStorage.getFish(id);
		if (deepFish) {
			// found in this.deepStorage
			return this.deepStorage;
		}

		throw new Error(`Fish with id ${id} not found in any storage`);
	}

	public removeFish(id: FishId): void {} //TODO

	public moveFish(id: FishId, destination: FishStorage): void {
		const fishToMove: Fish = this.getFishById(id);
		const fishToMoveOrigin: FishStorage = this.getFishStorageById(
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
	} //TODO
}

//instantiations
const storage = FishStorage.fromFish(
	new Fish("ancestorRed", "redditor", [255, 0, 0]),
	new Fish("ancestorGreen", "greenchamp", [0, 255, 0]),
	new Fish("ancestorBlue", "bluedab", [0, 0, 255])
);

const deepStorage = FishStorage.empty();
const fishManager = new FishManager({ storage, deepStorage });

// GAMEPLAY

// UTILITY
class Utility {
	public static validateRGB(x: unknown): boolean {

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
}
//Main.start()
