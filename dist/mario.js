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
    var Position = (function () {
        function Position() {
            this.x = 0;
            this.y = 0;
        }
        return Position;
    }());
    Character.Position = Position;
    var Direction;
    (function (Direction) {
        Direction[Direction["right"] = 0] = "right";
        Direction[Direction["left"] = 1] = "left";
    })(Direction = Character.Direction || (Character.Direction = {}));
    var Vertical;
    (function (Vertical) {
        Vertical[Vertical["up"] = 0] = "up";
        Vertical[Vertical["down"] = 1] = "down";
    })(Vertical = Character.Vertical || (Character.Vertical = {}));
    var AbstractCharacter = (function () {
        function AbstractCharacter(targetDom, pixSize, position, _direction, zIndex, frameInterval) {
            if (pixSize === void 0) { pixSize = 2; }
            if (position === void 0) { position = { x: 0, y: 0 }; }
            if (_direction === void 0) { _direction = Direction.right; }
            if (zIndex === void 0) { zIndex = 2147483645; }
            if (frameInterval === void 0) { frameInterval = 45; }
            var _this = this;
            this.targetDom = targetDom;
            this.pixSize = pixSize;
            this.position = position;
            this._direction = _direction;
            this.zIndex = zIndex;
            this.frameInterval = frameInterval;
            this._name = '';
            this.cssTextTemplate = "z-index: " + this.zIndex + "; position: absolute; bottom: 0;";
            this.currentAction = null;
            this._rightActions = [];
            this._leftActions = [];
            this._verticalRightActions = [];
            this._verticalLeftActions = [];
            this.charWidth = null;
            this.charHeight = null;
            this._gameMaster = null;
            this._isStarting = false;
            this._frameTimer = null;
            this._gravity = 2;
            this.defaultCommand = function (e) {
                if (e.keyCode == 32) {
                    if (_this._isStarting) {
                        _this.stop();
                    }
                    else {
                        _this.start();
                    }
                }
            };
        }
        AbstractCharacter.prototype.init = function () {
            for (var _i = 0, _a = this.chars; _i < _a.length; _i++) {
                var charactor = _a[_i];
                this._rightActions.push(this.createCharacterAction(charactor));
                this._leftActions.push(this.createCharacterAction(charactor, true));
                if (this.useVertical) {
                    this._verticalRightActions.push(this.createCharacterAction(charactor, false, true));
                    this._verticalLeftActions.push(this.createCharacterAction(charactor, true, true));
                }
            }
        };
        AbstractCharacter.prototype.createCharacterAction = function (charactorMap, isReverse, isVerticalRotation) {
            if (isReverse === void 0) { isReverse = false; }
            if (isVerticalRotation === void 0) { isVerticalRotation = false; }
            var element = document.createElement("canvas");
            var ctx = element.getContext("2d");
            this.charWidth = this.pixSize * charactorMap[0].length + 1;
            this.charHeight = this.pixSize * charactorMap.length;
            element.setAttribute("width", this.charWidth.toString());
            element.setAttribute("height", this.charHeight.toString());
            element.style.cssText = this.cssTextTemplate;
            AbstractCharacter.drawCharacter(ctx, charactorMap, this.colors, this.pixSize, isReverse, isVerticalRotation);
            return element;
        };
        AbstractCharacter.drawCharacter = function (ctx, map, colors, size, reverse, vertical) {
            if (reverse)
                ctx.transform(-1, 0, 0, 1, map[0].length * size, 0);
            if (vertical)
                ctx.transform(1, 0, 0, -1, 0, map.length * size);
            for (var y = 0; y < map.length; y++) {
                for (var x = 0; x < map[y].length; x++) {
                    if (map[y][x] != 0) {
                        ctx.beginPath();
                        ctx.rect(x * size, y * size, size, size);
                        ctx.fillStyle = colors[map[y][x]];
                        ctx.fill();
                    }
                }
            }
        };
        AbstractCharacter.prototype.removeCharacter = function () {
            if (this.currentAction != null) {
                this.targetDom.removeChild(this.currentAction);
                this.currentAction = null;
            }
        };
        AbstractCharacter.prototype.draw = function (index, position, direction, vertical, removeCurrent) {
            if (index === void 0) { index = 0; }
            if (position === void 0) { position = null; }
            if (direction === void 0) { direction = Direction.right; }
            if (vertical === void 0) { vertical = Vertical.up; }
            if (removeCurrent === void 0) { removeCurrent = false; }
            if (removeCurrent)
                this.removeCharacter();
            position = position || this.position;
            if (vertical == Vertical.up) {
                this.currentAction = direction == Direction.right ? this._rightActions[index] : this._leftActions[index];
            }
            else {
                this.currentAction = direction == Direction.right ? this._verticalRightActions[index] : this._verticalLeftActions[index];
            }
            this.currentAction.style.left = position.x + 'px';
            this.currentAction.style.bottom = this.position.y + 'px';
            this.targetDom.appendChild(this.currentAction);
        };
        AbstractCharacter.prototype.registerCommand = function () {
            document.addEventListener('keypress', this.defaultCommand);
            this.registerActionCommand();
        };
        AbstractCharacter.prototype.start = function () {
            var _this = this;
            this.registerCommand();
            this._isStarting = true;
            this._frameTimer = setInterval(function () { _this.onAction(); }, this.frameInterval);
        };
        AbstractCharacter.prototype.stop = function () {
            if (this._frameTimer) {
                clearInterval(this._frameTimer);
                this._frameTimer = null;
            }
            this._isStarting = false;
        };
        AbstractCharacter.prototype.destroy = function () {
            this.stop();
            this.removeCharacter();
            if (this._gameMaster && this.isEnemy) {
                this._gameMaster.deleteEnemy(this);
            }
            document.removeEventListener('keypress', this.defaultCommand);
        };
        AbstractCharacter.prototype.getPosition = function () {
            return this.position;
        };
        AbstractCharacter.prototype.setPosition = function (pos) {
            this.position = pos;
        };
        AbstractCharacter.prototype.getCharSize = function () {
            return { height: this.charHeight, width: this.charWidth };
        };
        AbstractCharacter.prototype.updateDirection = function () {
            var currentDirection = this._direction;
            if (this.position.x > this.targetDom.clientWidth - this.charWidth - (this.pixSize * 2) && this._direction == Direction.right) {
                this._direction = Direction.left;
            }
            if (this.position.x < 0 && this._direction == Direction.left) {
                this._direction = Direction.right;
            }
            return currentDirection != this._direction;
        };
        AbstractCharacter.prototype.checkMobile = function () {
            if ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {
                return true;
            }
            else {
                return false;
            }
        };
        return AbstractCharacter;
    }());
    Character.AbstractCharacter = AbstractCharacter;
})(Character || (Character = {}));
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
            _this._isSpecial = false;
            _this._isBraking = false;
            _this._isSquat = false;
            _this._attackDirection = Character.Direction.right;
            _this._specialAnimationIndex = 0;
            _this._specialAnimation = [{ index: 0, direction: Character.Direction.right }, { index: 12, direction: Character.Direction.right }, { index: 0, direction: Character.Direction.left }, { index: 13, direction: Character.Direction.right }];
            _this._grabedEnemy = null;
            _this._grabbing = false;
            _this._backgroundOpacity = 0;
            _this._canSpeedUpForMobile = true;
            _this._screenModeForMobile = 'PORTRAIT';
            _this._deviceDirection = 1;
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
                ], [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 3, 3, 6, 8, 8, 6, 3, 3, 0, 0, 0, 0],
                    [0, 0, 0, 3, 6, 6, 8, 8, 8, 2, 6, 6, 3, 0, 0, 0],
                    [0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 6, 6, 6, 3, 0, 0],
                    [0, 0, 3, 7, 1, 1, 1, 1, 1, 1, 1, 1, 6, 3, 0, 0],
                    [0, 0, 4, 1, 11, 11, 1, 11, 11, 1, 11, 11, 1, 4, 0, 0],
                    [0, 4, 10, 1, 10, 10, 1, 10, 10, 1, 10, 10, 1, 10, 4, 0],
                    [0, 4, 11, 1, 1, 10, 10, 10, 10, 10, 10, 1, 1, 11, 4, 0],
                    [0, 0, 4, 1, 10, 1, 11, 11, 11, 11, 1, 10, 1, 4, 0, 0],
                    [0, 0, 0, 4, 11, 1, 1, 1, 1, 1, 1, 11, 4, 0, 0, 0],
                    [0, 0, 0, 0, 4, 11, 1, 1, 1, 1, 11, 4, 0, 0, 0, 0],
                    [0, 0, 0, 3, 7, 4, 4, 4, 4, 4, 4, 6, 3, 0, 0, 0],
                    [0, 0, 3, 7, 7, 13, 12, 12, 12, 12, 12, 7, 6, 3, 0, 0],
                    [0, 0, 4, 7, 13, 2, 2, 12, 12, 2, 2, 12, 7, 4, 0, 0],
                    [0, 4, 2, 4, 13, 2, 2, 12, 12, 2, 2, 12, 4, 2, 4, 0],
                    [0, 4, 2, 4, 13, 13, 13, 13, 12, 12, 12, 12, 4, 2, 4, 0],
                    [0, 0, 4, 4, 5, 13, 13, 5, 5, 13, 13, 5, 4, 4, 0, 0],
                    [0, 0, 0, 0, 1, 4, 4, 4, 4, 4, 4, 1, 0, 0, 0, 0],
                    [0, 0, 0, 1, 4, 8, 4, 1, 1, 4, 8, 4, 1, 0, 0, 0],
                    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0]
                ], [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 3, 3, 6, 6, 6, 6, 3, 3, 0, 0, 0, 0],
                    [0, 0, 0, 3, 6, 6, 6, 6, 6, 6, 6, 6, 3, 0, 0, 0],
                    [0, 0, 3, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 3, 0, 0],
                    [0, 0, 3, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 3, 0, 0],
                    [0, 0, 4, 7, 6, 6, 6, 6, 6, 6, 6, 6, 7, 4, 0, 0],
                    [0, 0, 4, 3, 7, 7, 6, 6, 6, 6, 7, 7, 3, 4, 0, 0],
                    [0, 4, 10, 1, 3, 3, 7, 7, 7, 7, 3, 3, 1, 10, 4, 0],
                    [0, 4, 11, 1, 1, 1, 3, 3, 3, 3, 1, 1, 1, 11, 4, 0],
                    [0, 0, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 0, 0],
                    [0, 0, 0, 0, 11, 1, 1, 1, 1, 1, 1, 11, 0, 0, 0, 0],
                    [0, 0, 0, 3, 3, 12, 12, 1, 1, 12, 12, 3, 3, 0, 0, 0],
                    [0, 0, 3, 7, 5, 12, 12, 8, 8, 12, 12, 5, 7, 3, 0, 0],
                    [0, 0, 3, 5, 12, 12, 12, 12, 12, 12, 12, 12, 5, 3, 0, 0],
                    [0, 0, 3, 5, 5, 5, 12, 12, 12, 12, 5, 5, 5, 3, 0, 0],
                    [0, 0, 0, 5, 12, 12, 5, 12, 12, 5, 13, 13, 5, 0, 0, 0],
                    [0, 0, 0, 0, 5, 13, 5, 5, 5, 5, 13, 5, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 4, 4, 4, 4, 4, 4, 1, 0, 0, 0, 0],
                    [0, 0, 0, 1, 4, 4, 4, 1, 1, 4, 4, 4, 1, 0, 0, 0],
                    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0]
                ], [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 0, 0, 0],
                    [0, 0, 0, 0, 3, 6, 6, 7, 7, 8, 8, 2, 3, 0, 0, 0],
                    [0, 0, 0, 3, 6, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [0, 0, 3, 10, 1, 1, 1, 11, 1, 11, 1, 11, 0, 0, 0, 0],
                    [0, 3, 10, 4, 10, 1, 11, 10, 1, 10, 1, 10, 0, 0, 0, 0],
                    [0, 3, 11, 4, 10, 1, 1, 10, 10, 10, 10, 10, 10, 10, 4, 0],
                    [0, 3, 1, 11, 11, 1, 10, 10, 1, 11, 11, 11, 11, 11, 4, 0],
                    [5, 13, 13, 13, 13, 11, 11, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                    [5, 13, 13, 13, 13, 13, 3, 6, 6, 6, 4, 4, 4, 4, 0, 0],
                    [5, 13, 13, 13, 5, 5, 3, 7, 7, 6, 6, 3, 2, 4, 4, 4],
                    [5, 13, 13, 13, 13, 13, 13, 3, 3, 7, 7, 3, 2, 2, 2, 4],
                    [0, 5, 13, 13, 1, 4, 4, 4, 1, 3, 3, 3, 2, 2, 2, 4],
                    [0, 0, 5, 5, 1, 4, 4, 4, 8, 1, 8, 1, 4, 4, 4, 0],
                    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
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
                    [0, 0, 0, 1, 4, 4, 11, 11, 11, 1, 1, 4, 4, 4, 0, 0],
                    [0, 0, 0, 0, 5, 13, 4, 4, 4, 4, 4, 3, 2, 4, 4, 4],
                    [0, 0, 0, 5, 13, 13, 3, 6, 6, 6, 6, 3, 2, 2, 2, 4],
                    [0, 0, 0, 5, 13, 13, 3, 7, 7, 7, 7, 3, 2, 2, 2, 4],
                    [0, 0, 0, 5, 13, 13, 13, 3, 3, 3, 3, 3, 4, 4, 4, 0],
                    [0, 0, 0, 5, 13, 13, 13, 13, 13, 13, 12, 12, 5, 0, 0, 0],
                    [0, 0, 0, 5, 13, 13, 13, 13, 13, 5, 13, 5, 0, 0, 0, 0],
                    [0, 0, 0, 0, 5, 4, 4, 4, 1, 4, 1, 0, 0, 0, 0, 0],
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
                    [0, 0, 0, 1, 4, 11, 11, 11, 11, 1, 1, 4, 4, 4, 0, 0],
                    [0, 0, 0, 0, 5, 4, 4, 4, 4, 4, 4, 3, 2, 4, 4, 4],
                    [0, 0, 0, 5, 5, 13, 3, 6, 6, 6, 6, 3, 2, 2, 2, 4],
                    [0, 0, 1, 5, 13, 13, 3, 7, 7, 7, 7, 3, 2, 2, 2, 4],
                    [0, 1, 4, 5, 13, 13, 13, 3, 3, 3, 3, 3, 4, 4, 4, 1],
                    [0, 1, 4, 5, 13, 13, 13, 13, 13, 13, 12, 5, 1, 4, 1, 1],
                    [0, 1, 4, 1, 5, 5, 13, 13, 13, 13, 5, 1, 4, 1, 1, 0],
                    [0, 1, 4, 8, 1, 0, 5, 5, 5, 5, 0, 1, 4, 1, 1, 0],
                    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
                    this.draw(11, null, this._attackDirection, Character.Vertical.up, true);
                    this.stop();
                    var waitTimer = setTimeout(function () {
                        _this.start();
                    }, this.frameInterval * 3);
                    break;
                default:
                    var action = this.executeRun();
                    action = this.executeJump() || action;
                    this.draw(action.index, null, action.direction, Character.Vertical.up, true);
            }
        };
        Mario.prototype.doHitTest = function () {
            if (this._gameMaster) {
                var enemys = this._gameMaster.getEnemys();
                for (var name_2 in enemys) {
                    if (!enemys[name_2].isKilled()) {
                        var ePos = enemys[name_2].getPosition();
                        var eSize = enemys[name_2].getCharSize();
                        if (this.position.y > ePos.y + eSize.height)
                            continue;
                        if (ePos.y > this.position.y + this.charHeight)
                            continue;
                        if (this.position.x > ePos.x + eSize.width)
                            continue;
                        if (ePos.x > this.position.x + this.charWidth)
                            continue;
                        if (enemys[name_2].isStepped()) {
                            if (!this._grabbing) {
                                var playerCenter = this.position.x + this.charWidth / 2;
                                var enemyCenter = ePos.x + eSize.width / 2;
                                this._attackDirection = playerCenter <= enemyCenter ? 1 : -1;
                                enemys[name_2].onKicked(this._attackDirection, this._speed * 3);
                                return HitStatus.attack;
                            }
                            else {
                                this.grabEnemy(enemys[name_2]);
                                continue;
                            }
                        }
                        if (this._isJumping && this._yVector < 0) {
                            if (this._isSpecial) {
                                var playerCenter = this.position.x + this.charWidth / 2;
                                var enemyCenter = ePos.x + eSize.width / 2;
                                this._attackDirection = playerCenter <= enemyCenter ? 1 : -1;
                                enemys[name_2].onKicked(this._attackDirection, this._speed * 3);
                            }
                            else {
                                enemys[name_2].onStepped();
                            }
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
                    if (!this._isSpecial) {
                        if (this._speed > 8) {
                            if (this._yVector > 0 && this.position.y < this.charHeight * 3) {
                                return null;
                            }
                            else {
                                return { index: 7, direction: this._direction };
                            }
                        }
                        else {
                            return { index: this._yVector > 0 ? 2 : 3, direction: this._direction };
                        }
                    }
                    else {
                        this._specialAnimationIndex++;
                        if (this._specialAnimationIndex > this._specialAnimation.length)
                            this._specialAnimationIndex = 0;
                        return this._specialAnimation[this._specialAnimationIndex];
                    }
                }
            }
            else {
                return null;
            }
        };
        Mario.prototype.executeRun = function () {
            var directionUpdated = this.updateDirection();
            if (this._direction == Character.Direction.right) {
                this.position.x += this.pixSize * this._speed;
            }
            else {
                this.position.x -= this.pixSize * this._speed;
            }
            if (this._isSquat) {
                return { index: 8, direction: this._direction };
            }
            var runIndex = this._runIndex;
            if (this._currentStep < Mario.STEP) {
                this._currentStep++;
            }
            else {
                this._currentStep = 0;
                this._runIndex = this._runIndex ^ 1;
            }
            if (this._speed > 8) {
                runIndex = this._runIndex == 0 ? 4 : 5;
            }
            else {
                runIndex = this._runIndex;
            }
            if (!this._isJumping) {
                if (this._speed > 5 || (!directionUpdated && this._isBraking)) {
                    if ((this._direction == Character.Direction.left && this.position.x < this.charWidth * 3) ||
                        (this._direction == Character.Direction.right && this.position.x > this.targetDom.clientWidth - this.charWidth * 4)) {
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
            return { index: runIndex, direction: this._direction };
            ;
        };
        Mario.prototype.grabEnemy = function (enemy) {
            this._grabedEnemy = enemy;
            enemy.stop();
        };
        Mario.prototype.putEnemy = function () {
        };
        Mario.prototype.onGrab = function () {
            this._grabbing = true;
        };
        Mario.prototype.onAbortGrab = function () {
            this._grabbing = false;
        };
        Mario.prototype.onJump = function () {
            if (!this._isJumping) {
                this._isJumping = true;
                this._isSpecial = false;
                this._yVector = this._jumpPower * this.pixSize;
            }
        };
        Mario.prototype.onSpecialJump = function () {
            if (!this._isJumping) {
                this._isJumping = true;
                this._isSpecial = true;
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
                    _this.draw(9, null, Character.Direction.right, Character.Vertical.up, true);
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
                _this.draw(9, null, _this._runIndex == 0 ? Character.Direction.left : Character.Direction.right, Character.Vertical.up, true);
            }, this.frameInterval);
        };
        Mario.prototype.gool = function () {
            var _this = this;
            if (this._gameMaster)
                this._gameMaster.doGool();
            this._speed = 1;
            var blackScreen = document.createElement('div');
            if (this.targetDom == document.body)
                this.targetDom.style.cssText = 'margin: 0px;';
            var goolDimTimer = setInterval(function () {
                if (Math.floor(_this._backgroundOpacity) != 1) {
                    _this._backgroundOpacity += 0.01;
                }
                else {
                    _this.stop();
                    _this.draw(10, null, Character.Direction.right, Character.Vertical.up, true);
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
                if (window.orientation == 0) {
                    this._screenModeForMobile = 'PORTRAIT';
                    this._deviceDirection = 1;
                }
                else if (window.orientation == 90) {
                    this._screenModeForMobile = 'LANSCAPE';
                    this._deviceDirection = 1;
                }
                else if (window.orientation == -90) {
                    this._screenModeForMobile = 'LANSCAPE';
                    this._deviceDirection = -1;
                }
                document.addEventListener('touchstart', function (e) {
                    if (e.targetTouches.length > 1) {
                        _this.onSpecialJump();
                    }
                    else {
                        _this.onJump();
                    }
                });
                document.addEventListener('touchend', function (e) {
                    _this.onAbortJump();
                });
                document.addEventListener('touchcancel', function (e) {
                    _this.onAbortJump();
                });
                window.addEventListener('deviceorientation', function (e) {
                    var motion = 0;
                    switch (_this._screenModeForMobile) {
                        case 'PORTRAIT':
                            motion = Math.round(e.gamma);
                            break;
                        case 'LANSCAPE':
                            motion = Math.round(e.beta);
                            break;
                    }
                    motion = motion * _this._deviceDirection;
                    if (Math.abs(motion) >= 20 && _this._canSpeedUpForMobile) {
                        if (_this._direction == Character.Direction.left && motion < 0) {
                            _this._canSpeedUpForMobile = false;
                            _this.onSpeedUp();
                        }
                        else if (_this._direction == Character.Direction.right && motion > 0) {
                            _this._canSpeedUpForMobile = false;
                            _this.onSpeedUp();
                        }
                    }
                    else if (Math.abs(motion) < 20 && !_this._canSpeedUpForMobile) {
                        _this.onAbortSpeedUp();
                        _this._canSpeedUpForMobile = true;
                    }
                });
                window.addEventListener('orientationchange', function (e) {
                    if (window.matchMedia("(orientation: portrait)").matches) {
                        _this._screenModeForMobile = 'PORTRAIT';
                        _this._deviceDirection = 1;
                    }
                    if (window.matchMedia("(orientation: landscape)").matches) {
                        _this._screenModeForMobile = 'LANSCAPE';
                        if (window.orientation == 90) {
                            _this._deviceDirection = 1;
                        }
                        else {
                            _this._deviceDirection = -1;
                        }
                    }
                }, false);
            }
            else {
                document.addEventListener('keydown', function (e) {
                    if (e.keyCode == 65 && !_this._isSquat) {
                        _this.onJump();
                    }
                    if (e.keyCode == 88 && !_this._isSquat) {
                        _this.onSpecialJump();
                    }
                    if (e.keyCode == 66 && !_this._isJumping && !_this._isSquat) {
                        _this.onSpeedUp();
                        _this.onGrab();
                    }
                    if (e.keyCode == 40 && !_this._isJumping) {
                        _this.onSquat();
                        _this.onAbortGrab();
                    }
                });
                document.addEventListener('keyup', function (e) {
                    if (e.keyCode == 65) {
                        _this.onAbortJump();
                    }
                    if (e.keyCode == 88) {
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
var Character;
(function (Character) {
    var GameMaster = (function () {
        function GameMaster(targetDom, charSize) {
            this.targetDom = targetDom;
            this.charSize = charSize;
            this._enemys = {};
            this._enemyCount = 0;
            this._player = null;
        }
        GameMaster.GetController = function (gameName, targetDom, charSize) {
            var master = GameMaster.GAME_MASTERS[gameName];
            if (master) {
                return master;
            }
            master = new GameMaster(targetDom, charSize);
            GameMaster.GAME_MASTERS[gameName] = master;
            return master;
        };
        GameMaster.prototype.CreateCharInstance = function (clz, position, isReverse) {
            if (isReverse === void 0) { isReverse = false; }
            var char = new clz(this.targetDom, this.charSize, position, isReverse);
            if (char.isEnemy) {
                char._name = 'enemy_' + this._enemyCount;
                this._enemyCount++;
                this._enemys[char._name] = char;
            }
            else {
                char._name = 'player';
                this._player = char;
            }
            char._gameMaster = this;
            return char;
        };
        GameMaster.prototype.deleteEnemy = function (char) {
            delete this._enemys[char._name];
            if (Object.keys(this._enemys).length == 0) {
                this._player.gool();
            }
        };
        GameMaster.prototype.getEnemys = function () {
            return this._enemys;
        };
        GameMaster.prototype.init = function () {
            if (this._player) {
                this._player.init();
            }
            for (var name_3 in this._enemys) {
                this._enemys[name_3].init();
            }
        };
        GameMaster.prototype.start = function () {
            for (var name_4 in this._enemys) {
                this._enemys[name_4].start();
            }
            if (this._player) {
                this._player.start();
            }
        };
        GameMaster.prototype.doGameOver = function () {
            for (var name_5 in this._enemys) {
                this._enemys[name_5].stop();
            }
        };
        GameMaster.prototype.doGool = function () {
            for (var name_6 in this._enemys) {
                this._enemys[name_6].stop();
            }
        };
        return GameMaster;
    }());
    GameMaster.GAME_MASTERS = {};
    Character.GameMaster = GameMaster;
})(Character || (Character = {}));
//# sourceMappingURL=mario.js.map