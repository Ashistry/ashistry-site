export class Utility {
	public static validateRGB(x: unknown): boolean {
		if (!Array.isArray(x) || !x.every((item) => typeof item === "number")) {
			console.error(`${x} is not a valid number array!`);
			return false;
		}

		if (x.length !== 3) {
			console.error(`array of numbers ${x} is not 3 long!`);
			return false;
		}

		for (const num of x) {
			if (num < 0 || num > 255) {
				console.error(`Invalid value: ${num} must be 0-255`);
				return false;
			}
		}

		return true;
	}

	public static randomArrayMember<T>(array: Array<T>): T {
		if (array.length === 0) {
			throw new Error("Cannot get random member of empty array");
		}
		return array[Math.floor(Math.random() * array.length)]!;
	}

	public static randEnumValue<T extends object>(enumObj: T): T[keyof T] {
		const enumValues = Object.values(enumObj);
		const index = Math.floor(Math.random() * enumValues.length);
		return enumValues[index];
	}
}
