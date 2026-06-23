"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fishStorageManager = exports.FishStorageManager = exports.deepStorage = exports.DeepStorage = exports.activeStorage = exports.ActiveStorage = exports.FishStorage = exports.fishFactory = exports.FishFactory = exports.Fish = exports.fishNames = exports.FishNames = void 0;
const types_1 = require("./types");
const utility_1 = require("./utility");
class FishNames {
    fishNamesArray;
    constructor(namesToSet) {
        this.fishNamesArray = namesToSet;
    }
    randomName(maxRetries = 3) {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            const result = utility_1.Utility.randomArrayMember(this.fishNamesArray);
            if (result && typeof result === "string") {
                return result;
            }
            if (attempt === maxRetries) {
                throw new Error(`Failed to get a valid fish name after ${maxRetries} attempts.`);
            }
        }
        // TypeScript requires a return here, but this is unreachable
        throw new Error("Unreachable");
    }
}
exports.FishNames = FishNames;
exports.fishNames = new FishNames(["bob", "melissa", "bartholamew"]);
class Fish {
    UUID;
    name;
    color;
    personality;
    constructor(UUID, name, color, personality) {
        this.UUID = UUID;
        this.name = name;
        this.color = color;
        this.personality = personality;
    }
}
exports.Fish = Fish;
class FishFactory {
    names;
    constructor(names) {
        this.names = names;
    }
    createFish(UUID, name, color, personality) {
        return new Fish(UUID, name, color, personality);
        //add to a storage or do whatever
    }
    breedFish(parent1, parent2) {
        const childColor = utility_1.Utility.meanRGB(parent1.color, parent2.color);
        const childName = this.names.randomName();
        const childPersonality = parent1.personality; //placeholder
        const childUUID = crypto.randomUUID();
        this.createFish(childUUID, childName, childColor, childPersonality);
    }
}
exports.FishFactory = FishFactory;
exports.fishFactory = new FishFactory(exports.fishNames);
class FishStorage {
    map;
    constructor(defaults = []) {
        this.map = new Map(defaults);
    }
    static empty() {
        return new FishStorage();
    }
    static fromFish(...fishes) {
        return new FishStorage(fishes.map((fish) => [fish.UUID, fish]));
    }
    getFish(UUID) {
        return this.map.get(UUID); //TODO: handle undefined
    }
    addFish(fish) {
        this.map.set(fish.UUID, fish);
    }
    removeFish(UUID) {
        this.map.delete(UUID);
    }
}
exports.FishStorage = FishStorage;
class ActiveStorage extends FishStorage {
    static empty() {
        return new ActiveStorage();
    }
    static fromFish(...fishes) {
        return new ActiveStorage(fishes.map((fish) => [fish.UUID, fish]));
    }
}
exports.ActiveStorage = ActiveStorage;
const redFish = exports.fishFactory.createFish(crypto.randomUUID(), "redditor", [255, 0, 0], [utility_1.Utility.randEnumValue(types_1.PersonalityTraits)]);
const greenFish = exports.fishFactory.createFish(crypto.randomUUID(), "greenhorn", [0, 255, 0], [utility_1.Utility.randEnumValue(types_1.PersonalityTraits)]);
const blueFish = exports.fishFactory.createFish(crypto.randomUUID(), "bluegill", [0, 0, 255], [utility_1.Utility.randEnumValue(types_1.PersonalityTraits)]);
exports.activeStorage = ActiveStorage.fromFish(redFish, greenFish, blueFish);
class DeepStorage extends FishStorage {
    static empty() {
        return new DeepStorage();
    }
    static fromFish(...fishes) {
        return new DeepStorage(fishes.map((fish) => [fish.UUID, fish]));
    }
}
exports.DeepStorage = DeepStorage;
exports.deepStorage = DeepStorage.empty();
class FishStorageManager {
    activeStorageManaged;
    deepStorageManaged;
    constructor(activeStorageManaged, deepStorageManaged) {
        this.activeStorageManaged = activeStorageManaged;
        this.deepStorageManaged = deepStorageManaged;
    }
    getFish(UUID) {
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
    getFishStorage(UUID) {
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
    deleteFish(UUID) {
        const fishToRemoveLocation = this.getFishStorage(UUID);
        fishToRemoveLocation.removeFish(UUID);
    }
    moveFish(UUID) {
        const fishToMove = this.getFish(UUID);
        const fishToMoveOrigin = this.getFishStorage(fishToMove.UUID);
        let destination;
        if (fishToMoveOrigin === this.activeStorageManaged) {
            destination = this.deepStorageManaged;
        }
        else {
            destination = this.activeStorageManaged;
        }
        destination.addFish(fishToMove);
        fishToMoveOrigin.removeFish(fishToMove.UUID);
    }
}
exports.FishStorageManager = FishStorageManager;
exports.fishStorageManager = new FishStorageManager(exports.activeStorage, exports.deepStorage);
