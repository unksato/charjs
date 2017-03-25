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
    var GameMaster = (function () {
        function GameMaster(targetDom, charSize) {
            this.targetDom = targetDom;
            this.charSize = charSize;
            this._enemys = [];
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
                this._enemys.push(char);
            }
            else {
                this._player = char;
            }
            char._gameMaster = this;
            return char;
        };
        GameMaster.prototype.getEnemys = function () {
            return this._enemys;
        };
        GameMaster.prototype.init = function () {
            if (this._player) {
                this._player.init();
            }
            for (var _i = 0, _a = this._enemys; _i < _a.length; _i++) {
                var enemy = _a[_i];
                enemy.init();
            }
        };
        GameMaster.prototype.start = function () {
            for (var _i = 0, _a = this._enemys; _i < _a.length; _i++) {
                var enemy = _a[_i];
                enemy.start();
            }
            if (this._player) {
                this._player.start();
            }
        };
        GameMaster.prototype.doGameOver = function () {
            for (var _i = 0, _a = this._enemys; _i < _a.length; _i++) {
                var enemy = _a[_i];
                enemy.stop();
            }
        };
        GameMaster.prototype.doGool = function () {
            for (var _i = 0, _a = this._enemys; _i < _a.length; _i++) {
                var enemy = _a[_i];
                enemy.stop();
            }
        };
        return GameMaster;
    }());
    GameMaster.GAME_MASTERS = {};
    Character.GameMaster = GameMaster;
    var AbstractCharacter = (function () {
        function AbstractCharacter(targetDom, pixSize, position, _isReverse, zIndex, frameInterval) {
            if (pixSize === void 0) { pixSize = 2; }
            if (position === void 0) { position = { x: 0, y: 0 }; }
            if (_isReverse === void 0) { _isReverse = false; }
            if (zIndex === void 0) { zIndex = 2147483645; }
            if (frameInterval === void 0) { frameInterval = 45; }
            var _this = this;
            this.targetDom = targetDom;
            this.pixSize = pixSize;
            this.position = position;
            this._isReverse = _isReverse;
            this.zIndex = zIndex;
            this.frameInterval = frameInterval;
            this.cssTextTemplate = "z-index: " + this.zIndex + "; position: absolute; bottom: 0;";
            this.currentAction = null;
            this._actions = [];
            this._reverseActions = [];
            this._verticalActions = [];
            this._verticalReverseActions = [];
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
                this._actions.push(this.createCharacterAction(charactor));
                this._reverseActions.push(this.createCharacterAction(charactor, true));
                if (this.useVertical) {
                    this._verticalActions.push(this.createCharacterAction(charactor, false, true));
                    this._verticalReverseActions.push(this.createCharacterAction(charactor, true, true));
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
        AbstractCharacter.prototype.draw = function (index, position, reverse, vertical, removeCurrent) {
            if (index === void 0) { index = 0; }
            if (position === void 0) { position = null; }
            if (reverse === void 0) { reverse = false; }
            if (vertical === void 0) { vertical = false; }
            if (removeCurrent === void 0) { removeCurrent = false; }
            if (removeCurrent)
                this.removeCharacter();
            position = position || this.position;
            if (!vertical) {
                this.currentAction = !reverse ? this._actions[index] : this._reverseActions[index];
            }
            else {
                this.currentAction = !reverse ? this._verticalActions[index] : this._verticalReverseActions[index];
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
            document.removeEventListener('keypress', this.defaultCommand);
        };
        AbstractCharacter.prototype.getPosition = function () {
            return this.position;
        };
        AbstractCharacter.prototype.getCharSize = function () {
            return { height: this.charHeight, width: this.charWidth };
        };
        AbstractCharacter.prototype.updateDirection = function () {
            var currentDirection = this._isReverse;
            if (this.position.x > this.targetDom.clientWidth - this.charWidth - (this.pixSize * 2) && this._isReverse == false) {
                this._isReverse = true;
            }
            if (this.position.x < 0 && this._isReverse == true) {
                this._isReverse = false;
            }
            return currentDirection != this._isReverse;
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
                for (var _i = 0, enemys_1 = enemys; _i < enemys_1.length; _i++) {
                    var enemy = enemys_1[_i];
                    if (!enemy.isKilled()) {
                        var ePos = enemy.getPosition();
                        var eSize = enemy.getCharSize();
                        if (this.position.y > ePos.y + eSize.height)
                            continue;
                        if (ePos.y > this.position.y + this.charHeight)
                            continue;
                        if (this.position.x > ePos.x + eSize.width)
                            continue;
                        if (ePos.x > this.position.x + this.charWidth)
                            continue;
                        if (enemy.isStepped()) {
                            var playerCenter = this.position.x + this.charWidth / 2;
                            var enemyCenter = ePos.x + eSize.width / 2;
                            this._attackDirection = playerCenter <= enemyCenter ? 1 : -1;
                            enemy.onKicked(this._attackDirection, this._speed * 3);
                            return HitStatus.attack;
                        }
                        if (this._isJumping && this._yVector < 0) {
                            enemy.onStepped();
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
            var blackScreen = document.createElement('div');
            if (this.targetDom == document.body)
                this.targetDom.style.cssText = 'margin: 0px;'; // only document body 
            var goolDimTimer = setInterval(function () {
                if (Math.floor(_this._backgroundOpacity) != 1) {
                    _this._backgroundOpacity += 0.02;
                }
                else {
                    _this.stop();
                    _this.draw(10, null, false, false, true);
                    clearInterval(goolDimTimer);
                    var goolDimOffTimer_1 = setInterval(function () {
                        if (Math.ceil(_this._backgroundOpacity) != 0) {
                            _this._backgroundOpacity -= 0.04;
                        }
                        else {
                            clearInterval(goolDimOffTimer_1);
                            _this.targetDom.removeChild(blackScreen);
                            _this.start();
                            // TODO: GO back circle
                            // this.drawBlackClipCircle(this.targetDom, { x: 300, y: 1000 }, 500, 0);
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
            ctx.beginPath();
            ctx.rect(0, 0, width, height);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(position.x, position.y, size, 0, Math.PI * 2, false);
            ctx.clip();
            ctx.rect(0, 0, width, height);
            ctx.fillStyle = 'rgb(255, 255, 255, 1)';
            ctx.fill();
            targetDom.appendChild(element);
            if (count != 0)
                targetDom.removeChild(document.getElementById("brackout_circle_" + (count - 1)));
        };
        Mario.prototype.registerActionCommand = function () {
            var _this = this;
            if (this.checkMobile()) {
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
    }(AbstractCharacter));
    Mario.STEP = 2;
    Mario.DEFAULT_SPEED = 2;
    Character.Mario = Mario;
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
            _this._isStepped = false;
            return _this;
        }
        Goomba.prototype.isKilled = function () {
            return this._isKilled;
        };
        Goomba.prototype.onAction = function () {
            var directionUpdated = this.updateDirection();
            if (this.doHitTestWithOtherEnemy()) {
                this._isReverse = !this._isReverse;
            }
            if (!this._isReverse) {
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
            this.draw(this._actionIndex, null, this._isReverse, this._isStepped, true);
        };
        Goomba.prototype.isStepped = function () {
            return this._isStepped;
        };
        Goomba.prototype.onStepped = function () {
            this._isStepped = true;
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
                _this.draw(_this._actionIndex, null, direction > 0 ? false : true, _this._isStepped, true);
            }, this.frameInterval);
        };
        Goomba.prototype.doHitTestWithOtherEnemy = function () {
            if (this._gameMaster) {
                var enemys = this._gameMaster.getEnemys();
                for (var _i = 0, enemys_2 = enemys; _i < enemys_2.length; _i++) {
                    var enemy = enemys_2[_i];
                    if (enemy != this) {
                        var ePos = enemy.getPosition();
                        var eSize = enemy.getCharSize();
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
    }(AbstractCharacter));
    Goomba.STEP = 2;
    Character.Goomba = Goomba;
})(Character || (Character = {}));
var master = Character.GameMaster.GetController('sample', document.body, 3);
var mario = master.CreateCharInstance(Character.Mario, { x: 0, y: 0 });
var goomba1 = master.CreateCharInstance(Character.Goomba, { x: 300, y: 0 }, false);
var goomba2 = master.CreateCharInstance(Character.Goomba, { x: 500, y: 0 }, true);
var goomba3 = master.CreateCharInstance(Character.Goomba, { x: 800, y: 0 }, true);
master.init();
master.start();
// mario.draw(0, {x:0, y:0});
// mario.draw(1, {x:100, y:0});
// mario.draw(2, {x:200, y:0});
// mario.draw(3, {x:300, y:0});
// mario.draw(4, {x:400, y:0});
// mario.draw(5, {x:500, y:0});
// mario.draw(6, {x:600, y:0});
// mario.draw(7, {x:700, y:0});
// mario.draw(8, {x:800, y:0});
// mario.draw(9, {x:800, y:0});
// mario.draw(10, {x:900, y:0});
// mario.draw(11, {x:1000, y:0});
// mario.gool();
//# sourceMappingURL=mario_world.js.map