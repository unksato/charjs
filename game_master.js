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
            for (var name_1 in this._enemys) {
                this._enemys[name_1].init();
            }
        };
        GameMaster.prototype.start = function () {
            for (var name_2 in this._enemys) {
                this._enemys[name_2].start();
            }
            if (this._player) {
                this._player.start();
            }
        };
        GameMaster.prototype.doGameOver = function () {
            for (var name_3 in this._enemys) {
                this._enemys[name_3].stop();
            }
        };
        GameMaster.prototype.doGool = function () {
            for (var name_4 in this._enemys) {
                this._enemys[name_4].stop();
            }
        };
        return GameMaster;
    }());
    GameMaster.GAME_MASTERS = {};
    Character.GameMaster = GameMaster;
})(Character || (Character = {}));
//# sourceMappingURL=game_master.js.map