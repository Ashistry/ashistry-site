// custom types
export type RGB = [number, number, number];
export type FishUUID = ReturnType<typeof crypto.randomUUID>;
export type FishName = string;
export type FishPersonality = Array<PersonalityTraits>;
export type CSSWidth = string;
export type CSSHeight = string;

export enum PersonalityTraits {
	silly,
	energetic,
	lazy,
}

console.info("types module loaded");

// personalities will be implemented through keywords which decide what behaviours an individual might perform and at what rate.
// example: a Fish with the "silly" trait may make funny noises more often.
