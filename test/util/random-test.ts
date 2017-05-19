/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../src/util/random.ts" />

describe('Util.Random', ()=>{
    it('getRandom test', ()=>{
        expect(new RandomGenerator().getRandom(20,10)).within(10,20);
    });

    it('getCognitiveRandom test', ()=>{
        expect(new RandomGenerator().getCognitiveRandom(30,20)).within(20,30);
    });

    it('getNormdistRandom test', ()=>{
        expect(new RandomGenerator().getNormdistRandom(40,30)).within(30,40);
    });
});