/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../src/util/random.ts" />

describe('Util.Random', ()=>{
    it('getRandom test', ()=>{
        expect(RandomGenerator.getRandom(5)).within(0,5);
        expect(RandomGenerator.getRandom(20,10)).within(10,20);
    });

    it('getNormdistRandom test', ()=>{
        expect(RandomGenerator.getNormdistRandom(10)).within(0,10);
        expect(RandomGenerator.getNormdistRandom(30,20)).within(20,30);
        expect(RandomGenerator.getNormdistRandom(40,30,20)).within(30,40);
    });

    it('getCognitiveRandom test', ()=>{
        let mathMock = sinon.mock(Math);
        mathMock.expects('random').once().returns(0.5);
        mathMock.expects('random').once().returns(0.5);
        mathMock.expects('random').once().returns(0.5);
        mathMock.expects('random').once().returns(0.1);

        let rand = new RandomGenerator();
        let firstRand = rand.getCognitiveRandom(100);
        expect(firstRand).within(0,100);
        expect(rand.getCognitiveRandom(100)).within(0,100);
        expect(rand.getCognitiveRandom(100,0, 0.2)).within(0,100);

        mathMock.restore();
    });

});