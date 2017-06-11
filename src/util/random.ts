class RandomGenerator {
    private lastRandom;
    private lastRandom2;

    static getRandom(max: number, min: number = 0): number {
        return Math.floor(Math.random() * (max + 1 - min)) + min;
    }

    static getNormdistRandom(max: number, min: number = 0, normdist: number = 6): number {
        let rands = [];
        for (let i = 0; i < normdist; i++) {
            rands.push(Math.floor(Math.random() * (max + 1 - min)) + min);
        }
        return Math.floor(rands.reduce((prev, current) => { return prev + current }) / normdist);
    }

    getCognitiveRandom(max: number, min: number = 0, distance: number = 0.3): number {
        let rand = Math.random();
        while (Math.abs(this.lastRandom - rand) < distance && Math.abs(this.lastRandom2 - rand) < distance) {
            rand = Math.random();
        }
        this.lastRandom2 = this.lastRandom;
        this.lastRandom = rand;
        return Math.floor(rand * (max + 1 - min)) + min;
    }

    static generateUUIDv4(): string {
        // https://github.com/GoogleChrome/chrome-platform-analytics/blob/master/src/internal/identifier.js
        // const FORMAT: string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
        let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
        for (let i = 0, len = chars.length; i < len; i++) {
            switch (chars[i]) {
                case "x":
                    chars[i] = Math.floor(Math.random() * 16).toString(16);
                    break;
                case "y":
                    chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
                    break;
            }
        }
        return chars.join("");
    }

}