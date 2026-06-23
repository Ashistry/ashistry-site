import { PersonalityTraits, } from "./types.js";
import { Utility } from "./utility.js";
export class FishNames {
    fishNamesArray;
    constructor(namesToSet) {
        this.fishNamesArray = namesToSet;
    }
    randomName(maxRetries = 3) {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            const result = Utility.randomArrayMember(this.fishNamesArray);
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
export const fishNames = new FishNames(["bob", "melissa", "bartholamew"]);
export class Fish {
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
export class FishFactory {
    names;
    constructor(names) {
        this.names = names;
    }
    createFish(UUID, name, color, personality) {
        return new Fish(UUID, name, color, personality);
        //add to a storage or do whatever
    }
    breedFish(parent1, parent2) {
        const childColor = Utility.meanRGB(parent1.color, parent2.color);
        const childName = this.names.randomName();
        const childPersonality = parent1.personality; //placeholder
        const childUUID = crypto.randomUUID();
        this.createFish(childUUID, childName, childColor, childPersonality);
    }
}
export const fishFactory = new FishFactory(fishNames);
export class FishStorage {
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
export class ActiveStorage extends FishStorage {
    static empty() {
        return new ActiveStorage();
    }
    static fromFish(...fishes) {
        return new ActiveStorage(fishes.map((fish) => [fish.UUID, fish]));
    }
}
const redFish = fishFactory.createFish(crypto.randomUUID(), "redditor", [255, 0, 0], [Utility.randEnumValue(PersonalityTraits)]);
const greenFish = fishFactory.createFish(crypto.randomUUID(), "greenhorn", [0, 255, 0], [Utility.randEnumValue(PersonalityTraits)]);
const blueFish = fishFactory.createFish(crypto.randomUUID(), "bluegill", [0, 0, 255], [Utility.randEnumValue(PersonalityTraits)]);
export const activeStorage = ActiveStorage.fromFish(redFish, greenFish, blueFish);
export class DeepStorage extends FishStorage {
    static empty() {
        return new DeepStorage();
    }
    static fromFish(...fishes) {
        return new DeepStorage(fishes.map((fish) => [fish.UUID, fish]));
    }
}
export const deepStorage = DeepStorage.empty();
export class FishStorageManager {
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
export const fishStorageManager = new FishStorageManager(activeStorage, deepStorage);
