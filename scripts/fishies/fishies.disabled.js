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
        clearInterval(Main.timer);
        Main.timer = setInterval(() => Main.tick(), gameConfig.tickInterval);
    }
    static stop() {
        clearInterval(Main.timer);
    }
}
//stay global
Main.counter = 0;
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
    getLocalStorage() {
        //get local storage, then use setLocalStorageAsGameState()
    }
    setLocalStorage() {
        //get game state and save as local storage
    }
}
class GameConfig {
    constructor(resetAt, tickInterval) {
        this.resetAt = resetAt;
        this.tickInterval = tickInterval;
    }
}
class PlayerConfig {
}
//framework instances
const gameConfig = new GameConfig(1000, 1000);
const saveManager = new SaveManager();
// FISH
class FishNames {
    constructor(namesToSet) {
        this.namesToSet = namesToSet;
        this.fishNamesArray = namesToSet;
    }
    randomName() {
        const result = Utility.randomArrayMember(this.fishNamesArray);
        if (typeof result !== "string") {
            throw new Error(`${result} is not a string!`);
            //TODO: this should never be able to happen. maybe i can make it so it retries for a different name rather than throwing?
            // that should only retry a certain amount of times before genuinely Throwing then.
        }
        else {
            return result;
        }
    }
}
class Fish {
    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = color;
    }
}
class FishFactory {
}
class FishStorage {
    constructor(defaults = []) {
        this.map = new Map(defaults);
    }
    static empty() {
        return new FishStorage();
    }
    static fromFish(...fishes) {
        return new FishStorage(fishes.map((fish) => [fish.id, fish]));
    }
    getFish(id) {
        return this.map.get(id);
    }
    addFish(fish) {
        this.map.set(fish.id, fish);
    }
    removeFish(id) {
        this.map.delete(id);
    }
}
class IdManager {
    constructor() {
        this.idSet = new Set([1, 2, 3]);
    }
    createFishId() {
        let counter = 1; //technically we always expect 1-3 to be taken because of ancestors, but let's be thorough. its o(n) anyway.
        while (this.idSet.has(counter) === true) {
            counter++;
        }
        return counter;
        // return that id
    }
    removeFishId(id) {
        this.idSet.delete(id);
    }
}
class FishManager {
    constructor(options) {
        this.storage = options.storage;
        this.deepStorage = options.deepStorage;
        this.fishNames = options.fishNames;
    }
    getFishById(id) {
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
    getFishStorageById(id) {
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
    deleteFish(id) {
        const fishToRemoveLocation = this.getFishStorageById(id);
        fishToRemoveLocation.removeFish(id);
    }
    moveFish(id, destination) {
        const fishToMove = this.getFishById(id);
        const fishToMoveOrigin = this.getFishStorageById(fishToMove.id);
        if (destination === fishToMoveOrigin) {
            console.info(`fish with id ${id} already lives in ${destination}, nothing will happen.`);
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
                throw new Error(`destination ${destination} is invalid! no fish will be moved.`);
        }
    }
    breedFish(parentOneId, parentTwoId) {
        const parentOneRGB = this.getFishById(parentOneId).color;
        const parentTwoRGB = this.getFishById(parentTwoId).color;
        const newRGB = Utility.meanRGB(parentOneRGB, parentTwoRGB);
        //we won't add it anywhere, the player will be prompted to ask where they would like to put the new Fish.
    } //TODO: personality, id and name assignment
}
//instantiations
const storage = FishStorage.fromFish(new Fish(1, "redditor", [255, 0, 0]), new Fish(2, "greenhorn", [0, 255, 0]), new Fish(3, "blues", [0, 0, 255]));
const fishNames = new FishNames(["bob", "melissa", "bartholamew"]);
const deepStorage = FishStorage.empty();
const fishManager = new FishManager({ storage, deepStorage, fishNames });
// GAMEPLAY
// UTILITY
class Utility {
    static validateRGB(x) {
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
    static meanRGB(RGB1, RGB2) {
        const result = [
            (RGB1[0] + RGB2[0]) / 2,
            (RGB1[1] + RGB2[1]) / 2,
            (RGB1[2] + RGB2[2]) / 2,
        ];
        return result;
    }
    static randomArrayMember(array) {
        const result = array[Math.floor(Math.random() * array.length)];
        return result;
    }
}
//Main.start()
