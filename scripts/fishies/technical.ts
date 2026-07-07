import { moveSprite } from "./rendering.ts";

export class GameConfig {
	public readonly resetAt: number;
	public readonly tickInterval: number;

	public constructor(resetAt: number, tickInterval: number) {
		this.resetAt = resetAt;
		this.tickInterval = tickInterval;
	}
}

export const gameConfig = new GameConfig(1000, 1000);

export class LocalStorageManager {
	//todo
}

export class SaveManager {
	//state methods
	public getGameState() {}
	public setLocalStorageAsGameState() {}
	public getLocalStorage() {
		//get local storage, then use setLocalStorageAsGameState()
	}

	public setLocalStorage() {
		//get game state and save as local storage
	}
}
export const saveManager = new SaveManager(); //since Game is a singleton, we dont need to worry about what Game instance the save manager is associated with

export class Game {
	private readonly config: GameConfig;
	private counter: number = 0;
	private timer: ReturnType<typeof setInterval> | undefined = undefined;
	private static instance: Game | null = null;

	private constructor(config: GameConfig) {
		this.config = config;
	}

	public static createGame(gameConfig: GameConfig): Game {
		if (this.instance === null) {
			this.instance = new Game(gameConfig);
		}
		return this.instance;
	}

	// Start the game loop
	public start(): void {
		// if (this.timer !== undefined) return;
		console.info("game starting");
		clearInterval(this.timer);
		this.timer = setInterval(() => this.tick(), this.config.tickInterval);
	}

	public stop(): void {
		clearInterval(this.timer);
		this.timer = undefined;
	}

	private tick(): void {
		//some methods that first check if counter is divisible by their respective divisor.
		//note that 0 is divisible by everything.
		//some methods should also have probabilities so everything doesn't happen at once.
		//we reset at a large number.
		//make sure to make these probabilities adjustable to 100% for debugging.
		if (
			this.counter >= this.config.resetAt ||
			this.counter >= Number.MAX_SAFE_INTEGER
		) {
			this.counter = 0;
		} else {
			this.counter++;
		}

		moveSprite();
	}
}

export const game = Game.createGame(gameConfig);

console.info("technical module loaded");
game.start();
