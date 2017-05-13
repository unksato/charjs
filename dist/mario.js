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
        Direction[Direction["Right"] = 0] = "Right";
        Direction[Direction["Left"] = 1] = "Left";
    })(Direction = Charjs.Direction || (Charjs.Direction = {}));
    var Vertical;
    (function (Vertical) {
        Vertical[Vertical["Up"] = 0] = "Up";
        Vertical[Vertical["Down"] = 1] = "Down";
    })(Vertical = Charjs.Vertical || (Charjs.Vertical = {}));
    var HitStatus;
    (function (HitStatus) {
        HitStatus[HitStatus["none"] = 0] = "none";
        HitStatus[HitStatus["dammage"] = 1] = "dammage";
        HitStatus[HitStatus["attack"] = 2] = "attack";
        HitStatus[HitStatus["grab"] = 3] = "grab";
    })(HitStatus = Charjs.HitStatus || (Charjs.HitStatus = {}));
    var Entity = (function () {
        function Entity() {
            this.ground = null;
            this.ceiling = null;
            this.right = null;
            this.left = null;
        }
        return Entity;
    }());
    Charjs.Entity = Entity;
    var AbstractPixel = (function () {
        function AbstractPixel() {
        }
        AbstractPixel.drawPixel = function (ctx, x, y, size, color, alpha) {
            if (alpha === void 0) { alpha = 1; }
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.rect(x * size, y * size, size, size);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.globalAlpha = 1;
        };
        AbstractPixel.createCanvasElement = function (width, height, zIndex, shadow) {
            if (shadow === void 0) { shadow = false; }
            var element = document.createElement("canvas");
            if (shadow) {
                width += AbstractPixel.SHADOW_SIZE;
            }
            element.setAttribute("width", width.toString());
            element.setAttribute("height", height.toString());
            element.style.cssText = "z-index: " + zIndex + "; position: absolute; bottom: 0;";
            return element;
        };
        AbstractPixel.prototype.toImage = function (element) {
            var q = MyQ.Deferred.defer();
            var img = new Image();
            img.onload = function () {
                q.resolve(img);
            };
            img.src = element.toDataURL();
            return q.promise;
        };
        AbstractPixel.deepCopy = function (obj) {
            return JSON.parse(JSON.stringify(obj));
        };
        return AbstractPixel;
    }());
    AbstractPixel.SHADOW_SIZE = 2;
    Charjs.AbstractPixel = AbstractPixel;
    var AbstractObject = (function (_super) {
        __extends(AbstractObject, _super);
        function AbstractObject(targetDom, pixSize, position, _direction, useLeft, useVertical, zIndex, frameInterval) {
            if (pixSize === void 0) { pixSize = 2; }
            if (position === void 0) { position = { x: 0, y: 0 }; }
            if (_direction === void 0) { _direction = Direction.Right; }
            if (useLeft === void 0) { useLeft = true; }
            if (useVertical === void 0) { useVertical = true; }
            if (zIndex === void 0) { zIndex = 100; }
            if (frameInterval === void 0) { frameInterval = 45; }
            var _this = _super.call(this) || this;
            _this.targetDom = targetDom;
            _this.pixSize = pixSize;
            _this.position = position;
            _this._direction = _direction;
            _this.useLeft = useLeft;
            _this.useVertical = useVertical;
            _this.zIndex = zIndex;
            _this.frameInterval = frameInterval;
            _this._name = '';
            _this._gameMaster = null;
            _this.currentAction = null;
            _this._rightActions = [];
            _this._leftActions = [];
            _this._verticalRightActions = [];
            _this._verticalLeftActions = [];
            _this.size = { height: 0, width: 0, widthOffset: 0, heightOffset: 0 };
            _this.entity = { ground: null, ceiling: null, right: null, left: null };
            return _this;
        }
        AbstractObject.prototype.uncompress = function () {
            if (this.cchars && this.cchars.length > 0) {
                this.chars = [];
                for (var _i = 0, _a = this.cchars; _i < _a.length; _i++) {
                    var cchar = _a[_i];
                    this.chars.push(Util.Compression.RLD(cchar));
                }
            }
            else {
            }
        };
        AbstractObject.prototype.getTimer = function (func, interval) {
            if (this._gameMaster) {
                return this._gameMaster.addEvent(func);
            }
            else {
                return setInterval(func, interval);
            }
        };
        AbstractObject.prototype.removeTimer = function (id) {
            if (this._gameMaster) {
                this._gameMaster.removeEvent(id);
            }
            else {
                clearInterval(id);
            }
        };
        AbstractObject.prototype.init = function (shadow) {
            if (shadow === void 0) { shadow = false; }
            this.uncompress();
            for (var _i = 0, _a = this.chars; _i < _a.length; _i++) {
                var charactor = _a[_i];
                this._rightActions.push(this.createCharacterAction(charactor, shadow));
                if (this.useLeft)
                    this._leftActions.push(this.createCharacterAction(charactor, shadow, true));
                if (this.useVertical) {
                    this._verticalRightActions.push(this.createCharacterAction(charactor, shadow, false, true));
                    if (this.useLeft)
                        this._verticalLeftActions.push(this.createCharacterAction(charactor, shadow, true, true));
                }
            }
            return this;
        };
        AbstractObject.prototype.createCharacterAction = function (charactorMap, shadow, isReverse, isVerticalRotation) {
            if (isReverse === void 0) { isReverse = false; }
            if (isVerticalRotation === void 0) { isVerticalRotation = false; }
            this.size.width = this.pixSize * charactorMap[0].length;
            this.size.height = this.pixSize * charactorMap.length;
            var element = AbstractObject.createCanvasElement(this.size.width, this.size.height, this.zIndex, shadow);
            AbstractCharacter.drawCharacter(element.getContext('2d'), charactorMap, this.colors, this.pixSize, isReverse, isVerticalRotation, shadow);
            return element;
        };
        AbstractObject.drawCharacter = function (ctx, map, colors, size, reverse, vertical, shadow) {
            if (reverse)
                ctx.transform(-1, 0, 0, 1, map[0].length * size, 0);
            if (vertical)
                ctx.transform(1, 0, 0, -1, 0, map.length * size);
            if (shadow) {
                for (var y = 0; y < map.length; y++) {
                    for (var x = 0; x < map[y].length; x++) {
                        if (map[y][x] != 0) {
                            AbstractObject.drawPixel(ctx, x + (1 * (reverse ? -1 : 1)), y + (1 * (vertical ? -1 : 1)), size, '#000', 0.3);
                        }
                    }
                }
            }
            for (var y = 0; y < map.length; y++) {
                for (var x = 0; x < map[y].length; x++) {
                    if (map[y][x] != 0) {
                        AbstractObject.drawPixel(ctx, x, y, size, colors[map[y][x]]);
                    }
                }
            }
        };
        AbstractObject.prototype.removeCharacter = function (target) {
            if (target) {
                this.targetDom.removeChild(target);
            }
            else {
                if (this.currentAction != null) {
                    this.targetDom.removeChild(this.currentAction);
                    this.currentAction = null;
                }
            }
        };
        AbstractObject.prototype.draw = function (index, position, direction, vertical, removeCurrent, drawOffset, clone) {
            if (index === void 0) { index = 0; }
            if (position === void 0) { position = null; }
            if (direction === void 0) { direction = Direction.Right; }
            if (vertical === void 0) { vertical = Vertical.Up; }
            if (removeCurrent === void 0) { removeCurrent = false; }
            if (drawOffset === void 0) { drawOffset = this.pixSize; }
            if (clone === void 0) { clone = false; }
            if (removeCurrent && !clone)
                this.removeCharacter();
            position = position || this.position;
            var action = null;
            if (vertical == Vertical.Up) {
                action = direction == Direction.Right ? this._rightActions[index] : this._leftActions[index];
            }
            else {
                action = direction == Direction.Right ? this._verticalRightActions[index] : this._verticalLeftActions[index];
            }
            if (clone) {
                action = this.cloneCanvas(action);
            }
            else {
                this.currentAction = action;
            }
            action.style.left = position.x + 'px';
            action.style.bottom = (position.y - drawOffset) + 'px';
            action.style.zIndex = this.zIndex.toString();
            this.targetDom.appendChild(action);
            return action;
        };
        AbstractObject.prototype.cloneCanvas = function (oldCanvas) {
            var canvas = AbstractPixel.createCanvasElement(oldCanvas.width, oldCanvas.height, this.zIndex + 1);
            var ctx = canvas.getContext("2d");
            ctx.drawImage(oldCanvas, 0, 0);
            return canvas;
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
    }(AbstractPixel));
    Charjs.AbstractObject = AbstractObject;
    var AbstractCharacter = (function (_super) {
        __extends(AbstractCharacter, _super);
        function AbstractCharacter() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
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
        AbstractCharacter.prototype.init = function (shadow) {
            if (shadow === void 0) { shadow = false; }
            _super.prototype.init.call(this, shadow);
            this.registerCommand();
            return this;
        };
        AbstractCharacter.prototype.start = function () {
            var _this = this;
            if (!this._frameTimer) {
                this._frameTimer = this.getTimer(function () { _this.onAction(); }, this.frameInterval);
            }
            this._isStarting = true;
        };
        AbstractCharacter.prototype.stop = function () {
            if (this._frameTimer) {
                this.removeTimer(this._frameTimer);
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
        AbstractCharacter.prototype.updateEntity = function () {
            if (this._gameMaster) {
                var objs = this._gameMaster.getApproachedObjects(this, this.size.width * 3);
                this.entity.ground = null;
                this.entity.ceiling = null;
                this.entity.right = null;
                this.entity.left = null;
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
                    var oPosUnder = oPos.y;
                    var oPosUpper = oPos.y + oSize.height - oSize.heightOffset;
                    var cPosLeft = this.position.x + this.size.widthOffset;
                    var cPosRight = this.position.x + this.size.width - this.size.widthOffset;
                    var cPosUnder = this.position.y;
                    var cPosUpper = this.position.y + this.size.height - this.size.heightOffset;
                    if (cPosLeft >= oPosLeft && cPosLeft <= oPosRight || cPosRight >= oPosLeft && cPosRight <= oPosRight) {
                        if (cPosUnder >= oPosUpper && (this.entity.ground === null || this.entity.ground <= oPosUpper)) {
                            this.underObject = obj;
                            if (cPosUnder == oPosUpper && this instanceof AbstractEnemy && obj.entityEnemies.indexOf(this) == -1)
                                obj.entityEnemies.push(this);
                            this.entity.ground = oPosUpper;
                            continue;
                        }
                        if (cPosUpper <= oPosUnder + this.pixSize * 3 && (this.entity.ceiling === null || this.entity.ceiling >= oPosUnder + this.pixSize * 3)) {
                            this.upperObject = obj;
                            this.entity.ceiling = oPosUnder + this.pixSize * 3;
                            continue;
                        }
                    }
                    if (cPosUnder >= oPosUnder && cPosUnder < oPosUpper || cPosUpper > oPosUnder && cPosUpper <= oPosUpper) {
                        if (cPosLeft >= oPosRight && (this.entity.left === null || this.entity.left < oPosRight)) {
                            this.leftObject = obj;
                            this.entity.left = oPosRight;
                            continue;
                        }
                        if (cPosRight <= oPosLeft && (this.entity.right === null || this.entity.right > oPosLeft)) {
                            this.rightObject = obj;
                            this.entity.right = oPosLeft;
                            continue;
                        }
                    }
                }
            }
        };
        AbstractCharacter.prototype.updateDirection = function () {
            var currentDirection = this._direction;
            var right = this.entity.right || this.targetDom.clientWidth;
            var left = this.entity.left || 0;
            if (this.position.x + this.size.width >= right && currentDirection == Direction.Right) {
                this._direction = Direction.Left;
            }
            if (this.position.x <= left && currentDirection == Direction.Left) {
                this._direction = Direction.Right;
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
        AbstractEnemy.prototype.doHitTestWithOtherEnemy = function () {
            if (this._gameMaster) {
                var enemys = this._gameMaster.getEnemys();
                for (var name_1 in enemys) {
                    if (enemys[name_1] != this && !enemys[name_1].isKilled()) {
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
                        return enemys[name_1];
                    }
                }
            }
            return null;
        };
        return AbstractEnemy;
    }(AbstractCharacter));
    Charjs.AbstractEnemy = AbstractEnemy;
    var AbstractOtherObject = (function (_super) {
        __extends(AbstractOtherObject, _super);
        function AbstractOtherObject() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isActive = true;
            _this.entityEnemies = [];
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
        AbstractGround.prototype.createBorderImage = function () {
            this.uncompress();
            var q = MyQ.Deferred.defer();
            var element = document.createElement("canvas");
            var ctx = element.getContext("2d");
            var size = this.pixSize * this.chars[0].length * 3;
            element.setAttribute("width", size.toString());
            element.setAttribute("height", size.toString());
            var offsetSize = this.pixSize * this.chars[0].length;
            var drawProcess = [];
            drawProcess.push(this.drawImage(ctx, this.chars[0], false, false, 0, 0));
            drawProcess.push(this.drawImage(ctx, this.chars[1], false, false, offsetSize, 0));
            drawProcess.push(this.drawImage(ctx, this.chars[0], true, false, offsetSize * 2, 0));
            drawProcess.push(this.drawImage(ctx, this.chars[2], false, false, 0, offsetSize));
            drawProcess.push(this.drawImage(ctx, this.chars[3], false, false, offsetSize, offsetSize));
            drawProcess.push(this.drawImage(ctx, this.chars[2], true, false, offsetSize * 2, offsetSize));
            drawProcess.push(this.drawImage(ctx, this.chars[0], false, true, 0, offsetSize * 2));
            drawProcess.push(this.drawImage(ctx, this.chars[1], false, true, offsetSize, offsetSize * 2));
            drawProcess.push(this.drawImage(ctx, this.chars[0], true, true, offsetSize * 2, offsetSize * 2));
            MyQ.Promise.all(drawProcess).then(function () {
                q.resolve(element.toDataURL());
            });
            return q.promise;
        };
        AbstractGround.prototype.drawImage = function (ctx, map, reverse, vertical, offsetX, offsetY) {
            var q = MyQ.Deferred.defer();
            this.createImage(map, reverse, vertical).then(function (img) {
                ctx.drawImage(img, offsetX, offsetY);
                q.resolve({});
            });
            return q.promise;
        };
        AbstractGround.prototype.createImage = function (map, reverse, vertical) {
            var element = document.createElement('canvas');
            var ctx = element.getContext("2d");
            var size = this.pixSize * map.length;
            element.setAttribute("width", size.toString());
            element.setAttribute("height", size.toString());
            AbstractCharacter.drawCharacter(ctx, map, this.colors, this.pixSize, reverse, vertical, false);
            return this.toImage(element);
        };
        return AbstractGround;
    }(AbstractObject));
    Charjs.AbstractGround = AbstractGround;
})(Charjs || (Charjs = {}));
var Charjs;
(function (Charjs) {
    var SlipEffect = (function (_super) {
        __extends(SlipEffect, _super);
        function SlipEffect() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.cchars = [[[0, 1, 1, 2, 0, 1], [1, 4], [1, 4], [0, 1, 1, 2, 0, 1]], [[0, 1, 1, 2, 0, 1], [1, 4], [0, 1, 1, 2, 0, 1], [0, 4]], [[0, 4], [0, 1, 1, 1, 0, 2], [0, 4], [0, 4]]];
            _this.colors = ['', '#fff'];
            _this.chars = null;
            return _this;
        }
        SlipEffect.prototype.init = function () {
            _super.prototype.init.call(this);
            return this;
        };
        SlipEffect.prototype.drawEffect = function (pos) {
            var _this = this;
            var count = 0;
            var current = this.draw(count, pos, undefined, undefined, true, undefined, true);
            count++;
            var tEffect = this.getTimer(function () {
                _this.removeCharacter(current);
                if (count >= _this.chars.length) {
                    _this.destroy();
                    _this.removeTimer(tEffect);
                }
                else {
                    current = _this.draw(count, pos, undefined, undefined, true, undefined, true);
                    count++;
                }
            }, this.frameInterval * 2);
        };
        return SlipEffect;
    }(Charjs.AbstractObject));
    Charjs.SlipEffect = SlipEffect;
})(Charjs || (Charjs = {}));
var Charjs;
(function (Charjs) {
    var SpecialEffect = (function (_super) {
        __extends(SpecialEffect, _super);
        function SpecialEffect() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.cchars = [[[0, 3, 1, 4, 0, 9], [0, 2, 1, 6, 0, 1, 1, 4, 0, 3], [0, 1, 1, 13, 0, 2], [1, 15, 0, 1], [1, 15, 0, 1], [1, 15, 0, 1], [1, 14, 0, 2], [1, 15, 0, 1], [0, 1, 1, 14, 0, 1], [0, 2, 1, 14], [0, 2, 1, 14], [0, 1, 1, 15], [0, 1, 1, 14, 0, 1], [0, 1, 1, 14, 0, 1], [0, 2, 1, 11, 0, 3], [0, 6, 1, 4, 0, 6]], [[0, 16], [0, 3, 1, 2, 0, 4, 1, 1, 0, 6], [0, 2, 1, 4, 0, 2, 1, 3, 0, 5], [0, 2, 1, 4, 0, 3, 1, 1, 0, 2, 1, 1, 0, 3], [0, 2, 1, 4, 0, 5, 1, 3, 0, 2], [0, 3, 1, 2, 0, 6, 1, 3, 0, 2], [0, 12, 1, 1, 0, 3], [0, 8, 1, 2, 0, 6], [0, 7, 1, 4, 0, 5], [0, 8, 1, 2, 0, 6], [0, 4, 1, 1, 0, 7, 1, 1, 0, 3], [0, 3, 1, 3, 0, 5, 1, 3, 0, 2], [0, 3, 1, 3, 0, 1, 1, 1, 0, 3, 1, 3, 0, 2], [0, 4, 1, 1, 0, 1, 1, 3, 0, 3, 1, 1, 0, 3], [0, 7, 1, 1, 0, 8], [0, 16]], [[0, 16], [0, 16], [0, 16], [0, 3, 1, 2, 0, 4, 1, 1, 0, 6], [0, 2, 1, 4, 0, 5, 1, 2, 0, 3], [0, 3, 1, 2, 0, 6, 1, 2, 0, 3], [0, 16], [0, 16], [0, 16], [0, 9, 1, 1, 0, 6], [0, 8, 1, 3, 0, 5], [0, 3, 1, 2, 0, 4, 1, 1, 0, 6], [0, 3, 1, 2, 0, 11], [0, 11, 1, 2, 0, 3], [0, 8, 1, 1, 0, 7], [0, 16]], [[0, 16], [0, 16], [0, 16], [0, 16], [0, 3, 1, 1, 0, 12], [0, 16], [0, 12, 1, 1, 0, 3], [0, 16], [0, 16], [0, 9, 1, 1, 0, 6], [0, 16], [0, 3, 1, 1, 0, 12], [0, 12, 1, 1, 0, 3], [0, 16], [0, 16], [0, 16]], [[0, 16], [0, 16], [0, 16], [0, 16], [0, 16], [0, 8, 2, 1, 0, 7], [0, 8, 2, 1, 0, 7], [0, 5, 2, 7, 0, 4], [0, 6, 2, 5, 0, 5], [0, 7, 2, 3, 0, 6], [0, 6, 2, 5, 0, 5], [0, 5, 2, 2, 0, 3, 2, 2, 0, 4], [0, 16], [0, 16], [0, 16], [0, 16]]];
            _this.colors = ['', '#fff', '#fffd34'];
            _this.chars = null;
            _this.currentIndex = 0;
            _this.prevStars = [];
            return _this;
        }
        SpecialEffect.prototype.init = function () {
            _super.prototype.init.call(this);
            return this;
        };
        SpecialEffect.prototype.drawEffect = function (pos) {
            var _this = this;
            var tEffect = this.getTimer(function () {
                if (_this.currentIndex > 3) {
                    _this.removeStars();
                    _this.destroy();
                    _this.removeTimer(tEffect);
                    _this.currentIndex = 0;
                }
                else {
                    _this.draw(_this.currentIndex, pos, undefined, undefined, true);
                    _this.drawStars(pos, _this.currentIndex);
                    _this.currentIndex++;
                }
            }, this.frameInterval);
        };
        SpecialEffect.prototype.drawStars = function (pos, count) {
            this.removeStars();
            var offset = count * this.pixSize * 5;
            this.prevStars.push(this.draw(4, { x: pos.x - offset, y: pos.y - offset }, undefined, undefined, false, 0, true));
            this.prevStars.push(this.draw(4, { x: pos.x + offset, y: pos.y - offset }, undefined, undefined, false, 0, true));
            this.prevStars.push(this.draw(4, { x: pos.x - offset, y: pos.y + offset }, undefined, undefined, false, 0, true));
            this.prevStars.push(this.draw(4, { x: pos.x + offset, y: pos.y + offset }, undefined, undefined, false, 0, true));
        };
        SpecialEffect.prototype.removeStars = function () {
            if (this.prevStars.length > 0) {
                var prev = null;
                while (prev = this.prevStars.shift()) {
                    this.removeCharacter(prev);
                }
            }
        };
        return SpecialEffect;
    }(Charjs.AbstractObject));
    Charjs.SpecialEffect = SpecialEffect;
})(Charjs || (Charjs = {}));
var Charjs;
(function (Charjs) {
    var StarEffect = (function (_super) {
        __extends(StarEffect, _super);
        function StarEffect() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.cchars = [[[0, 7, 1, 2, 0, 7], [0, 7, 1, 2, 0, 5, 1, 2], [0, 6, 1, 3, 0, 3, 1, 4], [0, 6, 1, 9, 0, 1], [0, 6, 1, 9, 0, 1], [0, 5, 1, 9, 0, 2], [1, 14, 0, 2], [1, 13, 0, 3], [0, 1, 1, 13, 0, 2], [0, 2, 1, 13, 0, 1], [0, 3, 1, 13], [0, 2, 1, 14], [0, 1, 1, 9, 0, 6], [0, 1, 1, 8, 0, 7], [1, 4, 0, 2, 1, 3, 0, 7], [1, 2, 0, 5, 1, 1, 0, 8]]];
            _this.colors = ['', '#fff'];
            _this.chars = null;
            return _this;
        }
        StarEffect.prototype.init = function () {
            _super.prototype.init.call(this);
            return this;
        };
        StarEffect.prototype.drawEffect = function (pos) {
            var _this = this;
            this.draw(0, pos);
            var tEffect = this.getTimer(function () {
                _this.destroy();
                _this.removeTimer(tEffect);
            }, this.frameInterval);
        };
        return StarEffect;
    }(Charjs.AbstractObject));
    Charjs.StarEffect = StarEffect;
})(Charjs || (Charjs = {}));
var Charjs;
(function (Charjs) {
    var GoombaWorld = (function (_super) {
        __extends(GoombaWorld, _super);
        function GoombaWorld(targetDom, pixSize, position, direction, zIndex, frameInterval) {
            if (direction === void 0) { direction = Charjs.Direction.Right; }
            if (zIndex === void 0) { zIndex = 100; }
            if (frameInterval === void 0) { frameInterval = 45; }
            var _this = _super.call(this, targetDom, pixSize, position, direction, true, true, zIndex - 1, frameInterval) || this;
            _this.colors = ['', '#000000', '#ffffff', '#b82800', '#f88800', '#f87800', '#f8c000', '#f8f800'];
            _this.cchars = [[[0, 16], [0, 6, 1, 4, 0, 6], [0, 4, 1, 2, 3, 4, 1, 2, 0, 4], [0, 3, 1, 1, 4, 1, 1, 4, 3, 3, 1, 4], [0, 2, 1, 1, 4, 1, 2, 1, 4, 1, 3, 1, 1, 3, 3, 1, 1, 3, 0, 2], [0, 1, 1, 1, 3, 2, 4, 1, 3, 3, 2, 1, 1, 3, 2, 1, 3, 1, 1, 1, 0, 1], [0, 1, 1, 1, 3, 5, 2, 3, 3, 1, 2, 3, 3, 1, 1, 1], [1, 1, 3, 6, 2, 2, 1, 1, 3, 1, 1, 1, 2, 2, 3, 1, 1, 1], [1, 1, 3, 7, 2, 2, 3, 1, 2, 2, 3, 2, 1, 1], [1, 1, 3, 6, 4, 6, 3, 2, 1, 1], [0, 1, 1, 1, 3, 3, 4, 2, 2, 1, 1, 4, 2, 1, 3, 1, 1, 1, 0, 1], [0, 1, 5, 3, 4, 2, 1, 2, 4, 4, 1, 1, 4, 2, 0, 1], [5, 1, 6, 2, 7, 1, 5, 2, 4, 7, 1, 1, 4, 1, 0, 1], [1, 1, 6, 2, 7, 2, 2, 1, 5, 1, 4, 4, 1, 2, 7, 1, 2, 1, 1, 1], [0, 1, 1, 2, 6, 1, 7, 2, 5, 1, 1, 4, 6, 2, 1, 2, 0, 1], [0, 3, 1, 4, 0, 2, 1, 4, 0, 3]], [[0, 6, 1, 4, 0, 6], [0, 4, 1, 2, 3, 4, 1, 2, 0, 4], [0, 3, 1, 1, 4, 1, 3, 3, 1, 3, 3, 1, 1, 3, 0, 1], [0, 2, 1, 1, 4, 1, 2, 1, 4, 1, 3, 4, 1, 2, 3, 1, 1, 2, 0, 1], [0, 1, 1, 1, 3, 2, 4, 1, 3, 5, 2, 1, 1, 3, 2, 1, 0, 1], [0, 1, 1, 1, 3, 7, 2, 3, 1, 1, 2, 2, 0, 1], [1, 1, 3, 8, 2, 2, 1, 1, 3, 1, 1, 1, 2, 1, 1, 1], [1, 1, 3, 9, 2, 2, 3, 1, 2, 2, 1, 1], [1, 1, 3, 8, 4, 6, 1, 1], [0, 1, 1, 1, 3, 5, 4, 2, 2, 1, 1, 5, 0, 1], [0, 1, 1, 1, 3, 4, 4, 2, 1, 2, 4, 4, 1, 1, 0, 1], [0, 2, 1, 1, 3, 2, 4, 8, 1, 1, 0, 2], [0, 3, 1, 2, 5, 5, 4, 1, 1, 2, 0, 3], [0, 5, 5, 1, 6, 2, 7, 2, 5, 1, 0, 5], [0, 5, 5, 1, 6, 4, 2, 1, 5, 1, 0, 4], [0, 5, 1, 7, 0, 4]]];
            _this.chars = null;
            _this._speed = GoombaWorld.DEFAULT_SPEED;
            _this._step = GoombaWorld.STEP;
            _this._currentStep = 0;
            _this._actionIndex = 0;
            _this._isKilled = false;
            _this._yVector = 0;
            _this._jumpPower = 12;
            _this._isKickBound = false;
            _this._isRevivalJumping = false;
            _this._grabbedPlayer = null;
            _this._star_effect = null;
            _this._vertical = Charjs.Vertical.Up;
            _this._steppedTimeout = 0;
            _this._revivedTimeout = 0;
            _this._star_effect = new Charjs.StarEffect(targetDom, pixSize).init();
            return _this;
        }
        GoombaWorld.prototype.isKilled = function () {
            return this._isKilled;
        };
        GoombaWorld.prototype.executeJump = function () {
            var ground = this.entity.ground || 0;
            if (this._isKickBound) {
                this._yVector -= this._gravity * this.pixSize;
                if (this.entity.ceiling != null) {
                    this.position.y = Math.min(this.position.y + this._yVector, this.entity.ceiling - this.size.height + this.size.heightOffset);
                    if (this.position.y == this.entity.ceiling - this.size.height + this.size.heightOffset && this._yVector > 0) {
                        this._yVector = 0;
                    }
                }
                else {
                    this.position.y = this.position.y + this._yVector;
                }
                if (this.position.y <= ground) {
                    this.position.y = ground;
                    this._speed = 0;
                    this._yVector = 0;
                    this._isKickBound = false;
                }
            }
            if (this._isRevivalJumping) {
                this._yVector -= this._gravity * this.pixSize;
                if (this.entity.ceiling != null) {
                    this.position.y = Math.min(this.position.y + this._yVector, this.entity.ceiling - this.size.height + this.size.heightOffset);
                    if (this.position.y == this.entity.ceiling - this.size.height + this.size.heightOffset && this._yVector > 0) {
                        this._yVector = 0;
                    }
                }
                else {
                    this.position.y = this.position.y + this._yVector;
                }
                if (this.position.y <= ground) {
                    this._isRevivalJumping = false;
                    this._yVector = 0;
                    this.position.y = ground;
                    this._speed = GoombaWorld.DEFAULT_SPEED;
                }
                else {
                    if (this._yVector <= 0) {
                        this._vertical = Charjs.Vertical.Up;
                    }
                    ;
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
            }
        };
        GoombaWorld.prototype.onAction = function () {
            if (this._steppedTimeout > 0) {
                this._steppedTimeout -= this.frameInterval;
                this._revivedTimeout = 0;
                if (this._steppedTimeout <= 0) {
                    this._step = 1;
                    this._revivedTimeout = 2000;
                    this._steppedTimeout = 0;
                }
            }
            if (this._revivedTimeout > 0) {
                this._revivedTimeout -= this.frameInterval;
                if (this._revivedTimeout <= 0) {
                    if (this._grabbedPlayer) {
                        this._step = GoombaWorld.STEP;
                        this._vertical = Charjs.Vertical.Up;
                        if (this._grabbedPlayer) {
                            this._grabbedPlayer.releaseEnemy();
                            this._grabbedPlayer = null;
                        }
                    }
                    else {
                        this._step = GoombaWorld.STEP;
                        this._isRevivalJumping = true;
                        this._yVector = this._jumpPower * this.pixSize;
                    }
                }
            }
            if (!this._grabbedPlayer) {
                var directionUpdated = this.updateDirection();
                var targetEnemy = this.doHitTestWithOtherEnemy();
                if (targetEnemy) {
                    if (this._isKickBound) {
                        var ePos = targetEnemy.getPosition();
                        var targetEnemyCenter = ePos.x + targetEnemy.getCharSize().width / 2;
                        var enemyCenter = this.position.x + this.size.width / 2;
                        targetEnemy.onEnemyAttack(targetEnemyCenter <= enemyCenter ? Charjs.Direction.Left : Charjs.Direction.Right, 10);
                        this.onEnemyAttack(targetEnemyCenter <= enemyCenter ? Charjs.Direction.Right : Charjs.Direction.Left, 10);
                        var effectPos = { x: (this.position.x + ePos.x) / 2, y: (this.position.y + ePos.y) / 2 };
                        this._star_effect.drawEffect(effectPos);
                        return;
                    }
                    else {
                        if (!this.isStepped()) {
                            this._direction = this._direction == Charjs.Direction.Right ? Charjs.Direction.Left : Charjs.Direction.Right;
                        }
                    }
                }
                this.updateEntity();
                this.executeJump();
                if (this._direction == Charjs.Direction.Right) {
                    this.position.x += this.pixSize * this._speed;
                }
                else {
                    this.position.x -= this.pixSize * this._speed;
                }
                this.drawAction();
            }
        };
        GoombaWorld.prototype.drawAction = function () {
            if (this._currentStep < this._step) {
                this._currentStep++;
            }
            else {
                this._currentStep = 0;
                this._actionIndex = this._actionIndex ^ 1;
            }
            this.draw(this._actionIndex, null, this._direction, this._vertical, true);
        };
        GoombaWorld.prototype.isStepped = function () {
            return this._vertical == Charjs.Vertical.Down;
        };
        GoombaWorld.prototype.onKilled = function () {
            this._isKilled = true;
            this.destroy();
        };
        GoombaWorld.prototype.onStepped = function () {
            this._vertical = Charjs.Vertical.Down;
            this._speed = 0;
            this._steppedTimeout = 5000;
        };
        GoombaWorld.prototype.onGrabed = function (player) {
            this._grabbedPlayer = player;
        };
        GoombaWorld.prototype.onKicked = function (kickDirection, kickPower) {
            this._yVector = 8 * this.pixSize;
            this._isKickBound = true;
            this._speed = 10;
            this._direction = kickDirection;
            this._steppedTimeout = 5000;
            return Charjs.HitStatus.none;
        };
        GoombaWorld.prototype.onEnemyAttack = function (attackDirection, kickPower) {
            var _this = this;
            this.stop();
            this._isKilled = true;
            var yVector = 10 * this.pixSize;
            var direction = (attackDirection == Charjs.Direction.Right ? 1 : -1);
            var killTimer = this.getTimer(function () {
                yVector -= _this._gravity * _this.pixSize;
                _this.position.y = _this.position.y + yVector;
                _this.position.x += kickPower * direction;
                if (_this.position.y < _this.size.height * 5 * -1) {
                    _this.removeTimer(killTimer);
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
                _this.draw(_this._actionIndex, null, _this._direction, Charjs.Vertical.Down, true);
            }, this.frameInterval);
        };
        GoombaWorld.prototype.registerActionCommand = function () {
        };
        return GoombaWorld;
    }(Charjs.AbstractEnemy));
    GoombaWorld.DEFAULT_SPEED = 1;
    GoombaWorld.STEP = 2;
    Charjs.GoombaWorld = GoombaWorld;
})(Charjs || (Charjs = {}));
var Charjs;
(function (Charjs) {
    var KoopaWorld = (function (_super) {
        __extends(KoopaWorld, _super);
        function KoopaWorld(targetDom, pixSize, position, direction, zIndex, frameInterval) {
            if (direction === void 0) { direction = Charjs.Direction.Right; }
            if (zIndex === void 0) { zIndex = 100; }
            if (frameInterval === void 0) { frameInterval = 45; }
            var _this = _super.call(this, targetDom, pixSize, position, direction, true, true, zIndex - 1, frameInterval) || this;
            _this.colors = ['', '#000000', '#f8f8f8', '#b52b0f', '#f58820', '#17770f', '#28b61d', '#3af52a'];
            _this.cchars = [[[0, 11, 3, 1, 2, 2, 0, 2], [0, 10, 3, 1, 2, 4, 0, 1], [0, 9, 3, 2, 2, 3, 1, 1, 0, 1], [0, 8, 3, 1, 4, 1, 3, 1, 2, 3, 1, 1, 0, 1], [0, 8, 3, 1, 4, 2, 2, 3, 1, 1, 0, 1], [0, 8, 3, 1, 4, 2, 2, 4, 0, 1], [0, 4, 3, 5, 4, 3, 2, 2, 4, 1, 3, 1], [0, 2, 3, 2, 2, 4, 4, 6, 1, 1, 3, 1], [0, 1, 3, 1, 2, 3, 4, 1, 2, 1, 4, 8, 3, 1], [0, 1, 3, 1, 2, 2, 4, 2, 2, 1, 4, 1, 3, 1, 4, 2, 3, 1, 4, 3, 3, 1], [3, 1, 2, 3, 4, 3, 3, 3, 4, 2, 3, 1, 4, 1, 3, 1, 0, 1], [3, 1, 2, 3, 4, 3, 3, 1, 0, 2, 3, 1, 4, 1, 3, 2, 0, 2], [0, 1, 3, 1, 1, 5, 3, 1, 0, 3, 3, 2, 0, 3], [0, 2, 1, 1, 7, 4, 1, 2, 0, 7], [0, 2, 1, 1, 7, 4, 2, 1, 1, 1, 0, 7], [0, 2, 1, 7, 0, 7]], [[0, 16], [0, 11, 3, 1, 2, 2, 0, 2], [0, 10, 3, 1, 2, 4, 0, 1], [0, 9, 3, 2, 2, 3, 1, 1, 0, 1], [0, 8, 3, 1, 4, 1, 3, 1, 2, 3, 1, 1, 0, 1], [0, 8, 3, 1, 4, 2, 2, 3, 1, 1, 0, 1], [0, 8, 3, 1, 4, 2, 2, 4, 3, 1], [0, 4, 3, 5, 4, 3, 2, 2, 4, 1, 3, 1], [0, 2, 3, 2, 2, 4, 4, 6, 1, 1, 3, 1], [0, 1, 3, 1, 2, 2, 4, 2, 2, 1, 4, 8, 3, 1], [0, 1, 3, 1, 2, 1, 4, 2, 2, 2, 4, 1, 3, 1, 4, 2, 3, 1, 4, 3, 3, 1], [1, 1, 2, 2, 4, 3, 2, 1, 3, 3, 4, 2, 3, 1, 4, 1, 3, 1, 0, 1], [1, 1, 3, 1, 2, 1, 4, 3, 1, 3, 2, 1, 3, 1, 4, 1, 3, 2, 0, 2], [1, 1, 6, 1, 3, 2, 1, 1, 7, 4, 1, 2, 3, 2, 0, 3], [0, 1, 1, 1, 6, 2, 1, 1, 7, 4, 2, 1, 1, 1, 0, 5], [0, 2, 1, 9, 0, 5]], [[0, 16], [1, 4, 0, 12], [1, 1, 2, 1, 7, 2, 1, 3, 0, 9], [0, 1, 1, 1, 7, 5, 1, 1, 0, 4, 2, 2, 0, 2], [0, 2, 1, 1, 7, 4, 1, 1, 0, 2, 3, 1, 2, 4, 0, 1], [0, 2, 1, 3, 7, 1, 1, 1, 0, 2, 3, 1, 4, 1, 2, 2, 1, 1, 0, 2], [0, 1, 3, 1, 4, 3, 1, 2, 0, 1, 3, 1, 4, 2, 2, 3, 1, 1, 0, 1], [3, 1, 2, 1, 3, 1, 4, 3, 3, 1, 0, 1, 3, 1, 4, 2, 2, 3, 1, 1, 0, 1], [3, 1, 2, 2, 3, 3, 2, 1, 3, 2, 4, 2, 2, 4, 3, 1], [3, 1, 2, 6, 3, 1, 4, 4, 2, 2, 4, 1, 3, 1], [3, 1, 2, 5, 3, 2, 4, 6, 1, 1, 3, 1], [0, 1, 3, 1, 2, 3, 3, 1, 4, 2, 3, 1, 4, 6, 3, 1], [0, 1, 3, 1, 2, 3, 3, 1, 4, 3, 3, 3, 4, 3, 3, 1], [0, 2, 3, 1, 2, 2, 3, 1, 4, 4, 3, 1, 4, 1, 3, 1, 4, 1, 3, 1, 0, 1], [0, 3, 3, 2, 2, 1, 3, 2, 4, 3, 3, 1, 4, 1, 3, 1, 0, 2], [0, 5, 3, 8, 0, 3]], [[0, 2, 1, 2, 0, 12], [0, 2, 1, 1, 7, 1, 1, 1, 0, 5, 2, 1, 0, 2, 2, 1, 0, 2], [0, 2, 1, 1, 7, 2, 1, 1, 0, 10], [0, 3, 1, 1, 7, 2, 1, 1, 0, 4, 2, 2, 0, 3], [0, 2, 1, 1, 7, 4, 1, 1, 0, 1, 3, 1, 2, 4, 0, 2], [0, 2, 1, 2, 7, 2, 1, 1, 0, 1, 3, 1, 4, 1, 2, 2, 1, 1, 2, 1, 0, 2], [0, 1, 3, 1, 4, 2, 1, 2, 0, 1, 3, 1, 4, 2, 2, 3, 1, 1, 0, 2], [0, 1, 3, 2, 4, 3, 3, 2, 4, 2, 2, 3, 1, 1, 0, 2], [3, 1, 2, 2, 3, 5, 4, 2, 2, 4, 3, 1, 0, 1], [3, 1, 2, 5, 3, 1, 4, 4, 2, 2, 4, 1, 3, 1, 0, 1], [3, 1, 2, 5, 3, 1, 4, 6, 1, 1, 3, 1, 0, 1], [3, 1, 2, 4, 3, 3, 4, 1, 3, 2, 4, 3, 3, 1, 0, 1], [3, 2, 2, 3, 3, 1, 4, 2, 3, 1, 4, 2, 3, 1, 4, 2, 3, 1, 0, 1], [0, 1, 3, 2, 2, 2, 3, 1, 4, 3, 3, 1, 4, 1, 3, 1, 4, 1, 3, 1, 0, 2], [0, 2, 3, 2, 2, 2, 3, 1, 4, 3, 3, 1, 4, 1, 3, 1, 0, 3], [0, 4, 3, 8, 0, 4]], [[0, 16], [0, 16], [0, 16], [0, 16], [0, 16], [0, 16], [0, 16], [0, 16], [0, 1, 3, 2, 0, 2, 3, 6, 0, 2, 3, 2, 0, 1], [3, 1, 4, 2, 3, 1, 2, 3, 3, 2, 2, 3, 3, 1, 4, 2, 3, 1], [3, 3, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 3, 3], [0, 2, 3, 1, 4, 1, 2, 3, 4, 2, 2, 3, 4, 1, 3, 1, 0, 2], [0, 2, 3, 2, 4, 8, 3, 2, 0, 2], [0, 2, 1, 2, 3, 8, 1, 2, 0, 2], [0, 1, 1, 1, 2, 1, 7, 3, 1, 1, 2, 2, 1, 1, 7, 3, 2, 1, 1, 1, 0, 1], [0, 1, 1, 6, 3, 2, 1, 6, 0, 1]]];
            _this.chars = null;
            _this._yVector = 0;
            _this._isKilled = false;
            _this._step = KoopaWorld.STEP;
            _this._currentStep = 0;
            _this._actionIndex = 0;
            _this._xVector = 0;
            _this._speed = KoopaWorld.DEFAULT_SPEED;
            _this._star_effect = null;
            _this._slip_effect = null;
            _this._vertical = Charjs.Vertical.Up;
            _this.waitCount = 0;
            _this._star_effect = new Charjs.StarEffect(targetDom, pixSize).init();
            _this._slip_effect = new Charjs.SlipEffect(targetDom, _this.pixSize).init();
            return _this;
        }
        KoopaWorld.prototype.executeJump = function () {
            var ground = this.entity.ground || 0;
            this._yVector -= this._gravity * this.pixSize;
            this.position.y += this._yVector;
            if (this.position.y < ground) {
                this.position.y = ground;
            }
        };
        KoopaWorld.prototype.onPushOut = function () {
            this._xVector = 12;
            return this;
        };
        KoopaWorld.prototype.onAction = function () {
            var directionUpdated = this.updateDirection();
            var targetEnemy = this.doHitTestWithOtherEnemy();
            if (targetEnemy && this._xVector == 0) {
                this._direction = this._direction == Charjs.Direction.Right ? Charjs.Direction.Left : Charjs.Direction.Right;
            }
            this.updateEntity();
            this.executeJump();
            if (this._xVector > 0) {
                this._xVector--;
                this._speed = KoopaWorld.DEFAULT_SPEED * this._xVector;
            }
            else {
                this._speed = KoopaWorld.DEFAULT_SPEED;
            }
            if (this._xVector == 0 && this.waitCount < 100) {
                this.waitCount++;
                this._speed = 0;
                if (this.waitCount == 100)
                    this._yVector = 8 * this.pixSize;
            }
            if (this._direction == Charjs.Direction.Right) {
                this.position.x += this.pixSize * this._speed;
            }
            else {
                this.position.x -= this.pixSize * this._speed;
            }
            this.drawAction();
        };
        KoopaWorld.prototype.drawAction = function () {
            var action = this._actionIndex;
            if (this._xVector > 0) {
                this._slip_effect.drawEffect(this.position);
                action = 2;
            }
            else {
                if (this._currentStep < this._step) {
                    this._currentStep++;
                }
                else {
                    this._currentStep = 0;
                    if (this._actionIndex == 0 || this._actionIndex == 1) {
                        this._actionIndex = this._actionIndex ^ 1;
                    }
                    else {
                        this._actionIndex = 0;
                    }
                }
                if (this._speed == 0) {
                    action = this._actionIndex + 2;
                }
            }
            this.draw(action, null, this._direction, this._vertical, true);
        };
        KoopaWorld.prototype.isKilled = function () {
            return this._isKilled;
        };
        KoopaWorld.prototype.onKilled = function () {
            this.destroy();
        };
        KoopaWorld.prototype.isStepped = function () {
            return false;
        };
        KoopaWorld.prototype.onStepped = function () {
            var _this = this;
            this._isKilled = true;
            this.stop();
            this.draw(4, null, this._direction, Charjs.Vertical.Up, true);
            var timercount = 0;
            var killTimer = this.getTimer(function () {
                timercount++;
                if (timercount > 4) {
                    _this.removeTimer(killTimer);
                    _this.destroy();
                }
            }, this.frameInterval);
        };
        KoopaWorld.prototype.onGrabed = function (player) {
        };
        KoopaWorld.prototype.onKicked = function (kickDirection, kickPower) {
            return Charjs.HitStatus.none;
        };
        KoopaWorld.prototype.onEnemyAttack = function (attackDirection, kickPower) {
            var _this = this;
            if (this._xVector > 0)
                return;
            this._isKilled = true;
            this.stop();
            var yVector = 10 * this.pixSize;
            var direction = (attackDirection == Charjs.Direction.Right ? 1 : -1);
            var killTimer = this.getTimer(function () {
                yVector -= _this._gravity * _this.pixSize;
                _this.position.y = _this.position.y + yVector;
                _this.position.x += kickPower * direction;
                if (_this.position.y < _this.size.height * 5 * -1) {
                    _this.removeTimer(killTimer);
                    _this.destroy();
                    return;
                }
                _this.draw(_this._actionIndex, null, _this._direction, Charjs.Vertical.Down, true);
            }, this.frameInterval);
        };
        KoopaWorld.prototype.registerActionCommand = function () {
        };
        return KoopaWorld;
    }(Charjs.AbstractEnemy));
    KoopaWorld.STEP = 2;
    KoopaWorld.DEFAULT_SPEED = 1;
    Charjs.KoopaWorld = KoopaWorld;
})(Charjs || (Charjs = {}));
var Charjs;
(function (Charjs) {
    var KoopatroopaWorld = (function (_super) {
        __extends(KoopatroopaWorld, _super);
        function KoopatroopaWorld(targetDom, pixSize, position, direction, zIndex, frameInterval) {
            if (direction === void 0) { direction = Charjs.Direction.Right; }
            if (zIndex === void 0) { zIndex = 100; }
            if (frameInterval === void 0) { frameInterval = 45; }
            var _this = _super.call(this, targetDom, pixSize, position, direction, true, true, zIndex - 1, frameInterval) || this;
            _this.colors = ['', '#000000', '#f8f8f8', '#b52b0f', '#f58820', '#17770f', '#28b61d', '#3af52a'];
            _this.cchars = [[[0, 10, 2, 2, 0, 4], [0, 9, 2, 4, 0, 3], [0, 9, 2, 3, 1, 1, 0, 3], [0, 8, 3, 1, 2, 3, 1, 1, 0, 3], [0, 7, 3, 1, 4, 1, 2, 3, 1, 1, 3, 1, 0, 2], [0, 6, 3, 1, 4, 2, 2, 4, 4, 1, 3, 1, 0, 1], [0, 6, 3, 1, 4, 3, 2, 2, 4, 2, 3, 1, 0, 1], [0, 6, 3, 1, 4, 8, 3, 1], [0, 6, 3, 1, 4, 8, 3, 1], [0, 7, 3, 1, 4, 3, 3, 2, 4, 2, 3, 1], [0, 8, 3, 1, 4, 4, 3, 1, 4, 1, 3, 1], [0, 4, 1, 1, 5, 2, 1, 1, 0, 1, 3, 1, 4, 4, 3, 2], [0, 2, 5, 2, 1, 1, 2, 2, 5, 1, 1, 2, 4, 2, 3, 3, 0, 1], [0, 1, 5, 1, 7, 1, 1, 1, 7, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 4, 1, 3, 1, 0, 3], [0, 1, 1, 2, 7, 2, 6, 1, 1, 3, 2, 1, 1, 1, 3, 1, 0, 4], [5, 1, 6, 1, 1, 1, 6, 2, 1, 1, 6, 1, 1, 1, 3, 2, 1, 3, 0, 3], [5, 1, 6, 1, 1, 3, 6, 1, 5, 1, 3, 1, 4, 2, 3, 1, 2, 2, 1, 1, 0, 2], [5, 1, 1, 1, 6, 2, 1, 2, 2, 1, 3, 1, 4, 1, 3, 1, 6, 2, 1, 1, 0, 3], [1, 1, 6, 2, 5, 1, 1, 1, 2, 1, 1, 1, 3, 1, 4, 1, 3, 2, 1, 1, 0, 4], [5, 3, 1, 2, 3, 3, 4, 3, 3, 1, 0, 4], [2, 1, 1, 3, 2, 1, 3, 1, 4, 1, 3, 1, 4, 3, 3, 1, 0, 4], [1, 1, 2, 3, 1, 1, 3, 1, 4, 2, 3, 3, 0, 5], [0, 1, 1, 8, 0, 7], [0, 5, 1, 1, 7, 2, 1, 1, 0, 7], [0, 5, 1, 1, 7, 3, 1, 2, 0, 5], [0, 5, 1, 1, 7, 4, 2, 1, 1, 1, 0, 4], [0, 5, 1, 7, 0, 4]], [[0, 16], [0, 10, 2, 2, 0, 4], [0, 9, 2, 4, 0, 3], [0, 9, 2, 3, 1, 1, 0, 3], [0, 8, 3, 1, 2, 3, 1, 1, 0, 3], [0, 7, 3, 1, 4, 1, 2, 3, 1, 1, 3, 1, 0, 2], [0, 6, 3, 1, 4, 2, 2, 4, 4, 1, 3, 1, 0, 1], [0, 6, 3, 1, 4, 3, 2, 2, 4, 2, 3, 1, 0, 1], [0, 6, 3, 1, 4, 8, 3, 1], [0, 6, 3, 1, 4, 8, 3, 1], [0, 7, 3, 1, 4, 3, 3, 2, 4, 2, 3, 1], [0, 8, 3, 1, 4, 4, 3, 1, 4, 1, 3, 1], [0, 4, 1, 1, 5, 2, 1, 1, 0, 1, 3, 1, 4, 4, 3, 2], [0, 2, 5, 2, 1, 1, 2, 2, 5, 1, 1, 2, 4, 2, 3, 3, 0, 1], [0, 1, 5, 1, 7, 1, 3, 5, 1, 1, 2, 1, 1, 1, 4, 1, 3, 1, 0, 3], [5, 1, 6, 1, 3, 1, 4, 5, 3, 1, 2, 1, 1, 1, 3, 1, 0, 1, 3, 2, 0, 1], [5, 1, 6, 1, 3, 1, 4, 2, 3, 2, 4, 2, 3, 1, 1, 3, 4, 2, 3, 1], [5, 1, 6, 1, 3, 1, 4, 2, 3, 1, 1, 1, 3, 2, 5, 1, 2, 3, 1, 1, 4, 1, 3, 1], [5, 1, 1, 1, 6, 1, 3, 2, 1, 1, 2, 1, 1, 1, 2, 2, 6, 2, 1, 1, 3, 2, 0, 1], [1, 1, 6, 2, 5, 1, 1, 1, 2, 1, 1, 1, 2, 1, 5, 1, 2, 2, 1, 1, 0, 4], [5, 2, 1, 1, 5, 1, 3, 3, 2, 2, 6, 2, 1, 3, 0, 2], [0, 1, 1, 1, 7, 1, 1, 1, 4, 2, 3, 1, 6, 1, 2, 2, 1, 2, 2, 1, 1, 1, 0, 2], [1, 1, 7, 3, 1, 1, 4, 1, 3, 1, 2, 1, 1, 3, 7, 2, 1, 1, 0, 2], [1, 1, 7, 4, 1, 4, 7, 4, 1, 1, 0, 2], [0, 1, 1, 1, 7, 2, 1, 2, 0, 2, 1, 1, 7, 3, 1, 1, 0, 3], [0, 2, 1, 1, 7, 2, 2, 1, 1, 1, 0, 2, 1, 1, 7, 2, 1, 1, 0, 3], [0, 3, 1, 4, 0, 3, 1, 2, 0, 4]]];
            _this.chars = null;
            _this._speed = KoopatroopaWorld.DEFAULT_SPEED;
            _this._step = KoopatroopaWorld.STEP;
            _this._currentStep = 0;
            _this._actionIndex = 0;
            _this._isKilled = false;
            _this._yVector = 0;
            _this._isRevivalJumping = false;
            _this._star_effect = null;
            _this._vertical = Charjs.Vertical.Up;
            _this._star_effect = new Charjs.StarEffect(targetDom, pixSize).init();
            return _this;
        }
        KoopatroopaWorld.prototype.isKilled = function () {
            return this._isKilled;
        };
        KoopatroopaWorld.prototype.executeJump = function () {
            var ground = this.entity.ground || 0;
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
        };
        KoopatroopaWorld.prototype.onAction = function () {
            var directionUpdated = this.updateDirection();
            var targetEnemy = this.doHitTestWithOtherEnemy();
            if (targetEnemy) {
                this._direction = this._direction == Charjs.Direction.Right ? Charjs.Direction.Left : Charjs.Direction.Right;
            }
            this.updateEntity();
            this.executeJump();
            if (this._direction == Charjs.Direction.Right) {
                this.position.x += this.pixSize * this._speed;
            }
            else {
                this.position.x -= this.pixSize * this._speed;
            }
            this.drawAction();
        };
        KoopatroopaWorld.prototype.drawAction = function () {
            var direction = this._direction;
            if (this._currentStep < this._step) {
                this._currentStep++;
            }
            else {
                this._currentStep = 0;
                this._actionIndex = this._actionIndex ^ 1;
            }
            this.draw(this._actionIndex, null, direction, this._vertical, true);
        };
        KoopatroopaWorld.prototype.isStepped = function () {
            return false;
        };
        KoopatroopaWorld.prototype.onKilled = function () {
            this._isKilled = true;
            this.destroy();
        };
        KoopatroopaWorld.prototype.onStepped = function (attackDirection) {
            if (this._gameMaster) {
                this._isKilled = true;
                var troopa = this._gameMaster.CreateEnemyInstance(Charjs.TroopaWorld, this.position, this._direction);
                var koopa = this._gameMaster.CreateEnemyInstance(Charjs.KoopaWorld, { x: this.position.x + 20, y: this.position.y }, attackDirection);
                troopa.init(true).start();
                koopa.init(true).onPushOut().start();
                this.destroy();
            }
        };
        KoopatroopaWorld.prototype.onGrabed = function (player) {
        };
        KoopatroopaWorld.prototype.onKicked = function (kickDirection, kickPower) {
            return Charjs.HitStatus.none;
        };
        KoopatroopaWorld.prototype.onEnemyAttack = function (attackDirection, kickPower) {
            var _this = this;
            this.stop();
            this._isKilled = true;
            var yVector = 10 * this.pixSize;
            var direction = attackDirection == Charjs.Direction.Right ? 1 : -1;
            this.destroy();
            var troopa = new Charjs.TroopaWorld(this.targetDom, this.pixSize, this.position, this._direction);
            troopa.init(true);
            var killTimer = this.getTimer(function () {
                yVector -= _this._gravity * _this.pixSize;
                _this.position.y = _this.position.y + yVector;
                _this.position.x += kickPower * direction;
                if (_this.position.y < _this.size.height * 5 * -1) {
                    _this.removeTimer(killTimer);
                    troopa.destroy();
                    return;
                }
                if (_this._currentStep < KoopatroopaWorld.STEP) {
                    _this._currentStep++;
                }
                else {
                    _this._currentStep = 0;
                    _this._actionIndex = _this._actionIndex ^ 1;
                }
                troopa.draw(0, null, _this._direction, Charjs.Vertical.Down, true);
            }, this.frameInterval);
        };
        KoopatroopaWorld.prototype.registerActionCommand = function () {
        };
        return KoopatroopaWorld;
    }(Charjs.AbstractEnemy));
    KoopatroopaWorld.DEFAULT_SPEED = 1;
    KoopatroopaWorld.STEP = 2;
    Charjs.KoopatroopaWorld = KoopatroopaWorld;
})(Charjs || (Charjs = {}));
var Charjs;
(function (Charjs) {
    var MarioWorld = (function (_super) {
        __extends(MarioWorld, _super);
        function MarioWorld(targetDom, pixSize, position, direction, zIndex, frameInterval) {
            if (direction === void 0) { direction = Charjs.Direction.Right; }
            if (zIndex === void 0) { zIndex = 100; }
            if (frameInterval === void 0) { frameInterval = 45; }
            var _this = _super.call(this, targetDom, pixSize, position, direction, true, false, zIndex, frameInterval) || this;
            _this._runIndex = 0;
            _this._currentStep = MarioWorld.STEP;
            _this._yVector = 0;
            _this._xVector = 0;
            _this._jumpPower = 18;
            _this._speed = 0;
            _this._gameOverWaitCount = 0;
            _this._speedUpTimer = null;
            _this._speedDownTimer = null;
            _this._squatTimer = null;
            _this._gameOverTimer = null;
            _this._isJumping = false;
            _this._isSpecial = false;
            _this._isBraking = false;
            _this._isSquat = false;
            _this._isRight = false;
            _this._isLeft = false;
            _this._rightPushed = false;
            _this._leftPushed = false;
            _this._isSpeedUp = false;
            _this._attackDirection = Charjs.Direction.Right;
            _this._star_effect = null;
            _this._special_effect = null;
            _this._slip_effect = null;
            _this._specialAnimationIndex = 0;
            _this._specialAnimation = [{ index: 0, direction: Charjs.Direction.Right }, { index: 12, direction: Charjs.Direction.Right }, { index: 0, direction: Charjs.Direction.Left }, { index: 13, direction: Charjs.Direction.Right }];
            _this._grabedEnemy = null;
            _this._grabbing = false;
            _this._backgroundOpacity = 0;
            _this._canSpeedUpForMobile = true;
            _this._screenModeForMobile = 'PORTRAIT';
            _this._deviceDirection = 1;
            _this._gamepadTimer = null;
            _this.colors = ['', '#000000', '#ffffff', '#520000', '#8c5a18', '#21318c', '#ff4273', '#b52963', '#ffde73', '#dea539', '#ffd6c6', '#ff736b', '#84dece', '#42849c'];
            _this.cchars = [[[0, 16], [0, 16], [0, 7, 3, 5, 0, 4], [0, 5, 3, 2, 6, 3, 8, 1, 6, 1, 3, 1, 0, 3], [0, 4, 3, 1, 6, 2, 7, 2, 9, 1, 8, 1, 2, 1, 3, 1, 0, 3], [0, 3, 3, 1, 7, 1, 6, 1, 7, 2, 1, 6, 0, 2], [0, 2, 3, 1, 7, 3, 1, 9, 0, 1], [0, 2, 3, 1, 10, 1, 1, 3, 11, 1, 1, 1, 11, 1, 1, 1, 11, 1, 0, 4], [0, 1, 3, 1, 10, 1, 4, 1, 10, 1, 1, 1, 11, 1, 10, 1, 1, 1, 10, 1, 1, 1, 10, 1, 4, 2, 0, 2], [0, 1, 3, 1, 11, 1, 4, 1, 10, 1, 1, 2, 10, 7, 4, 1, 0, 1], [0, 1, 3, 1, 1, 1, 11, 1, 10, 1, 1, 1, 10, 2, 1, 1, 11, 5, 4, 1, 0, 1], [0, 2, 1, 2, 11, 2, 10, 1, 1, 7, 0, 2], [0, 3, 1, 1, 4, 2, 11, 3, 1, 4, 0, 3], [0, 4, 3, 1, 7, 1, 4, 4, 5, 1, 0, 5], [0, 3, 3, 1, 7, 2, 6, 1, 13, 2, 12, 2, 5, 1, 0, 4], [0, 3, 3, 1, 4, 3, 13, 1, 2, 2, 12, 1, 2, 1, 5, 1, 0, 3], [0, 3, 4, 1, 2, 3, 4, 1, 2, 2, 12, 1, 2, 1, 5, 1, 0, 3], [0, 3, 4, 1, 2, 2, 4, 1, 13, 3, 12, 2, 5, 1, 0, 3], [0, 3, 4, 1, 2, 2, 4, 1, 13, 2, 5, 1, 13, 1, 5, 1, 0, 4], [0, 4, 4, 4, 1, 1, 4, 1, 1, 1, 0, 5], [0, 4, 1, 1, 4, 3, 8, 1, 1, 1, 8, 1, 1, 1, 0, 4], [0, 4, 1, 8, 0, 4]], [[0, 16], [0, 7, 3, 5, 0, 4], [0, 5, 3, 2, 6, 3, 8, 1, 6, 1, 3, 1, 0, 3], [0, 4, 3, 1, 6, 2, 7, 2, 9, 1, 8, 1, 2, 1, 3, 1, 0, 3], [0, 3, 3, 1, 7, 1, 6, 1, 7, 2, 1, 6, 0, 2], [0, 2, 3, 1, 7, 3, 1, 9, 0, 1], [0, 2, 3, 1, 10, 1, 1, 3, 11, 1, 1, 1, 11, 1, 1, 1, 11, 1, 0, 4], [0, 1, 3, 1, 10, 1, 4, 1, 10, 1, 1, 1, 11, 1, 10, 1, 1, 1, 10, 1, 1, 1, 10, 1, 4, 2, 0, 2], [0, 1, 3, 1, 11, 1, 4, 1, 10, 1, 1, 2, 10, 7, 4, 1, 0, 1], [0, 1, 3, 1, 1, 1, 11, 1, 10, 1, 1, 1, 10, 2, 1, 1, 11, 5, 4, 1, 0, 1], [0, 2, 1, 2, 11, 2, 10, 1, 1, 7, 0, 2], [0, 3, 1, 1, 4, 2, 11, 3, 1, 4, 0, 3], [0, 3, 4, 1, 7, 3, 4, 3, 5, 1, 0, 5], [0, 3, 4, 4, 13, 2, 12, 2, 5, 1, 0, 4], [0, 2, 1, 1, 4, 1, 2, 3, 4, 1, 2, 2, 12, 1, 2, 1, 5, 1, 1, 2, 0, 1], [0, 1, 1, 1, 3, 1, 4, 1, 2, 2, 4, 2, 2, 2, 12, 1, 2, 1, 1, 1, 8, 1, 1, 2], [0, 1, 1, 1, 3, 1, 4, 1, 2, 2, 4, 1, 13, 3, 12, 1, 5, 1, 1, 1, 4, 1, 1, 2], [0, 1, 1, 1, 3, 1, 1, 1, 4, 2, 13, 4, 5, 1, 1, 1, 4, 1, 1, 2, 0, 1], [0, 1, 1, 1, 3, 1, 8, 1, 1, 1, 0, 1, 5, 4, 0, 1, 1, 1, 4, 1, 1, 2, 0, 1], [0, 2, 1, 2, 0, 8, 1, 2, 0, 2], [0, 16], [0, 16]], [[0, 12, 4, 2, 0, 2], [0, 11, 4, 1, 2, 2, 4, 1, 0, 1], [0, 10, 4, 1, 2, 4, 4, 1], [0, 7, 3, 5, 2, 3, 4, 1], [0, 5, 3, 2, 6, 3, 8, 1, 6, 1, 3, 1, 2, 1, 4, 1, 0, 1], [0, 4, 3, 1, 6, 2, 7, 2, 9, 1, 8, 1, 2, 1, 3, 1, 4, 2, 0, 1], [0, 3, 3, 1, 7, 1, 6, 1, 7, 2, 1, 6, 0, 2], [0, 2, 3, 1, 7, 3, 1, 9, 0, 1], [0, 2, 3, 1, 10, 1, 1, 3, 11, 1, 1, 1, 11, 1, 1, 1, 11, 1, 3, 1, 0, 3], [0, 1, 3, 1, 10, 1, 4, 1, 10, 1, 1, 1, 11, 1, 10, 1, 1, 1, 10, 1, 1, 1, 10, 1, 4, 2, 0, 2], [0, 1, 3, 1, 11, 1, 4, 1, 10, 1, 1, 2, 10, 7, 4, 1, 0, 1], [0, 1, 3, 1, 1, 1, 11, 1, 10, 1, 1, 1, 10, 2, 1, 1, 11, 5, 4, 1, 0, 1], [0, 2, 1, 2, 11, 2, 10, 1, 1, 7, 0, 2], [0, 1, 4, 3, 7, 1, 4, 1, 11, 3, 1, 4, 0, 3], [4, 2, 2, 2, 4, 1, 7, 1, 4, 4, 5, 1, 0, 5], [4, 1, 2, 4, 4, 1, 7, 1, 13, 2, 12, 2, 5, 1, 0, 4], [4, 1, 2, 4, 4, 1, 13, 2, 2, 2, 12, 1, 2, 1, 5, 1, 1, 2, 0, 1], [0, 1, 4, 1, 2, 2, 4, 1, 13, 3, 2, 2, 12, 1, 2, 1, 1, 1, 8, 1, 1, 2], [0, 1, 1, 1, 3, 1, 4, 1, 13, 6, 12, 1, 5, 1, 1, 1, 4, 1, 1, 2], [0, 1, 1, 1, 3, 1, 5, 3, 13, 4, 5, 1, 1, 1, 4, 1, 1, 2, 0, 1], [0, 1, 1, 1, 3, 1, 8, 1, 1, 1, 0, 1, 5, 4, 0, 1, 1, 1, 4, 1, 1, 2, 0, 1], [0, 2, 1, 2, 0, 8, 1, 2, 0, 2]], [[0, 16], [0, 7, 3, 5, 0, 4], [0, 5, 3, 2, 6, 3, 8, 1, 6, 1, 3, 1, 0, 3], [0, 4, 3, 1, 6, 2, 7, 2, 9, 1, 8, 1, 2, 1, 3, 1, 0, 3], [0, 3, 3, 1, 7, 1, 6, 1, 7, 2, 1, 6, 0, 2], [0, 2, 3, 1, 7, 3, 1, 9, 0, 1], [0, 2, 3, 1, 7, 1, 1, 5, 11, 1, 1, 2, 0, 4], [0, 1, 3, 1, 7, 2, 1, 2, 10, 6, 0, 4], [0, 1, 3, 1, 7, 1, 10, 1, 1, 2, 10, 2, 1, 1, 10, 1, 1, 1, 10, 1, 0, 4], [0, 1, 3, 1, 10, 1, 4, 1, 10, 1, 1, 1, 10, 2, 1, 1, 10, 1, 1, 1, 10, 1, 4, 2, 0, 2], [0, 1, 1, 1, 11, 1, 4, 1, 10, 1, 1, 2, 10, 7, 4, 1, 0, 1], [0, 2, 1, 1, 11, 2, 1, 1, 10, 2, 1, 1, 11, 5, 4, 1, 0, 1], [0, 1, 4, 1, 2, 2, 3, 1, 11, 2, 1, 7, 2, 1, 3, 1], [4, 1, 2, 4, 3, 1, 11, 3, 1, 4, 2, 2, 3, 1], [4, 1, 2, 4, 3, 1, 4, 4, 5, 1, 4, 1, 2, 1, 1, 2, 0, 1], [0, 1, 4, 1, 2, 2, 3, 1, 13, 4, 12, 2, 5, 1, 1, 1, 8, 1, 1, 2], [0, 1, 1, 1, 3, 2, 5, 1, 13, 3, 2, 2, 12, 1, 2, 1, 1, 1, 4, 1, 1, 2], [0, 1, 1, 1, 4, 2, 5, 1, 13, 3, 2, 2, 12, 1, 2, 1, 1, 1, 4, 1, 1, 2], [0, 1, 1, 1, 4, 1, 8, 1, 5, 2, 13, 4, 12, 1, 5, 1, 1, 1, 4, 1, 1, 2], [0, 2, 1, 2, 0, 1, 5, 2, 13, 3, 5, 1, 0, 2, 1, 2, 0, 1], [0, 6, 5, 4, 0, 6], [0, 16]], [[0, 16], [0, 16], [0, 7, 3, 5, 0, 4], [0, 5, 3, 2, 6, 3, 8, 1, 6, 1, 3, 1, 0, 3], [0, 4, 3, 1, 6, 2, 7, 2, 9, 1, 8, 1, 2, 1, 3, 1, 0, 3], [0, 3, 3, 1, 7, 1, 6, 1, 7, 2, 1, 6, 0, 2], [0, 2, 3, 1, 7, 3, 1, 9, 0, 1], [0, 2, 3, 1, 10, 1, 1, 3, 11, 1, 1, 1, 11, 1, 1, 1, 11, 1, 0, 4], [0, 1, 3, 1, 10, 1, 4, 1, 10, 1, 1, 1, 11, 1, 10, 1, 1, 1, 10, 1, 1, 1, 10, 1, 4, 2, 0, 2], [0, 1, 3, 1, 11, 1, 4, 1, 10, 1, 1, 2, 10, 7, 4, 1, 0, 1], [0, 1, 3, 1, 1, 1, 11, 1, 10, 1, 1, 1, 10, 2, 1, 1, 11, 5, 4, 1, 0, 1], [0, 2, 1, 2, 11, 2, 10, 1, 1, 7, 0, 2], [4, 6, 11, 3, 1, 4, 0, 3], [4, 1, 2, 3, 4, 1, 7, 1, 4, 4, 5, 1, 0, 5], [0, 1, 4, 1, 2, 2, 4, 1, 7, 2, 13, 2, 12, 2, 5, 1, 0, 4], [0, 2, 4, 2, 7, 2, 13, 2, 2, 2, 12, 1, 2, 1, 5, 1, 0, 3], [0, 3, 5, 1, 13, 4, 2, 2, 12, 1, 2, 1, 5, 1, 0, 3], [0, 3, 5, 1, 13, 6, 12, 2, 5, 1, 0, 3], [0, 3, 5, 2, 13, 4, 5, 1, 13, 1, 5, 1, 0, 4], [0, 4, 4, 4, 1, 1, 4, 1, 1, 1, 0, 5], [0, 4, 1, 1, 4, 3, 8, 1, 1, 1, 8, 1, 1, 1, 0, 4], [0, 4, 1, 8, 0, 4]], [[0, 16], [0, 7, 3, 5, 0, 4], [0, 5, 3, 2, 6, 3, 8, 1, 6, 1, 3, 1, 0, 3], [0, 4, 3, 1, 6, 2, 7, 2, 9, 1, 8, 1, 2, 1, 3, 1, 0, 3], [0, 3, 3, 1, 7, 1, 6, 1, 7, 2, 1, 6, 0, 2], [0, 2, 3, 1, 7, 3, 1, 9, 0, 1], [0, 2, 3, 1, 10, 1, 1, 3, 11, 1, 1, 1, 11, 1, 1, 1, 11, 1, 0, 4], [0, 1, 3, 1, 10, 1, 4, 1, 10, 1, 1, 1, 11, 1, 10, 1, 1, 1, 10, 1, 1, 1, 10, 1, 4, 2, 0, 2], [0, 1, 3, 1, 11, 1, 4, 1, 10, 1, 1, 2, 10, 7, 4, 1, 0, 1], [0, 1, 3, 1, 1, 1, 11, 1, 10, 1, 1, 1, 10, 2, 1, 1, 11, 5, 4, 1, 0, 1], [0, 2, 1, 2, 11, 2, 10, 1, 1, 7, 0, 2], [4, 6, 11, 3, 1, 4, 0, 3], [4, 1, 2, 3, 4, 1, 7, 1, 4, 4, 5, 1, 0, 5], [0, 1, 4, 1, 2, 2, 4, 1, 7, 1, 13, 3, 12, 2, 5, 1, 0, 4], [0, 2, 4, 2, 7, 2, 13, 2, 2, 2, 12, 1, 2, 1, 5, 1, 1, 2, 0, 1], [0, 1, 1, 1, 3, 2, 13, 4, 2, 2, 12, 1, 2, 1, 1, 1, 8, 1, 1, 2], [0, 1, 1, 1, 3, 2, 13, 6, 12, 1, 5, 1, 1, 1, 4, 1, 1, 2], [0, 1, 1, 1, 3, 1, 1, 1, 5, 2, 13, 4, 5, 1, 1, 1, 4, 1, 1, 2, 0, 1], [0, 1, 1, 1, 3, 1, 8, 1, 1, 1, 0, 1, 5, 4, 0, 1, 1, 1, 4, 1, 1, 2, 0, 1], [0, 2, 1, 2, 0, 8, 1, 2, 0, 2], [0, 16], [0, 16]], [[0, 16], [0, 5, 3, 5, 0, 6], [0, 4, 3, 1, 6, 1, 8, 1, 6, 3, 3, 2, 0, 4], [0, 4, 3, 1, 2, 1, 8, 2, 7, 4, 3, 1, 0, 3], [0, 3, 1, 6, 7, 4, 3, 1, 0, 2], [0, 2, 1, 9, 7, 3, 3, 1, 0, 1], [0, 4, 11, 5, 1, 4, 7, 1, 3, 1, 0, 1], [0, 4, 10, 1, 1, 1, 10, 1, 1, 1, 10, 1, 11, 1, 1, 2, 10, 1, 7, 2, 3, 1], [0, 2, 4, 2, 10, 1, 1, 1, 10, 1, 1, 1, 10, 2, 1, 1, 10, 1, 4, 1, 10, 1, 7, 1, 3, 1], [0, 1, 4, 1, 10, 7, 1, 2, 10, 1, 4, 1, 11, 1, 7, 1, 3, 1], [0, 1, 4, 1, 11, 5, 1, 1, 10, 2, 1, 1, 10, 1, 11, 1, 1, 1, 3, 1, 0, 1], [0, 2, 1, 6, 4, 3, 11, 1, 1, 2, 7, 1, 3, 1], [0, 3, 1, 4, 4, 1, 2, 2, 4, 2, 1, 1, 2, 1, 7, 1, 3, 1], [0, 4, 3, 1, 7, 2, 2, 4, 4, 1, 2, 3, 4, 1], [0, 4, 5, 1, 3, 2, 2, 4, 4, 1, 2, 3, 4, 1], [0, 4, 5, 1, 13, 1, 3, 3, 2, 1, 4, 3, 2, 1, 4, 1, 0, 1], [0, 4, 5, 1, 13, 1, 4, 1, 8, 1, 4, 2, 13, 1, 2, 2, 4, 1, 0, 2], [0, 5, 1, 1, 4, 2, 1, 2, 13, 3, 5, 1, 0, 2], [0, 5, 1, 1, 4, 1, 1, 3, 5, 1, 13, 3, 5, 1, 0, 1], [0, 6, 1, 3, 0, 2, 1, 1, 4, 2, 1, 1, 0, 1], [0, 11, 1, 1, 4, 2, 8, 1, 1, 1], [0, 11, 1, 5]], [[0, 16], [0, 16], [0, 7, 3, 5, 0, 4], [0, 5, 3, 2, 6, 3, 8, 1, 6, 1, 3, 1, 0, 3], [0, 4, 3, 1, 6, 2, 7, 2, 9, 1, 8, 1, 2, 1, 3, 1, 0, 3], [0, 3, 3, 1, 7, 1, 6, 1, 7, 2, 1, 6, 0, 2], [0, 2, 3, 1, 7, 3, 1, 9, 0, 1], [0, 2, 3, 1, 10, 1, 1, 3, 11, 1, 1, 1, 11, 1, 1, 1, 11, 1, 0, 4], [0, 1, 3, 1, 10, 1, 4, 1, 10, 1, 1, 1, 11, 1, 10, 1, 1, 1, 10, 1, 1, 1, 10, 1, 4, 2, 0, 2], [0, 1, 3, 1, 11, 1, 4, 1, 10, 1, 1, 2, 10, 7, 4, 1, 0, 1], [0, 1, 3, 1, 1, 1, 11, 1, 10, 1, 1, 1, 10, 2, 1, 1, 11, 5, 4, 1, 0, 1], [0, 2, 1, 2, 11, 2, 10, 1, 1, 7, 0, 2], [0, 3, 1, 1, 4, 2, 11, 3, 1, 4, 0, 3], [0, 1, 1, 2, 4, 9, 0, 4], [1, 1, 8, 1, 4, 1, 2, 3, 4, 1, 7, 1, 4, 1, 12, 1, 5, 1, 0, 5], [0, 1, 1, 1, 4, 2, 2, 2, 4, 1, 7, 1, 4, 1, 12, 2, 5, 1, 0, 4], [0, 3, 5, 1, 4, 3, 2, 2, 12, 1, 2, 1, 5, 1, 0, 4], [0, 3, 1, 2, 13, 3, 2, 1, 12, 1, 2, 1, 5, 1, 0, 4], [0, 2, 1, 1, 4, 2, 5, 1, 13, 4, 5, 1, 0, 5], [0, 2, 1, 1, 4, 3, 5, 1, 13, 1, 5, 2, 0, 6], [0, 2, 1, 1, 8, 1, 1, 2, 5, 3, 0, 7], [0, 3, 1, 1, 0, 12]], [[0, 16], [0, 16], [0, 16], [0, 16], [0, 16], [0, 16], [0, 16], [0, 16], [0, 5, 3, 4, 0, 7], [0, 3, 3, 2, 6, 4, 3, 2, 0, 5], [0, 2, 3, 1, 6, 5, 7, 1, 6, 2, 3, 1, 0, 4], [0, 1, 3, 1, 7, 2, 3, 2, 6, 1, 7, 1, 6, 2, 8, 1, 6, 1, 3, 1, 0, 3], [0, 1, 3, 1, 7, 1, 3, 1, 2, 2, 3, 1, 7, 2, 9, 1, 8, 1, 2, 1, 3, 1, 0, 3], [0, 1, 3, 2, 2, 4, 3, 1, 7, 1, 6, 1, 1, 4, 0, 2], [0, 1, 5, 1, 3, 1, 2, 4, 3, 1, 1, 7, 0, 1], [5, 1, 13, 1, 1, 1, 3, 4, 7, 1, 10, 6, 4, 1, 0, 1], [5, 1, 13, 1, 3, 1, 7, 3, 3, 1, 12, 1, 1, 1, 11, 5, 4, 1, 0, 1], [5, 1, 13, 1, 3, 1, 7, 2, 3, 1, 13, 2, 5, 1, 1, 5, 0, 2], [5, 1, 13, 2, 3, 2, 13, 1, 5, 2, 12, 1, 5, 1, 1, 3, 0, 3], [5, 2, 13, 2, 5, 2, 4, 1, 1, 1, 4, 1, 1, 1, 0, 6], [0, 1, 5, 3, 4, 3, 8, 1, 1, 1, 8, 1, 1, 1, 0, 5], [0, 4, 1, 7, 0, 5]], [[0, 6, 3, 4, 0, 6], [0, 4, 3, 2, 6, 1, 8, 2, 6, 1, 3, 2, 0, 4], [0, 3, 3, 1, 6, 2, 2, 1, 8, 2, 2, 1, 6, 2, 3, 1, 0, 3], [0, 2, 3, 1, 6, 3, 1, 4, 6, 3, 3, 1, 0, 2], [0, 2, 3, 1, 6, 1, 1, 8, 6, 1, 3, 1, 0, 2], [0, 2, 3, 1, 1, 10, 3, 1, 0, 2], [0, 3, 3, 1, 1, 1, 6, 1, 1, 1, 6, 2, 1, 1, 6, 1, 1, 1, 3, 1, 0, 3], [0, 2, 1, 2, 6, 8, 1, 2, 0, 2], [0, 3, 1, 1, 6, 8, 1, 1, 0, 3], [0, 2, 1, 2, 6, 1, 11, 1, 1, 1, 11, 2, 1, 1, 11, 1, 6, 1, 1, 2, 0, 2], [0, 1, 4, 1, 10, 1, 1, 1, 11, 2, 2, 4, 11, 2, 1, 1, 10, 1, 4, 1, 0, 1], [0, 1, 4, 1, 10, 1, 1, 2, 10, 6, 1, 2, 10, 1, 4, 1, 0, 1], [0, 1, 4, 1, 11, 1, 1, 1, 10, 1, 1, 1, 11, 4, 1, 1, 10, 1, 1, 1, 11, 1, 4, 1, 0, 1], [4, 1, 2, 1, 4, 1, 10, 1, 1, 8, 10, 1, 4, 1, 0, 2], [4, 1, 2, 2, 4, 1, 10, 3, 3, 2, 10, 3, 4, 3, 0, 1], [0, 1, 4, 1, 6, 2, 4, 2, 10, 1, 7, 2, 10, 1, 4, 2, 6, 1, 2, 2, 4, 1], [0, 1, 4, 1, 3, 1, 6, 1, 5, 1, 4, 1, 10, 1, 6, 2, 10, 1, 4, 1, 1, 3, 2, 1, 4, 1], [0, 3, 5, 1, 12, 2, 4, 1, 10, 2, 4, 1, 2, 1, 1, 4, 0, 1], [0, 3, 5, 1, 12, 1, 2, 2, 4, 2, 2, 2, 1, 4, 0, 1], [0, 2, 1, 3, 2, 2, 13, 3, 5, 1, 1, 4, 0, 1], [0, 1, 1, 1, 8, 1, 4, 2, 1, 1, 5, 4, 0, 1, 1, 4, 0, 1], [0, 1, 1, 4, 4, 1, 1, 1, 0, 5, 1, 2, 0, 2], [0, 4, 1, 3, 0, 9]], [[0, 16], [0, 7, 3, 4, 0, 5], [0, 5, 3, 2, 6, 1, 8, 2, 6, 1, 3, 2, 0, 3], [1, 2, 0, 1, 1, 2, 6, 2, 2, 1, 8, 2, 2, 1, 6, 2, 3, 1, 0, 2], [1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 6, 2, 1, 4, 6, 3, 3, 1, 0, 1], [0, 1, 1, 1, 2, 2, 1, 9, 6, 1, 3, 1, 0, 1], [1, 1, 2, 1, 1, 3, 11, 2, 1, 1, 11, 2, 1, 1, 11, 2, 1, 1, 3, 1, 0, 1], [1, 3, 2, 1, 1, 1, 10, 2, 1, 1, 10, 2, 1, 1, 10, 2, 1, 1, 4, 1, 0, 1], [1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 10, 6, 1, 2, 10, 1, 4, 1], [0, 1, 1, 3, 3, 1, 10, 1, 1, 1, 11, 4, 1, 1, 10, 1, 4, 1, 11, 1, 4, 1], [0, 1, 3, 1, 7, 1, 6, 1, 3, 1, 11, 1, 1, 6, 11, 1, 4, 2, 0, 1], [0, 2, 3, 1, 7, 1, 6, 1, 4, 1, 11, 1, 1, 4, 11, 1, 4, 1, 7, 2, 4, 1], [0, 2, 3, 1, 7, 1, 6, 1, 3, 1, 4, 6, 7, 1, 4, 3], [0, 3, 3, 1, 6, 1, 5, 1, 12, 5, 7, 2, 2, 2, 4, 1], [0, 4, 5, 1, 13, 1, 12, 1, 2, 2, 12, 2, 2, 1, 4, 1, 2, 2, 4, 1], [0, 4, 5, 1, 13, 2, 2, 2, 12, 2, 2, 1, 5, 1, 4, 2, 0, 1], [0, 3, 5, 1, 13, 5, 12, 4, 5, 1, 0, 2], [0, 3, 5, 1, 13, 7, 12, 2, 5, 1, 0, 2], [0, 2, 5, 1, 13, 10, 5, 1, 0, 2], [0, 1, 1, 1, 4, 3, 5, 6, 4, 3, 1, 1, 0, 1], [1, 1, 4, 1, 8, 1, 4, 1, 1, 1, 0, 6, 1, 1, 4, 1, 8, 1, 4, 1, 1, 1], [1, 4, 0, 8, 1, 4]], [[0, 16], [0, 16], [0, 7, 3, 5, 0, 4], [0, 5, 3, 2, 6, 3, 8, 1, 6, 1, 3, 1, 0, 3], [0, 4, 3, 1, 6, 2, 7, 2, 9, 1, 8, 1, 2, 1, 3, 1, 0, 3], [0, 3, 3, 1, 7, 1, 6, 1, 7, 2, 1, 6, 0, 2], [0, 2, 3, 1, 7, 3, 1, 9, 0, 1], [0, 2, 3, 1, 10, 1, 1, 3, 11, 1, 1, 1, 11, 1, 1, 1, 11, 1, 0, 4], [0, 1, 3, 1, 10, 1, 4, 1, 10, 1, 1, 1, 11, 1, 10, 1, 1, 1, 10, 1, 1, 1, 10, 1, 4, 2, 0, 2], [0, 1, 3, 1, 11, 1, 4, 1, 10, 1, 1, 2, 10, 7, 4, 1, 0, 1], [0, 1, 3, 1, 1, 1, 11, 1, 10, 1, 1, 1, 10, 2, 1, 1, 11, 5, 4, 1, 0, 1], [0, 2, 1, 2, 11, 2, 10, 1, 1, 7, 0, 2], [0, 3, 1, 1, 4, 2, 11, 3, 1, 4, 0, 3], [0, 2, 4, 1, 6, 3, 4, 4, 5, 1, 0, 5], [0, 1, 4, 2, 6, 2, 7, 1, 13, 2, 12, 3, 5, 1, 0, 1, 1, 2, 0, 1], [4, 1, 2, 2, 4, 1, 7, 1, 13, 2, 2, 2, 12, 1, 2, 2, 5, 1, 8, 1, 1, 2], [4, 1, 2, 3, 4, 1, 13, 2, 2, 2, 12, 1, 2, 2, 1, 1, 4, 1, 1, 2], [4, 1, 2, 2, 4, 1, 5, 1, 13, 4, 12, 3, 1, 1, 4, 1, 1, 2], [0, 1, 4, 2, 0, 2, 5, 1, 13, 3, 5, 3, 1, 1, 4, 1, 1, 2], [0, 4, 1, 1, 4, 3, 1, 1, 0, 4, 1, 2, 0, 1], [0, 4, 1, 1, 4, 3, 8, 1, 1, 1, 0, 6], [0, 4, 1, 6, 0, 6]], [[0, 16], [0, 16], [0, 6, 3, 4, 0, 6], [0, 4, 3, 2, 6, 1, 8, 2, 6, 1, 3, 2, 0, 4], [0, 3, 3, 1, 6, 2, 8, 3, 2, 1, 6, 2, 3, 1, 0, 3], [0, 2, 3, 1, 7, 3, 1, 4, 6, 3, 3, 1, 0, 2], [0, 2, 3, 1, 7, 1, 1, 8, 6, 1, 3, 1, 0, 2], [0, 2, 4, 1, 1, 1, 11, 2, 1, 1, 11, 2, 1, 1, 11, 2, 1, 1, 4, 1, 0, 2], [0, 1, 4, 1, 10, 1, 1, 1, 10, 2, 1, 1, 10, 2, 1, 1, 10, 2, 1, 1, 10, 1, 4, 1, 0, 1], [0, 1, 4, 1, 11, 1, 1, 2, 10, 6, 1, 2, 11, 1, 4, 1, 0, 1], [0, 2, 4, 1, 1, 1, 10, 1, 1, 1, 11, 4, 1, 1, 10, 1, 1, 1, 4, 1, 0, 2], [0, 3, 4, 1, 11, 1, 1, 6, 11, 1, 4, 1, 0, 3], [0, 4, 4, 1, 11, 1, 1, 4, 11, 1, 4, 1, 0, 4], [0, 3, 3, 1, 7, 1, 4, 6, 6, 1, 3, 1, 0, 3], [0, 2, 3, 1, 7, 2, 13, 1, 12, 5, 7, 1, 6, 1, 3, 1, 0, 2], [0, 2, 4, 1, 7, 1, 13, 1, 2, 2, 12, 2, 2, 2, 12, 1, 7, 1, 4, 1, 0, 2], [0, 1, 4, 1, 2, 1, 4, 1, 13, 1, 2, 2, 12, 2, 2, 2, 12, 1, 4, 1, 2, 1, 4, 1, 0, 1], [0, 1, 4, 1, 2, 1, 4, 1, 13, 4, 12, 4, 4, 1, 2, 1, 4, 1, 0, 1], [0, 2, 4, 2, 5, 1, 13, 2, 5, 2, 13, 2, 5, 1, 4, 2, 0, 2], [0, 4, 1, 1, 4, 6, 1, 1, 0, 4], [0, 3, 1, 1, 4, 1, 8, 1, 4, 1, 1, 2, 4, 1, 8, 1, 4, 1, 1, 1, 0, 3], [0, 3, 1, 10, 0, 3]], [[0, 16], [0, 16], [0, 6, 3, 4, 0, 6], [0, 4, 3, 2, 6, 4, 3, 2, 0, 4], [0, 3, 3, 1, 6, 8, 3, 1, 0, 3], [0, 2, 3, 1, 6, 10, 3, 1, 0, 2], [0, 2, 3, 1, 7, 1, 6, 9, 3, 1, 0, 2], [0, 2, 4, 1, 7, 1, 6, 8, 7, 1, 4, 1, 0, 2], [0, 2, 4, 1, 3, 1, 7, 2, 6, 4, 7, 2, 3, 1, 4, 1, 0, 2], [0, 1, 4, 1, 10, 1, 1, 1, 3, 2, 7, 4, 3, 2, 1, 1, 10, 1, 4, 1, 0, 1], [0, 1, 4, 1, 11, 1, 1, 3, 3, 4, 1, 3, 11, 1, 4, 1, 0, 1], [0, 2, 4, 2, 1, 8, 4, 2, 0, 2], [0, 4, 11, 1, 1, 6, 11, 1, 0, 4], [0, 3, 3, 2, 12, 2, 1, 2, 12, 2, 3, 2, 0, 3], [0, 2, 3, 1, 7, 1, 5, 1, 12, 2, 8, 2, 12, 2, 5, 1, 7, 1, 3, 1, 0, 2], [0, 2, 3, 1, 5, 1, 12, 8, 5, 1, 3, 1, 0, 2], [0, 2, 3, 1, 5, 3, 12, 4, 5, 3, 3, 1, 0, 2], [0, 3, 5, 1, 12, 2, 5, 1, 12, 2, 5, 1, 13, 2, 5, 1, 0, 3], [0, 4, 5, 1, 13, 1, 5, 4, 13, 1, 5, 1, 0, 4], [0, 4, 1, 1, 4, 6, 1, 1, 0, 4], [0, 3, 1, 1, 4, 3, 1, 2, 4, 3, 1, 1, 0, 3], [0, 3, 1, 10, 0, 3]], [[0, 16], [0, 16], [0, 16], [0, 16], [0, 16], [0, 16], [0, 7, 3, 5, 0, 4], [0, 5, 3, 2, 6, 3, 8, 1, 6, 1, 3, 1, 0, 3], [0, 4, 3, 1, 6, 2, 7, 2, 8, 2, 2, 1, 3, 1, 0, 3], [0, 3, 3, 1, 6, 2, 7, 2, 1, 6, 0, 2], [0, 2, 3, 1, 7, 3, 1, 9, 0, 1], [0, 2, 3, 1, 10, 1, 1, 3, 11, 1, 1, 1, 11, 1, 1, 1, 11, 1, 0, 4], [0, 1, 3, 1, 10, 1, 4, 1, 10, 1, 1, 1, 11, 1, 10, 1, 1, 1, 10, 1, 1, 1, 10, 1, 0, 4], [0, 1, 3, 1, 11, 1, 4, 1, 10, 1, 1, 2, 10, 7, 4, 1, 0, 1], [0, 1, 3, 1, 1, 1, 11, 2, 1, 1, 10, 2, 1, 1, 11, 5, 4, 1, 0, 1], [5, 1, 13, 4, 11, 2, 1, 7, 0, 2], [5, 1, 13, 5, 3, 1, 6, 3, 4, 4, 0, 2], [5, 1, 13, 3, 5, 2, 3, 1, 7, 2, 6, 2, 3, 1, 2, 1, 4, 3], [5, 1, 13, 6, 3, 2, 7, 2, 3, 1, 2, 3, 4, 1], [0, 1, 5, 1, 13, 2, 1, 1, 4, 3, 1, 1, 3, 3, 2, 3, 4, 1], [0, 2, 5, 2, 1, 1, 4, 3, 8, 1, 1, 1, 8, 1, 1, 1, 4, 3, 0, 1], [0, 4, 1, 8, 0, 4]], [[0, 16], [0, 16], [0, 7, 3, 5, 0, 4], [0, 5, 3, 2, 6, 3, 8, 1, 6, 1, 3, 1, 0, 3], [0, 4, 3, 1, 6, 2, 7, 2, 9, 1, 8, 1, 2, 1, 3, 1, 0, 3], [0, 3, 3, 1, 7, 1, 6, 1, 7, 2, 1, 6, 0, 2], [0, 2, 3, 1, 7, 3, 1, 9, 0, 1], [0, 2, 3, 1, 10, 1, 1, 3, 11, 1, 1, 1, 11, 1, 1, 1, 11, 1, 0, 4], [0, 1, 3, 1, 10, 1, 4, 1, 10, 1, 1, 1, 11, 1, 10, 1, 1, 1, 10, 1, 1, 1, 10, 1, 4, 2, 0, 2], [0, 1, 3, 1, 11, 1, 4, 1, 10, 1, 1, 2, 10, 7, 4, 1, 0, 1], [0, 1, 3, 1, 1, 1, 11, 1, 10, 1, 1, 1, 10, 2, 1, 1, 11, 5, 4, 1, 0, 1], [0, 2, 1, 2, 11, 2, 10, 1, 1, 7, 0, 2], [0, 3, 1, 1, 4, 2, 11, 3, 1, 2, 4, 3, 0, 2], [0, 4, 5, 1, 13, 1, 4, 5, 3, 1, 2, 1, 4, 3], [0, 3, 5, 1, 13, 2, 3, 1, 6, 4, 3, 1, 2, 3, 4, 1], [0, 3, 5, 1, 13, 2, 3, 1, 7, 4, 3, 1, 2, 3, 4, 1], [0, 3, 5, 1, 13, 3, 3, 5, 4, 3, 0, 1], [0, 3, 5, 1, 13, 6, 12, 2, 5, 1, 0, 3], [0, 3, 5, 1, 13, 5, 5, 1, 13, 1, 5, 1, 0, 4], [0, 4, 5, 1, 4, 3, 1, 1, 4, 1, 1, 1, 0, 5], [0, 4, 1, 1, 4, 3, 8, 1, 1, 1, 8, 1, 1, 1, 0, 4], [0, 4, 1, 8, 0, 4]], [[0, 16], [0, 7, 3, 5, 0, 4], [0, 5, 3, 2, 6, 3, 8, 1, 6, 1, 3, 1, 0, 3], [0, 4, 3, 1, 6, 2, 7, 2, 9, 1, 8, 1, 2, 1, 3, 1, 0, 3], [0, 3, 3, 1, 7, 1, 6, 1, 7, 2, 1, 6, 0, 2], [0, 2, 3, 1, 7, 3, 1, 9, 0, 1], [0, 2, 3, 1, 10, 1, 1, 3, 11, 1, 1, 1, 11, 1, 1, 1, 11, 1, 0, 4], [0, 1, 3, 1, 10, 1, 4, 1, 10, 1, 1, 1, 11, 1, 10, 1, 1, 1, 10, 1, 1, 1, 10, 1, 4, 2, 0, 2], [0, 1, 3, 1, 11, 1, 4, 1, 10, 1, 1, 2, 10, 7, 4, 1, 0, 1], [0, 1, 3, 1, 1, 1, 11, 1, 10, 1, 1, 1, 10, 2, 1, 1, 11, 5, 4, 1, 0, 1], [0, 2, 1, 2, 11, 2, 10, 1, 1, 7, 0, 2], [0, 3, 1, 1, 4, 1, 11, 4, 1, 2, 4, 3, 0, 2], [0, 4, 5, 1, 4, 6, 3, 1, 2, 1, 4, 3], [0, 3, 5, 2, 13, 1, 3, 1, 6, 4, 3, 1, 2, 3, 4, 1], [0, 2, 1, 1, 5, 1, 13, 2, 3, 1, 7, 4, 3, 1, 2, 3, 4, 1], [0, 1, 1, 1, 4, 1, 5, 1, 13, 3, 3, 5, 4, 3, 1, 1], [0, 1, 1, 1, 4, 1, 5, 1, 13, 6, 12, 1, 5, 1, 1, 1, 4, 1, 1, 2], [0, 1, 1, 1, 4, 1, 1, 1, 5, 2, 13, 4, 5, 1, 1, 1, 4, 1, 1, 2, 0, 1], [0, 1, 1, 1, 4, 1, 8, 1, 1, 1, 0, 1, 5, 4, 0, 1, 1, 1, 4, 1, 1, 2, 0, 1], [0, 2, 1, 2, 0, 8, 1, 2, 0, 2], [0, 16], [0, 16]]];
            _this.chars = null;
            _this._star_effect = new Charjs.StarEffect(targetDom, pixSize).init();
            _this._special_effect = new Charjs.SpecialEffect(targetDom, pixSize).init();
            _this._slip_effect = new Charjs.SlipEffect(targetDom, _this.pixSize).init();
            return _this;
        }
        MarioWorld.prototype.onAction = function () {
            var _this = this;
            this.updateEntity();
            switch (this.doHitTest()) {
                case Charjs.HitStatus.dammage:
                    this.gameOver();
                    break;
                case Charjs.HitStatus.attack:
                    this.draw(11, null, this._attackDirection, Charjs.Vertical.Up, true);
                    this.stop();
                    setTimeout(function () {
                        _this.start();
                    }, this.frameInterval);
                    break;
                case Charjs.HitStatus.grab:
                    this.moveGrabedEnemy();
                    this.draw(14, null, this._direction, Charjs.Vertical.Up, true);
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
                    this.draw(action.index, null, action.direction, Charjs.Vertical.Up, true);
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
                enemy.onEnemyAttack(grabedEnemyCenter <= enemyCenter ? Charjs.Direction.Right : Charjs.Direction.Left, this._speed * 3);
                this._grabedEnemy.onEnemyAttack(grabedEnemyCenter <= enemyCenter ? Charjs.Direction.Left : Charjs.Direction.Right, this._speed * 3);
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
                                if (this._isSpecial) {
                                    this._special_effect.drawEffect(enemys[name_2].getPosition());
                                    enemys[name_2].onKilled();
                                    this._yVector = 2 * this.pixSize;
                                    return Charjs.HitStatus.none;
                                }
                                else {
                                    var playerCenter = this.position.x + this.size.width / 2;
                                    var enemyCenter = ePos.x + eSize.width / 2;
                                    this._attackDirection = playerCenter <= enemyCenter ? Charjs.Direction.Right : Charjs.Direction.Left;
                                    return enemys[name_2].onKicked(this._attackDirection, this._speed * 3);
                                }
                            }
                            else {
                                this.grabEnemy(enemys[name_2]);
                                return Charjs.HitStatus.grab;
                            }
                        }
                        if (this._isJumping && this._yVector < 0) {
                            if (this._isSpecial) {
                                this._special_effect.drawEffect(enemys[name_2].getPosition());
                                enemys[name_2].onKilled();
                                this._yVector = 2 * this.pixSize;
                            }
                            else {
                                var playerCenter = this.position.x + this.size.width / 2;
                                var enemyCenter = ePos.x + eSize.width / 2;
                                this._attackDirection = playerCenter <= enemyCenter ? Charjs.Direction.Right : Charjs.Direction.Left;
                                enemys[name_2].onStepped(this._attackDirection);
                                var effectPos = { x: (this.position.x + ePos.x) / 2, y: (this.position.y + ePos.y) / 2 };
                                this._star_effect.drawEffect(effectPos);
                                this._yVector = 12 * this.pixSize;
                            }
                            continue;
                        }
                        return Charjs.HitStatus.dammage;
                    }
                }
            }
            return Charjs.HitStatus.none;
        };
        MarioWorld.prototype.executeJump = function () {
            var ground = this.entity.ground || 0;
            if (this.position.y > ground)
                this._isJumping = true;
            if (this._isJumping) {
                this._yVector -= this._gravity * this.pixSize;
                if (this.entity.ceiling != null) {
                    this.position.y = Math.min(this.position.y + this._yVector, this.entity.ceiling - this.size.height + this.size.heightOffset);
                    if (this.position.y == this.entity.ceiling - this.size.height + this.size.heightOffset && this._yVector > 0) {
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
                this._yVector = 0;
                return null;
            }
        };
        MarioWorld.prototype.moveGrabedEnemy = function () {
            if (this._grabedEnemy) {
                var grabXOffset = this._direction == Charjs.Direction.Right ? this.size.width * 0.7 : this.size.width * -1 * 0.7;
                var grabYOffset = this.pixSize;
                this._grabedEnemy.zIndex = this.zIndex - 1;
                this._grabedEnemy.setPosition({ x: this.position.x + grabXOffset, y: this.position.y + grabYOffset });
                this._grabedEnemy.drawAction();
            }
        };
        MarioWorld.prototype.executeRun = function () {
            this._isBraking = false;
            var direction = this._direction;
            if (((this._isLeft && direction == Charjs.Direction.Left) || (this._isRight && direction == Charjs.Direction.Right)) && !this._isSquat) {
                this._speed = MarioWorld.DEFAULT_SPEED * (this._isLeft ? -1 : 1);
            }
            else {
                this._speed = 0;
            }
            if (this._isLeft) {
                this._direction = Charjs.Direction.Left;
            }
            if (this._isRight) {
                this._direction = Charjs.Direction.Right;
            }
            if (this._isSpeedUp && (this._isLeft || this._isRight) && !this._isSquat) {
                if (this._isLeft && this._xVector > -10) {
                    this._xVector--;
                }
                if (this._isRight && this._xVector < 10) {
                    this._xVector++;
                }
            }
            else if (this._xVector != 0) {
                if (this._xVector > 0) {
                    this._xVector--;
                }
                else {
                    this._xVector++;
                }
            }
            this._speed += this._xVector;
            if ((this._isLeft && this._xVector > 0) || (this._isRight && this._xVector < 0))
                this._isBraking = true;
            if (this._speed > 0) {
                var right = this.entity.right || this.targetDom.clientWidth;
                this.position.x = Math.min(this.position.x + this.pixSize * this._speed, right - this.size.width);
            }
            else if (this._speed < 0) {
                var left = this.entity.left || 0;
                this.position.x = Math.max(this.position.x + this.pixSize * this._speed, left);
            }
            var runIndex = this._runIndex;
            if (this._currentStep < MarioWorld.STEP) {
                this._currentStep++;
            }
            else {
                this._currentStep = 0;
                this._runIndex = this._runIndex ^ 1;
            }
            if (this._speed == 0)
                this._runIndex = 0;
            if (this._grabedEnemy) {
                if (this._speed == 0 && (this._isRight || this._isLeft) && this._xVector == 0) {
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
                if (this._speed > 8 || this._speed < -8) {
                    runIndex = this._runIndex == 0 ? 4 : 5;
                }
                else {
                    runIndex = this._runIndex;
                }
                if (!this._isJumping && this._isBraking) {
                    runIndex = 6;
                    direction = direction == Charjs.Direction.Left ? Charjs.Direction.Right : Charjs.Direction.Left;
                    this._slip_effect.drawEffect({ x: this.position.x + (direction == Charjs.Direction.Left ? this.size.width : 0), y: this.position.y });
                }
            }
            if (this._isSquat) {
                if (this._grabedEnemy)
                    runIndex = 14;
                else
                    runIndex = 8;
            }
            return { index: runIndex, direction: direction };
            ;
        };
        MarioWorld.prototype.grabEnemy = function (enemy) {
            enemy.onGrabed(this);
            this._grabedEnemy = enemy;
        };
        MarioWorld.prototype.releaseEnemy = function () {
            this._grabedEnemy = null;
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
                this.draw(14, null, this._direction, Charjs.Vertical.Up, true);
                this.stop();
                setTimeout(function () {
                    _this.start();
                }, this.frameInterval);
                this._grabedEnemy.onGrabed(null);
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
            this._isSpeedUp = true;
        };
        MarioWorld.prototype.onAbortSpeedUp = function () {
            this._isSpeedUp = false;
        };
        MarioWorld.prototype.onSquat = function () {
            this._isSquat = true;
        };
        MarioWorld.prototype.onAbortSquat = function () {
            this._isSquat = false;
        };
        MarioWorld.prototype.onRight = function () {
            this._rightPushed = true;
            if (!this._isLeft)
                this._isRight = true;
        };
        MarioWorld.prototype.onAbortRight = function () {
            this._rightPushed = false;
            this._isRight = false;
            if (this._leftPushed)
                this._isLeft = true;
        };
        MarioWorld.prototype.onLeft = function () {
            this._leftPushed = true;
            if (!this._isRight)
                this._isLeft = true;
        };
        MarioWorld.prototype.onAbortLeft = function () {
            this._leftPushed = false;
            this._isLeft = false;
            if (this._rightPushed)
                this._isRight = true;
        };
        MarioWorld.prototype.gameOver = function () {
            var _this = this;
            if (this._gamepadTimer)
                clearInterval(this._gamepadTimer);
            if (this._gameMaster)
                this._gameMaster.doGameOver();
            this.stop();
            this._gameOverTimer = this.getTimer(function () {
                if (_this._gameOverWaitCount < 20) {
                    _this._gameOverWaitCount++;
                    _this.draw(9, null, Charjs.Direction.Right, Charjs.Vertical.Up, true);
                    _this._yVector = _this._jumpPower * _this.pixSize;
                    return;
                }
                _this._yVector -= _this._gravity * _this.pixSize;
                _this.position.y = _this.position.y + _this._yVector;
                if (_this.position.y < _this.size.height * 5 * -1) {
                    _this.removeTimer(_this._gameOverTimer);
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
                _this.draw(9, null, _this._runIndex == 0 ? Charjs.Direction.Left : Charjs.Direction.Right, Charjs.Vertical.Up, true);
            }, this.frameInterval);
        };
        MarioWorld.prototype.onGool = function (callback) {
            this.draw(10, null, Charjs.Direction.Right, Charjs.Vertical.Up, true);
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
        MarioWorld.prototype.scangamepads = function () {
            var _this = this;
            var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
            if (gamepads[0]) {
                this._gamepadTimer = setInterval(function () { _this.updatePadStatus(); }, this.frameInterval);
            }
        };
        MarioWorld.prototype.updatePadStatus = function () {
            var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
            var gamepad = gamepads[0];
            this.onAbortSquat();
            this.onAbortLeft();
            this.onAbortRight();
            if (gamepad.buttons[13].pressed) {
                this.onSquat();
            }
            if (gamepad.buttons[14].pressed) {
                this.onLeft();
            }
            if (gamepad.buttons[15].pressed) {
                this.onRight();
            }
            if (gamepad.buttons[1].pressed || gamepad.buttons[2].pressed || gamepad.buttons[3].pressed) {
                if (gamepad.buttons[2].pressed || gamepad.buttons[3].pressed) {
                    this.onSpecialJump();
                }
                else {
                    this.onJump();
                }
            }
            else {
                this.onAbortJump();
            }
            if (gamepad.buttons[0].pressed) {
                this.onSpeedUp();
                this.onGrab();
            }
            else {
                this.onAbortSpeedUp();
                this.onAbortGrab();
            }
            if (gamepad.buttons[9].pressed) {
                if (this._gameMaster.isStarting())
                    this._gameMaster.stop();
                else
                    this._gameMaster.start();
            }
        };
        MarioWorld.prototype.registerActionCommand = function () {
            var _this = this;
            var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
            if (gamepads && gamepads[0]) {
                this.scangamepads();
            }
            else {
                window.addEventListener("gamepadconnected", function (e) {
                    _this.scangamepads();
                });
            }
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
                                motion = Math.round(e.beta) * _this._deviceDirection;
                                break;
                        }
                        if (motion > 5) {
                            _this.onAbortLeft();
                            _this.onRight();
                        }
                        else if (motion < -5) {
                            _this.onAbortRight();
                            _this.onLeft();
                        }
                        else {
                            _this.onAbortRight();
                            _this.onAbortLeft();
                        }
                        if (Math.abs(motion) >= 20 && _this._canSpeedUpForMobile) {
                            if (_this._direction == Charjs.Direction.Left && motion < 0) {
                                _this._canSpeedUpForMobile = false;
                                _this.onSpeedUp();
                            }
                            else if (_this._direction == Charjs.Direction.Right && motion > 0) {
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
                }
                if (e.keyCode == 37 && !_this._isSquat) {
                    _this.onLeft();
                }
                if (e.keyCode == 39 && !_this._isSquat) {
                    _this.onRight();
                }
            });
            document.addEventListener('keyup', function (e) {
                if (e.keyCode == 65) {
                    _this.onAbortJump();
                }
                if (e.keyCode == 88) {
                    _this.onAbortJump();
                }
                if (e.keyCode == 66 && _this._isSpeedUp) {
                    _this.onAbortSpeedUp();
                    _this.onAbortGrab();
                }
                if (e.keyCode == 40 && _this._isSquat) {
                    _this.onAbortSquat();
                }
                if (e.keyCode == 37 && _this._isLeft) {
                    _this.onAbortLeft();
                }
                if (e.keyCode == 39 && _this._isRight) {
                    _this.onAbortRight();
                }
            });
        };
        return MarioWorld;
    }(Charjs.AbstractPlayer));
    MarioWorld.STEP = 2;
    MarioWorld.DEFAULT_SPEED = 2;
    Charjs.MarioWorld = MarioWorld;
})(Charjs || (Charjs = {}));
var Charjs;
(function (Charjs) {
    var NormalBlockWorld = (function (_super) {
        __extends(NormalBlockWorld, _super);
        function NormalBlockWorld(targetDom, pixSize, position, direction, zIndex, frameInterval) {
            if (direction === void 0) { direction = Charjs.Direction.Right; }
            if (zIndex === void 0) { zIndex = 90; }
            if (frameInterval === void 0) { frameInterval = 45; }
            var _this = _super.call(this, targetDom, pixSize, position, direction, false, true, zIndex - 2, frameInterval) || this;
            _this.colors = ['', '#000000', '#ffffff', '#fee13d', '#ddae50'];
            _this.cchars = [[[0, 2, 1, 12, 0, 2], [0, 1, 1, 1, 2, 3, 4, 9, 1, 1, 0, 1], [1, 1, 2, 2, 3, 9, 4, 3, 1, 1], [1, 1, 2, 1, 3, 11, 4, 2, 1, 1], [1, 1, 2, 1, 3, 11, 4, 2, 1, 1], [1, 1, 4, 1, 3, 3, 1, 1, 3, 4, 1, 1, 3, 2, 4, 2, 1, 1], [1, 1, 2, 1, 3, 3, 1, 1, 3, 4, 1, 1, 3, 2, 4, 2, 1, 1], [1, 1, 4, 1, 3, 3, 1, 1, 3, 4, 1, 1, 3, 2, 4, 2, 1, 1], [1, 1, 4, 1, 3, 3, 1, 1, 3, 4, 1, 1, 3, 2, 4, 2, 1, 1], [1, 1, 4, 1, 3, 11, 4, 2, 1, 1], [1, 1, 4, 1, 3, 11, 4, 2, 1, 1], [1, 1, 4, 1, 3, 11, 4, 2, 1, 1], [1, 1, 4, 2, 3, 9, 4, 3, 1, 1], [1, 1, 4, 14, 1, 1], [0, 1, 1, 1, 4, 12, 1, 1, 0, 1], [0, 2, 1, 12, 0, 2]], [[0, 16], [0, 16], [0, 16], [0, 1, 1, 14, 0, 1], [1, 2, 2, 3, 4, 9, 1, 2], [1, 1, 2, 1, 1, 12, 4, 1, 1, 1], [1, 2, 3, 11, 4, 1, 1, 2], [1, 1, 4, 1, 3, 3, 1, 1, 3, 4, 1, 1, 3, 2, 4, 2, 1, 1], [1, 1, 4, 1, 3, 3, 1, 1, 3, 4, 1, 1, 3, 2, 4, 2, 1, 1], [1, 1, 4, 1, 3, 11, 4, 2, 1, 1], [1, 1, 4, 1, 3, 11, 4, 2, 1, 1], [1, 1, 4, 1, 3, 10, 4, 3, 1, 1], [0, 1, 1, 14, 0, 1], [0, 16], [0, 16], [0, 16]], [[0, 16], [0, 16], [0, 16], [0, 16], [0, 16], [0, 16], [0, 1, 1, 14, 0, 1], [1, 1, 4, 14, 1, 1], [1, 1, 4, 14, 1, 1], [0, 1, 1, 14, 0, 1], [0, 16], [0, 16], [0, 16], [0, 16], [0, 16], [0, 16]], [[0, 16], [0, 16], [0, 16], [0, 1, 1, 14, 0, 1], [1, 2, 2, 10, 3, 1, 2, 1, 1, 2], [1, 1, 2, 8, 3, 1, 2, 1, 3, 1, 2, 1, 3, 2, 1, 1], [1, 1, 2, 4, 4, 1, 2, 2, 3, 1, 2, 1, 4, 1, 3, 4, 1, 1], [1, 1, 2, 4, 4, 1, 2, 1, 3, 1, 2, 1, 3, 1, 4, 1, 3, 4, 1, 1], [1, 1, 2, 1, 3, 1, 2, 1, 3, 1, 2, 1, 3, 1, 2, 1, 3, 7, 1, 1], [1, 2, 3, 12, 1, 2], [1, 1, 3, 1, 1, 12, 4, 1, 1, 1], [1, 2, 3, 9, 4, 3, 1, 2], [0, 1, 1, 14, 0, 1], [0, 16], [0, 16], [0, 16]]];
            _this.chars = null;
            _this.animation = null;
            _this._animationIndex = null;
            _this._isStarting = false;
            _this._star_effect = null;
            _this._pushedUpTimer = null;
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
            _this._star_effect = new Charjs.StarEffect(targetDom, pixSize).init();
            return _this;
        }
        NormalBlockWorld.getAnimation = function (size) {
            return [
                { yOffset: size * 4, index: 0, wait: 0 },
                { yOffset: size * 8, index: 0, wait: 0 },
                { yOffset: size * 10, index: 0, wait: 2 },
                { yOffset: size * 8, index: 0, wait: 0 },
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
        };
        NormalBlockWorld.prototype.init = function (shadow) {
            if (shadow === void 0) { shadow = false; }
            _super.prototype.init.call(this, shadow);
            this.draw(0, undefined, undefined, undefined, undefined, 0);
            return this;
        };
        NormalBlockWorld.prototype.start = function () {
            var _this = this;
            if (this._animationIndex !== null && this.animation != null) {
                this.isActive = false;
                this._isStarting = true;
                this._pushedUpTimer = this.getTimer(function () {
                    if (_this._animationIndex >= _this.animation.length) {
                        _this.animation = null;
                        _this.isActive = true;
                        _this._animationIndex = null;
                        _this.removeCommand();
                        _this.stop();
                        return;
                    }
                    var pos = { x: _this.position.x, y: _this.position.y };
                    if (_this.animation[_this._animationIndex].yOffset)
                        pos.y += _this.animation[_this._animationIndex].yOffset;
                    _this.draw(_this.animation[_this._animationIndex].index, pos, Charjs.Direction.Right, Charjs.Vertical.Up, true, 0);
                    if (_this.animation[_this._animationIndex].wait) {
                        _this.animation[_this._animationIndex].wait--;
                    }
                    else {
                        _this._animationIndex++;
                    }
                }, this.frameInterval);
            }
        };
        NormalBlockWorld.prototype.stop = function () {
            this._isStarting = false;
            if (this._pushedUpTimer) {
                this.removeTimer(this._pushedUpTimer);
                this._pushedUpTimer = null;
            }
        };
        NormalBlockWorld.prototype.onPushedUp = function () {
            for (var _i = 0, _a = this.entityEnemies; _i < _a.length; _i++) {
                var enemy = _a[_i];
                var ePos = enemy.getPosition();
                var effectPos = { x: (this.position.x + ePos.x) / 2, y: (this.position.y + ePos.y) / 2 };
                this._star_effect.drawEffect(effectPos);
                enemy.onEnemyAttack(Charjs.Direction.Right, 0);
            }
            if (!this._pushedUpTimer) {
                this.animation = NormalBlockWorld.getAnimation(this.pixSize);
                this._animationIndex = 0;
                this.registerCommand();
                this.start();
            }
        };
        NormalBlockWorld.prototype.onTrampled = function () {
        };
        NormalBlockWorld.prototype.registerCommand = function () {
            document.addEventListener('keypress', this.defaultCommand);
        };
        NormalBlockWorld.prototype.removeCommand = function () {
            document.removeEventListener('keypress', this.defaultCommand);
        };
        return NormalBlockWorld;
    }(Charjs.AbstractOtherObject));
    Charjs.NormalBlockWorld = NormalBlockWorld;
})(Charjs || (Charjs = {}));
var Charjs;
(function (Charjs) {
    var AbstractBackgroundObject = (function (_super) {
        __extends(AbstractBackgroundObject, _super);
        function AbstractBackgroundObject(width, height, pixSize) {
            var _this = _super.call(this) || this;
            _this.width = width;
            _this.height = height;
            _this.pixSize = pixSize;
            _this._element = null;
            return _this;
        }
        AbstractBackgroundObject.prototype.createImage = function (element) {
            return this.toImage(element);
        };
        AbstractBackgroundObject.prototype.draw = function (top, numberOfLine) {
            if (top === void 0) { top = 0; }
            if (numberOfLine === void 0) { numberOfLine = this.height; }
            if (!this._element) {
                this._element = AbstractMountain.createCanvasElement(this.width, this.height, 0);
                var ctx = this._element.getContext("2d");
                var center = this.width / this.pixSize / 2;
                var datas = Charjs.AbstractPixel.deepCopy(this.dataPattern);
                for (var _i = 0, datas_1 = datas; _i < datas_1.length; _i++) {
                    var data = datas_1[_i];
                    data.currentOffset = center;
                }
                for (var i = 0; i < numberOfLine; i++) {
                    for (var _a = 0, datas_2 = datas; _a < datas_2.length; _a++) {
                        var data = datas_2[_a];
                        if (data.start <= i && (!data.end || data.end >= i)) {
                            var start = data.currentOffset - data.pattern[Math.min(i - data.start, data.pattern.length - 1)];
                            var end = data.isFill ? center : data.currentOffset + data.fillPattern[Math.min(i - data.start, data.fillPattern.length - 1)];
                            if (start == end) {
                                end++;
                            }
                            for (var w = start; w < end; w++) {
                                this.picWithMirror(center, ctx, w, i + top, data.color);
                            }
                            data.currentOffset = start;
                        }
                    }
                }
            }
            return this._element;
        };
        AbstractBackgroundObject.prototype.picWithMirror = function (center, ctx, x, y, color) {
            Charjs.AbstractPixel.drawPixel(ctx, x, y, this.pixSize, color);
            var mirrorX = center + (center - x) - 1;
            Charjs.AbstractPixel.drawPixel(ctx, mirrorX, y, this.pixSize, color);
        };
        return AbstractBackgroundObject;
    }(Charjs.AbstractPixel));
    Charjs.AbstractBackgroundObject = AbstractBackgroundObject;
    var AbstractMountain = (function (_super) {
        __extends(AbstractMountain, _super);
        function AbstractMountain() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.tree = [[0, 0, 1, 1, 0, 0],
                [0, 1, 1, 1, 2, 0],
                [0, 1, 1, 2, 2, 0],
                [1, 1, 1, 2, 2, 3],
                [1, 1, 2, 2, 3, 3],
                [1, 2, 2, 3, 3, 3],
                [0, 3, 3, 3, 3, 0],
                [0, 0, 3, 3, 0, 0]];
            _this.treeImage = null;
            return _this;
        }
        AbstractMountain.prototype.drawMountain = function (trees) {
            var _this = this;
            var mountHeight = Math.min(this.height / this.pixSize, ((this.width / 2) - (this.dataPattern[0].pattern.reduce(function (prev, current) { return prev + current; }) * this.pixSize)) / (this.dataPattern[0].pattern[this.dataPattern[0].pattern.length - 1] * this.pixSize) + this.dataPattern[0].pattern.length);
            var top = (this.height / this.pixSize) - mountHeight;
            var mountElement = this.draw(top, mountHeight);
            return this.createTree().then(function (treeImage) {
                _this.treeImage = treeImage;
                for (var _i = 0, trees_1 = trees; _i < trees_1.length; _i++) {
                    var tree = trees_1[_i];
                    var ctx = mountElement.getContext("2d");
                    ctx.drawImage(_this.treeImage, tree.x, tree.y);
                }
                return _this.createImage(mountElement);
            });
        };
        AbstractMountain.prototype.createTree = function () {
            if (!this.treeImage) {
                var treeElement = Charjs.AbstractPixel.createCanvasElement(this.width, this.height, 0);
                var ctx = treeElement.getContext("2d");
                for (var y = 0; y < this.tree.length; y++) {
                    for (var x = 0; x < this.tree[y].length; x++) {
                        if (this.tree[y][x])
                            Charjs.AbstractPixel.drawPixel(ctx, x, y, this.pixSize, this.treeColors[this.tree[y][x]]);
                    }
                }
                return this.toImage(treeElement);
            }
            return MyQ.Promise.when(this.treeImage);
        };
        return AbstractMountain;
    }(AbstractBackgroundObject));
    Charjs.AbstractMountain = AbstractMountain;
    var Cloud = (function (_super) {
        __extends(Cloud, _super);
        function Cloud() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.dataPattern = [{
                    start: 0,
                    pattern: [8, 3, 2, 1, 1, 0, 1, 0, 0, 0, -1, 0, -1, -1, -2, -3],
                    fillPattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 5, 13],
                    color: '#abe0f7',
                    isFill: false
                }, {
                    start: 1,
                    end: 14,
                    pattern: [8, 3, 2, 1, 0, 1, 0, 0, 0, -1, 0, -1, -2, -3],
                    fillPattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 13],
                    color: '#c3f8f8',
                    isFill: false
                }, {
                    start: 2,
                    end: 13,
                    pattern: [8, 3, 2, 0, 1, 0, 0, 0, -1, 0, -2, -3],
                    fillPattern: [],
                    color: '#e8f0f8',
                    isFill: true
                }];
            return _this;
        }
        Cloud.prototype.drawCloud = function () {
            var element = this.draw();
            var ctx = element.getContext("2d");
            var c = "#000";
            for (var i = 4; i < 8; i++) {
                Charjs.AbstractPixel.drawPixel(ctx, 11, i, this.pixSize, c);
                Charjs.AbstractPixel.drawPixel(ctx, 15, i, this.pixSize, c);
            }
            return this.createImage(element);
        };
        return Cloud;
    }(AbstractBackgroundObject));
    Charjs.Cloud = Cloud;
    var Mountain01 = (function (_super) {
        __extends(Mountain01, _super);
        function Mountain01() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.treeColors = ['#98e0c0', '#88d0b0', '#78c0a0'];
            _this.treePattern = [{ x: 160, y: 40 },
                { x: 128, y: 76 },
                { x: 193, y: 76 },
                { x: 240, y: 108 },
                { x: 224, y: 125 },
                { x: 80, y: 140 },
                { x: 96, y: 140 },
                { x: 160, y: 140 },
                { x: 63, y: 160 }];
            _this.dataPattern = [{
                    start: 0,
                    pattern: [2, 2, 2, 1],
                    fillPattern: [0, 2, 2, 2, 1],
                    color: '#6daf91',
                    isFill: false
                }, {
                    start: 2,
                    pattern: [2, 2, 2, 1],
                    fillPattern: [0, 2, 2, 1],
                    color: '#5d9f81',
                    isFill: false
                }, {
                    start: 4,
                    pattern: [2, 3, 1],
                    fillPattern: [],
                    color: '#4d8f71',
                    isFill: true
                }];
            return _this;
        }
        return Mountain01;
    }(AbstractMountain));
    Charjs.Mountain01 = Mountain01;
    var Mountain02 = (function (_super) {
        __extends(Mountain02, _super);
        function Mountain02() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.treeColors = ['#6daf91', '#5d9f81', '#4d8f71'];
            _this.treePattern = [{ x: 300, y: 50 },
                { x: 396, y: 80 },
                { x: 427, y: 80 },
                { x: 413, y: 95 },
                { x: 180, y: 100 },
                { x: 365, y: 100 },
                { x: 382, y: 135 },
                { x: 141, y: 135 },
                { x: 267, y: 135 },
                { x: 300, y: 135 },
                { x: 557, y: 135 }];
            _this.dataPattern = [{
                    start: 0,
                    pattern: [2, 3, 3, 2],
                    fillPattern: [2, 3, 3, 2],
                    color: '#98e0c0',
                    isFill: false
                }, {
                    start: 2,
                    pattern: [2, 4, 2],
                    fillPattern: [0, 0, 2],
                    color: '#88d0b0',
                    isFill: false
                }, {
                    start: 3,
                    pattern: [2],
                    fillPattern: [],
                    color: '#78c0a0',
                    isFill: true
                }];
            return _this;
        }
        return Mountain02;
    }(AbstractMountain));
    Charjs.Mountain02 = Mountain02;
    var Mountain04 = (function (_super) {
        __extends(Mountain04, _super);
        function Mountain04() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.treePattern = [{ x: 517, y: 34 },
                { x: 569, y: 34 },
                { x: 584, y: 44 },
                { x: 442, y: 69 },
                { x: 632, y: 68 },
                { x: 377, y: 100 },
                { x: 409, y: 100 },
                { x: 536, y: 100 },
                { x: 666, y: 100 },
                { x: 698, y: 100 },
                { x: 394, y: 116 },
                { x: 682, y: 116 },
                { x: 314, y: 136 },
                { x: 345, y: 136 },
                { x: 601, y: 136 },
                { x: 265, y: 165 },
                { x: 343, y: 165 },
                { x: 617, y: 150 }];
            return _this;
        }
        return Mountain04;
    }(Mountain02));
    Charjs.Mountain04 = Mountain04;
    var Mountain03 = (function (_super) {
        __extends(Mountain03, _super);
        function Mountain03() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.treePattern = [{ x: 405, y: 37 },
                { x: 452, y: 37 },
                { x: 438, y: 55 },
                { x: 372, y: 72 },
                { x: 244, y: 103 },
                { x: 196, y: 135 },
                { x: 342, y: 135 },
                { x: 182, y: 152 },
                { x: 213, y: 167 },
                { x: 245, y: 167 }];
            _this.dataPattern = [{
                    start: 0,
                    pattern: [2, 3, 3, 2],
                    fillPattern: [0, 2, 3, 1, 2],
                    color: '#6daf91',
                    isFill: false
                }, {
                    start: 2,
                    pattern: [2, 5, 1, 2],
                    fillPattern: [0, 0, 1, 1, 2],
                    color: '#5d9f81',
                    isFill: false
                }, {
                    start: 3,
                    pattern: [5, 1, 1, 1, 2],
                    fillPattern: [],
                    color: '#4d8f71',
                    isFill: true
                }];
            return _this;
        }
        return Mountain03;
    }(Mountain01));
    Charjs.Mountain03 = Mountain03;
    var Mountains = (function () {
        function Mountains(pixSize) {
            this.pixSize = pixSize;
            this.width = 1024;
            this.height = 864;
        }
        Mountains.prototype.drawBackgroundImage = function (targetDom) {
            var d = MyQ.Deferred.defer();
            targetDom.style.backgroundColor = "#99d9ea";
            var element = document.createElement("canvas");
            var ctx = element.getContext("2d");
            element.setAttribute("width", this.width.toString());
            element.setAttribute("height", this.height.toString());
            var objs = [];
            var cloud = new Cloud(32 * this.pixSize, 16 * this.pixSize, this.pixSize);
            var rand = new RandomGenerator();
            for (var i = 0; i < 10; i++) {
                objs.push({ cloud: cloud, offsetX: rand.getCognitiveRandom(this.width - 32 * this.pixSize), offsetY: rand.getCognitiveRandom(this.height * 0.7) });
            }
            var mount04 = new Mountain04(1100, 250, this.pixSize);
            objs.push({ mount: mount04, offsetX: -330, offsetY: 864 - 250 });
            objs.push({ mount: mount04, offsetX: 695, offsetY: 864 - 250 });
            objs.push({ mount: new Mountain03(820, 200, this.pixSize), offsetX: 50, offsetY: 864 - 200 });
            objs.push({ mount: new Mountain02(700, 180, this.pixSize), offsetX: 350, offsetY: 864 - 180 });
            objs.push({ mount: new Mountain01(350, 150, this.pixSize), offsetX: 0, offsetY: 864 - 150 });
            MyQ.Promise.reduce(objs, this.composition(ctx)).then(function () {
                targetDom.style.backgroundImage = "url(" + element.toDataURL() + ")";
                targetDom.style.backgroundPosition = "left bottom";
                targetDom.style.backgroundRepeat = "repeat-x";
                d.resolve({});
            });
            return d.promise;
        };
        Mountains.prototype.composition = function (ctx) {
            return function (q, value) {
                if (value.cloud) {
                    value.cloud.drawCloud().then(function (img) {
                        ctx.drawImage(img, value.offsetX, value.offsetY);
                        q.resolve({});
                    });
                }
                else {
                    value.mount.drawMountain(value.mount.treePattern).then(function (img) {
                        ctx.drawImage(img, value.offsetX, value.offsetY);
                        q.resolve({});
                    });
                }
            };
        };
        return Mountains;
    }());
    Charjs.Mountains = Mountains;
})(Charjs || (Charjs = {}));
var Charjs;
(function (Charjs) {
    var NormalGroundWorld = (function (_super) {
        __extends(NormalGroundWorld, _super);
        function NormalGroundWorld() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.colors = ['', '#000000', '#2ec720', '#177848', '#78681a', '#c7995c', '#e0c057'];
            _this.cchars = [[[0, 4, 1, 12], [0, 2, 1, 2, 2, 12], [0, 1, 1, 1, 2, 14], [0, 1, 1, 1, 2, 5, 3, 4, 2, 3, 3, 2], [1, 1, 2, 4, 3, 2, 1, 4, 3, 3, 1, 2], [1, 1, 2, 3, 3, 2, 1, 1, 4, 4, 1, 3, 4, 2], [1, 1, 2, 3, 3, 1, 1, 1, 4, 10], [1, 1, 2, 2, 3, 2, 1, 1, 4, 1, 5, 4, 4, 3, 5, 2], [1, 1, 2, 2, 3, 1, 1, 1, 4, 2, 5, 9], [1, 1, 2, 2, 3, 1, 1, 1, 4, 2, 5, 6, 6, 2, 5, 1], [1, 1, 2, 2, 3, 1, 1, 1, 4, 2, 5, 6, 6, 2, 5, 1], [1, 1, 2, 3, 3, 1, 1, 1, 4, 2, 5, 5, 6, 2, 5, 1], [1, 1, 2, 3, 3, 1, 1, 1, 4, 2, 5, 2, 6, 1, 5, 5], [1, 1, 2, 3, 3, 1, 1, 1, 4, 2, 5, 2, 6, 1, 5, 5], [1, 1, 2, 2, 3, 1, 1, 1, 4, 3, 5, 8], [1, 1, 2, 2, 3, 1, 1, 1, 4, 2, 5, 9]], [[1, 16], [2, 16], [2, 16], [3, 1, 2, 7, 3, 3, 2, 3, 3, 2], [1, 1, 3, 2, 2, 3, 3, 2, 1, 3, 3, 3, 1, 2], [4, 1, 1, 2, 3, 3, 1, 2, 4, 3, 1, 3, 4, 2], [4, 3, 1, 3, 4, 10], [5, 2, 4, 5, 5, 4, 4, 3, 5, 2], [5, 13, 6, 2, 5, 1], [5, 3, 6, 2, 5, 8, 6, 2, 5, 1], [5, 3, 6, 2, 5, 8, 6, 2, 5, 1], [5, 3, 6, 2, 5, 5, 6, 1, 5, 5], [5, 10, 6, 1, 5, 5], [5, 16], [5, 16], [5, 16]], [[1, 1, 2, 2, 3, 1, 1, 1, 4, 2, 5, 9], [1, 1, 2, 2, 3, 1, 1, 1, 4, 2, 5, 9], [1, 1, 2, 3, 3, 1, 1, 1, 4, 2, 5, 8], [1, 1, 2, 3, 3, 1, 1, 1, 4, 2, 5, 1, 6, 1, 5, 6], [1, 1, 2, 4, 3, 1, 1, 1, 4, 1, 5, 1, 6, 1, 5, 6], [1, 1, 2, 4, 3, 1, 1, 1, 4, 1, 5, 1, 6, 1, 5, 6], [1, 1, 2, 4, 3, 1, 1, 1, 4, 1, 5, 4, 6, 1, 5, 3], [1, 1, 2, 3, 3, 1, 1, 1, 4, 2, 5, 4, 6, 1, 5, 3], [1, 1, 2, 2, 3, 1, 1, 1, 4, 2, 5, 9], [1, 1, 2, 2, 3, 1, 1, 1, 4, 2, 5, 9], [1, 1, 2, 2, 3, 1, 1, 1, 4, 2, 5, 5, 6, 2, 5, 2], [1, 1, 2, 3, 3, 1, 1, 1, 4, 2, 5, 4, 6, 2, 5, 2], [1, 1, 2, 3, 3, 1, 1, 1, 4, 2, 5, 4, 6, 2, 5, 2], [1, 1, 2, 3, 3, 1, 1, 1, 4, 2, 5, 1, 6, 1, 5, 6], [1, 1, 2, 2, 3, 1, 1, 1, 4, 3, 5, 1, 6, 1, 5, 6], [1, 1, 2, 2, 3, 1, 1, 1, 4, 2, 5, 9]], [[5, 16], [5, 5, 6, 2, 5, 9], [5, 5, 6, 2, 5, 3, 6, 1, 5, 5], [5, 5, 6, 2, 5, 3, 6, 1, 5, 5], [5, 3, 6, 1, 5, 6, 6, 1, 5, 5], [5, 3, 6, 1, 5, 6, 6, 1, 5, 5], [5, 13, 6, 1, 5, 2], [5, 13, 6, 1, 5, 2], [5, 16], [5, 16], [5, 3, 6, 2, 5, 8, 6, 2, 5, 1], [5, 3, 6, 2, 5, 8, 6, 2, 5, 1], [5, 3, 6, 2, 5, 5, 6, 1, 5, 2, 6, 2, 5, 1], [5, 10, 6, 1, 5, 5], [5, 16], [5, 16]]];
            _this.chars = null;
            return _this;
        }
        NormalGroundWorld.prototype.setBorderImage = function () {
            var _this = this;
            this.createBorderImage().then(function (url) {
                var charSize = _this.pixSize * _this.chars[0].length;
                url = "url(" + url + ")";
                _this.targetDom.style.borderImage = url + " " + charSize + " fill round";
                _this.targetDom.style.borderStyle = 'solid';
                _this.targetDom.style.borderWidth = charSize + "px " + charSize + "px 0px " + charSize + "px";
                _this.targetDom.style.webkitBorderImage = url + " " + charSize + " round";
            });
        };
        return NormalGroundWorld;
    }(Charjs.AbstractGround));
    Charjs.NormalGroundWorld = NormalGroundWorld;
})(Charjs || (Charjs = {}));
var Charjs;
(function (Charjs) {
    var TroopaWorld = (function (_super) {
        __extends(TroopaWorld, _super);
        function TroopaWorld(targetDom, pixSize, position, direction, zIndex, frameInterval) {
            if (direction === void 0) { direction = Charjs.Direction.Right; }
            if (zIndex === void 0) { zIndex = 100; }
            if (frameInterval === void 0) { frameInterval = 45; }
            var _this = _super.call(this, targetDom, pixSize, position, direction, true, true, zIndex - 1, frameInterval) || this;
            _this.colors = ['', '#000000', '#f8f8f8', '#b52b0f', '#f58820', '#17770f', '#28b61d', '#3af52a'];
            _this.cchars = [[[0, 5, 5, 6, 0, 5], [0, 4, 5, 1, 1, 1, 6, 2, 2, 2, 1, 1, 5, 1, 0, 4], [0, 3, 5, 1, 6, 2, 1, 3, 2, 2, 6, 1, 5, 1, 0, 3], [0, 2, 5, 1, 6, 2, 1, 1, 7, 4, 1, 1, 6, 2, 5, 1, 0, 2], [0, 2, 1, 1, 6, 1, 1, 1, 7, 6, 1, 1, 6, 1, 1, 1, 0, 2], [0, 1, 5, 1, 6, 1, 1, 1, 7, 8, 1, 1, 6, 1, 5, 1, 0, 1], [0, 1, 5, 1, 1, 1, 6, 1, 1, 1, 7, 6, 1, 1, 6, 1, 1, 1, 5, 1, 0, 1], [5, 1, 1, 1, 5, 1, 6, 2, 1, 1, 7, 4, 1, 1, 6, 2, 5, 1, 1, 1, 5, 1], [1, 1, 5, 3, 6, 2, 1, 4, 6, 2, 5, 3, 1, 1], [2, 3, 5, 2, 1, 1, 0, 4, 1, 1, 5, 2, 2, 3], [2, 4, 1, 1, 5, 6, 1, 1, 2, 4], [1, 2, 2, 12, 1, 2], [0, 1, 1, 3, 2, 8, 1, 3, 0, 1], [0, 2, 1, 1, 2, 1, 1, 8, 2, 1, 1, 1, 0, 2], [0, 3, 1, 1, 2, 8, 1, 1, 0, 3], [0, 4, 1, 8, 0, 4]], [[0, 5, 5, 2, 1, 1, 5, 3, 0, 5], [0, 4, 5, 2, 2, 2, 1, 1, 6, 1, 5, 2, 0, 4], [0, 3, 5, 1, 6, 1, 2, 2, 7, 2, 1, 3, 5, 1, 0, 3], [0, 2, 1, 1, 5, 1, 6, 1, 7, 3, 1, 1, 7, 1, 6, 2, 1, 1, 5, 1, 0, 2], [0, 2, 5, 1, 1, 1, 7, 3, 1, 1, 7, 3, 6, 2, 1, 1, 0, 2], [0, 1, 5, 1, 6, 2, 1, 3, 7, 4, 6, 3, 1, 1, 0, 1], [0, 1, 5, 1, 6, 1, 1, 1, 6, 3, 1, 1, 7, 2, 6, 3, 1, 1, 5, 1, 0, 1], [5, 2, 1, 1, 2, 5, 1, 1, 6, 3, 1, 1, 6, 1, 5, 2], [1, 2, 2, 7, 1, 3, 6, 1, 5, 3], [5, 1, 2, 10, 5, 1, 1, 1, 5, 2, 0, 1], [2, 2, 1, 6, 2, 8], [2, 1, 1, 9, 2, 6], [0, 1, 2, 1, 1, 14], [0, 1, 1, 1, 2, 1, 1, 6, 2, 6, 0, 1], [0, 2, 1, 1, 2, 8, 1, 3, 0, 2], [0, 3, 1, 8, 0, 5]], [[0, 5, 5, 1, 1, 1, 5, 2, 1, 1, 5, 1, 0, 5], [0, 4, 5, 1, 1, 1, 2, 2, 6, 2, 1, 1, 5, 1, 0, 4], [0, 3, 1, 2, 2, 2, 7, 4, 1, 2, 0, 3], [0, 2, 5, 2, 6, 1, 1, 1, 7, 4, 1, 1, 6, 1, 5, 2, 0, 2], [0, 2, 5, 1, 6, 1, 7, 2, 1, 1, 7, 2, 1, 1, 7, 2, 6, 1, 5, 1, 0, 2], [0, 1, 5, 2, 6, 1, 7, 3, 1, 2, 7, 3, 6, 1, 5, 2, 0, 1], [0, 1, 5, 2, 6, 2, 7, 1, 1, 1, 7, 2, 1, 1, 7, 1, 6, 2, 5, 2, 0, 1], [0, 1, 1, 1, 5, 2, 6, 1, 1, 1, 2, 4, 1, 1, 6, 1, 5, 2, 1, 1, 0, 1], [0, 1, 5, 1, 1, 3, 2, 6, 1, 3, 5, 2], [5, 1, 1, 1, 5, 1, 2, 10, 5, 1, 1, 1, 5, 1], [1, 1, 2, 4, 1, 6, 2, 4, 1, 1], [2, 4, 1, 8, 2, 4], [2, 1, 1, 14, 2, 1], [0, 1, 1, 1, 2, 2, 1, 8, 2, 2, 1, 1, 0, 1], [0, 2, 1, 2, 2, 8, 1, 2, 0, 2], [0, 4, 1, 8, 0, 4]]];
            _this.chars = null;
            _this.animationIndex = 4;
            _this._speed = 0;
            _this._actionIndex = 0;
            _this._star_effect = null;
            _this._yVector = 0;
            _this._grabbedPlayer = null;
            _this._isKilled = false;
            _this._isStepped = true;
            _this._star_effect = new Charjs.StarEffect(targetDom, pixSize).init();
            return _this;
        }
        TroopaWorld.prototype.executeJump = function () {
            var ground = this.entity.ground || 0;
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
        };
        TroopaWorld.prototype.isKilled = function () {
            return this._isKilled;
        };
        TroopaWorld.prototype.onAction = function () {
            if (!this._grabbedPlayer) {
                var directionUpdated = this.updateDirection();
                var targetEnemy = this.doHitTestWithOtherEnemy();
                if (targetEnemy && this._speed > 0) {
                    var ePos = targetEnemy.getPosition();
                    var targetEnemyCenter = ePos.x + targetEnemy.getCharSize().width / 2;
                    var enemyCenter = this.position.x + this.size.width / 2;
                    targetEnemy.onEnemyAttack(targetEnemyCenter <= enemyCenter ? Charjs.Direction.Left : Charjs.Direction.Right, 10);
                    var effectPos = { x: (this.position.x + ePos.x) / 2, y: (this.position.y + ePos.y) / 2 };
                    this._star_effect.drawEffect(effectPos);
                }
                this.updateEntity();
                this.executeJump();
                if (this._direction == Charjs.Direction.Right) {
                    this.position.x += this.pixSize * this._speed;
                }
                else {
                    this.position.x -= this.pixSize * this._speed;
                }
                this.drawAction();
            }
        };
        TroopaWorld.prototype.drawAction = function () {
            var direction = this._direction;
            if (this._speed > 0) {
                if (this.animationIndex >= TroopaWorld.animation.length) {
                    this.animationIndex = 0;
                }
                this._actionIndex = TroopaWorld.animation[this.animationIndex].index;
                direction = TroopaWorld.animation[this.animationIndex].direction;
                this.animationIndex++;
            }
            this.draw(this._actionIndex, null, direction, Charjs.Vertical.Up, true);
        };
        TroopaWorld.prototype.isStepped = function () {
            return this._isStepped;
        };
        TroopaWorld.prototype.onKilled = function () {
            this.destroy();
        };
        TroopaWorld.prototype.onStepped = function () {
            this._isStepped = true;
            this._speed = 0;
        };
        TroopaWorld.prototype.onGrabed = function (player) {
            this._grabbedPlayer = player;
        };
        TroopaWorld.prototype.onKicked = function (kickDirection, kickPower) {
            this._isStepped = false;
            this._speed = 10;
            this._direction = kickDirection;
            return Charjs.HitStatus.attack;
        };
        TroopaWorld.prototype.onEnemyAttack = function (attackDirection, kickPower) {
            var _this = this;
            this._isKilled = true;
            this.stop();
            var yVector = 10 * this.pixSize;
            var direction = (attackDirection == Charjs.Direction.Right ? 1 : -1);
            var killTimer = this.getTimer(function () {
                yVector -= _this._gravity * _this.pixSize;
                _this.position.y = _this.position.y + yVector;
                _this.position.x += kickPower * direction;
                if (_this.position.y < _this.size.height * 5 * -1) {
                    _this.removeTimer(killTimer);
                    _this.destroy();
                    return;
                }
                _this.draw(_this._actionIndex, null, _this._direction, Charjs.Vertical.Down, true);
            }, this.frameInterval);
        };
        TroopaWorld.prototype.registerActionCommand = function () {
        };
        return TroopaWorld;
    }(Charjs.AbstractEnemy));
    TroopaWorld.animation = [
        { index: 2, direction: Charjs.Direction.Right },
        { index: 1, direction: Charjs.Direction.Left },
        { index: 0, direction: Charjs.Direction.Right },
        { index: 1, direction: Charjs.Direction.Right }
    ];
    Charjs.TroopaWorld = TroopaWorld;
})(Charjs || (Charjs = {}));
var Charjs;
(function (Charjs) {
    var GameMaster = (function () {
        function GameMaster(targetDom, charSize, frameInterval, _goolCallback, _gameoverCallback) {
            if (charSize === void 0) { charSize = 2; }
            if (frameInterval === void 0) { frameInterval = 45; }
            var _this = this;
            this.targetDom = targetDom;
            this.charSize = charSize;
            this.frameInterval = frameInterval;
            this._goolCallback = _goolCallback;
            this._gameoverCallback = _gameoverCallback;
            this._point = 0;
            this._events = {};
            this._eventCount = 0;
            this._gameTimer = null;
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
        GameMaster.GetController = function (gameName, targetDom, charSize, frameInterval, goolCallback, clearCallback) {
            var master = GameMaster.GAME_MASTERS[gameName];
            if (master) {
                return master;
            }
            if (targetDom) {
                master = new GameMaster(targetDom, charSize, frameInterval, goolCallback, clearCallback);
                GameMaster.GAME_MASTERS[gameName] = master;
                return master;
            }
            else {
                return null;
            }
        };
        GameMaster.prototype.addEvent = function (func) {
            this._eventCount++;
            this._events[this._eventCount] = func;
            return this._eventCount;
        };
        GameMaster.prototype.removeEvent = function (id) {
            delete this._events[id];
        };
        GameMaster.prototype.startTimer = function () {
            var _this = this;
            if (!this._gameTimer) {
                this._gameTimer = setInterval(function () {
                    for (var id in _this._events) {
                        _this._events[id]();
                    }
                }, this.frameInterval);
            }
        };
        GameMaster.prototype.stopTimer = function () {
            if (this._gameTimer) {
                clearInterval(this._gameTimer);
                this._gameTimer = null;
            }
        };
        GameMaster.prototype.CreatePlayerInstance = function (clz, position, direction) {
            if (direction === void 0) { direction = Charjs.Direction.Right; }
            var char = new clz(this.targetDom, this.charSize, position, direction, 100, this.frameInterval);
            char._name = 'player';
            this._player = char;
            char._gameMaster = this;
            return char;
        };
        GameMaster.prototype.CreateEnemyInstance = function (clz, position, direction) {
            if (direction === void 0) { direction = Charjs.Direction.Right; }
            var char = new clz(this.targetDom, this.charSize, position, direction, 100, this.frameInterval);
            char._name = 'enemy_' + this._enemyCount;
            this._enemyCount++;
            this._enemys[char._name] = char;
            char._gameMaster = this;
            return char;
        };
        GameMaster.prototype.CreateObjectInstance = function (clz, position) {
            var char = new clz(this.targetDom, this.charSize, position, Charjs.Direction.Right, 90, this.frameInterval);
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
            this.cleanEntityEnemiesFromAllObjects(char);
            delete this._enemys[char._name];
            if (Object.keys(this._enemys).length == 0) {
                this.doGool();
            }
        };
        GameMaster.prototype.getEnemys = function () {
            return this._enemys;
        };
        GameMaster.prototype.getApproachedObjects = function (target, radius) {
            var objs = [];
            this.cleanEntityEnemiesFromAllObjects(target);
            for (var name_3 in this._objects) {
                if (this._objects[name_3].isActive) {
                    var objPos = this._objects[name_3].getPosition();
                    var charPos = target.getPosition();
                    if (charPos.x - radius < objPos.x && objPos.x < charPos.x + radius &&
                        charPos.y - radius < objPos.y && objPos.y < charPos.y + radius) {
                        objs.push(this._objects[name_3]);
                    }
                }
            }
            return objs;
        };
        GameMaster.prototype.cleanEntityEnemiesFromAllObjects = function (target) {
            if (target instanceof Charjs.AbstractEnemy) {
                for (var name_4 in this._objects) {
                    this._objects[name_4].entityEnemies.some(function (v, i, array) { if (v == target)
                        array.splice(i, 1); return true; });
                }
            }
        };
        GameMaster.prototype.init = function () {
            if (this._player) {
                this._player.init(true);
            }
            for (var name_5 in this._enemys) {
                this._enemys[name_5].init(true);
            }
            for (var name_6 in this._objects) {
                this._objects[name_6].init(true);
            }
            for (var name_7 in this._enemys) {
                this._enemys[name_7].start();
            }
            if (this._player) {
                this._player.start();
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
            this.startTimer();
            this._isStarting = true;
        };
        GameMaster.prototype.stop = function () {
            this.stopTimer();
            this._isStarting = false;
        };
        GameMaster.prototype.doGameOver = function () {
            if (this._gameoverCallback) {
                this._gameoverCallback(this._point);
            }
            for (var name_8 in this._enemys) {
                this._enemys[name_8].stop();
            }
        };
        GameMaster.prototype.doGool = function () {
            var _this = this;
            if (this._goolCallback) {
                this._goolCallback(this._point);
            }
            for (var name_9 in this._enemys) {
                this._enemys[name_9].stop();
            }
            var screen = document.body;
            var blackScreen = document.createElement('div');
            blackScreen.setAttribute("width", screen.clientWidth.toString());
            blackScreen.setAttribute("height", screen.clientHeight.toString());
            var backgroundOpacity = 0;
            var goolDimTimer = this.addEvent(function () {
                if (Math.floor(backgroundOpacity) != 1) {
                    backgroundOpacity += 0.01;
                }
                else {
                    _this.removeEvent(goolDimTimer);
                    _this._player.stop();
                    _this._player.onGool(function () {
                        var goolDimOffTimer = _this.addEvent(function () {
                            if (backgroundOpacity.toFixed(2) != "0.20") {
                                backgroundOpacity -= 0.05;
                            }
                            else {
                                _this.removeEvent(goolDimOffTimer);
                                _this._player.start();
                                var circleSize_1 = screen.clientWidth > screen.clientHeight ? screen.clientWidth : screen.clientHeight;
                                var circleAnimationCount_1 = 0;
                                var circleTimer_1 = _this.addEvent(function () {
                                    circleSize_1 -= 20;
                                    var rect = _this._player.getCurrntElement().getBoundingClientRect();
                                    _this.drawBlackClipCircle(screen, rect, circleSize_1, circleAnimationCount_1);
                                    circleAnimationCount_1++;
                                    if (circleSize_1 <= 0) {
                                        _this.removeEvent(circleTimer_1);
                                        _this._player.destroy();
                                    }
                                });
                            }
                            blackScreen.style.cssText = "z-index: " + (_this._player.zIndex - 1) + "; position: absolute; background-color:black; width: 100vw; height: 100vh; border: 0;opacity: " + backgroundOpacity + ";";
                        });
                    });
                }
                blackScreen.style.cssText = "z-index: " + (_this._player.zIndex - 1) + "; position: absolute; background-color:black; width: 100vw; height: 100vh; border: 0;opacity: " + backgroundOpacity + ";";
            });
            this.targetDom.appendChild(blackScreen);
        };
        GameMaster.prototype.drawBlackClipCircle = function (targetDom, rect, size, count) {
            var element = document.createElement("canvas");
            var ctx = element.getContext("2d");
            var width = targetDom.scrollWidth;
            var height = targetDom.scrollHeight;
            element.id = "bkout_circle_" + count;
            element.setAttribute("width", width.toString());
            element.setAttribute("height", height.toString());
            element.style.cssText = "z-index: " + (this._player.zIndex + 1) + "; position: absolute;";
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, width, height);
            if (size > 0) {
                ctx.globalCompositeOperation = "destination-out";
                ctx.beginPath();
                ctx.arc(rect.left + rect.width / 2 + window.scrollX, rect.top + rect.height / 2 + window.scrollY, size, 0, Math.PI * 2, false);
            }
            ctx.fill();
            targetDom.appendChild(element);
            if (count != 0)
                targetDom.removeChild(document.getElementById("bkout_circle_" + (count - 1)));
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
var Util;
(function (Util) {
    var Compression = (function () {
        function Compression() {
        }
        Compression.RLE = function (map) {
            var newMap = [];
            for (var i = 0; i < map.length; i++) {
                var row = [];
                var prev = null;
                var prevCount = 0;
                for (var j = 0; j < map[i].length; j++) {
                    if (prev !== map[i][j]) {
                        if (prev !== null) {
                            row.push(prev);
                            row.push(prevCount);
                        }
                        prev = map[i][j];
                        prevCount = 1;
                    }
                    else {
                        prevCount++;
                    }
                }
                row.push(prev);
                row.push(prevCount);
                newMap.push(row);
            }
            return newMap;
        };
        Compression.RLD = function (map) {
            var newMap = [];
            for (var i = 0; i < map.length; i++) {
                var row = [];
                for (var j = 0; j < map[i].length; j += 2) {
                    for (var k = 0; k < map[i][j + 1]; k++) {
                        row.push(map[i][j]);
                    }
                }
                newMap.push(row);
            }
            return newMap;
        };
        return Compression;
    }());
    Util.Compression = Compression;
})(Util || (Util = {}));
var MyQ;
(function (MyQ) {
    var Deferred = (function () {
        function Deferred() {
            this.promise = new MyQ.Promise();
        }
        Deferred.defer = function () {
            return new Deferred();
        };
        Deferred.prototype.resolve = function (arg) {
            var _this = this;
            setTimeout(function () {
                _this.promise.resolve(arg);
            }, 0);
        };
        Deferred.prototype.reject = function (e) {
            var _this = this;
            setTimeout(function () {
                _this.promise.reject(e);
            }, 0);
        };
        return Deferred;
    }());
    MyQ.Deferred = Deferred;
})(MyQ || (MyQ = {}));
var MyQ;
(function (MyQ) {
    var Promise = (function () {
        function Promise() {
            this._ok = null;
            this._ng = null;
            this._final = null;
            this._next = null;
            this._finallyCalled = false;
        }
        Promise.prototype.resolve = function (arg) {
            var _this = this;
            if (this._ok) {
                try {
                    var ret = this._ok(arg);
                    if (ret instanceof Promise) {
                        ret.then(function (arg) {
                            _this._next.resolve(arg);
                        }).catch(function (e) {
                            _this.reject(e);
                        });
                    }
                    else {
                        this._next.resolve(ret);
                    }
                }
                catch (e) {
                    this.reject(e);
                }
                finally {
                    this.final();
                }
            }
        };
        Promise.prototype.reject = function (e) {
            try {
                if (this._next)
                    this._next.reject(e);
                else if (this._ng)
                    this._ng(e);
            }
            catch (e) {
                throw e;
            }
            finally {
                this.final();
            }
        };
        Promise.prototype.final = function () {
            if (this._next) {
                this._next.final();
            }
            else if (this._final) {
                if (!this._finallyCalled) {
                    this._finallyCalled = true;
                    this._final();
                }
            }
        };
        Promise.prototype.then = function (func) {
            this._ok = func;
            this._next = new Promise();
            return this._next;
        };
        Promise.prototype.catch = function (func) {
            this._ng = func;
            return this;
        };
        Promise.prototype.finally = function (func) {
            this._final = func;
            return this;
        };
        Promise.when = function (arg) {
            var d = MyQ.Deferred.defer();
            setTimeout(function () {
                d.resolve(arg);
            }, 0);
            return d.promise;
        };
        Promise.all = function (Promises) {
            var PromiseLength = Promises.length;
            var callbackCount = 0;
            var PromisesArgs = [];
            var allPromise = new Promise();
            var resolve = function (index) {
                return function (arg) {
                    callbackCount++;
                    PromisesArgs[index] = arg;
                    if (PromiseLength == callbackCount) {
                        allPromise.resolve(PromisesArgs);
                    }
                };
            };
            var reject = function (index) {
                return function (e) {
                    allPromise.reject(e);
                };
            };
            for (var i = 0; i < Promises.length; i++) {
                Promises[i].then(resolve(i)).catch(reject(i));
            }
            return allPromise;
        };
        Promise.allSettled = function (Promises) {
            var PromiseLength = Promises.length;
            var callbackCount = 0;
            var results = [];
            var allPromise = new Promise();
            var resolve = function (index) {
                return function (arg) {
                    callbackCount++;
                    results[index] = { state: 'fulfilled', value: arg };
                    if (PromiseLength == callbackCount) {
                        allPromise.resolve(results);
                    }
                };
            };
            var reject = function (index) {
                return function (e) {
                    callbackCount++;
                    results[index] = { state: 'rejected', reason: e };
                    if (PromiseLength == callbackCount) {
                        allPromise.resolve(results);
                    }
                };
            };
            for (var i = 0; i < Promises.length; i++) {
                Promises[i].then(resolve(i)).catch(reject(i));
            }
            return allPromise;
        };
        Promise.race = function (Promises) {
            var racePromise = new Promise();
            var raceCalled = false;
            var resolve = function (arg) {
                if (!raceCalled) {
                    raceCalled = true;
                    racePromise.resolve(arg);
                }
            };
            var reject = function (e) {
                if (!raceCalled) {
                    raceCalled = true;
                    racePromise.reject(e);
                }
            };
            for (var i = 0; i < Promises.length; i++) {
                Promises[i].then(resolve).catch(reject);
            }
            return racePromise;
        };
        Promise.reduce = function (values, func) {
            return values.reduce(function (prev, current) {
                return prev.then(function () {
                    var d = MyQ.Deferred.defer();
                    func(d, current);
                    return d.promise;
                });
            }, Promise.when());
        };
        return Promise;
    }());
    MyQ.Promise = Promise;
})(MyQ || (MyQ = {}));
var RandomGenerator = (function () {
    function RandomGenerator() {
    }
    RandomGenerator.prototype.getRandom = function (max, min) {
        return Math.floor(Math.random() * (max + 1 - min)) + min;
    };
    RandomGenerator.prototype.getCognitiveRandom = function (max, min, distance) {
        if (min === void 0) { min = 0; }
        if (distance === void 0) { distance = 0.3; }
        var rand = Math.random();
        while (Math.abs(this.lastRandom - rand) < distance && Math.abs(this.lastRandom2 - rand) < distance) {
            rand = Math.random();
        }
        this.lastRandom2 = this.lastRandom;
        this.lastRandom = rand;
        return Math.floor(rand * (max + 1 - min)) + min;
    };
    RandomGenerator.prototype.getNormdistRandom = function (max, min, normdist) {
        if (min === void 0) { min = 0; }
        if (normdist === void 0) { normdist = 6; }
        var rands = [];
        for (var i = 0; i < normdist; i++) {
            rands.push(Math.random() * (max + 1 - min)) + min;
        }
        return Math.floor(rands.reduce(function (prev, current) { return prev + current; }) / normdist);
    };
    return RandomGenerator;
}());
//# sourceMappingURL=mario.js.map