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
var Charjs;
(function (Charjs) {
    var Direction;
    (function (Direction) {
        Direction[Direction["right"] = 0] = "right";
        Direction[Direction["left"] = 1] = "left";
    })(Direction = Charjs.Direction || (Charjs.Direction = {}));
    var Vertical;
    (function (Vertical) {
        Vertical[Vertical["up"] = 0] = "up";
        Vertical[Vertical["down"] = 1] = "down";
    })(Vertical = Charjs.Vertical || (Charjs.Vertical = {}));
    var Position = (function () {
        function Position() {
            this.x = 0;
            this.y = 0;
        }
        return Position;
    }());
    Charjs.Position = Position;
    var Size = (function () {
        function Size() {
            this.width = 0;
            this.height = 0;
            this.widthOffset = 0;
            this.heightOffset = 0;
        }
        return Size;
    }());
    Charjs.Size = Size;
    var Environment = (function () {
        function Environment() {
            this.ground = null;
            this.ceiling = null;
            this.right = null;
            this.left = null;
        }
        return Environment;
    }());
    Charjs.Environment = Environment;
    var AbstractObject = (function () {
        function AbstractObject(targetDom, pixSize, position, _direction, useLeft, useVertical, zIndex, frameInterval) {
            if (pixSize === void 0) { pixSize = 2; }
            if (position === void 0) { position = { x: 0, y: 0 }; }
            if (_direction === void 0) { _direction = Direction.right; }
            if (useLeft === void 0) { useLeft = true; }
            if (useVertical === void 0) { useVertical = true; }
            if (zIndex === void 0) { zIndex = 2147483640; }
            if (frameInterval === void 0) { frameInterval = 45; }
            this.targetDom = targetDom;
            this.pixSize = pixSize;
            this.position = position;
            this._direction = _direction;
            this.useLeft = useLeft;
            this.useVertical = useVertical;
            this.zIndex = zIndex;
            this.frameInterval = frameInterval;
            this._name = '';
            this.cssTextTemplate = "z-index: " + this.zIndex + "; position: absolute; bottom: 0;";
            this.currentAction = null;
            this._rightActions = [];
            this._leftActions = [];
            this._verticalRightActions = [];
            this._verticalLeftActions = [];
            this.size = { height: 0, width: 0, widthOffset: 0, heightOffset: 0 };
            this.env = { ground: null, ceiling: null, right: null, left: null };
        }
        AbstractObject.prototype.init = function () {
            for (var _i = 0, _a = this.chars; _i < _a.length; _i++) {
                var charactor = _a[_i];
                this._rightActions.push(this.createCharacterAction(charactor));
                if (this.useLeft)
                    this._leftActions.push(this.createCharacterAction(charactor, true));
                if (this.useVertical) {
                    this._verticalRightActions.push(this.createCharacterAction(charactor, false, true));
                    if (this.useLeft)
                        this._verticalLeftActions.push(this.createCharacterAction(charactor, true, true));
                }
            }
        };
        AbstractObject.prototype.createCharacterAction = function (charactorMap, isReverse, isVerticalRotation) {
            if (isReverse === void 0) { isReverse = false; }
            if (isVerticalRotation === void 0) { isVerticalRotation = false; }
            var element = document.createElement("canvas");
            var ctx = element.getContext("2d");
            this.size.width = this.pixSize * charactorMap[0].length;
            this.size.height = this.pixSize * charactorMap.length;
            element.setAttribute("width", this.size.width.toString());
            element.setAttribute("height", this.size.height.toString());
            element.style.cssText = this.cssTextTemplate;
            AbstractCharacter.drawCharacter(ctx, charactorMap, this.colors, this.pixSize, isReverse, isVerticalRotation);
            return element;
        };
        AbstractObject.drawCharacter = function (ctx, map, colors, size, reverse, vertical) {
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
        AbstractObject.prototype.removeCharacter = function () {
            if (this.currentAction != null) {
                this.targetDom.removeChild(this.currentAction);
                this.currentAction = null;
            }
        };
        AbstractObject.prototype.draw = function (index, position, direction, vertical, removeCurrent) {
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
            this.currentAction.style.bottom = position.y + 'px';
            this.currentAction.style.zIndex = this.zIndex.toString();
            this.targetDom.appendChild(this.currentAction);
        };
        AbstractObject.prototype.refresh = function () {
            this.currentAction.style.left = this.position.x + 'px';
            this.currentAction.style.bottom = this.position.y + 'px';
        };
        AbstractObject.prototype.destroy = function () {
            this.removeCharacter();
        };
        AbstractObject.prototype.getPosition = function () {
            return this.position;
        };
        AbstractObject.prototype.setPosition = function (pos) {
            this.position = pos;
        };
        AbstractObject.prototype.getCharSize = function () {
            return this.size;
        };
        AbstractObject.prototype.getCurrntElement = function () {
            return this.currentAction;
        };
        return AbstractObject;
    }());
    Charjs.AbstractObject = AbstractObject;
    var AbstractCharacter = (function (_super) {
        __extends(AbstractCharacter, _super);
        function AbstractCharacter() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._gameMaster = null;
            _this._isStarting = false;
            _this._frameTimer = null;
            _this._gravity = 2;
            _this.defaultCommand = function (e) {
                if (e.keyCode == 32) {
                    if (_this._isStarting) {
                        _this.stop();
                    }
                    else {
                        _this.start();
                    }
                }
            };
            _this.upperObject = null;
            _this.underObject = null;
            _this.rightObject = null;
            _this.leftObject = null;
            return _this;
        }
        AbstractCharacter.prototype.registerCommand = function () {
            if (!this._gameMaster) {
                document.addEventListener('keypress', this.defaultCommand);
            }
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
            if (this._gameMaster && this instanceof AbstractEnemy) {
                this._gameMaster.deleteEnemy(this);
            }
            document.removeEventListener('keypress', this.defaultCommand);
            _super.prototype.destroy.call(this);
        };
        AbstractCharacter.prototype.updateEnvironment = function () {
            if (this._gameMaster) {
                var objs = this._gameMaster.getApproachedObjects(this.position, this.size.width * 3);
                this.env.ground = null;
                this.env.ceiling = null;
                this.env.right = null;
                this.env.left = null;
                this.upperObject = null;
                this.underObject = null;
                this.rightObject = null;
                this.leftObject = null;
                for (var _i = 0, objs_1 = objs; _i < objs_1.length; _i++) {
                    var obj = objs_1[_i];
                    var oPos = obj.getPosition();
                    var oSize = obj.getCharSize();
                    var oPosLeft = oPos.x + oSize.widthOffset;
                    var oPosRight = oPos.x + oSize.width - oSize.widthOffset;
                    var oPosUnder = oPos.y + this.pixSize * 3;
                    var oPosUpper = oPos.y + oSize.height - oSize.heightOffset;
                    var cPosLeft = this.position.x + this.size.widthOffset;
                    var cPosRight = this.position.x + this.size.width - this.size.widthOffset;
                    var cPosUnder = this.position.y;
                    var cPosUpper = this.position.y + this.size.height - this.size.heightOffset;
                    if (cPosLeft >= oPosLeft && cPosLeft <= oPosRight || cPosRight >= oPosLeft && cPosRight <= oPosRight) {
                        if (cPosUnder >= oPosUpper && (this.env.ground === null || this.env.ground > oPosUpper)) {
                            this.underObject = obj;
                            this.env.ground = oPosUpper;
                            continue;
                        }
                        if (cPosUpper <= oPosUnder && (this.env.ceiling === null || this.env.ceiling > oPosUnder)) {
                            this.upperObject = obj;
                            this.env.ceiling = oPosUnder;
                            continue;
                        }
                        continue;
                    }
                    if (cPosUnder > oPosUnder && cPosUnder < oPosUpper || cPosUpper > oPosUnder && cPosUpper < oPosUpper) {
                        if (cPosLeft >= oPosRight && (this.env.left === null || this.env.left < oPosRight)) {
                            this.leftObject = obj;
                            this.env.left = oPosRight;
                            continue;
                        }
                        if (cPosRight <= oPosLeft && (this.env.right === null || this.env.right > oPosLeft)) {
                            this.rightObject = obj;
                            this.env.right = oPosLeft;
                            continue;
                        }
                        continue;
                    }
                }
            }
        };
        AbstractCharacter.prototype.updateDirection = function () {
            var currentDirection = this._direction;
            var right = this.env.right === null ? this.targetDom.clientWidth - this.size.width - (this.pixSize * 2) : this.env.right;
            var left = this.env.left === null ? 0 : this.env.left;
            if (this.position.x > right && this._direction == Direction.right) {
                this._direction = Direction.left;
            }
            if (this.position.x < left && this._direction == Direction.left) {
                this._direction = Direction.right;
            }
            return currentDirection != this._direction;
        };
        return AbstractCharacter;
    }(AbstractObject));
    Charjs.AbstractCharacter = AbstractCharacter;
    var AbstractPlayer = (function (_super) {
        __extends(AbstractPlayer, _super);
        function AbstractPlayer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return AbstractPlayer;
    }(AbstractCharacter));
    Charjs.AbstractPlayer = AbstractPlayer;
    var AbstractEnemy = (function (_super) {
        __extends(AbstractEnemy, _super);
        function AbstractEnemy() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return AbstractEnemy;
    }(AbstractCharacter));
    Charjs.AbstractEnemy = AbstractEnemy;
    var AbstractOtherObject = (function (_super) {
        __extends(AbstractOtherObject, _super);
        function AbstractOtherObject() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isActive = true;
            return _this;
        }
        return AbstractOtherObject;
    }(AbstractObject));
    Charjs.AbstractOtherObject = AbstractOtherObject;
    var AbstractGround = (function (_super) {
        __extends(AbstractGround, _super);
        function AbstractGround() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return AbstractGround;
    }(AbstractObject));
    Charjs.AbstractGround = AbstractGround;
})(Charjs || (Charjs = {}));
var Charjs;
(function (Charjs) {
    var NormalBlockWorld = (function (_super) {
        __extends(NormalBlockWorld, _super);
        function NormalBlockWorld(targetDom, pixSize, position, direction, zIndex, frameInterval) {
            if (direction === void 0) { direction = Charjs.Direction.right; }
            if (zIndex === void 0) { zIndex = 2147483640; }
            if (frameInterval === void 0) { frameInterval = 45; }
            var _this = _super.call(this, targetDom, pixSize, position, direction, false, true, zIndex - 2, frameInterval) || this;
            _this.colors = ['', '#000000', '#ffffff', '#fee13d', '#ddae50'];
            _this.chars = [[
                    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 1, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 0],
                    [1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 1],
                    [1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 1],
                    [1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 1],
                    [1, 4, 3, 3, 3, 1, 3, 3, 3, 3, 1, 3, 3, 4, 4, 1],
                    [1, 2, 3, 3, 3, 1, 3, 3, 3, 3, 1, 3, 3, 4, 4, 1],
                    [1, 4, 3, 3, 3, 1, 3, 3, 3, 3, 1, 3, 3, 4, 4, 1],
                    [1, 4, 3, 3, 3, 1, 3, 3, 3, 3, 1, 3, 3, 4, 4, 1],
                    [1, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 1],
                    [1, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 1],
                    [1, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 1],
                    [1, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 1],
                    [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                    [0, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 0],
                    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0]
                ], [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [1, 1, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1],
                    [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1],
                    [1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 1, 1],
                    [1, 4, 3, 3, 3, 1, 3, 3, 3, 3, 1, 3, 3, 4, 4, 1],
                    [1, 4, 3, 3, 3, 1, 3, 3, 3, 3, 1, 3, 3, 4, 4, 1],
                    [1, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 1],
                    [1, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 1],
                    [1, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 1],
                    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ], [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                    [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ], [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 1, 1],
                    [1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 3, 2, 3, 3, 1],
                    [1, 2, 2, 2, 2, 4, 2, 2, 3, 2, 4, 3, 3, 3, 3, 1],
                    [1, 2, 2, 2, 2, 4, 2, 3, 2, 3, 4, 3, 3, 3, 3, 1],
                    [1, 2, 3, 2, 3, 2, 3, 2, 3, 3, 3, 3, 3, 3, 3, 1],
                    [1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1],
                    [1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1],
                    [1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 1, 1],
                    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ]];
            _this._pushedUpTimer = null;
            return _this;
        }
        NormalBlockWorld.prototype.init = function () {
            _super.prototype.init.call(this);
            this.draw(0);
        };
        NormalBlockWorld.prototype.onPushedUp = function () {
            var _this = this;
            var animation = [
                { yOffset: this.pixSize * 4, index: 0, wait: 0 },
                { yOffset: this.pixSize * 8, index: 0, wait: 0 },
                { yOffset: this.pixSize * 10, index: 0, wait: 2 },
                { yOffset: this.pixSize * 8, index: 0, wait: 0 },
                { yOffset: 0, index: 2, wait: 2 },
                { yOffset: 0, index: 3, wait: 2 },
                { yOffset: 0, index: 0, wait: 2 },
                { yOffset: 0, index: 1, wait: 2 },
                { yOffset: 0, index: 2, wait: 2 },
                { yOffset: 0, index: 3, wait: 2 },
                { yOffset: 0, index: 0, wait: 2 },
                { yOffset: 0, index: 1, wait: 2 },
                { yOffset: 0, index: 2, wait: 2 },
                { yOffset: 0, index: 3, wait: 2 },
                { yOffset: 0, index: 0, wait: 2 },
                { yOffset: 0, index: 1, wait: 2 },
                { yOffset: 0, index: 2, wait: 2 },
                { yOffset: 0, index: 3, wait: 2 },
                { yOffset: 0, index: 0, wait: 2 },
                { yOffset: 0, index: 1, wait: 2 },
                { yOffset: 0, index: 2, wait: 2 },
                { yOffset: 0, index: 3, wait: 2 },
                { yOffset: 0, index: 0, wait: 2 },
                { yOffset: 0, index: 1, wait: 2 },
                { yOffset: 0, index: 2, wait: 2 },
                { yOffset: 0, index: 3, wait: 2 },
                { yOffset: 0, index: 0, wait: 2 },
                { yOffset: 0, index: 1, wait: 2 },
                { yOffset: 0, index: 2, wait: 2 },
                { yOffset: 0, index: 3, wait: 2 },
                { yOffset: 0, index: 0, wait: 2 }
            ];
            var animationIndex = 0;
            var currnetAnimation = null;
            if (!this._pushedUpTimer) {
                this.isActive = false;
                this._pushedUpTimer = setInterval(function () {
                    if (animationIndex >= animation.length) {
                        clearInterval(_this._pushedUpTimer);
                        _this._pushedUpTimer = null;
                        _this.isActive = true;
                        return;
                    }
                    var pos = { x: _this.position.x, y: _this.position.y };
                    if (animation[animationIndex].yOffset)
                        pos.y += animation[animationIndex].yOffset;
                    _this.draw(animation[animationIndex].index, pos, Charjs.Direction.right, Charjs.Vertical.up, true);
                    if (animation[animationIndex].wait) {
                        animation[animationIndex].wait--;
                    }
                    else {
                        animationIndex++;
                    }
                }, this.frameInterval);
            }
        };
        NormalBlockWorld.prototype.onTrampled = function () {
        };
        return NormalBlockWorld;
    }(Charjs.AbstractOtherObject));
    Charjs.NormalBlockWorld = NormalBlockWorld;
})(Charjs || (Charjs = {}));
var Charjs;
(function (Charjs) {
    var GoombaWorld = (function (_super) {
        __extends(GoombaWorld, _super);
        function GoombaWorld(targetDom, pixSize, position, direction, zIndex, frameInterval) {
            if (direction === void 0) { direction = Charjs.Direction.right; }
            if (zIndex === void 0) { zIndex = 2147483640; }
            if (frameInterval === void 0) { frameInterval = 45; }
            var _this = _super.call(this, targetDom, pixSize, position, direction, true, true, zIndex - 1, frameInterval) || this;
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
            _this._speed = 1;
            _this._currentStep = 0;
            _this._actionIndex = 0;
            _this._isKilled = false;
            _this._isGrabed = false;
            _this._yVector = 0;
            _this._vertical = Charjs.Vertical.up;
            return _this;
        }
        GoombaWorld.prototype.isKilled = function () {
            return this._isKilled;
        };
        GoombaWorld.prototype.onAction = function () {
            if (!this._isGrabed) {
                var directionUpdated = this.updateDirection();
                if (this.doHitTestWithOtherEnemy()) {
                    this._direction = this._direction == Charjs.Direction.right ? Charjs.Direction.left : Charjs.Direction.right;
                }
                this.updateEnvironment();
                var ground = this.env.ground || 0;
                if (this.position.y > ground) {
                    this._yVector -= this._gravity * this.pixSize;
                    this.position.y += this._yVector;
                    if (this.position.y < ground) {
                        this.position.y = ground;
                    }
                }
                else {
                    this._yVector = 0;
                }
                if (this._direction == Charjs.Direction.right) {
                    this.position.x += this.pixSize * this._speed;
                }
                else {
                    this.position.x -= this.pixSize * this._speed;
                }
                this.drawAction();
            }
        };
        GoombaWorld.prototype.drawAction = function () {
            if (this._currentStep < GoombaWorld.STEP) {
                this._currentStep++;
            }
            else {
                this._currentStep = 0;
                this._actionIndex = this._actionIndex ^ 1;
            }
            this.draw(this._actionIndex, null, this._direction, this._vertical, true);
        };
        GoombaWorld.prototype.isStepped = function () {
            return this._vertical == Charjs.Vertical.down;
        };
        GoombaWorld.prototype.onStepped = function () {
            this._vertical = Charjs.Vertical.down;
            this._speed = 0;
        };
        GoombaWorld.prototype.onGrabed = function () {
            this._isGrabed = true;
            this.stop();
        };
        GoombaWorld.prototype.onKicked = function (kickDirection, kickPower) {
            var _this = this;
            this.stop();
            this._isKilled = true;
            var yVector = 10 * this.pixSize;
            var direction = kickDirection == Charjs.Direction.right ? 1 : -1;
            var killTimer = setInterval(function () {
                yVector -= _this._gravity * _this.pixSize;
                _this.position.y = _this.position.y + yVector;
                _this.position.x += kickPower * direction;
                if (_this.position.y < _this.size.height * 5 * -1) {
                    clearInterval(killTimer);
                    _this.destroy();
                    return;
                }
                if (_this._currentStep < GoombaWorld.STEP) {
                    _this._currentStep++;
                }
                else {
                    _this._currentStep = 0;
                    _this._actionIndex = _this._actionIndex ^ 1;
                }
                _this.draw(_this._actionIndex, null, _this._direction, Charjs.Vertical.down, true);
            }, this.frameInterval);
        };
        GoombaWorld.prototype.doHitTestWithOtherEnemy = function () {
            if (this._gameMaster) {
                var enemys = this._gameMaster.getEnemys();
                for (var name_1 in enemys) {
                    if (enemys[name_1] != this) {
                        var ePos = enemys[name_1].getPosition();
                        var eSize = enemys[name_1].getCharSize();
                        if (this.position.y > ePos.y + eSize.height)
                            continue;
                        if (ePos.y > this.position.y + this.size.height)
                            continue;
                        if (this.position.x > ePos.x + eSize.width)
                            continue;
                        if (ePos.x > this.position.x + this.size.width)
                            continue;
                        return true;
                    }
                }
            }
            return false;
        };
        GoombaWorld.prototype.registerActionCommand = function () {
        };
        return GoombaWorld;
    }(Charjs.AbstractEnemy));
    GoombaWorld.STEP = 2;
    Charjs.GoombaWorld = GoombaWorld;
})(Charjs || (Charjs = {}));
var Charjs;
(function (Charjs) {
    var HitStatus;
    (function (HitStatus) {
        HitStatus[HitStatus["none"] = 0] = "none";
        HitStatus[HitStatus["dammage"] = 1] = "dammage";
        HitStatus[HitStatus["attack"] = 2] = "attack";
        HitStatus[HitStatus["grab"] = 3] = "grab";
    })(HitStatus || (HitStatus = {}));
    var MarioWorld = (function (_super) {
        __extends(MarioWorld, _super);
        function MarioWorld(targetDom, pixSize, position, direction, zIndex, frameInterval) {
            if (direction === void 0) { direction = Charjs.Direction.right; }
            if (zIndex === void 0) { zIndex = 2147483640; }
            if (frameInterval === void 0) { frameInterval = 45; }
            var _this = _super.call(this, targetDom, pixSize, position, direction, true, false, zIndex, frameInterval) || this;
            _this._runIndex = 0;
            _this._currentStep = MarioWorld.STEP;
            _this._yVector = 0;
            _this._jumpPower = 18;
            _this._speed = MarioWorld.DEFAULT_SPEED;
            _this._gameOverWaitCount = 0;
            _this._speedUpTimer = null;
            _this._speedDownTimer = null;
            _this._squatTimer = null;
            _this._gameOverTimer = null;
            _this._isJumping = false;
            _this._isSpecial = false;
            _this._isBraking = false;
            _this._isSquat = false;
            _this._attackDirection = Charjs.Direction.right;
            _this._specialAnimationIndex = 0;
            _this._specialAnimation = [{ index: 0, direction: Charjs.Direction.right }, { index: 12, direction: Charjs.Direction.right }, { index: 0, direction: Charjs.Direction.left }, { index: 13, direction: Charjs.Direction.right }];
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
        MarioWorld.prototype.onAction = function () {
            var _this = this;
            this.updateEnvironment();
            switch (this.doHitTest()) {
                case HitStatus.dammage:
                    this.gameOver();
                    break;
                case HitStatus.attack:
                    this.draw(11, null, this._attackDirection, Charjs.Vertical.up, true);
                    this.stop();
                    setTimeout(function () {
                        _this.start();
                    }, this.frameInterval * 3);
                    break;
                case HitStatus.grab:
                    this.moveGrabedEnemy();
                    this.draw(14, null, this._direction, Charjs.Vertical.up, true);
                    this.stop();
                    setTimeout(function () {
                        _this.start();
                    }, this.frameInterval);
                    break;
                default:
                    var action = this.executeRun();
                    action = this.executeJump() || action;
                    if (action.index === 0) {
                        this.size.widthOffset = 4 * this.pixSize;
                    }
                    else {
                        this.size.widthOffset = 0;
                    }
                    this.draw(action.index, null, action.direction, Charjs.Vertical.up, true);
            }
        };
        MarioWorld.prototype.checkGrabedEnemysAttack = function (enemy) {
            if (this._grabedEnemy) {
                var ePos = enemy.getPosition();
                var eSize = enemy.getCharSize();
                var gEnemyPos = this._grabedEnemy.getPosition();
                var gEnemySize = this._grabedEnemy.getCharSize();
                if (gEnemyPos.y > ePos.y + eSize.height)
                    return;
                if (ePos.y > gEnemyPos.y + gEnemySize.height)
                    return;
                if (gEnemyPos.x > ePos.x + eSize.width)
                    return;
                if (ePos.x > gEnemyPos.x + gEnemySize.width)
                    return;
                var grabedEnemyCenter = gEnemyPos.x + gEnemySize.width / 2;
                var enemyCenter = ePos.x + eSize.width / 2;
                enemy.onKicked(grabedEnemyCenter <= enemyCenter ? Charjs.Direction.right : Charjs.Direction.left, this._speed * 3);
                this._grabedEnemy.onKicked(grabedEnemyCenter <= enemyCenter ? Charjs.Direction.left : Charjs.Direction.right, this._speed * 3);
                this._grabedEnemy = null;
            }
        };
        MarioWorld.prototype.doHitTest = function () {
            if (this._gameMaster) {
                var enemys = this._gameMaster.getEnemys();
                for (var name_2 in enemys) {
                    if (!enemys[name_2].isKilled() && this._grabedEnemy != enemys[name_2]) {
                        var ePos = enemys[name_2].getPosition();
                        var eSize = enemys[name_2].getCharSize();
                        this.checkGrabedEnemysAttack(enemys[name_2]);
                        if (this.position.y > ePos.y + eSize.height)
                            continue;
                        if (ePos.y > this.position.y + this.size.height)
                            continue;
                        if (this.position.x > ePos.x + eSize.width)
                            continue;
                        if (ePos.x > this.position.x + this.size.width)
                            continue;
                        if (enemys[name_2].isStepped()) {
                            if (!this._grabbing) {
                                var playerCenter = this.position.x + this.size.width / 2;
                                var enemyCenter = ePos.x + eSize.width / 2;
                                this._attackDirection = playerCenter <= enemyCenter ? Charjs.Direction.right : Charjs.Direction.left;
                                enemys[name_2].onKicked(this._attackDirection, this._speed * 3);
                                return HitStatus.attack;
                            }
                            else {
                                this.grabEnemy(enemys[name_2]);
                                return HitStatus.grab;
                            }
                        }
                        if (this._isJumping && this._yVector < 0) {
                            if (this._isSpecial) {
                                var playerCenter = this.position.x + this.size.width / 2;
                                var enemyCenter = ePos.x + eSize.width / 2;
                                this._attackDirection = playerCenter <= enemyCenter ? Charjs.Direction.right : Charjs.Direction.left;
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
        MarioWorld.prototype.executeJump = function () {
            var ground = this.env.ground || 0;
            if (this._isJumping) {
                this._yVector -= this._gravity * this.pixSize;
                if (this.env.ceiling != null) {
                    this.position.y = Math.min(this.position.y + this._yVector, this.env.ceiling - this.size.height + this.size.heightOffset);
                    if (this.position.y == this.env.ceiling - this.size.height + this.size.heightOffset && this._yVector > 0) {
                        this.upperObject.onPushedUp();
                        this._yVector = 0;
                    }
                }
                else {
                    this.position.y = this.position.y + this._yVector;
                }
                this.moveGrabedEnemy();
                if (this.position.y <= ground) {
                    this._isJumping = false;
                    this._yVector = 0;
                    this.position.y = ground;
                    return null;
                }
                else {
                    if (!this._grabedEnemy) {
                        if (!this._isSpecial) {
                            if (this._speed > 8) {
                                if (this._yVector > 0 && this.position.y < this.size.height * 3) {
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
            }
            else {
                if (this.position.y > ground) {
                    this._yVector -= this._gravity * this.pixSize;
                    this.position.y += this._yVector;
                    if (this.position.y < ground) {
                        this.position.y = ground;
                    }
                }
                else {
                    this._yVector = 0;
                }
                return null;
            }
        };
        MarioWorld.prototype.moveGrabedEnemy = function () {
            if (this._grabedEnemy) {
                var grabXOffset = this._direction == Charjs.Direction.right ? this.size.width * 0.7 : this.size.width * -1 * 0.7;
                var grabYOffset = this.pixSize;
                this._grabedEnemy.zIndex = this.zIndex - 1;
                this._grabedEnemy.setPosition({ x: this.position.x + grabXOffset, y: this.position.y + grabYOffset });
                this._grabedEnemy.drawAction();
            }
        };
        MarioWorld.prototype.executeRun = function () {
            var directionUpdated = this.updateDirection();
            if (this._direction == Charjs.Direction.right) {
                this.position.x += this.pixSize * this._speed;
            }
            else {
                this.position.x -= this.pixSize * this._speed;
            }
            var runIndex = this._runIndex;
            if (this._isSquat) {
                if (this._grabedEnemy)
                    runIndex = 14;
                else
                    runIndex = 8;
                return { index: runIndex, direction: this._direction };
            }
            if (this._currentStep < MarioWorld.STEP) {
                this._currentStep++;
            }
            else {
                this._currentStep = 0;
                this._runIndex = this._runIndex ^ 1;
            }
            if (this._grabedEnemy) {
                if (directionUpdated) {
                    runIndex = 12;
                    this._grabedEnemy.setPosition({ x: this.position.x, y: this.position.y });
                    this._grabedEnemy.zIndex = this.zIndex + 1;
                    this._grabedEnemy.drawAction();
                }
                else {
                    runIndex = this._runIndex == 0 ? 15 : 16;
                    this.moveGrabedEnemy();
                }
            }
            else {
                if (this._speed > 8) {
                    runIndex = this._runIndex == 0 ? 4 : 5;
                }
                else {
                    runIndex = this._runIndex;
                }
                if (!this._isJumping) {
                    if (this._speed > 5 || (!directionUpdated && this._isBraking)) {
                        if ((this._direction == Charjs.Direction.left && this.position.x < this.size.width * 3) ||
                            (this._direction == Charjs.Direction.right && this.position.x > this.targetDom.clientWidth - this.size.width * 4)) {
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
            }
            return { index: runIndex, direction: this._direction };
            ;
        };
        MarioWorld.prototype.grabEnemy = function (enemy) {
            enemy.onGrabed();
            this._grabedEnemy = enemy;
        };
        MarioWorld.prototype.putEnemy = function () {
        };
        MarioWorld.prototype.onGrab = function () {
            this._grabbing = true;
        };
        MarioWorld.prototype.onAbortGrab = function () {
            var _this = this;
            this._grabbing = false;
            if (this._grabedEnemy) {
                this.draw(11, null, this._direction, Charjs.Vertical.up, true);
                this.stop();
                setTimeout(function () {
                    _this.start();
                }, this.frameInterval * 3);
                this._grabedEnemy.onKicked(this._direction, this._speed * 3);
                this._grabedEnemy = null;
            }
        };
        MarioWorld.prototype.onJump = function () {
            if (!this._isJumping) {
                this._isJumping = true;
                this._isSpecial = false;
                this._yVector = this._jumpPower * this.pixSize;
            }
        };
        MarioWorld.prototype.onSpecialJump = function () {
            if (!this._isJumping) {
                this._isJumping = true;
                this._isSpecial = true;
                this._yVector = this._jumpPower * this.pixSize;
            }
        };
        MarioWorld.prototype.onAbortJump = function () {
            if (this._yVector > 0) {
                this._yVector = 0;
            }
        };
        MarioWorld.prototype.onSpeedUp = function () {
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
        MarioWorld.prototype.onAbortSpeedUp = function () {
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
        MarioWorld.prototype.onSquat = function () {
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
        MarioWorld.prototype.onAbortSquat = function () {
            if (this._squatTimer) {
                clearInterval(this._squatTimer);
                this._squatTimer = null;
            }
            this._speed = MarioWorld.DEFAULT_SPEED;
            this._isSquat = false;
        };
        MarioWorld.prototype.gameOver = function () {
            var _this = this;
            if (this._gameMaster)
                this._gameMaster.doGameOver();
            this.stop();
            this._gameOverTimer = setInterval(function () {
                if (_this._gameOverWaitCount < 20) {
                    _this._gameOverWaitCount++;
                    _this.draw(9, null, Charjs.Direction.right, Charjs.Vertical.up, true);
                    _this._yVector = _this._jumpPower * _this.pixSize;
                    return;
                }
                _this._yVector -= _this._gravity * _this.pixSize;
                _this.position.y = _this.position.y + _this._yVector;
                if (_this.position.y < _this.size.height * 5 * -1) {
                    clearInterval(_this._gameOverTimer);
                    _this.destroy();
                    return;
                }
                if (_this._currentStep < MarioWorld.STEP) {
                    _this._currentStep++;
                }
                else {
                    _this._currentStep = 0;
                    _this._runIndex = _this._runIndex ^ 1;
                }
                _this.draw(9, null, _this._runIndex == 0 ? Charjs.Direction.left : Charjs.Direction.right, Charjs.Vertical.up, true);
            }, this.frameInterval);
        };
        MarioWorld.prototype.onGool = function (callback) {
            this.draw(10, null, Charjs.Direction.right, Charjs.Vertical.up, true);
            if (callback)
                callback();
        };
        MarioWorld.prototype.touchAbort = function (touchLength) {
            switch (touchLength) {
                case 3:
                    this.onAbortSquat();
                    break;
                case 1:
                case 2:
                    this.onAbortJump();
                    this.onAbortSquat();
                    break;
                default:
                    this.onAbortGrab();
                    this.onAbortJump();
                    this.onAbortSquat();
            }
        };
        MarioWorld.prototype.touch = function (touchLength) {
            switch (touchLength) {
                case 1:
                    this.onGrab();
                    break;
                case 2:
                    this.onJump();
                    break;
                case 3:
                    this.onSpecialJump();
                    break;
                case 4:
                    this.onSquat();
                    break;
                default:
                    this.onJump();
            }
        };
        MarioWorld.prototype.registerActionCommand = function () {
            var _this = this;
            if (Charjs.GameMaster.checkMobile()) {
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
                    _this.touch(e.targetTouches.length);
                });
                document.addEventListener('touchend', function (e) {
                    _this.touchAbort(e.targetTouches.length);
                });
                document.addEventListener('touchcancel', function (e) {
                    _this.touchAbort(e.targetTouches.length);
                });
                window.addEventListener('deviceorientation', function (e) {
                    if (!_this._isSquat) {
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
                            if (_this._direction == Charjs.Direction.left && motion < 0) {
                                _this._canSpeedUpForMobile = false;
                                _this.onSpeedUp();
                            }
                            else if (_this._direction == Charjs.Direction.right && motion > 0) {
                                _this._canSpeedUpForMobile = false;
                                _this.onSpeedUp();
                            }
                        }
                        else if (Math.abs(motion) < 20 && !_this._canSpeedUpForMobile) {
                            _this.onAbortSpeedUp();
                            _this._canSpeedUpForMobile = true;
                        }
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
                    if (e.keyCode == 89 && !_this._isSquat) {
                        _this.onGrab();
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
                    if (e.keyCode == 88) {
                        _this.onAbortJump();
                    }
                    if (e.keyCode == 89) {
                        _this.onAbortGrab();
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
        return MarioWorld;
    }(Charjs.AbstractPlayer));
    MarioWorld.STEP = 2;
    MarioWorld.DEFAULT_SPEED = 2;
    Charjs.MarioWorld = MarioWorld;
})(Charjs || (Charjs = {}));
var Charjs;
(function (Charjs) {
    var NormalGroundWorld = (function (_super) {
        __extends(NormalGroundWorld, _super);
        function NormalGroundWorld() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.colors = ['', '#000000', '#2ec720', '#177848', '#78681a', '#c7995c', '#e0c057'];
            _this.chars = [[
                    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                    [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                    [0, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 3, 3],
                    [1, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 3, 3, 3, 1, 1],
                    [1, 2, 2, 2, 3, 3, 1, 4, 4, 4, 4, 1, 1, 1, 4, 4],
                    [1, 2, 2, 2, 3, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
                    [1, 2, 2, 3, 3, 1, 4, 5, 5, 5, 5, 4, 4, 4, 5, 5],
                    [1, 2, 2, 3, 1, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5],
                    [1, 2, 2, 3, 1, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 5],
                    [1, 2, 2, 3, 1, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 5],
                    [1, 2, 2, 2, 3, 1, 4, 4, 5, 5, 5, 5, 5, 6, 6, 5],
                    [1, 2, 2, 2, 3, 1, 4, 4, 5, 5, 6, 5, 5, 5, 5, 5],
                    [1, 2, 2, 2, 3, 1, 4, 4, 5, 5, 6, 5, 5, 5, 5, 5],
                    [1, 2, 2, 3, 1, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5],
                    [1, 2, 2, 3, 1, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5]
                ], [
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                    [3, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 2, 2, 2, 3, 3],
                    [1, 3, 3, 2, 2, 2, 3, 3, 1, 1, 1, 3, 3, 3, 1, 1],
                    [4, 1, 1, 3, 3, 3, 1, 1, 4, 4, 4, 1, 1, 1, 4, 4],
                    [4, 4, 4, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
                    [5, 5, 4, 4, 4, 4, 4, 5, 5, 5, 5, 4, 4, 4, 5, 5],
                    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 5],
                    [5, 5, 5, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 5],
                    [5, 5, 5, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 5],
                    [5, 5, 5, 6, 6, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5],
                    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5],
                    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
                    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
                    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
                ], [
                    [1, 2, 2, 3, 1, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5],
                    [1, 2, 2, 3, 1, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5],
                    [1, 2, 2, 2, 3, 1, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5],
                    [1, 2, 2, 2, 3, 1, 4, 4, 5, 6, 5, 5, 5, 5, 5, 5],
                    [1, 2, 2, 2, 2, 3, 1, 4, 5, 6, 5, 5, 5, 5, 5, 5],
                    [1, 2, 2, 2, 2, 3, 1, 4, 5, 6, 5, 5, 5, 5, 5, 5],
                    [1, 2, 2, 2, 2, 3, 1, 4, 5, 5, 5, 5, 6, 5, 5, 5],
                    [1, 2, 2, 2, 3, 1, 4, 4, 5, 5, 5, 5, 6, 5, 5, 5],
                    [1, 2, 2, 3, 1, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5],
                    [1, 2, 2, 3, 1, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5],
                    [1, 2, 2, 3, 1, 4, 4, 5, 5, 5, 5, 5, 6, 6, 5, 5],
                    [1, 2, 2, 2, 3, 1, 4, 4, 5, 5, 5, 5, 6, 6, 5, 5],
                    [1, 2, 2, 2, 3, 1, 4, 4, 5, 5, 5, 5, 6, 6, 5, 5],
                    [1, 2, 2, 2, 3, 1, 4, 4, 5, 6, 5, 5, 5, 5, 5, 5],
                    [1, 2, 2, 3, 1, 4, 4, 4, 5, 6, 5, 5, 5, 5, 5, 5],
                    [1, 2, 2, 3, 1, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5]
                ], [
                    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
                    [5, 5, 5, 5, 5, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5],
                    [5, 5, 5, 5, 5, 6, 6, 5, 5, 5, 6, 5, 5, 5, 5, 5],
                    [5, 5, 5, 5, 5, 6, 6, 5, 5, 5, 6, 5, 5, 5, 5, 5],
                    [5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5],
                    [5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5],
                    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5],
                    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5],
                    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
                    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
                    [5, 5, 5, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 5],
                    [5, 5, 5, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 5],
                    [5, 5, 5, 6, 6, 5, 5, 5, 5, 5, 6, 5, 5, 6, 6, 5],
                    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5],
                    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
                    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
                ]];
            return _this;
        }
        NormalGroundWorld.prototype.setBorderImage = function () {
            var charSize = this.pixSize * this.chars[0].length;
            var url = "url(" + this.createBorderImage() + ")";
            this.targetDom.style.borderImage = url + " " + charSize + " fill round";
            this.targetDom.style.borderStyle = 'solid';
            this.targetDom.style.borderWidth = charSize + "px " + charSize + "px 0px " + charSize + "px";
        };
        NormalGroundWorld.prototype.createBorderImage = function () {
            var element = document.createElement("canvas");
            var ctx = element.getContext("2d");
            var size = this.pixSize * this.chars[0].length * 3;
            element.setAttribute("width", size.toString());
            element.setAttribute("height", size.toString());
            var offsetSize = this.pixSize * this.chars[0].length;
            ctx.drawImage(this.createImage(this.chars[0], false, false), 0, 0);
            ctx.drawImage(this.createImage(this.chars[1], false, false), offsetSize, 0);
            ctx.drawImage(this.createImage(this.chars[0], true, false), offsetSize * 2, 0);
            ctx.drawImage(this.createImage(this.chars[2], false, false), 0, offsetSize);
            ctx.drawImage(this.createImage(this.chars[3], false, false), offsetSize, offsetSize);
            ctx.drawImage(this.createImage(this.chars[2], true, false), offsetSize * 2, offsetSize);
            ctx.drawImage(this.createImage(this.chars[0], false, true), 0, offsetSize * 2);
            ctx.drawImage(this.createImage(this.chars[1], false, true), offsetSize, offsetSize * 2);
            ctx.drawImage(this.createImage(this.chars[0], true, true), offsetSize * 2, offsetSize * 2);
            return element.toDataURL();
        };
        NormalGroundWorld.prototype.createImage = function (map, reverse, vertical) {
            var element = document.createElement('canvas');
            var ctx = element.getContext("2d");
            Charjs.AbstractCharacter.drawCharacter(ctx, map, this.colors, this.pixSize, reverse, vertical);
            var img = new Image();
            img.src = element.toDataURL();
            return img;
        };
        return NormalGroundWorld;
    }(Charjs.AbstractGround));
    Charjs.NormalGroundWorld = NormalGroundWorld;
})(Charjs || (Charjs = {}));
var Charjs;
(function (Charjs) {
    var GameMaster = (function () {
        function GameMaster(targetDom, charSize, frameInterval) {
            if (frameInterval === void 0) { frameInterval = 45; }
            var _this = this;
            this.targetDom = targetDom;
            this.charSize = charSize;
            this.frameInterval = frameInterval;
            this._enemys = {};
            this._enemyCount = 0;
            this._objects = {};
            this._objectCount = 0;
            this._player = null;
            this._isStarting = false;
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
        GameMaster.GetController = function (gameName, targetDom, charSize) {
            var master = GameMaster.GAME_MASTERS[gameName];
            if (master) {
                return master;
            }
            master = new GameMaster(targetDom, charSize);
            GameMaster.GAME_MASTERS[gameName] = master;
            return master;
        };
        GameMaster.prototype.CreatePlayerInstance = function (clz, position, direction) {
            if (direction === void 0) { direction = Charjs.Direction.right; }
            var char = new clz(this.targetDom, this.charSize, position, direction, this.frameInterval);
            char._name = 'player';
            this._player = char;
            char._gameMaster = this;
            return char;
        };
        GameMaster.prototype.CreateEnemyInstance = function (clz, position, direction) {
            if (direction === void 0) { direction = Charjs.Direction.right; }
            var char = new clz(this.targetDom, this.charSize, position, direction, this.frameInterval);
            char._name = 'enemy_' + this._enemyCount;
            this._enemyCount++;
            this._enemys[char._name] = char;
            char._gameMaster = this;
            return char;
        };
        GameMaster.prototype.CreateObjectInstance = function (clz, position) {
            var char = new clz(this.targetDom, this.charSize, position, Charjs.Direction.left, this.frameInterval);
            char._name = 'obj_' + this._objectCount;
            this._objectCount++;
            this._objects[char._name] = char;
            return char;
        };
        GameMaster.prototype.CreateGround = function (clz, groundDom) {
            var ground = new clz(groundDom, this.charSize);
            ground.setBorderImage();
        };
        GameMaster.prototype.deleteEnemy = function (char) {
            delete this._enemys[char._name];
            if (Object.keys(this._enemys).length == 0) {
                this.doGool();
            }
        };
        GameMaster.prototype.getEnemys = function () {
            return this._enemys;
        };
        GameMaster.prototype.getApproachedObjects = function (pos, radius) {
            var objs = [];
            for (var name_3 in this._objects) {
                if (this._objects[name_3].isActive) {
                    var objPos = this._objects[name_3].getPosition();
                    if (pos.x - radius < objPos.x && objPos.x < pos.x + radius &&
                        pos.y - radius < objPos.y && objPos.y < pos.y + radius) {
                        objs.push(this._objects[name_3]);
                    }
                }
            }
            return objs;
        };
        GameMaster.prototype.init = function () {
            if (this._player) {
                this._player.init();
            }
            for (var name_4 in this._enemys) {
                this._enemys[name_4].init();
            }
            for (var name_5 in this._objects) {
                this._objects[name_5].init();
            }
            this.registerCommand();
        };
        GameMaster.prototype.isStarting = function () {
            return this._isStarting;
        };
        GameMaster.prototype.registerCommand = function () {
            document.addEventListener('keypress', this.defaultCommand);
        };
        GameMaster.prototype.start = function () {
            for (var name_6 in this._enemys) {
                this._enemys[name_6].start();
            }
            if (this._player) {
                this._player.start();
            }
            this._isStarting = true;
        };
        GameMaster.prototype.stop = function () {
            for (var name_7 in this._enemys) {
                this._enemys[name_7].stop();
            }
            if (this._player) {
                this._player.stop();
            }
            this._isStarting = false;
        };
        GameMaster.prototype.doGameOver = function () {
            for (var name_8 in this._enemys) {
                this._enemys[name_8].stop();
            }
        };
        GameMaster.prototype.doGool = function () {
            var _this = this;
            for (var name_9 in this._enemys) {
                this._enemys[name_9].stop();
            }
            var screen = document.body;
            var blackScreen = document.createElement('div');
            blackScreen.setAttribute("width", screen.clientWidth.toString());
            blackScreen.setAttribute("height", screen.clientHeight.toString());
            var backgroundOpacity = 0;
            var goolDimTimer = setInterval(function () {
                if (Math.floor(backgroundOpacity) != 1) {
                    backgroundOpacity += 0.01;
                }
                else {
                    clearInterval(goolDimTimer);
                    _this._player.stop();
                    _this._player.onGool(function () {
                        var goolDimOffTimer = setInterval(function () {
                            if (backgroundOpacity.toFixed(2) != "0.20") {
                                backgroundOpacity -= 0.05;
                            }
                            else {
                                clearInterval(goolDimOffTimer);
                                _this._player.start();
                                var circleSize_1 = screen.clientWidth > screen.clientHeight ? screen.clientWidth : screen.clientHeight;
                                var circleAnimationCount_1 = 0;
                                var circleTimer_1 = setInterval(function () {
                                    circleSize_1 -= 20;
                                    var rect = _this._player.getCurrntElement().getBoundingClientRect();
                                    _this.drawBlackClipCircle(screen, rect, circleSize_1, circleAnimationCount_1);
                                    circleAnimationCount_1++;
                                    if (circleSize_1 <= 0) {
                                        clearInterval(circleTimer_1);
                                        _this._player.destroy();
                                    }
                                }, _this.frameInterval / 2);
                            }
                            blackScreen.style.cssText = "z-index: " + (_this._player.zIndex - 1) + "; position: absolute; background-color:black; width: 100vw; height: 100vh; border: 0;opacity: " + backgroundOpacity + ";";
                        }, _this.frameInterval);
                    });
                }
                blackScreen.style.cssText = "z-index: " + (_this._player.zIndex - 1) + "; position: absolute; background-color:black; width: 100vw; height: 100vh; border: 0;opacity: " + backgroundOpacity + ";";
            }, this.frameInterval * 1.5);
            this.targetDom.appendChild(blackScreen);
        };
        GameMaster.prototype.drawBlackClipCircle = function (targetDom, rect, size, count) {
            var element = document.createElement("canvas");
            var ctx = element.getContext("2d");
            var width = targetDom.clientWidth;
            var height = targetDom.clientHeight;
            element.id = "bkout_circle_" + count;
            element.setAttribute("width", width);
            element.setAttribute("height", height);
            element.style.cssText = "z-index: " + (this._player.zIndex + 1) + "; position: absolute;";
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, width, height);
            if (size > 0) {
                ctx.globalCompositeOperation = "destination-out";
                ctx.beginPath();
                ctx.arc(rect.left + rect.width / 2, rect.top + rect.height / 2, size, 0, Math.PI * 2, false);
            }
            ctx.fill();
            this.targetDom.appendChild(element);
            if (count != 0)
                this.targetDom.removeChild(document.getElementById("bkout_circle_" + (count - 1)));
        };
        GameMaster.checkMobile = function () {
            if ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {
                return true;
            }
            else {
                return false;
            }
        };
        return GameMaster;
    }());
    GameMaster.GAME_MASTERS = {};
    Charjs.GameMaster = GameMaster;
})(Charjs || (Charjs = {}));
//# sourceMappingURL=mario.js.map