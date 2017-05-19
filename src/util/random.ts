class RandomGenerator {
    private lastRandom;
    private lastRandom2;
    getRandom(max: number, min: number): number {
        return Math.floor(Math.random() * (max + 1 - min)) + min;
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

    getNormdistRandom(max: number, min: number = 0, normdist: number = 6): number {
        let rands = [];
        for (let i = 0; i < normdist; i++) {
            rands.push(Math.floor(Math.random() * (max + 1 - min)) + min);
        }
        return Math.floor(rands.reduce((prev, current) => { return prev + current }) / normdist);
    }
}