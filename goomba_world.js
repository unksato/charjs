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
    var Goomba = (function (_super) {
        __extends(Goomba, _super);
        function Goomba() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.colors = ['', '#000000', '#ffffff', '#b82800', '#f88800', '#f87800', '#f8c000', '#f8f800'];
            _this.chars = [[
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 1, 3, 3, 3, 3, 1, 1, 0, 0, 0, 0],
                    [0, 0, 0, 1, 4, 1, 1, 1, 1, 3, 3, 3, 1, 1, 1, 1],
                    [0, 0, 1, 4, 2, 4, 3, 1, 1, 1, 3, 1, 1, 1, 0, 0],
                    [0, 1, 3, 3, 4, 3, 3, 3, 2, 1, 1, 1, 2, 3, 1, 0],
                    [0, 1, 3, 3, 3, 3, 3, 2, 2, 2, 3, 2, 2, 2, 3, 1],
                    [1, 3, 3, 3, 3, 3, 3, 2, 2, 1, 3, 1, 2, 2, 3, 1],
                    [1, 3, 3, 3, 3, 3, 3, 3, 2, 2, 3, 2, 2, 3, 3, 1],
                    [1, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 3, 3, 1],
                    [0, 1, 3, 3, 3, 4, 4, 2, 1, 1, 1, 1, 2, 3, 1, 0],
                    [0, 5, 5, 5, 4, 4, 1, 1, 4, 4, 4, 4, 1, 4, 4, 0],
                    [5, 6, 6, 7, 5, 5, 4, 4, 4, 4, 4, 4, 4, 1, 4, 0],
                    [1, 6, 6, 7, 7, 2, 5, 0, 0, 0, 0, 1, 1, 7, 2, 1],
                    [0, 1, 1, 6, 7, 7, 5, 1, 1, 1, 1, 6, 6, 1, 1, 0],
                    [0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0]
                ], [
                    [0.0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 1, 3, 3, 3, 3, 1, 1, 0, 0, 0, 0],
                    [0, 0, 0, 1, 4, 3, 3, 3, 1, 1, 1, 3, 1, 1, 1, 0],
                    [0, 0, 1, 4, 2, 4, 3, 3, 3, 3, 1, 1, 3, 1, 1, 0],
                    [0, 1, 3, 3, 4, 3, 3, 3, 3, 3, 2, 1, 1, 1, 2, 0],
                    [0, 1, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 1, 2, 2, 0],
                    [1, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 3, 1, 2, 1],
                    [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 3, 2, 2, 1],
                    [1, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 1],
                    [0, 1, 3, 3, 3, 3, 3, 4, 4, 2, 1, 1, 1, 1, 1, 0],
                    [0, 1, 3, 3, 3, 3, 4, 4, 1, 1, 4, 4, 4, 4, 1, 0],
                    [0, 0, 1, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 1, 0, 0],
                    [0, 0, 0, 1, 1, 5, 5, 5, 5, 5, 4, 1, 1, 0, 0, 0],
                    [0, 0, 0, 0, 0, 5, 6, 6, 7, 7, 5, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 5, 6, 6, 6, 6, 2, 5, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
                ]];
            _this.useVertical = true;
            _this.isEnemy = true;
            _this._speed = 1;
            _this._currentStep = 0;
            _this._actionIndex = 0;
            _this._isKilled = false;
            _this._vertical = Character.Vertical.up;
            return _this;
        }
        Goomba.prototype.isKilled = function () {
            return this._isKilled;
        };
        Goomba.prototype.onAction = function () {
            var directionUpdated = this.updateDirection();
            if (this.doHitTestWithOtherEnemy()) {
                this._direction = this._direction == Character.Direction.right ? Character.Direction.left : Character.Direction.right;
            }
            if (this._direction == Character.Direction.right) {
                this.position.x += this.pixSize * this._speed;
            }
            else {
                this.position.x -= this.pixSize * this._speed;
            }
            if (this._currentStep < Goomba.STEP) {
                this._currentStep++;
            }
            else {
                this._currentStep = 0;
                this._actionIndex = this._actionIndex ^ 1;
            }
            this.draw(this._actionIndex, null, this._direction, this._vertical, true);
        };
        Goomba.prototype.isStepped = function () {
            return this._vertical == Character.Vertical.down;
        };
        Goomba.prototype.onStepped = function () {
            this._vertical = Character.Vertical.down;
            this._speed = 0;
        };
        Goomba.prototype.onKicked = function (direction, kickPower) {
            var _this = this;
            this.stop();
            this._isKilled = true;
            var yVector = 10 * this.pixSize;
            var killTimer = setInterval(function () {
                yVector -= _this._gravity * _this.pixSize;
                _this.position.y = _this.position.y + yVector;
                _this.position.x += kickPower * direction;
                if (_this.position.y < _this.charHeight * 5 * -1) {
                    clearInterval(killTimer);
                    _this.destroy();
                    return;
                }
                if (_this._currentStep < Goomba.STEP) {
                    _this._currentStep++;
                }
                else {
                    _this._currentStep = 0;
                    _this._actionIndex = _this._actionIndex ^ 1;
                }
                _this.draw(_this._actionIndex, null, direction > 0 ? Character.Direction.right : Character.Direction.left, Character.Vertical.down, true);
            }, this.frameInterval);
        };
        Goomba.prototype.doHitTestWithOtherEnemy = function () {
            if (this._gameMaster) {
                var enemys = this._gameMaster.getEnemys();
                for (var name_1 in enemys) {
                    if (enemys[name_1] != this) {
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
                        return true;
                    }
                }
            }
            return false;
        };
        Goomba.prototype.registerActionCommand = function () {
        };
        return Goomba;
    }(Character.AbstractCharacter));
    Goomba.STEP = 2;
    Character.Goomba = Goomba;
})(Character || (Character = {}));
//# sourceMappingURL=goomba_world.js.map