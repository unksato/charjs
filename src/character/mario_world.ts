namespace Charjs {

    enum HitStatus{
        none,
        dammage,
        attack,
        grab
    }

    export class MarioWorld extends AbstractPlayer {
        private static STEP = 2;
        private static DEFAULT_SPEED = 2;
        private _runIndex = 0;
        private _currentStep = MarioWorld.STEP;

        private _yVector = 0;
        private _jumpPower = 18;
        private _speed = MarioWorld.DEFAULT_SPEED;
        private _gameOverWaitCount = 0;

        private _speedUpTimer = null;
        private _speedDownTimer = null;
        private _squatTimer = null;
        private _gameOverTimer = null;

        private _isJumping = false;
        private _isSpecial = false;

        private _isBraking = false;
        private _isSquat = false;
        private _attackDirection : Direction = Direction.Right;

        constructor(targetDom, pixSize:number, position: IPosition, direction: Direction = Direction.Right, zIndex = 2147483640, frameInterval = 45){
            super(targetDom, pixSize,position, direction, true, false, zIndex, frameInterval);
        }

        onAction(): void {
            this.updateEntity();
            switch (this.doHitTest()) {
                case HitStatus.dammage:
                    this.gameOver();
                    break;
                case HitStatus.attack:
                    this.draw(11, null, this._attackDirection, Vertical.Up, true);
                    this.stop();
                    setTimeout(() => {
                        this.start();
                    }, this.frameInterval * 3);
                    break;
                case HitStatus.grab:
                    this.moveGrabedEnemy();
                    this.draw(14, null, this._direction, Vertical.Up, true);                               
                    this.stop();
                    setTimeout(() => {
                        this.start();
                    }, this.frameInterval);
                    break;
                default:
                    let action = this.executeRun();
                    action = this.executeJump() || action;

                    if(action.index === 0){
                        this.size.widthOffset = 4 * this.pixSize;
                    } else {
                        this.size.widthOffset = 0;
                    }

                    this.draw(action.index, null, action.direction, Vertical.Up, true);
            }
        }

        private checkGrabedEnemysAttack(enemy: IEnemy) {
            if(this._grabedEnemy){
                let ePos = enemy.getPosition();
                let eSize = enemy.getCharSize()

                let gEnemyPos = this._grabedEnemy.getPosition();
                let gEnemySize = this._grabedEnemy.getCharSize()
                if (gEnemyPos.y > ePos.y + eSize.height)
                    return;
                if(ePos.y > gEnemyPos.y + gEnemySize.height)
                    return;
                if(gEnemyPos.x > ePos.x + eSize.width)
                    return;
                if(ePos.x > gEnemyPos.x + gEnemySize.width)
                    return;

                let grabedEnemyCenter = gEnemyPos.x + gEnemySize.width / 2;
                let enemyCenter = ePos.x + eSize.width / 2;
                enemy.onKicked(grabedEnemyCenter <= enemyCenter ? Direction.Right : Direction.Left, this._speed * 3);
                this._grabedEnemy.onKicked(grabedEnemyCenter <= enemyCenter ? Direction.Left : Direction.Right, this._speed * 3)
                this._grabedEnemy = null;
            }
        }

        private doHitTest(): HitStatus {
            if (this._gameMaster) {
                let enemys = this._gameMaster.getEnemys();
                for (let name in enemys) {
                    if (!enemys[name].isKilled() && this._grabedEnemy != enemys[name]) {
                        let ePos = enemys[name].getPosition();
                        let eSize = enemys[name].getCharSize()

                        this.checkGrabedEnemysAttack(enemys[name]);

                        if (this.position.y > ePos.y + eSize.height)
                            continue;
                        if (ePos.y > this.position.y + this.size.height)
                            continue;
                        if (this.position.x > ePos.x + eSize.width)
                            continue;
                        if (ePos.x > this.position.x + this.size.width)
                            continue;
                        
                        if (enemys[name].isStepped()) {
                            if(!this._grabbing){
                                let playerCenter = this.position.x + this.size.width / 2;
                                let enemyCenter = ePos.x + eSize.width / 2;
                                this._attackDirection = playerCenter <= enemyCenter ? Direction.Right : Direction.Left;
                                enemys[name].onKicked(this._attackDirection, this._speed * 3);
                                return HitStatus.attack;
                            }else{
                                this.grabEnemy(enemys[name]);
                                return HitStatus.grab;
                            }
                        }

                        if (this._isJumping && this._yVector < 0) {
                            if(this._isSpecial){
                                let playerCenter = this.position.x + this.size.width / 2;
                                let enemyCenter = ePos.x + eSize.width / 2;
                                this._attackDirection = playerCenter <= enemyCenter ? Direction.Right : Direction.Left;
                                enemys[name].onKicked(this._attackDirection, this._speed * 3);
                            }else{
                                enemys[name].onStepped();
                            }
                            this._yVector = 12 * this.pixSize;
                            continue;
                        }
                        return HitStatus.dammage;
                    }
                }
            }
            return HitStatus.none;
        }

        private _specialAnimationIndex = 0;
        private _specialAnimation = [{index:0, direction:Direction.Right},{index:12, direction:Direction.Right},{index:0, direction:Direction.Left},{index:13, direction:Direction.Right}]

        private executeJump(): {index:number, direction: Direction} {
            let ground = this.entity.ground || 0;
            if (this._isJumping) {
                this._yVector -= this._gravity * this.pixSize;
                if(this.entity.ceiling != null){
                    this.position.y = Math.min(this.position.y + this._yVector, this.entity.ceiling - this.size.height + this.size.heightOffset);
                    if(this.position.y == this.entity.ceiling - this.size.height + this.size.heightOffset && this._yVector > 0){
                        this.upperObject.onPushedUp();
                        this._yVector = 0;
                    }
                }else{
                    this.position.y = this.position.y + this._yVector;
                }
            
                this.moveGrabedEnemy();
                if (this.position.y <= ground) {
                    this._isJumping = false;
                    this._yVector = 0;
                    this.position.y = ground;
                    return null;
                } else {
                    if(!this._grabedEnemy){
                        if(!this._isSpecial) {
                            if (this._speed > 8) {
                                if (this._yVector > 0 && this.position.y < this.size.height * 3) {
                                    return null;
                                } else {
                                    return {index:7, direction:this._direction};
                                }
                            } else {
                                return {index:this._yVector > 0 ? 2 : 3, direction:this._direction};
                            }
                        }else{
                            this._specialAnimationIndex++;
                            if(this._specialAnimationIndex > this._specialAnimation.length)
                                this._specialAnimationIndex=0;
                            return this._specialAnimation[this._specialAnimationIndex];
                        }
                    }
                }
            } else {
                if(this.position.y > ground){
                    this._yVector-= this._gravity*this.pixSize;
                    this.position.y+=this._yVector;
                    if(this.position.y < ground){
                        this.position.y = ground;
                    }
                }else{
                    this._yVector = 0;
                }                
                return null;
            }   
        }

        private moveGrabedEnemy() {
            if(this._grabedEnemy){
                let grabXOffset = this._direction == Direction.Right ? this.size.width * 0.7 : this.size.width * -1 * 0.7;
                let grabYOffset = this.pixSize;
                this._grabedEnemy.zIndex = this.zIndex - 1;
                this._grabedEnemy.setPosition({x:this.position.x + grabXOffset ,y:this.position.y + grabYOffset});
                this._grabedEnemy.drawAction();
            }
        }

        private executeRun(): { index:number, direction: Direction} {
            let directionUpdated = this.updateDirection();

            if (this._direction == Direction.Right) {
                let right = this.entity.right || this.targetDom.clientWidth;
                this.position.x = Math.min(this.position.x + this.pixSize * this._speed, right - this.size.width);
            } else {
                let left = this.entity.left || 0;
                this.position.x = Math.max(this.position.x - this.pixSize * this._speed, left);
            }

            let runIndex = this._runIndex;

            if (this._isSquat) {
                if (this._grabedEnemy)
                    runIndex = 14;
                else 
                    runIndex = 8;              
                return {index:runIndex, direction: this._direction};
            }


            if (this._currentStep < MarioWorld.STEP) {
                this._currentStep++;
            } else {
                this._currentStep = 0;
                this._runIndex = this._runIndex ^ 1;
            }

            // grabed action
            if (this._grabedEnemy) {
                if(directionUpdated){
                    runIndex = 12;
                    this._grabedEnemy.setPosition({x:this.position.x,y:this.position.y});
                    this._grabedEnemy.zIndex = this.zIndex + 1;
                    this._grabedEnemy.drawAction();
                }else{
                    runIndex = this._runIndex == 0 ? 15 : 16;
                    this.moveGrabedEnemy();
                }
            }else{
                // Speed up action
                if (this._speed > 8) {
                    runIndex = this._runIndex == 0 ? 4 : 5;
                } else {
                    runIndex = this._runIndex;
                }

                // Braking action
                if (!this._isJumping) {
                    if (this._speed > 5 || (!directionUpdated && this._isBraking)) {
                        if ((this._direction == Direction.Left && this.position.x < this.size.width * 3) ||
                            (this._direction == Direction.Right && this.position.x > this.targetDom.clientWidth - this.size.width * 4)
                        ) {
                            runIndex = 6;
                            if (this._speed > 2)
                                this._speed--;
                            this._isBraking = true;
                        }
                    } else {
                        this._isBraking = false;
                    }
                }
            }
            return {index:runIndex, direction: this._direction};;
        }

        private _grabedEnemy : IEnemy = null;
        private _grabbing = false;

        private grabEnemy(enemy: IEnemy) : void {
            enemy.onGrabed(this);
            this._grabedEnemy = enemy;
        }

        releaseEnemy(): void {
            this._grabedEnemy = null;
        }

        private putEnemy() : void {

        }

        private onGrab(): void {
            this._grabbing = true;
        }

        private onAbortGrab(): void {
            this._grabbing = false;
            if(this._grabedEnemy){
                this.draw(11, null, this._direction, Vertical.Up, true);
                this.stop();
                setTimeout(() => {
                    this.start();
                }, this.frameInterval * 3);
                this._grabedEnemy.onKicked(this._direction, this._speed * 3);
                this._grabedEnemy = null;
            }
        }

        private onJump(): void {
            if (!this._isJumping) {
                this._isJumping = true;
                this._isSpecial = false;
                this._yVector = this._jumpPower * this.pixSize;
            }
        }

        private onSpecialJump(): void {
            if (!this._isJumping) {
                this._isJumping = true;
                this._isSpecial = true;
                this._yVector = this._jumpPower * this.pixSize;
            }
        }

        private onAbortJump(): void {
            if (this._yVector > 0) {
                this._yVector = 0;
            }
        }


        private onSpeedUp(): void {
            if (!this._speedUpTimer) {
                if (this._speedDownTimer) {
                    clearInterval(this._speedDownTimer);
                    this._speedDownTimer = null;
                }
                this._speedUpTimer = setInterval(() => {
                    if (this._speed < 10) {
                        if(!this._isBraking)
                            this._speed++;
                    } else {
                        clearInterval(this._speedUpTimer);
                        this._speedUpTimer = null;
                    }
                }, this.frameInterval);
            }
        }

        private onAbortSpeedUp(): void {
            if (!this._speedDownTimer) {
                this._speedDownTimer = setInterval(() => {
                    if (this._speedUpTimer) {
                        clearInterval(this._speedUpTimer);
                        this._speedUpTimer = null;
                    }
                    if (this._speed > 2) {
                        this._speed--;
                    } else {
                        clearInterval(this._speedDownTimer);
                        this._speedDownTimer = null;
                        this._isBraking = false;
                    }
                }, this.frameInterval);
            }
        }

        private onSquat(): void {
            this.onAbortSpeedUp();
            this._isSquat = true;
            if (!this._squatTimer) {
                this._squatTimer = setInterval(() => {
                    if (this._speed > 0) {
                        this._speed--;
                    } else {
                        clearInterval(this._squatTimer);
                        this._squatTimer = null;
                    }
                }, this.frameInterval);
            }
        }

        private onAbortSquat(): void {
            if (this._squatTimer) {
                clearInterval(this._squatTimer);
                this._squatTimer = null;                
            }
            this._speed = MarioWorld.DEFAULT_SPEED;
            this._isSquat = false;
        }

        public gameOver(): void {
            if (this._gameMaster) this._gameMaster.doGameOver();
            this.stop();
            this._gameOverTimer = setInterval(() => {
                if (this._gameOverWaitCount < 20) {
                    this._gameOverWaitCount++;
                    this.draw(9, null, Direction.Right, Vertical.Up, true);
                    this._yVector = this._jumpPower * this.pixSize;
                    return;
                }

                this._yVector -= this._gravity * this.pixSize;
                this.position.y = this.position.y + this._yVector;

                if (this.position.y < this.size.height * 5 * -1) {
                    clearInterval(this._gameOverTimer);
                    this.destroy();
                    return;
                }

                if (this._currentStep < MarioWorld.STEP) {
                    this._currentStep++;
                } else {
                    this._currentStep = 0;
                    this._runIndex = this._runIndex ^ 1;
                }

                this.draw(9, null, this._runIndex == 0 ? Direction.Left : Direction.Right, Vertical.Up, true);

            }, this.frameInterval);
        }

        private _backgroundOpacity = 0;

        public onGool(callback?:Function): void {
            this.draw(10, null, Direction.Right, Vertical.Up, true);
            if(callback) callback();
        }

        private _canSpeedUpForMobile: boolean = true;
        private _screenModeForMobile: string = 'PORTRAIT';
        private _deviceDirection: number = 1;

        private touchAbort(touchLength: number){
            switch(touchLength) {
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
        }

        private touch(touchLength: number){
            switch(touchLength){
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
        }

        registerActionCommand(): void {
            if (GameMaster.checkMobile()) {
                if(window.orientation == 0){
                    this._screenModeForMobile = 'PORTRAIT';
                    this._deviceDirection = 1;
                }else if(window.orientation == 90){
                    this._screenModeForMobile = 'LANSCAPE';
                    this._deviceDirection = 1;
                }else if(window.orientation == -90){
                    this._screenModeForMobile = 'LANSCAPE';
                    this._deviceDirection = -1;
                }
                document.addEventListener('touchstart', (e)=>{
                    this.touch(e.targetTouches.length);
                });
                document.addEventListener('touchend', (e)=>{
                    this.touchAbort(e.targetTouches.length);
                });
                document.addEventListener('touchcancel', (e)=>{
                    this.touchAbort(e.targetTouches.length);
                });

                window.addEventListener('deviceorientation',(e)=>{
                    if(!this._isSquat){
                        let motion = 0;
                        switch(this._screenModeForMobile){
                            case 'PORTRAIT':
                                motion = Math.round(e.gamma);
                                break;    
                            case 'LANSCAPE':
                                motion = Math.round(e.beta);
                                break;                       
                        }
                        motion = motion * this._deviceDirection;
                        if(Math.abs(motion) >= 20 && this._canSpeedUpForMobile){
                            if(this._direction == Direction.Left && motion < 0){
                                this._canSpeedUpForMobile = false;
                                this.onSpeedUp();
                            }else if(this._direction == Direction.Right && motion > 0){
                                this._canSpeedUpForMobile = false;
                                this.onSpeedUp();
                            }
                        }else if(Math.abs(motion) < 20 && !this._canSpeedUpForMobile){
                            this.onAbortSpeedUp();
                            this._canSpeedUpForMobile = true;
                        }
                    }
                });
                window.addEventListener('orientationchange', (e)=>{
                    if (window.matchMedia("(orientation: portrait)").matches) {
                        this._screenModeForMobile = 'PORTRAIT';
                        this._deviceDirection = 1;
                    }
                    if (window.matchMedia("(orientation: landscape)").matches) {
                        this._screenModeForMobile = 'LANSCAPE';
                        if(window.orientation == 90){
                            this._deviceDirection = 1;
                        }else{
                            this._deviceDirection = -1;                            
                        }
                    }
                },false);

            } else {
                document.addEventListener('keydown', (e) => {
                    if (e.keyCode == 65 && !this._isSquat) {
                        this.onJump();
                    }
                    if (e.keyCode == 88 && !this._isSquat) {
                        this.onSpecialJump();
                    }

                    if (e.keyCode == 89 && !this._isSquat) {
                        this.onGrab();
                    }

                    if (e.keyCode == 66 && !this._isJumping && !this._isSquat) {
                        this.onSpeedUp();
                    }

                    if (e.keyCode == 40 && !this._isJumping) {
                        this.onSquat();
                    }

                });
                document.addEventListener('keyup', (e) => {
                    if (e.keyCode == 65) {
                        this.onAbortJump();
                    }
                    if (e.keyCode == 88) {
                        this.onAbortJump();
                    }
                    if (e.keyCode == 89) {
                        this.onAbortGrab();
                    }
                    if (e.keyCode == 66) {
                        this.onAbortSpeedUp();
                    }
                    if (e.keyCode == 40) {
                        this.onAbortSquat();
                    }
                });
            }
        }

        colors = ['','#000000','#ffffff','#520000','#8c5a18','#21318c','#ff4273','#b52963','#ffde73','#dea539','#ffd6c6','#ff736b','#84dece','#42849c'];
        cchars = [[[0,16],[0,16],[0,7,3,5,0,4],[0,5,3,2,6,3,8,1,6,1,3,1,0,3],[0,4,3,1,6,2,7,2,9,1,8,1,2,1,3,1,0,3],[0,3,3,1,7,1,6,1,7,2,1,6,0,2],[0,2,3,1,7,3,1,9,0,1],[0,2,3,1,10,1,1,3,11,1,1,1,11,1,1,1,11,1,0,4],[0,1,3,1,10,1,4,1,10,1,1,1,11,1,10,1,1,1,10,1,1,1,10,1,4,2,0,2],[0,1,3,1,11,1,4,1,10,1,1,2,10,7,4,1,0,1],[0,1,3,1,1,1,11,1,10,1,1,1,10,2,1,1,11,5,4,1,0,1],[0,2,1,2,11,2,10,1,1,7,0,2],[0,3,1,1,4,2,11,3,1,4,0,3],[0,4,3,1,7,1,4,4,5,1,0,5],[0,3,3,1,7,2,6,1,13,2,12,2,5,1,0,4],[0,3,3,1,4,3,13,1,2,2,12,1,2,1,5,1,0,3],[0,3,4,1,2,3,4,1,2,2,12,1,2,1,5,1,0,3],[0,3,4,1,2,2,4,1,13,3,12,2,5,1,0,3],[0,3,4,1,2,2,4,1,13,2,5,1,13,1,5,1,0,4],[0,4,4,4,1,1,4,1,1,1,0,5],[0,4,1,1,4,3,8,1,1,1,8,1,1,1,0,4],[0,4,1,8,0,4]],[[0,16],[0,7,3,5,0,4],[0,5,3,2,6,3,8,1,6,1,3,1,0,3],[0,4,3,1,6,2,7,2,9,1,8,1,2,1,3,1,0,3],[0,3,3,1,7,1,6,1,7,2,1,6,0,2],[0,2,3,1,7,3,1,9,0,1],[0,2,3,1,10,1,1,3,11,1,1,1,11,1,1,1,11,1,0,4],[0,1,3,1,10,1,4,1,10,1,1,1,11,1,10,1,1,1,10,1,1,1,10,1,4,2,0,2],[0,1,3,1,11,1,4,1,10,1,1,2,10,7,4,1,0,1],[0,1,3,1,1,1,11,1,10,1,1,1,10,2,1,1,11,5,4,1,0,1],[0,2,1,2,11,2,10,1,1,7,0,2],[0,3,1,1,4,2,11,3,1,4,0,3],[0,3,4,1,7,3,4,3,5,1,0,5],[0,3,4,4,13,2,12,2,5,1,0,4],[0,2,1,1,4,1,2,3,4,1,2,2,12,1,2,1,5,1,1,2,0,1],[0,1,1,1,3,1,4,1,2,2,4,2,2,2,12,1,2,1,1,1,8,1,1,2],[0,1,1,1,3,1,4,1,2,2,4,1,13,3,12,1,5,1,1,1,4,1,1,2],[0,1,1,1,3,1,1,1,4,2,13,4,5,1,1,1,4,1,1,2,0,1],[0,1,1,1,3,1,8,1,1,1,0,1,5,4,0,1,1,1,4,1,1,2,0,1],[0,2,1,2,0,8,1,2,0,2],[0,16],[0,16]],[[0,12,4,2,0,2],[0,11,4,1,2,2,4,1,0,1],[0,10,4,1,2,4,4,1],[0,7,3,5,2,3,4,1],[0,5,3,2,6,3,8,1,6,1,3,1,2,1,4,1,0,1],[0,4,3,1,6,2,7,2,9,1,8,1,2,1,3,1,4,2,0,1],[0,3,3,1,7,1,6,1,7,2,1,6,0,2],[0,2,3,1,7,3,1,9,0,1],[0,2,3,1,10,1,1,3,11,1,1,1,11,1,1,1,11,1,3,1,0,3],[0,1,3,1,10,1,4,1,10,1,1,1,11,1,10,1,1,1,10,1,1,1,10,1,4,2,0,2],[0,1,3,1,11,1,4,1,10,1,1,2,10,7,4,1,0,1],[0,1,3,1,1,1,11,1,10,1,1,1,10,2,1,1,11,5,4,1,0,1],[0,2,1,2,11,2,10,1,1,7,0,2],[0,1,4,3,7,1,4,1,11,3,1,4,0,3],[4,2,2,2,4,1,7,1,4,4,5,1,0,5],[4,1,2,4,4,1,7,1,13,2,12,2,5,1,0,4],[4,1,2,4,4,1,13,2,2,2,12,1,2,1,5,1,1,2,0,1],[0,1,4,1,2,2,4,1,13,3,2,2,12,1,2,1,1,1,8,1,1,2],[0,1,1,1,3,1,4,1,13,6,12,1,5,1,1,1,4,1,1,2],[0,1,1,1,3,1,5,3,13,4,5,1,1,1,4,1,1,2,0,1],[0,1,1,1,3,1,8,1,1,1,0,1,5,4,0,1,1,1,4,1,1,2,0,1],[0,2,1,2,0,8,1,2,0,2]],[[0,16],[0,7,3,5,0,4],[0,5,3,2,6,3,8,1,6,1,3,1,0,3],[0,4,3,1,6,2,7,2,9,1,8,1,2,1,3,1,0,3],[0,3,3,1,7,1,6,1,7,2,1,6,0,2],[0,2,3,1,7,3,1,9,0,1],[0,2,3,1,7,1,1,5,11,1,1,2,0,4],[0,1,3,1,7,2,1,2,10,6,0,4],[0,1,3,1,7,1,10,1,1,2,10,2,1,1,10,1,1,1,10,1,0,4],[0,1,3,1,10,1,4,1,10,1,1,1,10,2,1,1,10,1,1,1,10,1,4,2,0,2],[0,1,1,1,11,1,4,1,10,1,1,2,10,7,4,1,0,1],[0,2,1,1,11,2,1,1,10,2,1,1,11,5,4,1,0,1],[0,1,4,1,2,2,3,1,11,2,1,7,2,1,3,1],[4,1,2,4,3,1,11,3,1,4,2,2,3,1],[4,1,2,4,3,1,4,4,5,1,4,1,2,1,1,2,0,1],[0,1,4,1,2,2,3,1,13,4,12,2,5,1,1,1,8,1,1,2],[0,1,1,1,3,2,5,1,13,3,2,2,12,1,2,1,1,1,4,1,1,2],[0,1,1,1,4,2,5,1,13,3,2,2,12,1,2,1,1,1,4,1,1,2],[0,1,1,1,4,1,8,1,5,2,13,4,12,1,5,1,1,1,4,1,1,2],[0,2,1,2,0,1,5,2,13,3,5,1,0,2,1,2,0,1],[0,6,5,4,0,6],[0,16]],[[0,16],[0,16],[0,7,3,5,0,4],[0,5,3,2,6,3,8,1,6,1,3,1,0,3],[0,4,3,1,6,2,7,2,9,1,8,1,2,1,3,1,0,3],[0,3,3,1,7,1,6,1,7,2,1,6,0,2],[0,2,3,1,7,3,1,9,0,1],[0,2,3,1,10,1,1,3,11,1,1,1,11,1,1,1,11,1,0,4],[0,1,3,1,10,1,4,1,10,1,1,1,11,1,10,1,1,1,10,1,1,1,10,1,4,2,0,2],[0,1,3,1,11,1,4,1,10,1,1,2,10,7,4,1,0,1],[0,1,3,1,1,1,11,1,10,1,1,1,10,2,1,1,11,5,4,1,0,1],[0,2,1,2,11,2,10,1,1,7,0,2],[4,6,11,3,1,4,0,3],[4,1,2,3,4,1,7,1,4,4,5,1,0,5],[0,1,4,1,2,2,4,1,7,2,13,2,12,2,5,1,0,4],[0,2,4,2,7,2,13,2,2,2,12,1,2,1,5,1,0,3],[0,3,5,1,13,4,2,2,12,1,2,1,5,1,0,3],[0,3,5,1,13,6,12,2,5,1,0,3],[0,3,5,2,13,4,5,1,13,1,5,1,0,4],[0,4,4,4,1,1,4,1,1,1,0,5],[0,4,1,1,4,3,8,1,1,1,8,1,1,1,0,4],[0,4,1,8,0,4]],[[0,16],[0,7,3,5,0,4],[0,5,3,2,6,3,8,1,6,1,3,1,0,3],[0,4,3,1,6,2,7,2,9,1,8,1,2,1,3,1,0,3],[0,3,3,1,7,1,6,1,7,2,1,6,0,2],[0,2,3,1,7,3,1,9,0,1],[0,2,3,1,10,1,1,3,11,1,1,1,11,1,1,1,11,1,0,4],[0,1,3,1,10,1,4,1,10,1,1,1,11,1,10,1,1,1,10,1,1,1,10,1,4,2,0,2],[0,1,3,1,11,1,4,1,10,1,1,2,10,7,4,1,0,1],[0,1,3,1,1,1,11,1,10,1,1,1,10,2,1,1,11,5,4,1,0,1],[0,2,1,2,11,2,10,1,1,7,0,2],[4,6,11,3,1,4,0,3],[4,1,2,3,4,1,7,1,4,4,5,1,0,5],[0,1,4,1,2,2,4,1,7,1,13,3,12,2,5,1,0,4],[0,2,4,2,7,2,13,2,2,2,12,1,2,1,5,1,1,2,0,1],[0,1,1,1,3,2,13,4,2,2,12,1,2,1,1,1,8,1,1,2],[0,1,1,1,3,2,13,6,12,1,5,1,1,1,4,1,1,2],[0,1,1,1,3,1,1,1,5,2,13,4,5,1,1,1,4,1,1,2,0,1],[0,1,1,1,3,1,8,1,1,1,0,1,5,4,0,1,1,1,4,1,1,2,0,1],[0,2,1,2,0,8,1,2,0,2],[0,16],[0,16]],[[0,16],[0,5,3,5,0,6],[0,4,3,1,6,1,8,1,6,3,3,2,0,4],[0,4,3,1,2,1,8,2,7,4,3,1,0,3],[0,3,1,6,7,4,3,1,0,2],[0,2,1,9,7,3,3,1,0,1],[0,4,11,5,1,4,7,1,3,1,0,1],[0,4,10,1,1,1,10,1,1,1,10,1,11,1,1,2,10,1,7,2,3,1],[0,2,4,2,10,1,1,1,10,1,1,1,10,2,1,1,10,1,4,1,10,1,7,1,3,1],[0,1,4,1,10,7,1,2,10,1,4,1,11,1,7,1,3,1],[0,1,4,1,11,5,1,1,10,2,1,1,10,1,11,1,1,1,3,1,0,1],[0,2,1,6,4,3,11,1,1,2,7,1,3,1],[0,3,1,4,4,1,2,2,4,2,1,1,2,1,7,1,3,1],[0,4,3,1,7,2,2,4,4,1,2,3,4,1],[0,4,5,1,3,2,2,4,4,1,2,3,4,1],[0,4,5,1,13,1,3,3,2,1,4,3,2,1,4,1,0,1],[0,4,5,1,13,1,4,1,8,1,4,2,13,1,2,2,4,1,0,2],[0,5,1,1,4,2,1,2,13,3,5,1,0,2],[0,5,1,1,4,1,1,3,5,1,13,3,5,1,0,1],[0,6,1,3,0,2,1,1,4,2,1,1,0,1],[0,11,1,1,4,2,8,1,1,1],[0,11,1,5]],[[0,16],[0,16],[0,7,3,5,0,4],[0,5,3,2,6,3,8,1,6,1,3,1,0,3],[0,4,3,1,6,2,7,2,9,1,8,1,2,1,3,1,0,3],[0,3,3,1,7,1,6,1,7,2,1,6,0,2],[0,2,3,1,7,3,1,9,0,1],[0,2,3,1,10,1,1,3,11,1,1,1,11,1,1,1,11,1,0,4],[0,1,3,1,10,1,4,1,10,1,1,1,11,1,10,1,1,1,10,1,1,1,10,1,4,2,0,2],[0,1,3,1,11,1,4,1,10,1,1,2,10,7,4,1,0,1],[0,1,3,1,1,1,11,1,10,1,1,1,10,2,1,1,11,5,4,1,0,1],[0,2,1,2,11,2,10,1,1,7,0,2],[0,3,1,1,4,2,11,3,1,4,0,3],[0,1,1,2,4,9,0,4],[1,1,8,1,4,1,2,3,4,1,7,1,4,1,12,1,5,1,0,5],[0,1,1,1,4,2,2,2,4,1,7,1,4,1,12,2,5,1,0,4],[0,3,5,1,4,3,2,2,12,1,2,1,5,1,0,4],[0,3,1,2,13,3,2,1,12,1,2,1,5,1,0,4],[0,2,1,1,4,2,5,1,13,4,5,1,0,5],[0,2,1,1,4,3,5,1,13,1,5,2,0,6],[0,2,1,1,8,1,1,2,5,3,0,7],[0,3,1,1,0,12]],[[0,16],[0,16],[0,16],[0,16],[0,16],[0,16],[0,16],[0,16],[0,5,3,4,0,7],[0,3,3,2,6,4,3,2,0,5],[0,2,3,1,6,5,7,1,6,2,3,1,0,4],[0,1,3,1,7,2,3,2,6,1,7,1,6,2,8,1,6,1,3,1,0,3],[0,1,3,1,7,1,3,1,2,2,3,1,7,2,9,1,8,1,2,1,3,1,0,3],[0,1,3,2,2,4,3,1,7,1,6,1,1,4,0,2],[0,1,5,1,3,1,2,4,3,1,1,7,0,1],[5,1,13,1,1,1,3,4,7,1,10,6,4,1,0,1],[5,1,13,1,3,1,7,3,3,1,12,1,1,1,11,5,4,1,0,1],[5,1,13,1,3,1,7,2,3,1,13,2,5,1,1,5,0,2],[5,1,13,2,3,2,13,1,5,2,12,1,5,1,1,3,0,3],[5,2,13,2,5,2,4,1,1,1,4,1,1,1,0,6],[0,1,5,3,4,3,8,1,1,1,8,1,1,1,0,5],[0,4,1,7,0,5]],[[0,6,3,4,0,6],[0,4,3,2,6,1,8,2,6,1,3,2,0,4],[0,3,3,1,6,2,2,1,8,2,2,1,6,2,3,1,0,3],[0,2,3,1,6,3,1,4,6,3,3,1,0,2],[0,2,3,1,6,1,1,8,6,1,3,1,0,2],[0,2,3,1,1,10,3,1,0,2],[0,3,3,1,1,1,6,1,1,1,6,2,1,1,6,1,1,1,3,1,0,3],[0,2,1,2,6,8,1,2,0,2],[0,3,1,1,6,8,1,1,0,3],[0,2,1,2,6,1,11,1,1,1,11,2,1,1,11,1,6,1,1,2,0,2],[0,1,4,1,10,1,1,1,11,2,2,4,11,2,1,1,10,1,4,1,0,1],[0,1,4,1,10,1,1,2,10,6,1,2,10,1,4,1,0,1],[0,1,4,1,11,1,1,1,10,1,1,1,11,4,1,1,10,1,1,1,11,1,4,1,0,1],[4,1,2,1,4,1,10,1,1,8,10,1,4,1,0,2],[4,1,2,2,4,1,10,3,3,2,10,3,4,3,0,1],[0,1,4,1,6,2,4,2,10,1,7,2,10,1,4,2,6,1,2,2,4,1],[0,1,4,1,3,1,6,1,5,1,4,1,10,1,6,2,10,1,4,1,1,3,2,1,4,1],[0,3,5,1,12,2,4,1,10,2,4,1,2,1,1,4,0,1],[0,3,5,1,12,1,2,2,4,2,2,2,1,4,0,1],[0,2,1,3,2,2,13,3,5,1,1,4,0,1],[0,1,1,1,8,1,4,2,1,1,5,4,0,1,1,4,0,1],[0,1,1,4,4,1,1,1,0,5,1,2,0,2],[0,4,1,3,0,9]],[[0,16],[0,7,3,4,0,5],[0,5,3,2,6,1,8,2,6,1,3,2,0,3],[1,2,0,1,1,2,6,2,2,1,8,2,2,1,6,2,3,1,0,2],[1,1,2,1,1,1,2,1,1,1,6,2,1,4,6,3,3,1,0,1],[0,1,1,1,2,2,1,9,6,1,3,1,0,1],[1,1,2,1,1,3,11,2,1,1,11,2,1,1,11,2,1,1,3,1,0,1],[1,3,2,1,1,1,10,2,1,1,10,2,1,1,10,2,1,1,4,1,0,1],[1,1,2,1,1,1,2,1,1,2,10,6,1,2,10,1,4,1],[0,1,1,3,3,1,10,1,1,1,11,4,1,1,10,1,4,1,11,1,4,1],[0,1,3,1,7,1,6,1,3,1,11,1,1,6,11,1,4,2,0,1],[0,2,3,1,7,1,6,1,4,1,11,1,1,4,11,1,4,1,7,2,4,1],[0,2,3,1,7,1,6,1,3,1,4,6,7,1,4,3],[0,3,3,1,6,1,5,1,12,5,7,2,2,2,4,1],[0,4,5,1,13,1,12,1,2,2,12,2,2,1,4,1,2,2,4,1],[0,4,5,1,13,2,2,2,12,2,2,1,5,1,4,2,0,1],[0,3,5,1,13,5,12,4,5,1,0,2],[0,3,5,1,13,7,12,2,5,1,0,2],[0,2,5,1,13,10,5,1,0,2],[0,1,1,1,4,3,5,6,4,3,1,1,0,1],[1,1,4,1,8,1,4,1,1,1,0,6,1,1,4,1,8,1,4,1,1,1],[1,4,0,8,1,4]],[[0,16],[0,16],[0,7,3,5,0,4],[0,5,3,2,6,3,8,1,6,1,3,1,0,3],[0,4,3,1,6,2,7,2,9,1,8,1,2,1,3,1,0,3],[0,3,3,1,7,1,6,1,7,2,1,6,0,2],[0,2,3,1,7,3,1,9,0,1],[0,2,3,1,10,1,1,3,11,1,1,1,11,1,1,1,11,1,0,4],[0,1,3,1,10,1,4,1,10,1,1,1,11,1,10,1,1,1,10,1,1,1,10,1,4,2,0,2],[0,1,3,1,11,1,4,1,10,1,1,2,10,7,4,1,0,1],[0,1,3,1,1,1,11,1,10,1,1,1,10,2,1,1,11,5,4,1,0,1],[0,2,1,2,11,2,10,1,1,7,0,2],[0,3,1,1,4,2,11,3,1,4,0,3],[0,2,4,1,6,3,4,4,5,1,0,5],[0,1,4,2,6,2,7,1,13,2,12,3,5,1,0,1,1,2,0,1],[4,1,2,2,4,1,7,1,13,2,2,2,12,1,2,2,5,1,8,1,1,2],[4,1,2,3,4,1,13,2,2,2,12,1,2,2,1,1,4,1,1,2],[4,1,2,2,4,1,5,1,13,4,12,3,1,1,4,1,1,2],[0,1,4,2,0,2,5,1,13,3,5,3,1,1,4,1,1,2],[0,4,1,1,4,3,1,1,0,4,1,2,0,1],[0,4,1,1,4,3,8,1,1,1,0,6],[0,4,1,6,0,6]],[[0,16],[0,16],[0,6,3,4,0,6],[0,4,3,2,6,1,8,2,6,1,3,2,0,4],[0,3,3,1,6,2,8,3,2,1,6,2,3,1,0,3],[0,2,3,1,7,3,1,4,6,3,3,1,0,2],[0,2,3,1,7,1,1,8,6,1,3,1,0,2],[0,2,4,1,1,1,11,2,1,1,11,2,1,1,11,2,1,1,4,1,0,2],[0,1,4,1,10,1,1,1,10,2,1,1,10,2,1,1,10,2,1,1,10,1,4,1,0,1],[0,1,4,1,11,1,1,2,10,6,1,2,11,1,4,1,0,1],[0,2,4,1,1,1,10,1,1,1,11,4,1,1,10,1,1,1,4,1,0,2],[0,3,4,1,11,1,1,6,11,1,4,1,0,3],[0,4,4,1,11,1,1,4,11,1,4,1,0,4],[0,3,3,1,7,1,4,6,6,1,3,1,0,3],[0,2,3,1,7,2,13,1,12,5,7,1,6,1,3,1,0,2],[0,2,4,1,7,1,13,1,2,2,12,2,2,2,12,1,7,1,4,1,0,2],[0,1,4,1,2,1,4,1,13,1,2,2,12,2,2,2,12,1,4,1,2,1,4,1,0,1],[0,1,4,1,2,1,4,1,13,4,12,4,4,1,2,1,4,1,0,1],[0,2,4,2,5,1,13,2,5,2,13,2,5,1,4,2,0,2],[0,4,1,1,4,6,1,1,0,4],[0,3,1,1,4,1,8,1,4,1,1,2,4,1,8,1,4,1,1,1,0,3],[0,3,1,10,0,3]],[[0,16],[0,16],[0,6,3,4,0,6],[0,4,3,2,6,4,3,2,0,4],[0,3,3,1,6,8,3,1,0,3],[0,2,3,1,6,10,3,1,0,2],[0,2,3,1,7,1,6,9,3,1,0,2],[0,2,4,1,7,1,6,8,7,1,4,1,0,2],[0,2,4,1,3,1,7,2,6,4,7,2,3,1,4,1,0,2],[0,1,4,1,10,1,1,1,3,2,7,4,3,2,1,1,10,1,4,1,0,1],[0,1,4,1,11,1,1,3,3,4,1,3,11,1,4,1,0,1],[0,2,4,2,1,8,4,2,0,2],[0,4,11,1,1,6,11,1,0,4],[0,3,3,2,12,2,1,2,12,2,3,2,0,3],[0,2,3,1,7,1,5,1,12,2,8,2,12,2,5,1,7,1,3,1,0,2],[0,2,3,1,5,1,12,8,5,1,3,1,0,2],[0,2,3,1,5,3,12,4,5,3,3,1,0,2],[0,3,5,1,12,2,5,1,12,2,5,1,13,2,5,1,0,3],[0,4,5,1,13,1,5,4,13,1,5,1,0,4],[0,4,1,1,4,6,1,1,0,4],[0,3,1,1,4,3,1,2,4,3,1,1,0,3],[0,3,1,10,0,3]],[[0,16],[0,16],[0,16],[0,16],[0,16],[0,16],[0,7,3,5,0,4],[0,5,3,2,6,3,8,1,6,1,3,1,0,3],[0,4,3,1,6,2,7,2,8,2,2,1,3,1,0,3],[0,3,3,1,6,2,7,2,1,6,0,2],[0,2,3,1,7,3,1,9,0,1],[0,2,3,1,10,1,1,3,11,1,1,1,11,1,1,1,11,1,0,4],[0,1,3,1,10,1,4,1,10,1,1,1,11,1,10,1,1,1,10,1,1,1,10,1,0,4],[0,1,3,1,11,1,4,1,10,1,1,2,10,7,4,1,0,1],[0,1,3,1,1,1,11,2,1,1,10,2,1,1,11,5,4,1,0,1],[5,1,13,4,11,2,1,7,0,2],[5,1,13,5,3,1,6,3,4,4,0,2],[5,1,13,3,5,2,3,1,7,2,6,2,3,1,2,1,4,3],[5,1,13,6,3,2,7,2,3,1,2,3,4,1],[0,1,5,1,13,2,1,1,4,3,1,1,3,3,2,3,4,1],[0,2,5,2,1,1,4,3,8,1,1,1,8,1,1,1,4,3,0,1],[0,4,1,8,0,4]],[[0,16],[0,16],[0,7,3,5,0,4],[0,5,3,2,6,3,8,1,6,1,3,1,0,3],[0,4,3,1,6,2,7,2,9,1,8,1,2,1,3,1,0,3],[0,3,3,1,7,1,6,1,7,2,1,6,0,2],[0,2,3,1,7,3,1,9,0,1],[0,2,3,1,10,1,1,3,11,1,1,1,11,1,1,1,11,1,0,4],[0,1,3,1,10,1,4,1,10,1,1,1,11,1,10,1,1,1,10,1,1,1,10,1,4,2,0,2],[0,1,3,1,11,1,4,1,10,1,1,2,10,7,4,1,0,1],[0,1,3,1,1,1,11,1,10,1,1,1,10,2,1,1,11,5,4,1,0,1],[0,2,1,2,11,2,10,1,1,7,0,2],[0,3,1,1,4,2,11,3,1,2,4,3,0,2],[0,4,5,1,13,1,4,5,3,1,2,1,4,3],[0,3,5,1,13,2,3,1,6,4,3,1,2,3,4,1],[0,3,5,1,13,2,3,1,7,4,3,1,2,3,4,1],[0,3,5,1,13,3,3,5,4,3,0,1],[0,3,5,1,13,6,12,2,5,1,0,3],[0,3,5,1,13,5,5,1,13,1,5,1,0,4],[0,4,5,1,4,3,1,1,4,1,1,1,0,5],[0,4,1,1,4,3,8,1,1,1,8,1,1,1,0,4],[0,4,1,8,0,4]],[[0,16],[0,7,3,5,0,4],[0,5,3,2,6,3,8,1,6,1,3,1,0,3],[0,4,3,1,6,2,7,2,9,1,8,1,2,1,3,1,0,3],[0,3,3,1,7,1,6,1,7,2,1,6,0,2],[0,2,3,1,7,3,1,9,0,1],[0,2,3,1,10,1,1,3,11,1,1,1,11,1,1,1,11,1,0,4],[0,1,3,1,10,1,4,1,10,1,1,1,11,1,10,1,1,1,10,1,1,1,10,1,4,2,0,2],[0,1,3,1,11,1,4,1,10,1,1,2,10,7,4,1,0,1],[0,1,3,1,1,1,11,1,10,1,1,1,10,2,1,1,11,5,4,1,0,1],[0,2,1,2,11,2,10,1,1,7,0,2],[0,3,1,1,4,1,11,4,1,2,4,3,0,2],[0,4,5,1,4,6,3,1,2,1,4,3],[0,3,5,2,13,1,3,1,6,4,3,1,2,3,4,1],[0,2,1,1,5,1,13,2,3,1,7,4,3,1,2,3,4,1],[0,1,1,1,4,1,5,1,13,3,3,5,4,3,1,1],[0,1,1,1,4,1,5,1,13,6,12,1,5,1,1,1,4,1,1,2],[0,1,1,1,4,1,1,1,5,2,13,4,5,1,1,1,4,1,1,2,0,1],[0,1,1,1,4,1,8,1,1,1,0,1,5,4,0,1,1,1,4,1,1,2,0,1],[0,2,1,2,0,8,1,2,0,2],[0,16],[0,16]]];
        chars = null;
/*
        chars = [[
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 0, 0, 0],
            [ 0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [ 0, 0, 3,10, 1, 1, 1,11, 1,11, 1,11, 0, 0, 0, 0],
            [ 0, 3,10, 4,10, 1,11,10, 1,10, 1,10, 4, 4, 0, 0],
            [ 0, 3,11, 4,10, 1, 1,10,10,10,10,10,10,10, 4, 0],
            [ 0, 3, 1,11,10, 1,10,10, 1,11,11,11,11,11, 4, 0],
            [ 0, 0, 1, 1,11,11,10, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 0, 0, 1, 4, 4,11,11,11, 1, 1, 1, 1, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 7, 4, 4, 4, 4, 5, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 3, 7, 7, 6,13,13,12,12, 5, 0, 0, 0, 0],
            [ 0, 0, 0, 3, 4, 4, 4,13, 2, 2,12, 2, 5, 0, 0, 0],
            [ 0, 0, 0, 4, 2, 2, 2, 4, 2, 2,12, 2, 5, 0, 0, 0],
            [ 0, 0, 0, 4, 2, 2, 4,13,13,13,12,12, 5, 0, 0, 0],
            [ 0, 0, 0, 4, 2, 2, 4,13,13, 5,13, 5, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 4, 4, 4, 4, 1, 4, 1, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 1, 4, 4, 4, 8, 1, 8, 1, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
        ], [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 0, 0, 0],
            [ 0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [ 0, 0, 3,10, 1, 1, 1,11, 1,11, 1,11, 0, 0, 0, 0],
            [ 0, 3,10, 4,10, 1,11,10, 1,10, 1,10, 4, 4, 0, 0],
            [ 0, 3,11, 4,10, 1, 1,10,10,10,10,10,10,10, 4, 0],
            [ 0, 3, 1,11,10, 1,10,10, 1,11,11,11,11,11, 4, 0],
            [ 0, 0, 1, 1,11,11,10, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 0, 0, 1, 4, 4,11,11,11, 1, 1, 1, 1, 0, 0, 0],
            [ 0, 0, 0, 4, 7, 7, 7, 4, 4, 4, 5, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 4, 4, 4, 4,13,13,12,12, 5, 0, 0, 0, 0],
            [ 0, 0, 1, 4, 2, 2, 2, 4, 2, 2,12, 2, 5, 1, 1, 0],
            [ 0, 1, 3, 4, 2, 2, 4, 4, 2, 2,12, 2, 1, 8, 1, 1],
            [ 0, 1, 3, 4, 2, 2, 4,13,13,13,12, 5, 1, 4, 1, 1],
            [ 0, 1, 3, 1, 4, 4,13,13,13,13, 5, 1, 4, 1, 1, 0],
            [ 0, 1, 3, 8, 1, 0, 5, 5, 5, 5, 0, 1, 4, 1, 1, 0],
            [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],[
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 2, 4, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 2, 2, 2, 4],
            [ 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 2, 2, 2, 4],
            [ 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 2, 4, 0],
            [ 0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 4, 4, 0],
            [ 0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [ 0, 0, 3,10, 1, 1, 1,11, 1,11, 1,11, 3, 0, 0, 0],
            [ 0, 3,10, 4,10, 1,11,10, 1,10, 1,10, 4, 4, 0, 0],
            [ 0, 3,11, 4,10, 1, 1,10,10,10,10,10,10,10, 4, 0],
            [ 0, 3, 1,11,10, 1,10,10, 1,11,11,11,11,11, 4, 0],
            [ 0, 0, 1, 1,11,11,10, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 4, 4, 4, 7, 4,11,11,11, 1, 1, 1, 1, 0, 0, 0],
            [ 4, 4, 2, 2, 4, 7, 4, 4, 4, 4, 5, 0, 0, 0, 0, 0],
            [ 4, 2, 2, 2, 2, 4, 7,13,13,12,12, 5, 0, 0, 0, 0],
            [ 4, 2, 2, 2, 2, 4,13,13, 2, 2,12, 2, 5, 1, 1, 0],
            [ 0, 4, 2, 2, 4,13,13,13, 2, 2,12, 2, 1, 8, 1, 1],
            [ 0, 1, 3, 4,13,13,13,13,13,13,12, 5, 1, 4, 1, 1],
            [ 0, 1, 3, 5, 5, 5,13,13,13,13, 5, 1, 4, 1, 1, 0],
            [ 0, 1, 3, 8, 1, 0, 5, 5, 5, 5, 0, 1, 4, 1, 1, 0],
            [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0]
        ], [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 0, 0, 0],
            [ 0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [ 0, 0, 3, 7, 1, 1, 1, 1, 1,11, 1, 1, 0, 0, 0, 0],
            [ 0, 3, 7, 7, 1, 1,10,10,10,10,10,10, 0, 0, 0, 0],
            [ 0, 3, 7,10, 1, 1,10,10, 1,10, 1,10, 0, 0, 0, 0],
            [ 0, 3,10, 4,10, 1,10,10, 1,10, 1,10, 4, 4, 0, 0],
            [ 0, 1,11, 4,10, 1, 1,10,10,10,10,10,10,10, 4, 0],
            [ 0, 0, 1,11,11, 1,10,10, 1,11,11,11,11,11, 4, 0],
            [ 0, 4, 2, 2, 3,11,11, 1, 1, 1, 1, 1, 1, 1, 2, 3],
            [ 4, 2, 2, 2, 2, 3,11,11,11, 1, 1, 1, 1, 2, 2, 3],
            [ 4, 2, 2, 2, 2, 3, 4, 4, 4, 4, 5, 4, 2, 1, 1, 0],
            [ 0, 4, 2, 2, 3,13,13,13,13,12,12, 5, 1, 8, 1, 1],
            [ 0, 1, 3, 3, 5,13,13,13, 2, 2,12, 2, 1, 4, 1, 1],
            [ 0, 1, 4, 4, 5,13,13,13, 2, 2,12, 2, 1, 4, 1, 1],
            [ 0, 1, 4, 8, 5, 5,13,13,13,13,12, 5, 1, 4, 1, 1],
            [ 0, 0, 1, 1, 0, 5, 5,13,13,13, 5, 0, 0, 1, 1, 0],
            [ 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ], [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 0, 0, 0],
            [ 0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [ 0, 0, 3,10, 1, 1, 1,11, 1,11, 1,11, 0, 0, 0, 0],
            [ 0, 3,10, 4,10, 1,11,10, 1,10, 1,10, 4, 4, 0, 0],
            [ 0, 3,11, 4,10, 1, 1,10,10,10,10,10,10,10, 4, 0],
            [ 0, 3, 1,11,10, 1,10,10, 1,11,11,11,11,11, 4, 0],
            [ 0, 0, 1, 1,11,11,10, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 4, 4, 4, 4, 4, 4,11,11,11, 1, 1, 1, 1, 0, 0, 0],
            [ 4, 2, 2, 2, 4, 7, 4, 4, 4, 4, 5, 0, 0, 0, 0, 0],
            [ 0, 4, 2, 2, 4, 7, 7,13,13,12,12, 5, 0, 0, 0, 0],
            [ 0, 0, 4, 4, 7, 7,13,13, 2, 2,12, 2, 5, 0, 0, 0],
            [ 0, 0, 0, 5,13,13,13,13, 2, 2,12, 2, 5, 0, 0, 0],
            [ 0, 0, 0, 5,13,13,13,13,13,13,12,12, 5, 0, 0, 0],
            [ 0, 0, 0, 5, 5,13,13,13,13, 5,13, 5, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 4, 4, 4, 4, 1, 4, 1, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 1, 4, 4, 4, 8, 1, 8, 1, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
        ], [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 0, 0, 0],
            [ 0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [ 0, 0, 3,10, 1, 1, 1,11, 1,11, 1,11, 0, 0, 0, 0],
            [ 0, 3,10, 4,10, 1,11,10, 1,10, 1,10, 4, 4, 0, 0],
            [ 0, 3,11, 4,10, 1, 1,10,10,10,10,10,10,10, 4, 0],
            [ 0, 3, 1,11,10, 1,10,10, 1,11,11,11,11,11, 4, 0],
            [ 0, 0, 1, 1,11,11,10, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 4, 4, 4, 4, 4, 4,11,11,11, 1, 1, 1, 1, 0, 0, 0],
            [ 4, 2, 2, 2, 4, 7, 4, 4, 4, 4, 5, 0, 0, 0, 0, 0],
            [ 0, 4, 2, 2, 4, 7,13,13,13,12,12, 5, 0, 0, 0, 0],
            [ 0, 0, 4, 4, 7, 7,13,13, 2, 2,12, 2, 5, 1, 1, 0],
            [ 0, 1, 3, 3,13,13,13,13, 2, 2,12, 2, 1, 8, 1, 1],
            [ 0, 1, 3, 3,13,13,13,13,13,13,12, 5, 1, 4, 1, 1],
            [ 0, 1, 3, 1, 5, 5,13,13,13,13, 5, 1, 4, 1, 1, 0],
            [ 0, 1, 3, 8, 1, 0, 5, 5, 5, 5, 0, 1, 4, 1, 1, 0],
            [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ], [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 6, 8, 6, 6, 6, 3, 3, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 2, 8, 8, 7, 7, 7, 7, 3, 0, 0, 0],
            [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 7, 7, 7, 7, 3, 0, 0],
            [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 7, 7, 3, 0],
            [ 0, 0, 0, 0,11,11,11,11,11, 1, 1, 1, 1, 7, 3, 0],
            [ 0, 0, 0, 0,10, 1,10, 1,10,11, 1, 1,10, 7, 7, 3],
            [ 0, 0, 4, 4,10, 1,10, 1,10,10, 1,10, 4,10, 7, 3],
            [ 0, 4,10,10,10,10,10,10,10, 1, 1,10, 4,11, 7, 3],
            [ 0, 4,11,11,11,11,11, 1,10,10, 1,10,11, 1, 3, 0],
            [ 0, 0, 1, 1, 1, 1, 1, 1, 4, 4, 4,11, 1, 1, 7, 3],
            [ 0, 0, 0, 1, 1, 1, 1, 4, 2, 2, 4, 4, 1, 2, 7, 3],
            [ 0, 0, 0, 0, 3, 7, 7, 2, 2, 2, 2, 4, 2, 2, 2, 4],
            [ 0, 0, 0, 0, 5, 3, 3, 2, 2, 2, 2, 4, 2, 2, 2, 4],
            [ 0, 0, 0, 0, 5,13, 3, 3, 3, 2, 4, 4, 4, 2, 4, 0],
            [ 0, 0, 0, 0, 5,13, 4, 8, 4, 4,13, 2, 2, 4, 0, 0],
            [ 0, 0, 0, 0, 0, 1, 4, 4, 1, 1,13,13,13, 5, 0, 0],
            [ 0, 0, 0, 0, 0, 1, 4, 1, 1, 1, 5,13,13,13, 5, 0],
            [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 4, 4, 1, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 4, 8, 1],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1]
        ], [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 0, 0, 0],
            [ 0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [ 0, 0, 3,10, 1, 1, 1,11, 1,11, 1,11, 0, 0, 0, 0],
            [ 0, 3,10, 4,10, 1,11,10, 1,10, 1,10, 4, 4, 0, 0],
            [ 0, 3,11, 4,10, 1, 1,10,10,10,10,10,10,10, 4, 0],
            [ 0, 3, 1,11,10, 1,10,10, 1,11,11,11,11,11, 4, 0],
            [ 0, 0, 1, 1,11,11,10, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 0, 0, 1, 4, 4,11,11,11, 1, 1, 1, 1, 0, 0, 0],
            [ 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0],
            [ 1, 8, 4, 2, 2, 2, 4, 7, 4,12, 5, 0, 0, 0, 0, 0],
            [ 0, 1, 4, 4, 2, 2, 4, 7, 4,12,12, 5, 0, 0, 0, 0],
            [ 0, 0, 0, 5, 4, 4, 4, 2, 2,12, 2, 5, 0, 0, 0, 0],
            [ 0, 0, 0, 1, 1,13,13,13, 2,12, 2, 5, 0, 0, 0, 0],
            [ 0, 0, 1, 4, 4, 5,13,13,13,13, 5, 0, 0, 0, 0, 0],
            [ 0, 0, 1, 4, 4, 4, 5,13, 5, 5, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 1, 8, 1, 1, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],[
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 3, 3, 6, 6, 6, 6, 3, 3, 0, 0, 0, 0, 0],
            [ 0, 0, 3, 6, 6, 6, 6, 6, 7, 6, 6, 3, 0, 0, 0, 0],
            [ 0, 3, 7, 7, 3, 3, 6, 7, 6, 6, 8, 6, 3, 0, 0, 0],
            [ 0, 3, 7, 3, 2, 2, 3, 7, 7, 9, 8, 2, 3, 0, 0, 0],
            [ 0, 3, 3, 2, 2, 2, 2, 3, 7, 6, 1, 1, 1, 1, 0, 0],
            [ 0, 5, 3, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 0],
            [ 5,13, 1, 3, 3, 3, 3, 7,10,10,10,10,10,10, 4, 0],
            [ 5,13, 3, 7, 7, 7, 3,12, 1,11,11,11,11,11, 4, 0],
            [ 5,13, 3, 7, 7, 3,13,13, 5, 1, 1, 1, 1, 1, 0, 0],
            [ 5,13,13, 3, 3,13, 5, 5,12, 5, 1, 1, 1, 0, 0, 0],
            [ 5, 5,13,13, 5, 5, 4, 1, 4, 1, 0, 0, 0, 0, 0, 0],
            [ 0, 5, 5, 5, 4, 4, 4, 8, 1, 8, 1, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]            
        ], [
            [ 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 3, 6, 8, 8, 6, 3, 3, 0, 0, 0, 0],
            [ 0, 0, 0, 3, 6, 6, 2, 8, 8, 2, 6, 6, 3, 0, 0, 0],
            [ 0, 0, 3, 6, 6, 6, 1, 1, 1, 1, 6, 6, 6, 3, 0, 0],
            [ 0, 0, 3, 6, 1, 1, 1, 1, 1, 1, 1, 1, 6, 3, 0, 0],
            [ 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0],
            [ 0, 0, 0, 3, 1, 6, 1, 6, 6, 1, 6, 1, 3, 0, 0, 0],
            [ 0, 0, 1, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 1, 0, 0],
            [ 0, 0, 0, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 0, 0, 0],
            [ 0, 0, 1, 1, 6,11, 1,11,11, 1,11, 6, 1, 1, 0, 0],
            [ 0, 4,10, 1,11,11, 2, 2, 2, 2,11,11, 1,10, 4, 0],
            [ 0, 4,10, 1, 1,10,10,10,10,10,10, 1, 1,10, 4, 0],
            [ 0, 4,11, 1,10, 1,11,11,11,11, 1,10, 1,11, 4, 0],
            [ 4, 2, 4,10, 1, 1, 1, 1, 1, 1, 1, 1,10, 4, 0, 0],
            [ 4, 2, 2, 4,10,10,10, 3, 3,10,10,10, 4, 4, 4, 0],
            [ 0, 4, 6, 6, 4, 4,10, 7, 7,10, 4, 4, 6, 2, 2, 4],
            [ 0, 4, 3, 6, 5, 4,10, 6, 6,10, 4, 1, 1, 1, 2, 4],
            [ 0, 0, 0, 5,12,12, 4,10,10, 4, 2, 1, 1, 1, 1, 0],
            [ 0, 0, 0, 5,12, 2, 2, 4, 4, 2, 2, 1, 1, 1, 1, 0],
            [ 0, 0, 1, 1, 1, 2, 2,13,13,13, 5, 1, 1, 1, 1, 0],
            [ 0, 1, 8, 4, 4, 1, 5, 5, 5, 5, 0, 1, 1, 1, 1, 0],
            [ 0, 1, 1, 1, 1, 4, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0],
            [ 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]            
        ], [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 3, 3, 6, 8, 8, 6, 3, 3, 0, 0, 0],
            [ 1, 1, 0, 1, 1, 6, 6, 2, 8, 8, 2, 6, 6, 3, 0, 0],
            [ 1, 2, 1, 2, 1, 6, 6, 1, 1, 1, 1, 6, 6, 6, 3, 0],
            [ 0, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 3, 0],
            [ 1, 2, 1, 1, 1,11,11, 1,11,11, 1,11,11, 1, 3, 0],
            [ 1, 1, 1, 2, 1,10,10, 1,10,10, 1,10,10, 1, 4, 0],
            [ 1, 2, 1, 2, 1, 1,10,10,10,10,10,10, 1, 1,10, 4],
            [ 0, 1, 1, 1, 3,10, 1,11,11,11,11, 1,10, 4,11, 4],
            [ 0, 3, 7, 6, 3,11, 1, 1, 1, 1, 1, 1,11, 4, 4, 0],
            [ 0, 0, 3, 7, 6, 4,11, 1, 1, 1, 1,11, 4, 7, 7, 4],
            [ 0, 0, 3, 7, 6, 3, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4],
            [ 0, 0, 0, 3, 6, 5,12,12,12,12,12, 7, 7, 2, 2, 4],
            [ 0, 0, 0, 0, 5,13,12, 2, 2,12,12, 2, 4, 2, 2, 4],
            [ 0, 0, 0, 0, 5,13,13, 2, 2,12,12, 2, 5, 4, 4, 0],
            [ 0, 0, 0, 5,13,13,13,13,13,12,12,12,12, 5, 0, 0],
            [ 0, 0, 0, 5,13,13,13,13,13,13,13,12,12, 5, 0, 0],
            [ 0, 0, 5,13,13,13,13,13,13,13,13,13,13, 5, 0, 0],
            [ 0, 1, 4, 4, 4, 5, 5, 5, 5, 5, 5, 4, 4, 4, 1, 0],
            [ 1, 4, 8, 4, 1, 0, 0, 0, 0, 0, 0, 1, 4, 8, 4, 1],
            [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]
        ], [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 0, 0, 0],
            [ 0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [ 0, 0, 3,10, 1, 1, 1,11, 1,11, 1,11, 0, 0, 0, 0],
            [ 0, 3,10, 4,10, 1,11,10, 1,10, 1,10, 4, 4, 0, 0],
            [ 0, 3,11, 4,10, 1, 1,10,10,10,10,10,10,10, 4, 0],
            [ 0, 3, 1,11,10, 1,10,10, 1,11,11,11,11,11, 4, 0],
            [ 0, 0, 1, 1,11,11,10, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 0, 0, 1, 4, 4,11,11,11, 1, 1, 1, 1, 0, 0, 0],
            [ 0, 0, 4, 6, 6, 6, 4, 4, 4, 4, 5, 0, 0, 0, 0, 0],
            [ 0, 4, 4, 6, 6, 7,13,13,12,12,12, 5, 0, 1, 1, 0],
            [ 4, 2, 2, 4, 7,13,13, 2, 2,12, 2, 2, 5, 8, 1, 1],
            [ 4, 2, 2, 2, 4,13,13, 2, 2,12, 2, 2, 1, 4, 1, 1],
            [ 4, 2, 2, 4, 5,13,13,13,13,12,12,12, 1, 4, 1, 1],
            [ 0, 4, 4, 0, 0, 5,13,13,13, 5, 5, 5, 1, 4, 1, 1],
            [ 0, 0, 0, 0, 1, 4, 4, 4, 1, 0, 0, 0, 0, 1, 1, 0],
            [ 0, 0, 0, 0, 1, 4, 4, 4, 8, 1, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0]
        ],[
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 3, 6, 8, 8, 6, 3, 3, 0, 0, 0, 0],
            [ 0, 0, 0, 3, 6, 6, 8, 8, 8, 2, 6, 6, 3, 0, 0, 0],
            [ 0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 6, 6, 6, 3, 0, 0],
            [ 0, 0, 3, 7, 1, 1, 1, 1, 1, 1, 1, 1, 6, 3, 0, 0],
            [ 0, 0, 4, 1,11,11, 1,11,11, 1,11,11, 1, 4, 0, 0],
            [ 0, 4,10, 1,10,10, 1,10,10, 1,10,10, 1,10, 4, 0],
            [ 0, 4,11, 1, 1,10,10,10,10,10,10, 1, 1,11, 4, 0],
            [ 0, 0, 4, 1,10, 1,11,11,11,11, 1,10, 1, 4, 0, 0],
            [ 0, 0, 0, 4,11, 1, 1, 1, 1, 1, 1,11, 4, 0, 0, 0],
            [ 0, 0, 0, 0, 4,11, 1, 1, 1, 1,11, 4, 0, 0, 0, 0],
            [ 0, 0, 0, 3, 7, 4, 4, 4, 4, 4, 4, 6, 3, 0, 0, 0],
            [ 0, 0, 3, 7, 7,13,12,12,12,12,12, 7, 6, 3, 0, 0],
            [ 0, 0, 4, 7,13, 2, 2,12,12, 2, 2,12, 7, 4, 0, 0],
            [ 0, 4, 2, 4,13, 2, 2,12,12, 2, 2,12, 4, 2, 4, 0],
            [ 0, 4, 2, 4,13,13,13,13,12,12,12,12, 4, 2, 4, 0],
            [ 0, 0, 4, 4, 5,13,13, 5, 5,13,13, 5, 4, 4, 0, 0],
            [ 0, 0, 0, 0, 1, 4, 4, 4, 4, 4, 4, 1, 0, 0, 0, 0],
            [ 0, 0, 0, 1, 4, 8, 4, 1, 1, 4, 8, 4, 1, 0, 0, 0],
            [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0]            
        ],[
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 3, 6, 6, 6, 6, 3, 3, 0, 0, 0, 0],
            [ 0, 0, 0, 3, 6, 6, 6, 6, 6, 6, 6, 6, 3, 0, 0, 0],
            [ 0, 0, 3, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 3, 0, 0],
            [ 0, 0, 3, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 3, 0, 0],
            [ 0, 0, 4, 7, 6, 6, 6, 6, 6, 6, 6, 6, 7, 4, 0, 0],
            [ 0, 0, 4, 3, 7, 7, 6, 6, 6, 6, 7, 7, 3, 4, 0, 0],
            [ 0, 4,10, 1, 3, 3, 7, 7, 7, 7, 3, 3, 1,10, 4, 0],
            [ 0, 4,11, 1, 1, 1, 3, 3, 3, 3, 1, 1, 1,11, 4, 0],
            [ 0, 0, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 0, 0],
            [ 0, 0, 0, 0,11, 1, 1, 1, 1, 1, 1,11, 0, 0, 0, 0],
            [ 0, 0, 0, 3, 3,12,12, 1, 1,12,12, 3, 3, 0, 0, 0],
            [ 0, 0, 3, 7, 5,12,12, 8, 8,12,12, 5, 7, 3, 0, 0],
            [ 0, 0, 3, 5,12,12,12,12,12,12,12,12, 5, 3, 0, 0],
            [ 0, 0, 3, 5, 5, 5,12,12,12,12, 5, 5, 5, 3, 0, 0],
            [ 0, 0, 0, 5,12,12, 5,12,12, 5,13,13, 5, 0, 0, 0],
            [ 0, 0, 0, 0, 5,13, 5, 5, 5, 5,13, 5, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 1, 4, 4, 4, 4, 4, 4, 1, 0, 0, 0, 0],
            [ 0, 0, 0, 1, 4, 4, 4, 1, 1, 4, 4, 4, 1, 0, 0, 0],
            [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0]            
        ],[
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 6, 6, 7, 7, 8, 8, 2, 3, 0, 0, 0],
            [ 0, 0, 0, 3, 6, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [ 0, 0, 3,10, 1, 1, 1,11, 1,11, 1,11, 0, 0, 0, 0],
            [ 0, 3,10, 4,10, 1,11,10, 1,10, 1,10, 0, 0, 0, 0],
            [ 0, 3,11, 4,10, 1, 1,10,10,10,10,10,10,10, 4, 0],
            [ 0, 3, 1,11,11, 1,10,10, 1,11,11,11,11,11, 4, 0],
            [ 5,13,13,13,13,11,11, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 5,13,13,13,13,13, 3, 6, 6, 6, 4, 4, 4, 4, 0, 0],
            [ 5,13,13,13, 5, 5, 3, 7, 7, 6, 6, 3, 2, 4, 4, 4],
            [ 5,13,13,13,13,13,13, 3, 3, 7, 7, 3, 2, 2, 2, 4],
            [ 0, 5,13,13, 1, 4, 4, 4, 1, 3, 3, 3, 2, 2, 2, 4],
            [ 0, 0, 5, 5, 1, 4, 4, 4, 8, 1, 8, 1, 4, 4, 4, 0],
            [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]            
        ],[
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 0, 0, 0],
            [ 0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [ 0, 0, 3,10, 1, 1, 1,11, 1,11, 1,11, 0, 0, 0, 0],
            [ 0, 3,10, 4,10, 1,11,10, 1,10, 1,10, 4, 4, 0, 0],
            [ 0, 3,11, 4,10, 1, 1,10,10,10,10,10,10,10, 4, 0],
            [ 0, 3, 1,11,10, 1,10,10, 1,11,11,11,11,11, 4, 0],
            [ 0, 0, 1, 1,11,11,10, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 0, 0, 1, 4, 4,11,11,11, 1, 1, 4, 4, 4, 0, 0],
            [ 0, 0, 0, 0, 5,13, 4, 4, 4, 4, 4, 3, 2, 4, 4, 4],
            [ 0, 0, 0, 5,13,13, 3, 6, 6, 6, 6, 3, 2, 2, 2, 4],
            [ 0, 0, 0, 5,13,13, 3, 7, 7, 7, 7, 3, 2, 2, 2, 4],
            [ 0, 0, 0, 5,13,13,13, 3, 3, 3, 3, 3, 4, 4, 4, 0],
            [ 0, 0, 0, 5,13,13,13,13,13,13,12,12, 5, 0, 0, 0],
            [ 0, 0, 0, 5,13,13,13,13,13, 5,13, 5, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 5, 4, 4, 4, 1, 4, 1, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 1, 4, 4, 4, 8, 1, 8, 1, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
        ],[
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 0, 0, 0],
            [ 0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [ 0, 0, 3,10, 1, 1, 1,11, 1,11, 1,11, 0, 0, 0, 0],
            [ 0, 3,10, 4,10, 1,11,10, 1,10, 1,10, 4, 4, 0, 0],
            [ 0, 3,11, 4,10, 1, 1,10,10,10,10,10,10,10, 4, 0],
            [ 0, 3, 1,11,10, 1,10,10, 1,11,11,11,11,11, 4, 0],
            [ 0, 0, 1, 1,11,11,10, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 0, 0, 1, 4,11,11,11,11, 1, 1, 4, 4, 4, 0, 0],
            [ 0, 0, 0, 0, 5, 4, 4, 4, 4, 4, 4, 3, 2, 4, 4, 4],
            [ 0, 0, 0, 5, 5,13, 3, 6, 6, 6, 6, 3, 2, 2, 2, 4],
            [ 0, 0, 1, 5,13,13, 3, 7, 7, 7, 7, 3, 2, 2, 2, 4],
            [ 0, 1, 4, 5,13,13,13, 3, 3, 3, 3, 3, 4, 4, 4, 1],
            [ 0, 1, 4, 5,13,13,13,13,13,13,12, 5, 1, 4, 1, 1],
            [ 0, 1, 4, 1, 5, 5,13,13,13,13, 5, 1, 4, 1, 1, 0],
            [ 0, 1, 4, 8, 1, 0, 5, 5, 5, 5, 0, 1, 4, 1, 1, 0],
            [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]];
*/
    }
}

