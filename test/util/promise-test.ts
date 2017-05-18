/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../src/util/deferred.ts" />
/// <reference path="../../src/util/promise.ts" />

class Sample {
  success(timeout: number): MyQ.Promise<string> {
    var q = MyQ.Deferred.defer<string>();
    setTimeout(() => {
      var obj = 'success';
      q.resolve(obj);
    }, timeout);
    return q.promise;
  }
  error(timeout: number): MyQ.Promise<string> {
    var q = MyQ.Deferred.defer<string>();
    setTimeout(() => {
      q.reject("error has occured.");
    }, timeout);
    return q.promise;
  }
}

const expect = chai.expect;
const assert = chai.assert;

describe('Promise', ()=>{
    it('simple resolved test',(done)=>{
        let firstActualVal = null;
        let secondActualVal = null;

        new Sample().success(0).then((val) => {
            firstActualVal = val;
            return val + ':' + val;
        }).then((val) => {
            secondActualVal = val;
        }).catch((e) => {
            done(e);
        }).finally(() => {
            expect(firstActualVal).equal('success');
            expect(secondActualVal).equal('success:success');
            done();
        });
    });

    it('simple reject test', (done) => {
        let catchVal = null;
        new Sample().error(0).then(()=>{
        }).catch((e)=>{
            catchVal = e;
        }).finally(()=>{
            expect(catchVal).equal('error has occured.');
            done();
        });
    });

    it('when test', (done) => {
        let isSuccess = false;
        MyQ.Promise.when().then(() => {
            isSuccess = true;
        }).finally(()=>{
            assert.isOk(isSuccess);
            done();
        });
    });

    it('all success test', (done) => {
        let p1 = new Sample().success(0);
        let p2 = new Sample().success(10);
        let result = null;

        MyQ.Promise.all([p1,p2]).then((val)=>{
            result = val;
        }).finally(()=>{
            expect(result.length).equal(2);
            expect(result[0]).equal('success');
            expect(result[1]).equal('success');
            done();
        })
    });

})