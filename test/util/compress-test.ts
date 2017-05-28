/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../src/util/compress.ts" />

describe('Util.Compress', () => {

    const expect = chai.expect;
    const assert = chai.assert;

    it('RLE test', () => {
        let plainMap = [[0, 0, 0, 1, 0, 0]];
        let compressedMap = Util.Compression.RLE(plainMap);
        expect(compressedMap).deep.equal([[0, 3, 1, 1, 0, 2]]);
    });

    it('RLD test', () => {
        let compressedMap = [[0, 3, 1, 1, 0, 2]];
        let plainMap = Util.Compression.RLD(compressedMap);
        expect(plainMap).deep.equal([[0, 0, 0, 1, 0, 0]]);
    });

})