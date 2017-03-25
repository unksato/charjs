var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Character;
(function (Character) {
    var HitStatus;
    (function (HitStatus) {
        HitStatus[HitStatus["none"] = 0] = "none";
        HitStatus[HitStatus["dammage"] = 1] = "dammage";
        HitStatus[HitStatus["attack"] = 2] = "attack";
    })(HitStatus || (HitStatus = {}));
    var Mario = (function (_super) {
        __extends(Mario, _super);
        function Mario() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._runIndex = 0;
            _this._currentStep = Mario.STEP;
            _this.isEnemy = false;
            _this.useVertical = false;
            _this._yVector = 0;
            _this._jumpPower = 18;
            _this._speed = Mario.DEFAULT_SPEED;
            _this._gameOverWaitCount = 0;
            _this._speedUpTimer = null;
            _this._speedDownTimer = null;
            _this._squatTimer = null;
            _this._gameOverTimer = null;
            _this._isJumping = false;
            _this._isBraking = false;
            _this._isSquat = false;
            _this._attackDirection = 1;
            _this._backgroundOpacity = 0;
            _this._canSpeedUpForMobile = true;
            _this.colors = ['', '#000000', '#ffffff', '#520000', '#8c5a18', '#21318c', '#ff4273', '#b52963', '#ffde73', '#dea539', '#ffd6c6', '#ff736b', '#84dece', '#42849c'];
            _this.chars = [[
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 0, 0, 0],
                    [0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 0, 0, 0],
                    [0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [0, 0, 3, 10, 1, 1, 1, 11, 1, 11, 1, 11, 0, 0, 0, 0],
                    [0, 3, 10, 4, 10, 1, 11, 10, 1, 10, 1, 10, 4, 4, 0, 0],
                    [0, 3, 11, 4, 10, 1, 1, 10, 10, 10, 10, 10, 10, 10, 4, 0],
                    [0, 3, 1, 11, 10, 1, 10, 10, 1, 11, 11, 11, 11, 11, 4, 0],
                    [0, 0, 1, 1, 11, 11, 10, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 0, 1, 4, 4, 11, 11, 11, 1, 1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 0, 3, 7, 4, 4, 4, 4, 5, 0, 0, 0, 0, 0],
                    [0, 0, 0, 3, 7, 7, 6, 13, 13, 12, 12, 5, 0, 0, 0, 0],
                    [0, 0, 0, 3, 4, 4, 4, 13, 2, 2, 12, 2, 5, 0, 0, 0],
                    [0, 0, 0, 4, 2, 2, 2, 4, 2, 2, 12, 2, 5, 0, 0, 0],
                    [0, 0, 0, 4, 2, 2, 4, 13, 13, 13, 12, 12, 5, 0, 0, 0],
                    [0, 0, 0, 4, 2, 2, 4, 13, 13, 5, 13, 5, 0, 0, 0, 0],
                    [0, 0, 0, 0, 4, 4, 4, 4, 1, 4, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 4, 4, 4, 8, 1, 8, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
                ], [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 0, 0, 0],
                    [0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 0, 0, 0],
                    [0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [0, 0, 3, 10, 1, 1, 1, 11, 1, 11, 1, 11, 0, 0, 0, 0],
                    [0, 3, 10, 4, 10, 1, 11, 10, 1, 10, 1, 10, 4, 4, 0, 0],
                    [0, 3, 11, 4, 10, 1, 1, 10, 10, 10, 10, 10, 10, 10, 4, 0],
                    [0, 3, 1, 11, 10, 1, 10, 10, 1, 11, 11, 11, 11, 11, 4, 0],
                    [0, 0, 1, 1, 11, 11, 10, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 0, 1, 4, 4, 11, 11, 11, 1, 1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 4, 7, 7, 7, 4, 4, 4, 5, 0, 0, 0, 0, 0],
                    [0, 0, 0, 4, 4, 4, 4, 13, 13, 12, 12, 5, 0, 0, 0, 0],
                    [0, 0, 1, 4, 2, 2, 2, 4, 2, 2, 12, 2, 5, 1, 1, 0],
                    [0, 1, 3, 4, 2, 2, 4, 4, 2, 2, 12, 2, 1, 8, 1, 1],
                    [0, 1, 3, 4, 2, 2, 4, 13, 13, 13, 12, 5, 1, 4, 1, 1],
                    [0, 1, 3, 1, 4, 4, 13, 13, 13, 13, 5, 1, 4, 1, 1, 0],
                    [0, 1, 3, 8, 1, 0, 5, 5, 5, 5, 0, 1, 4, 1, 1, 0],
                    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ], [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 2, 4, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 2, 2, 2, 4],
                    [0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 2, 2, 2, 4],
                    [0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 2, 4, 0],
                    [0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 4, 4, 0],
                    [0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [0, 0, 3, 10, 1, 1, 1, 11, 1, 11, 1, 11, 3, 0, 0, 0],
                    [0, 3, 10, 4, 10, 1, 11, 10, 1, 10, 1, 10, 4, 4, 0, 0],
                    [0, 3, 11, 4, 10, 1, 1, 10, 10, 10, 10, 10, 10, 10, 4, 0],
                    [0, 3, 1, 11, 10, 1, 10, 10, 1, 11, 11, 11, 11, 11, 4, 0],
                    [0, 0, 1, 1, 11, 11, 10, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 4, 4, 4, 7, 4, 11, 11, 11, 1, 1, 1, 1, 0, 0, 0],
                    [4, 4, 2, 2, 4, 7, 4, 4, 4, 4, 5, 0, 0, 0, 0, 0],
                    [4, 2, 2, 2, 2, 4, 7, 13, 13, 12, 12, 5, 0, 0, 0, 0],
                    [4, 2, 2, 2, 2, 4, 13, 13, 2, 2, 12, 2, 5, 1, 1, 0],
                    [0, 4, 2, 2, 4, 13, 13, 13, 2, 2, 12, 2, 1, 8, 1, 1],
                    [0, 1, 3, 4, 13, 13, 13, 13, 13, 13, 12, 5, 1, 4, 1, 1],
                    [0, 1, 3, 5, 5, 5, 13, 13, 13, 13, 5, 1, 4, 1, 1, 0],
                    [0, 1, 3, 8, 1, 0, 5, 5, 5, 5, 0, 1, 4, 1, 1, 0],
                    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0]
                ], [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 0, 0, 0],
                    [0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 0, 0, 0],
                    [0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [0, 0, 3, 7, 1, 1, 1, 1, 1, 11, 1, 1, 0, 0, 0, 0],
                    [0, 3, 7, 7, 1, 1, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0],
                    [0, 3, 7, 10, 1, 1, 10, 10, 1, 10, 1, 10, 0, 0, 0, 0],
                    [0, 3, 10, 4, 10, 1, 10, 10, 1, 10, 1, 10, 4, 4, 0, 0],
                    [0, 1, 11, 4, 10, 1, 1, 10, 10, 10, 10, 10, 10, 10, 4, 0],
                    [0, 0, 1, 11, 11, 1, 10, 10, 1, 11, 11, 11, 11, 11, 4, 0],
                    [0, 4, 2, 2, 3, 11, 11, 1, 1, 1, 1, 1, 1, 1, 2, 3],
                    [4, 2, 2, 2, 2, 3, 11, 11, 11, 1, 1, 1, 1, 2, 2, 3],
                    [4, 2, 2, 2, 2, 3, 4, 4, 4, 4, 5, 4, 2, 1, 1, 0],
                    [0, 4, 2, 2, 3, 13, 13, 13, 13, 12, 12, 5, 1, 8, 1, 1],
                    [0, 1, 3, 3, 5, 13, 13, 13, 2, 2, 12, 2, 1, 4, 1, 1],
                    [0, 1, 4, 4, 5, 13, 13, 13, 2, 2, 12, 2, 1, 4, 1, 1],
                    [0, 1, 4, 8, 5, 5, 13, 13, 13, 13, 12, 5, 1, 4, 1, 1],
                    [0, 0, 1, 1, 0, 5, 5, 13, 13, 13, 5, 0, 0, 1, 1, 0],
                    [0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ], [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 0, 0, 0],
                    [0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 0, 0, 0],
                    [0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [0, 0, 3, 10, 1, 1, 1, 11, 1, 11, 1, 11, 0, 0, 0, 0],
                    [0, 3, 10, 4, 10, 1, 11, 10, 1, 10, 1, 10, 4, 4, 0, 0],
                    [0, 3, 11, 4, 10, 1, 1, 10, 10, 10, 10, 10, 10, 10, 4, 0],
                    [0, 3, 1, 11, 10, 1, 10, 10, 1, 11, 11, 11, 11, 11, 4, 0],
                    [0, 0, 1, 1, 11, 11, 10, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                    [4, 4, 4, 4, 4, 4, 11, 11, 11, 1, 1, 1, 1, 0, 0, 0],
                    [4, 2, 2, 2, 4, 7, 4, 4, 4, 4, 5, 0, 0, 0, 0, 0],
                    [0, 4, 2, 2, 4, 7, 7, 13, 13, 12, 12, 5, 0, 0, 0, 0],
                    [0, 0, 4, 4, 7, 7, 13, 13, 2, 2, 12, 2, 5, 0, 0, 0],
                    [0, 0, 0, 5, 13, 13, 13, 13, 2, 2, 12, 2, 5, 0, 0, 0],
                    [0, 0, 0, 5, 13, 13, 13, 13, 13, 13, 12, 12, 5, 0, 0, 0],
                    [0, 0, 0, 5, 5, 13, 13, 13, 13, 5, 13, 5, 0, 0, 0, 0],
                    [0, 0, 0, 0, 4, 4, 4, 4, 1, 4, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 4, 4, 4, 8, 1, 8, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
                ], [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 0, 0, 0],
                    [0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 0, 0, 0],
                    [0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [0, 0, 3, 10, 1, 1, 1, 11, 1, 11, 1, 11, 0, 0, 0, 0],
                    [0, 3, 10, 4, 10, 1, 11, 10, 1, 10, 1, 10, 4, 4, 0, 0],
                    [0, 3, 11, 4, 10, 1, 1, 10, 10, 10, 10, 10, 10, 10, 4, 0],
                    [0, 3, 1, 11, 10, 1, 10, 10, 1, 11, 11, 11, 11, 11, 4, 0],
                    [0, 0, 1, 1, 11, 11, 10, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                    [4, 4, 4, 4, 4, 4, 11, 11, 11, 1, 1, 1, 1, 0, 0, 0],
                    [4, 2, 2, 2, 4, 7, 4, 4, 4, 4, 5, 0, 0, 0, 0, 0],
                    [0, 4, 2, 2, 4, 7, 13, 13, 13, 12, 12, 5, 0, 0, 0, 0],
                    [0, 0, 4, 4, 7, 7, 13, 13, 2, 2, 12, 2, 5, 1, 1, 0],
                    [0, 1, 3, 3, 13, 13, 13, 13, 2, 2, 12, 2, 1, 8, 1, 1],
                    [0, 1, 3, 3, 13, 13, 13, 13, 13, 13, 12, 5, 1, 4, 1, 1],
                    [0, 1, 3, 1, 5, 5, 13, 13, 13, 13, 5, 1, 4, 1, 1, 0],
                    [0, 1, 3, 8, 1, 0, 5, 5, 5, 5, 0, 1, 4, 1, 1, 0],
                    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ], [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 3, 6, 8, 6, 6, 6, 3, 3, 0, 0, 0, 0],
                    [0, 0, 0, 0, 3, 2, 8, 8, 7, 7, 7, 7, 3, 0, 0, 0],
                    [0, 0, 0, 1, 1, 1, 1, 1, 1, 7, 7, 7, 7, 3, 0, 0],
                    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 7, 7, 3, 0],
                    [0, 0, 0, 0, 11, 11, 11, 11, 11, 1, 1, 1, 1, 7, 3, 0],
                    [0, 0, 0, 0, 10, 1, 10, 1, 10, 11, 1, 1, 10, 7, 7, 3],
                    [0, 0, 4, 4, 10, 1, 10, 1, 10, 10, 1, 10, 4, 10, 7, 3],
                    [0, 4, 10, 10, 10, 10, 10, 10, 10, 1, 1, 10, 4, 11, 7, 3],
                    [0, 4, 11, 11, 11, 11, 11, 1, 10, 10, 1, 10, 11, 1, 3, 0],
                    [0, 0, 1, 1, 1, 1, 1, 1, 4, 4, 4, 11, 1, 1, 7, 3],
                    [0, 0, 0, 1, 1, 1, 1, 4, 2, 2, 4, 4, 1, 2, 7, 3],
                    [0, 0, 0, 0, 3, 7, 7, 2, 2, 2, 2, 4, 2, 2, 2, 4],
                    [0, 0, 0, 0, 5, 3, 3, 2, 2, 2, 2, 4, 2, 2, 2, 4],
                    [0, 0, 0, 0, 5, 13, 3, 3, 3, 2, 4, 4, 4, 2, 4, 0],
                    [0, 0, 0, 0, 5, 13, 4, 8, 4, 4, 13, 2, 2, 4, 0, 0],
                    [0, 0, 0, 0, 0, 1, 4, 4, 1, 1, 13, 13, 13, 5, 0, 0],
                    [0, 0, 0, 0, 0, 1, 4, 1, 1, 1, 5, 13, 13, 13, 5, 0],
                    [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 4, 4, 1, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 4, 8, 1],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1]
                ], [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 0, 0, 0],
                    [0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 0, 0, 0],
                    [0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [0, 0, 3, 10, 1, 1, 1, 11, 1, 11, 1, 11, 0, 0, 0, 0],
                    [0, 3, 10, 4, 10, 1, 11, 10, 1, 10, 1, 10, 4, 4, 0, 0],
                    [0, 3, 11, 4, 10, 1, 1, 10, 10, 10, 10, 10, 10, 10, 4, 0],
                    [0, 3, 1, 11, 10, 1, 10, 10, 1, 11, 11, 11, 11, 11, 4, 0],
                    [0, 0, 1, 1, 11, 11, 10, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 0, 1, 4, 4, 11, 11, 11, 1, 1, 1, 1, 0, 0, 0],
                    [0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0],
                    [1, 8, 4, 2, 2, 2, 4, 7, 4, 12, 5, 0, 0, 0, 0, 0],
                    [0, 1, 4, 4, 2, 2, 4, 7, 4, 12, 12, 5, 0, 0, 0, 0],
                    [0, 0, 0, 5, 4, 4, 4, 2, 2, 12, 2, 5, 0, 0, 0, 0],
                    [0, 0, 0, 1, 1, 13, 13, 13, 2, 12, 2, 5, 0, 0, 0, 0],
                    [0, 0, 1, 4, 4, 5, 13, 13, 13, 13, 5, 0, 0, 0, 0, 0],
                    [0, 0, 1, 4, 4, 4, 5, 13, 5, 5, 0, 0, 0, 0, 0, 0],
                    [0, 0, 1, 8, 1, 1, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ], [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 3, 3, 6, 6, 6, 6, 3, 3, 0, 0, 0, 0, 0],
                    [0, 0, 3, 6, 6, 6, 6, 6, 7, 6, 6, 3, 0, 0, 0, 0],
                    [0, 3, 7, 7, 3, 3, 6, 7, 6, 6, 8, 6, 3, 0, 0, 0],
                    [0, 3, 7, 3, 2, 2, 3, 7, 7, 9, 8, 2, 3, 0, 0, 0],
                    [0, 3, 3, 2, 2, 2, 2, 3, 7, 6, 1, 1, 1, 1, 0, 0],
                    [0, 5, 3, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 0],
                    [5, 13, 1, 3, 3, 3, 3, 7, 10, 10, 10, 10, 10, 10, 4, 0],
                    [5, 13, 3, 7, 7, 7, 3, 12, 1, 11, 11, 11, 11, 11, 4, 0],
                    [5, 13, 3, 7, 7, 3, 13, 13, 5, 1, 1, 1, 1, 1, 0, 0],
                    [5, 13, 13, 3, 3, 13, 5, 5, 12, 5, 1, 1, 1, 0, 0, 0],
                    [5, 5, 13, 13, 5, 5, 4, 1, 4, 1, 0, 0, 0, 0, 0, 0],
                    [0, 5, 5, 5, 4, 4, 4, 8, 1, 8, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
                ], [
                    [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 3, 3, 6, 8, 8, 6, 3, 3, 0, 0, 0, 0],
                    [0, 0, 0, 3, 6, 6, 2, 8, 8, 2, 6, 6, 3, 0, 0, 0],
                    [0, 0, 3, 6, 6, 6, 1, 1, 1, 1, 6, 6, 6, 3, 0, 0],
                    [0, 0, 3, 6, 1, 1, 1, 1, 1, 1, 1, 1, 6, 3, 0, 0],
                    [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0],
                    [0, 0, 0, 3, 1, 6, 1, 6, 6, 1, 6, 1, 3, 0, 0, 0],
                    [0, 0, 1, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 1, 0, 0],
                    [0, 0, 0, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 0, 0, 0],
                    [0, 0, 1, 1, 6, 11, 1, 11, 11, 1, 11, 6, 1, 1, 0, 0],
                    [0, 4, 10, 1, 11, 11, 2, 2, 2, 2, 11, 11, 1, 10, 4, 0],
                    [0, 4, 10, 1, 1, 10, 10, 10, 10, 10, 10, 1, 1, 10, 4, 0],
                    [0, 4, 11, 1, 10, 1, 11, 11, 11, 11, 1, 10, 1, 11, 4, 0],
                    [4, 2, 4, 10, 1, 1, 1, 1, 1, 1, 1, 1, 10, 4, 0, 0],
                    [4, 2, 2, 4, 10, 10, 10, 3, 3, 10, 10, 10, 4, 4, 4, 0],
                    [0, 4, 6, 6, 4, 4, 10, 7, 7, 10, 4, 4, 6, 2, 2, 4],
                    [0, 4, 3, 6, 5, 4, 10, 6, 6, 10, 4, 1, 1, 1, 2, 4],
                    [0, 0, 0, 5, 12, 12, 4, 10, 10, 4, 2, 1, 1, 1, 1, 0],
                    [0, 0, 0, 5, 12, 2, 2, 4, 4, 2, 2, 1, 1, 1, 1, 0],
                    [0, 0, 1, 1, 1, 2, 2, 13, 13, 13, 5, 1, 1, 1, 1, 0],
                    [0, 1, 8, 4, 4, 1, 5, 5, 5, 5, 0, 1, 1, 1, 1, 0],
                    [0, 1, 1, 1, 1, 4, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0],
                    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ], [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 3, 3, 6, 8, 8, 6, 3, 3, 0, 0, 0],
                    [1, 1, 0, 1, 1, 6, 6, 2, 8, 8, 2, 6, 6, 3, 0, 0],
                    [1, 2, 1, 2, 1, 6, 6, 1, 1, 1, 1, 6, 6, 6, 3, 0],
                    [0, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 3, 0],
                    [1, 2, 1, 1, 1, 11, 11, 1, 11, 11, 1, 11, 11, 1, 3, 0],
                    [1, 1, 1, 2, 1, 10, 10, 1, 10, 10, 1, 10, 10, 1, 4, 0],
                    [1, 2, 1, 2, 1, 1, 10, 10, 10, 10, 10, 10, 1, 1, 10, 4],
                    [0, 1, 1, 1, 3, 10, 1, 11, 11, 11, 11, 1, 10, 4, 11, 4],
                    [0, 3, 7, 6, 3, 11, 1, 1, 1, 1, 1, 1, 11, 4, 4, 0],
                    [0, 0, 3, 7, 6, 4, 11, 1, 1, 1, 1, 11, 4, 7, 7, 4],
                    [0, 0, 3, 7, 6, 3, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4],
                    [0, 0, 0, 3, 6, 5, 12, 12, 12, 12, 12, 7, 7, 2, 2, 4],
                    [0, 0, 0, 0, 5, 13, 12, 2, 2, 12, 12, 2, 4, 2, 2, 4],
                    [0, 0, 0, 0, 5, 13, 13, 2, 2, 12, 12, 2, 5, 4, 4, 0],
                    [0, 0, 0, 5, 13, 13, 13, 13, 13, 12, 12, 12, 12, 5, 0, 0],
                    [0, 0, 0, 5, 13, 13, 13, 13, 13, 13, 13, 12, 12, 5, 0, 0],
                    [0, 0, 5, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 5, 0, 0],
                    [0, 1, 4, 4, 4, 5, 5, 5, 5, 5, 5, 4, 4, 4, 1, 0],
                    [1, 4, 8, 4, 1, 0, 0, 0, 0, 0, 0, 1, 4, 8, 4, 1],
                    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]
                ], [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 0, 0, 0],
                    [0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 0, 0, 0],
                    [0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [0, 0, 3, 10, 1, 1, 1, 11, 1, 11, 1, 11, 0, 0, 0, 0],
                    [0, 3, 10, 4, 10, 1, 11, 10, 1, 10, 1, 10, 4, 4, 0, 0],
                    [0, 3, 11, 4, 10, 1, 1, 10, 10, 10, 10, 10, 10, 10, 4, 0],
                    [0, 3, 1, 11, 10, 1, 10, 10, 1, 11, 11, 11, 11, 11, 4, 0],
                    [0, 0, 1, 1, 11, 11, 10, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 0, 1, 4, 4, 11, 11, 11, 1, 1, 1, 1, 0, 0, 0],
                    [0, 0, 4, 6, 6, 6, 4, 4, 4, 4, 5, 0, 0, 0, 0, 0],
                    [0, 4, 4, 6, 6, 7, 13, 13, 12, 12, 12, 5, 0, 1, 1, 0],
                    [4, 2, 2, 4, 7, 13, 13, 2, 2, 12, 2, 2, 5, 8, 1, 1],
                    [4, 2, 2, 2, 4, 13, 13, 2, 2, 12, 2, 2, 1, 4, 1, 1],
                    [4, 2, 2, 4, 5, 13, 13, 13, 13, 12, 12, 12, 1, 4, 1, 1],
                    [0, 4, 4, 0, 0, 5, 13, 13, 13, 5, 5, 5, 1, 4, 1, 1],
                    [0, 0, 0, 0, 1, 4, 4, 4, 1, 0, 0, 0, 0, 1, 1, 0],
                    [0, 0, 0, 0, 1, 4, 4, 4, 8, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0]
                ]];
            return _this;
        }
        Mario.prototype.onAction = function () {
            var _this = this;
            switch (this.doHitTest()) {
                case HitStatus.dammage:
                    this.gameOver();
                    break;
                case HitStatus.attack:
                    this.draw(11, null, this._attackDirection >= 0 ? false : true, false, true);
                    this.stop();
                    var waitTimer = setTimeout(function () {
                        _this.start();
                    }, this.frameInterval * 3);
                    break;
                default:
                    var actionIndex = this.executeRun();
                    actionIndex = this.executeJump() || actionIndex;
                    this.draw(actionIndex, null, this._isReverse, false, true);
            }
        };
        Mario.prototype.doHitTest = function () {
            if (this._gameMaster) {
                var enemys = this._gameMaster.getEnemys();
                for (var name_1 in enemys) {
                    if (!enemys[name_1].isKilled()) {
                        var ePos = enemys[name_1].getPosition();
                        var eSize = enemys[name_1].getCharSize();
                        if (this.position.y > ePos.y + eSize.height)
                            continue;
                        if (ePos.y > this.position.y + this.charHeight)
                            continue;
                        if (this.position.x > ePos.x + eSize.width)
                            continue;
                        if (ePos.x > this.position.x + this.charWidth)
                            continue;
                        if (enemys[name_1].isStepped()) {
                            var playerCenter = this.position.x + this.charWidth / 2;
                            var enemyCenter = ePos.x + eSize.width / 2;
                            this._attackDirection = playerCenter <= enemyCenter ? 1 : -1;
                            enemys[name_1].onKicked(this._attackDirection, this._speed * 3);
                            return HitStatus.attack;
                        }
                        if (this._isJumping && this._yVector < 0) {
                            enemys[name_1].onStepped();
                            this._yVector = 12 * this.pixSize;
                            continue;
                        }
                        return HitStatus.dammage;
                    }
                }
            }
            return HitStatus.none;
        };
        Mario.prototype.executeJump = function () {
            if (this._isJumping) {
                this._yVector -= this._gravity * this.pixSize;
                this.position.y = this.position.y + this._yVector;
                if (this.position.y <= 0) {
                    this._isJumping = false;
                    this._yVector = 0;
                    this.position.y = 0;
                    return null;
                }
                else {
                    if (this._speed > 8) {
                        if (this._yVector > 0 && this.position.y < this.charHeight * 3) {
                            return null;
                        }
                        else {
                            return 7;
                        }
                    }
                    else {
                        return this._yVector > 0 ? 2 : 3;
                    }
                }
            }
            else {
                return null;
            }
        };
        Mario.prototype.executeRun = function () {
            var directionUpdated = this.updateDirection();
            if (!this._isReverse) {
                this.position.x += this.pixSize * this._speed;
            }
            else {
                this.position.x -= this.pixSize * this._speed;
            }
            if (this._isSquat) {
                return 8;
            }
            var runIndex = this._runIndex;
            if (this._currentStep < Mario.STEP) {
                this._currentStep++;
            }
            else {
                this._currentStep = 0;
                this._runIndex = this._runIndex ^ 1;
            }
            // Speed up action
            if (this._speed > 8) {
                runIndex = this._runIndex == 0 ? 4 : 5;
            }
            else {
                runIndex = this._runIndex;
            }
            // Braking action
            if (!this._isJumping) {
                if (this._speed > 5 || (!directionUpdated && this._isBraking)) {
                    if ((this._isReverse && this.position.x < this.charWidth * 3) ||
                        (!this._isReverse && this.position.x > this.targetDom.clientWidth - this.charWidth * 4)) {
                        runIndex = 6;
                        if (this._speed > 2)
                            this._speed--;
                        this._isBraking = true;
                    }
                }
                else {
                    this._isBraking = false;
                }
            }
            return runIndex;
        };
        Mario.prototype.onJump = function () {
            if (!this._isJumping) {
                this._isJumping = true;
                this._yVector = this._jumpPower * this.pixSize;
            }
        };
        Mario.prototype.onAbortJump = function () {
            if (this._yVector > 0) {
                this._yVector = 0;
            }
        };
        Mario.prototype.onSpeedUp = function () {
            var _this = this;
            if (!this._speedUpTimer) {
                if (this._speedDownTimer) {
                    clearInterval(this._speedDownTimer);
                    this._speedDownTimer = null;
                }
                this._speedUpTimer = setInterval(function () {
                    if (_this._speed < 10) {
                        if (!_this._isBraking)
                            _this._speed++;
                    }
                    else {
                        clearInterval(_this._speedUpTimer);
                        _this._speedUpTimer = null;
                    }
                }, this.frameInterval);
            }
        };
        Mario.prototype.onAbortSpeedUp = function () {
            var _this = this;
            if (!this._speedDownTimer) {
                this._speedDownTimer = setInterval(function () {
                    if (_this._speedUpTimer) {
                        clearInterval(_this._speedUpTimer);
                        _this._speedUpTimer = null;
                    }
                    if (_this._speed > 2) {
                        _this._speed--;
                    }
                    else {
                        clearInterval(_this._speedDownTimer);
                        _this._speedDownTimer = null;
                        _this._isBraking = false;
                    }
                }, this.frameInterval);
            }
        };
        Mario.prototype.onSquat = function () {
            var _this = this;
            this.onAbortSpeedUp();
            this._isSquat = true;
            if (!this._squatTimer) {
                this._squatTimer = setInterval(function () {
                    if (_this._speed > 0) {
                        _this._speed--;
                    }
                    else {
                        clearInterval(_this._squatTimer);
                        _this._squatTimer = null;
                    }
                }, this.frameInterval);
            }
        };
        Mario.prototype.onAbortSquat = function () {
            if (this._squatTimer) {
                clearInterval(this._squatTimer);
                this._squatTimer = null;
            }
            this._speed = Mario.DEFAULT_SPEED;
            this._isSquat = false;
        };
        Mario.prototype.gameOver = function () {
            var _this = this;
            if (this._gameMaster)
                this._gameMaster.doGameOver();
            this.stop();
            this._gameOverTimer = setInterval(function () {
                if (_this._gameOverWaitCount < 20) {
                    _this._gameOverWaitCount++;
                    _this.draw(9, null, false, false, true);
                    _this._yVector = _this._jumpPower * _this.pixSize;
                    return;
                }
                _this._yVector -= _this._gravity * _this.pixSize;
                _this.position.y = _this.position.y + _this._yVector;
                if (_this.position.y < _this.charHeight * 5 * -1) {
                    clearInterval(_this._gameOverTimer);
                    _this.destroy();
                    return;
                }
                if (_this._currentStep < Mario.STEP) {
                    _this._currentStep++;
                }
                else {
                    _this._currentStep = 0;
                    _this._runIndex = _this._runIndex ^ 1;
                }
                _this.draw(9, null, _this._runIndex == 0 ? true : false, false, true);
            }, this.frameInterval);
        };
        Mario.prototype.gool = function () {
            var _this = this;
            if (this._gameMaster)
                this._gameMaster.doGool();
            this._speed = 1;
            var blackScreen = document.createElement('div');
            if (this.targetDom == document.body)
                this.targetDom.style.cssText = 'margin: 0px;'; // only document body 
            var goolDimTimer = setInterval(function () {
                if (Math.floor(_this._backgroundOpacity) != 1) {
                    _this._backgroundOpacity += 0.01;
                }
                else {
                    _this.stop();
                    _this.draw(10, null, false, false, true);
                    clearInterval(goolDimTimer);
                    var goolDimOffTimer_1 = setInterval(function () {
                        if (Math.ceil(_this._backgroundOpacity) != 0) {
                            _this._backgroundOpacity -= 0.02;
                        }
                        else {
                            clearInterval(goolDimOffTimer_1);
                            _this.start();
                            var circleSize_1 = _this.targetDom.clientWidth > _this.targetDom.clientHeight ? _this.targetDom.clientWidth : _this.targetDom.clientHeight;
                            var circleAnimationCount_1 = 0;
                            var circleTimer_1 = setInterval(function () {
                                circleSize_1 -= 5;
                                _this.drawBlackClipCircle(_this.targetDom, _this.position, circleSize_1, circleAnimationCount_1);
                                circleAnimationCount_1++;
                                if (circleSize_1 <= 0) {
                                    clearInterval(circleTimer_1);
                                    _this.destroy();
                                }
                            }, 1);
                        }
                        blackScreen.style.cssText = "z-index: " + (_this.zIndex - 3) + "; position: absolute; background-color:black; width: 100%; height: 100%; border: 0;opacity: " + _this._backgroundOpacity + ";";
                    }, _this.frameInterval);
                }
                blackScreen.style.cssText = "z-index: " + (_this.zIndex - 3) + "; position: absolute; background-color:black; width: 100%; height: 100%; border: 0;opacity: " + _this._backgroundOpacity + ";";
            }, this.frameInterval);
            this.targetDom.appendChild(blackScreen);
        };
        Mario.prototype.drawBlackClipCircle = function (targetDom, position, size, count) {
            var element = document.createElement("canvas");
            element.id = "brackout_circle_" + count;
            var ctx = element.getContext("2d");
            var width = this.targetDom.clientWidth;
            var height = this.targetDom.clientHeight;
            element.setAttribute("width", width.toString());
            element.setAttribute("height", height.toString());
            element.style.cssText = "z-index: " + (this.zIndex + 1) + "; position: absolute;";
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, width, height);
            if (size > 0) {
                ctx.globalCompositeOperation = "destination-out";
                ctx.beginPath();
                ctx.arc(position.x + this.charWidth / 2, height - position.y - this.charHeight / 2, size, 0, Math.PI * 2, false);
            }
            ctx.fill();
            targetDom.appendChild(element);
            if (count != 0)
                targetDom.removeChild(document.getElementById("brackout_circle_" + (count - 1)));
        };
        Mario.prototype.registerActionCommand = function () {
            var _this = this;
            if (this.checkMobile()) {
                document.addEventListener('touchstart', function (e) {
                    _this.onJump();
                });
                document.addEventListener('touchend', function (e) {
                    _this.onAbortJump();
                });
                document.addEventListener('touchcancel', function (e) {
                    _this.onAbortJump();
                });
                window.addEventListener('devicemotion', function (e) {
                    if (Math.abs(e.rotationRate.gamma) > 20 && _this._canSpeedUpForMobile) {
                        if (_this._isReverse && e.rotationRate.gamma > 0) {
                            _this._canSpeedUpForMobile = false;
                            _this.onSpeedUp();
                        }
                        else if (!_this._isReverse && e.rotationRate.gamma < 0) {
                            _this._canSpeedUpForMobile = false;
                            _this.onSpeedUp();
                        }
                    }
                    else {
                        if (!_this._canSpeedUpForMobile) {
                            _this.onAbortSpeedUp();
                            _this._canSpeedUpForMobile = true;
                        }
                    }
                });
            }
            else {
                document.addEventListener('keydown', function (e) {
                    if (e.keyCode == 65 && !_this._isSquat) {
                        _this.onJump();
                    }
                    if (e.keyCode == 66 && !_this._isJumping && !_this._isSquat) {
                        _this.onSpeedUp();
                    }
                    if (e.keyCode == 40 && !_this._isJumping) {
                        _this.onSquat();
                    }
                });
                document.addEventListener('keyup', function (e) {
                    if (e.keyCode == 65) {
                        _this.onAbortJump();
                    }
                    if (e.keyCode == 66) {
                        _this.onAbortSpeedUp();
                    }
                    if (e.keyCode == 40) {
                        _this.onAbortSquat();
                    }
                });
            }
        };
        return Mario;
    }(Character.AbstractCharacter));
    Mario.STEP = 2;
    Mario.DEFAULT_SPEED = 2;
    Character.Mario = Mario;
})(Character || (Character = {}));
//# sourceMappingURL=mario_world.js.map