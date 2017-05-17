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
    })
})