namespace Character {

    enum HitStatus{
        none,
        dammage,
        attack
    }

    export class Mario extends AbstractCharacter{
        private static STEP = 2;
        private static DEFAULT_SPEED = 2;
        private _runIndex = 0;
        private _currentStep = Mario.STEP;

        isEnemy = false;
        useVertical = false;

        private _yVector = 0;
        private _jumpPower = 18;
        private _speed = Mario.DEFAULT_SPEED;
        private _gameOverWaitCount = 0;


        private _speedUpTimer = null;
        private _speedDownTimer = null;
        private _squatTimer = null;
        private _gameOverTimer = null;

        private _isJumping = false;
        private _isBraking = false;
        private _isSquat = false;
        private _attackDirection = 1;


        onAction(): void {
            switch (this.doHitTest()) {
                case HitStatus.dammage:
                    this.gameOver();
                    break;
                case HitStatus.attack:
                    this.draw(11, null, this._attackDirection >= 0 ? false : true, false, true);
                    this.stop();
                    let waitTimer = setTimeout(() => {
                        this.start();
                    }, this.frameInterval * 3);
                    break;
                default:
                    let actionIndex = this.executeRun();
                    actionIndex = this.executeJump() || actionIndex;
                    this.draw(actionIndex, null, this._isReverse, false, true);
            }
        }

        private doHitTest(): HitStatus {
            if (this._gameMaster) {
                let enemys = this._gameMaster.getEnemys();
                for (let name in enemys) {
                    if (!enemys[name].isKilled()) {
                        let ePos = enemys[name].getPosition();
                        let eSize = enemys[name].getCharSize()
                        if (this.position.y > ePos.y + eSize.height)
                            continue;
                        if (ePos.y > this.position.y + this.charHeight)
                            continue;
                        if (this.position.x > ePos.x + eSize.width)
                            continue;
                        if (ePos.x > this.position.x + this.charWidth)
                            continue;

                        if (enemys[name].isStepped()) {
                            let playerCenter = this.position.x + this.charWidth / 2;
                            let enemyCenter = ePos.x + eSize.width / 2;
                            this._attackDirection = playerCenter <= enemyCenter ? 1 : -1;
                            enemys[name].onKicked(this._attackDirection, this._speed * 3);
                            return HitStatus.attack;
                        }

                        if (this._isJumping && this._yVector < 0) {
                            enemys[name].onStepped();
                            this._yVector = 12 * this.pixSize;
                            continue;
                        }
                        return HitStatus.dammage;
                    }
                }
            }
            return HitStatus.none;
        }

        private executeJump(): number {
            if (this._isJumping) {
                this._yVector -= this._gravity * this.pixSize;
                this.position.y = this.position.y + this._yVector;
                if (this.position.y <= 0) {
                    this._isJumping = false;
                    this._yVector = 0;
                    this.position.y = 0;
                    return null;
                } else {
                    if (this._speed > 8) {
                        if (this._yVector > 0 && this.position.y < this.charHeight * 3) {
                            return null;
                        } else {
                            return 7;
                        }
                    } else {
                        return this._yVector > 0 ? 2 : 3;
                    }
                }
            } else {
                return null;
            }   
        }

        private executeRun(): number {
            let directionUpdated = this.updateDirection();

            if (!this._isReverse) {
                this.position.x += this.pixSize * this._speed;
            } else {
                this.position.x -= this.pixSize * this._speed;            
            }

            if (this._isSquat) {
                return 8;
            }

            let runIndex = this._runIndex;

            if (this._currentStep < Mario.STEP) {
                this._currentStep++;
            } else {
                this._currentStep = 0;
                this._runIndex = this._runIndex ^ 1;
            }

            // Speed up action
            if (this._speed > 8) {
                runIndex = this._runIndex == 0 ? 4 : 5;
            } else {
                runIndex = this._runIndex;
            }

            // Braking action
            if (!this._isJumping) {
                if (this._speed > 5 || (!directionUpdated && this._isBraking)) {
                    if ((this._isReverse && this.position.x < this.charWidth * 3) ||
                        (!this._isReverse && this.position.x > this.targetDom.clientWidth - this.charWidth * 4)
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
            return runIndex;
        }

        private onJump(): void {
            if (!this._isJumping) {
                this._isJumping = true;
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
            this._speed = Mario.DEFAULT_SPEED;
            this._isSquat = false;
        }

        public gameOver(): void {
            if (this._gameMaster) this._gameMaster.doGameOver();
            this.stop();
            this._gameOverTimer = setInterval(() => {
                if (this._gameOverWaitCount < 20) {
                    this._gameOverWaitCount++;
                    this.draw(9, null, false, false, true);
                    this._yVector = this._jumpPower * this.pixSize;
                    return;
                }

                this._yVector -= this._gravity * this.pixSize;
                this.position.y = this.position.y + this._yVector;

                if (this.position.y < this.charHeight * 5 * -1) {
                    clearInterval(this._gameOverTimer);
                    this.destroy();
                    return;
                }

                if (this._currentStep < Mario.STEP) {
                    this._currentStep++;
                } else {
                    this._currentStep = 0;
                    this._runIndex = this._runIndex ^ 1;
                }

                this.draw(9, null, this._runIndex == 0 ? true : false, false, true);

            }, this.frameInterval);
        }

        private _backgroundOpacity = 0;

        public gool(): void {
            if (this._gameMaster) this._gameMaster.doGool();

            this._speed = 1;

            let blackScreen = document.createElement('div');
            if (this.targetDom == document.body)
                this.targetDom.style.cssText = 'margin: 0px;'; // only document body 

            let goolDimTimer = setInterval(() => {
                if (Math.floor(this._backgroundOpacity) != 1) {
                    this._backgroundOpacity += 0.01;
                } else {
                    this.stop();
                    this.draw(10, null, false, false, true);
                    clearInterval(goolDimTimer);
                    let goolDimOffTimer = setInterval(() => {
                        if (Math.ceil(this._backgroundOpacity) != 0) {
                            this._backgroundOpacity -= 0.02;
                        } else {
                            clearInterval(goolDimOffTimer);
                            this.start();

                            let circleSize = this.targetDom.clientWidth > this.targetDom.clientHeight ? this.targetDom.clientWidth  : this.targetDom.clientHeight ;
                            let circleAnimationCount = 0;
                            let circleTimer = setInterval(() => {
                                circleSize-=5;
                                this.drawBlackClipCircle(this.targetDom, this.position, circleSize, circleAnimationCount);
                                circleAnimationCount++;
                                if(circleSize <= 0){
                                    clearInterval(circleTimer);
                                    this.destroy();
                                }
                            }, 1);
                        }
                        blackScreen.style.cssText = `z-index: ${this.zIndex - 3}; position: absolute; background-color:black; width: 100%; height: 100%; border: 0;opacity: ${this._backgroundOpacity};`;

                    }, this.frameInterval);
                }
                blackScreen.style.cssText = `z-index: ${this.zIndex - 3}; position: absolute; background-color:black; width: 100%; height: 100%; border: 0;opacity: ${this._backgroundOpacity};`;

            }, this.frameInterval);

            this.targetDom.appendChild(blackScreen);
        }

        private drawBlackClipCircle(targetDom, position: Position, size: number, count: number): void {
            let element = document.createElement("canvas");
            element.id = `brackout_circle_${count}`;
            let ctx = element.getContext("2d");
            let width = this.targetDom.clientWidth;
            let height = this.targetDom.clientHeight;
            element.setAttribute("width", width.toString());
            element.setAttribute("height", height.toString());
            element.style.cssText = `z-index: ${this.zIndex + 1}; position: absolute;`;
            ctx.fillStyle = "black";
            ctx.fillRect(0,0,width,height);

            if(size > 0){
                ctx.globalCompositeOperation = "destination-out";
                ctx.beginPath();
                ctx.arc(position.x + this.charWidth / 2, height - position.y - this.charHeight / 2, size, 0, Math.PI * 2, false);
            }
            ctx.fill();

            targetDom.appendChild(element);
            if (count != 0)
                targetDom.removeChild(document.getElementById(`brackout_circle_${count - 1}`));
        }

        private _canSpeedUpForMobile: boolean = true;
        private _screenModeForMobile: string = 'PORTRAIT';
        private _deviceDirection: number = 1;

        registerActionCommand(): void {
            if (this.checkMobile()) {
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
                    this.onJump();
                });
                document.addEventListener('touchend', (e)=>{
                    this.onAbortJump();
                });
                document.addEventListener('touchcancel', (e)=>{
                    this.onAbortJump();
                });

                window.addEventListener('deviceorientation',(e)=>{
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
                    if(Math.abs(motion) >= 40 && this._canSpeedUpForMobile){
                        if(this._isReverse && motion < 0){
                            this._canSpeedUpForMobile = false;
                            this.onSpeedUp();
                        }else if(!this._isReverse && motion > 0){
                            this._canSpeedUpForMobile = false;
                            this.onSpeedUp();
                        }
                    }else if(Math.abs(motion) < 40 && !this._canSpeedUpForMobile){
                        this.onAbortSpeedUp();
                        this._canSpeedUpForMobile = true;
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
        ]];

    }


}

