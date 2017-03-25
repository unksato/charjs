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
            this._name = '';
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
            if (this._gameMaster && this.isEnemy) {
                this._gameMaster.deleteEnemy(this);
            }
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
    Character.AbstractCharacter = AbstractCharacter;
})(Character || (Character = {}));
//# sourceMappingURL=abstract_character.js.map