import type { RGB } from "./types.js";

export class Utility {
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

	public static meanRGB(RGB1: RGB, RGB2: RGB): RGB {
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
}

console.log("hello from test utility!");
