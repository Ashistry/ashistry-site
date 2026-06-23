export class GameConfig {
    resetAt;
    tickInterval;
    constructor(resetAt, tickInterval) {
        this.resetAt = resetAt;
        this.tickInterval = tickInterval;
    }
}
export const gameConfig = new GameConfig(1000, 1000);
export class LocalStorageManager {
}
export class SaveManager {
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
export const saveManager = new SaveManager(); //since Game is a singleton, we dont need to worry about what Game instance the save manager is associated with
export class Game {
    config;
    counter = 0;
    timer = undefined;
    static instance = null;
    constructor(config) {
        this.config = config;
    }
    static createGame(gameConfig) {
        if (this.instance === null) {
            this.instance = new Game(gameConfig);
        }
        return this.instance;
    }
    // Start the game loop
    start() {
        // if (this.timer !== undefined) return;
        clearInterval(this.timer);
        this.timer = setInterval(() => this.tick(), this.config.tickInterval);
    }
    stop() {
        clearInterval(this.timer);
        this.timer = undefined;
    }
    tick() {
        //some methods that first check if counter is divisible by their respective divisor.
        //note that 0 is divisible by everything.
        //some methods should also have probabilities so everything doesn't happen at once.
        //we reset at a large number.
        //make sure to make these probabilities adjustable to 100% for debugging.
        if (this.counter >= this.config.resetAt ||
            this.counter >= Number.MAX_SAFE_INTEGER) {
            this.counter = 0;
        }
        else {
            this.counter++;
        }
    }
}
export const game = Game.createGame(gameConfig);
