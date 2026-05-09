// fish breeding will be active.
// fish will have genetics-determined personalities with tomodachi style adlibs.

// custom types
type RGB = [number, number, number];

// GAME FRAMEWORK
class Main {
	private static resetAt: number = 1000;
	private static counter: number = 0;
	private static tickInterval: number = 1000; //ms

	private static tick(): void {
		//some methods that first check if counter is divisible by their respective divisor.
		//note that 0 is divisible by everything.
		//some methods should also have probabilities so everything doesn't happen at once.
		//we reset at a large number.
		//make sure to make these probabilities adjustable to 100% for debugging.
		++this.counter;
	}

	// Start the game loop
	public static start(): void {
		setInterval(() => Main.tick(), Main.tickInterval);
	}
}

class DeveloperMode {
	private static probabilityModifier: number = 1; //unimplemented
	private static devMode: boolean = true; //unimplemented
}

class SaveManager {
	//state methods
	public static getGameState() {}
	public static setLocalStorageAsGameState() {}

	// dev-only method
	// private static writeGameState() {}
}

class LocalStorageManager {
	public static getLocalStorage() {
		//get local storage, then use setLocalStorageAsGameState()
	}

	public static setLocalStorage() {
		//get game state and save as local storage
	}
}

// FISH

class Fish {
	color: RGB;
	id: string;

	public constructor(id: string, color: RGB) {
		this.color = color;
		this.id = id;
	}
}

class FishManager {
	private static fishStorage: Fish[] = [
		new Fish("ancestorRed", [255, 0, 0]),
		new Fish("ancestorGreen", [0, 255, 0]),
		new Fish("ancestorBlue", [0, 0, 255]),
	];

	private static deepFishStorage: Fish[] = []; //for non-active fish

	public static getFishById(id: string) {
		//for reading a fish only
	}

	public static addFish(fish: Fish) {}

	public static removeFish(fish: Fish) {}

	public static moveFishBetweenStorages(fish: Fish) {
		//if in normal storage, move to deep storage. If in deep storage, move to storage.
	}

	public static breedFish() {}
}

// GAMEPLAY


// Main.start();
