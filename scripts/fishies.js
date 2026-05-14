"use strict";
// fish breeding will be active.
// fish will have genetics-determined personalities with tomodachi style adlibs.
Object.defineProperty(exports, "__esModule", { value: true });
// GAME FRAMEWORK
class Main {
    static tick() {
        //some methods that first check if counter is divisible by their respective divisor.
        //note that 0 is divisible by everything.
        //some methods should also have probabilities so everything doesn't happen at once.
        //we reset at a large number.
        //make sure to make these probabilities adjustable to 100% for debugging.
        ++Main.counter;
    }
    // Start the game loop
    static start() {
        setInterval(() => Main.tick(), Main.tickInterval);
    }
}
//stay global
Main.resetAt = 1000;
Main.counter = 0;
Main.tickInterval = 1000; //ms
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
    getGameState() { }
    setLocalStorageAsGameState() { }
}
class LocalStorageManager {
    getLocalStorage() {
        //get local storage, then use setLocalStorageAsGameState()
    }
    setLocalStorage() {
        //get game state and save as local storage
    }
}
//framework instances
const localStorageManager = new LocalStorageManager();
const saveManager = new SaveManager();
// FISH
class Fish {
    constructor(id, color) {
        this.id = id;
        this.color = color;
    }
}
class FishStorage {
    constructor(defaults = []) {
        this.map = new Map(defaults);
    }
    getFish(id) {
        return this.map.get(id);
    }
    setFish(id, fish) {
        this.map.set(id, fish);
    }
    removeFish(fishToDeleteId) {
        this.map.delete(fishToDeleteId);
    }
}
class FishManager {
    constructor(storage, deepStorage) {
        this.storage = storage;
        this.deepStorage = deepStorage;
    }
    getFishById(id) {
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
    getFishStorageById(id) {
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
    getFishRGBbyId(id) {
        return this.getFishById(id).color;
    }
    removeFish(id) { } //TODO
    moveFish(id, destination) {
        const fishToMove = this.getFishById(id);
        const fishToMoveOrigin = this.getFishStorageById(fishToMove.id);
        if (destination === fishToMoveOrigin) {
            console.warn(`fish with id ${id} already lives in ${destination}, nothing will happen.`);
            return;
        }
        switch (destination) {
            case this.storage:
                this.storage.setFish(fishToMove.id, fishToMove);
                fishToMoveOrigin.removeFish(fishToMove.id);
                break;
            case this.deepStorage:
                this.deepStorage.setFish(fishToMove.id, fishToMove);
                fishToMoveOrigin.removeFish(fishToMove.id);
                break;
            default:
                throw new Error(`destination ${destination} is invalid! no fish will be moved.`);
        }
    }
    breedFish(parentOneId, parentTwoId) {
        const parentOneRGB = this.getFishRGBbyId(parentOneId);
        const parentTwoRGB = this.getFishRGBbyId(parentTwoId);
        const newRGB = Utility.meanRGB(parentOneRGB, parentTwoRGB);
    } //TODO
}
//instantiations
const fishStorage = new FishStorage([
    ["ancestorRed", new Fish("ancestorRed", [255, 0, 0])],
    ["ancestorGreen", new Fish("ancestorGreen", [0, 255, 0])],
    ["ancestorBlue", new Fish("ancestorBlue", [0, 0, 255])],
]);
const deepStorage = new FishStorage();
const fishManager = new FishManager(fishStorage, deepStorage);
// GAMEPLAY
// UTILITY
class Utility {
    // public static validateRGB(x: unknown): boolean {
    // 	// Type guard
    // 	if (!Array.isArray(x) || !x.every((item) => typeof item === "number")) {
    // 		console.error(`${x} is not a valid number array!`);
    // 		return false;
    // 	}
    // 	// Length check
    // 	if (x.length !== 3) {
    // 		console.error(`array of numbers ${x} is not 3 long!`);
    // 		return false;
    // 	}
    // 	// Range check
    // 	for (const num of x) {
    // 		if (num < 0 || num > 255) {
    // 			console.error(`Invalid value: ${num} must be 0-255`);
    // 			return false;
    // 		}
    // 	}
    // 	return true;
    // }
    static meanRGB(RGB1, RGB2) {
        const result = [RGB1[0] + RGB2[0], RGB1[1] + RGB2[1], RGB1[2] + RGB2[2]];
        return result;
    }
}
//Main.start()
