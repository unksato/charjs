namespace Charjs {

    enum HitStatus{
        none,
        dammage,
        attack,
        grab
    }

    export class MarioWorld extends AbstractCharacter{
        private static STEP = 2;
        private static DEFAULT_SPEED = 2;
        private _runIndex = 0;
        private _currentStep = MarioWorld.STEP;

        isEnemy = false;
        useVertical = false;

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
        private _attackDirection : Direction = Direction.right;


        onAction(): void {
            switch (this.doHitTest()) {
                case HitStatus.dammage:
                    this.gameOver();
                    break;
                case HitStatus.attack:
                    this.draw(11, null, this._attackDirection, Vertical.up, true);
                    this.stop();
                    setTimeout(() => {
                        this.start();
                    }, this.frameInterval * 3);
                    break;
                case HitStatus.grab:
                    this.updateGrabedEnemy();
                    this.draw(14, null, this._direction, Vertical.up, true);                               
                    this.stop();
                    setTimeout(() => {
                        this.start();
                    }, this.frameInterval);
                    break;
                default:
                    let action = this.executeRun();
                    action = this.executeJump() || action;
                    this.draw(action.index, null, action.direction, Vertical.up, true);
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
                enemy.onKicked(grabedEnemyCenter <= enemyCenter ? Direction.right : Direction.left, this._speed * 3);
                this._grabedEnemy.onKicked(grabedEnemyCenter <= enemyCenter ? Direction.left : Direction.right, this._speed * 3)
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
                        if (ePos.y > this.position.y + this.charHeight)
                            continue;
                        if (this.position.x > ePos.x + eSize.width)
                            continue;
                        if (ePos.x > this.position.x + this.charWidth)
                            continue;
                        
                        if (enemys[name].isStepped()) {
                            if(!this._grabbing){
                                let playerCenter = this.position.x + this.charWidth / 2;
                                let enemyCenter = ePos.x + eSize.width / 2;
                                this._attackDirection = playerCenter <= enemyCenter ? Direction.right : Direction.left;
                                enemys[name].onKicked(this._attackDirection, this._speed * 3);
                                return HitStatus.attack;
                            }else{
                                this.grabEnemy(enemys[name]);
                                return HitStatus.grab;
                            }
                        }

                        if (this._isJumping && this._yVector < 0) {
                            if(this._isSpecial){
                                let playerCenter = this.position.x + this.charWidth / 2;
                                let enemyCenter = ePos.x + eSize.width / 2;
                                this._attackDirection = playerCenter <= enemyCenter ? Direction.right : Direction.left;
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
        private _specialAnimation = [{index:0, direction:Direction.right},{index:12, direction:Direction.right},{index:0, direction:Direction.left},{index:13, direction:Direction.right}]

        private executeJump(): {index:number, direction: Direction} {
            if (this._isJumping) {
                this._yVector -= this._gravity * this.pixSize;
                this.position.y = this.position.y + this._yVector;
                this.updateGrabedEnemy();
                if (this.position.y <= 0) {
                    this._isJumping = false;
                    this._yVector = 0;
                    this.position.y = 0;
                    return null;
                } else {
                    if(!this._grabedEnemy){
                        if(!this._isSpecial) {
                            if (this._speed > 8) {
                                if (this._yVector > 0 && this.position.y < this.charHeight * 3) {
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
                return null;
            }   
        }

        private updateGrabedEnemy() {
            if(this._grabedEnemy){
                let grabXOffset = this._direction == Direction.right ? this.charWidth * 0.7 : this.charWidth * -1 * 0.7;
                let grabYOffset = this.pixSize;
                this._grabedEnemy.setPosition({x:this.position.x + grabXOffset ,y:this.position.y + grabYOffset});
                this._grabedEnemy.drawAction();
            }
        }

        private executeRun(): { index:number, direction: Direction} {
            let directionUpdated = this.updateDirection();

            if (this._direction == Direction.right) {
                this.position.x += this.pixSize * this._speed;
            } else {
                this.position.x -= this.pixSize * this._speed;            
            }

            if (this._isSquat) {
                return {index:8, direction: this._direction};
            }

            let runIndex = this._runIndex;

            if (this._currentStep < MarioWorld.STEP) {
                this._currentStep++;
            } else {
                this._currentStep = 0;
                this._runIndex = this._runIndex ^ 1;
            }

            // grabed action
            if (this._grabedEnemy) {
                runIndex = this._runIndex == 0 ? 15 : 16;
                this.updateGrabedEnemy();
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
                        if ((this._direction == Direction.left && this.position.x < this.charWidth * 3) ||
                            (this._direction == Direction.right && this.position.x > this.targetDom.clientWidth - this.charWidth * 4)
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
            enemy.onGrabed();
            this._grabedEnemy = enemy;
        }

        private putEnemy() : void {

        }

        private onGrab(): void {
            this._grabbing = true;
        }

        private onAbortGrab(): void {
            this._grabbing = false;
            if(this._grabedEnemy){
                this.draw(11, null, this._direction, Vertical.up, true);
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
                    this.draw(9, null, Direction.right, Vertical.up, true);
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

                if (this._currentStep < MarioWorld.STEP) {
                    this._currentStep++;
                } else {
                    this._currentStep = 0;
                    this._runIndex = this._runIndex ^ 1;
                }

                this.draw(9, null, this._runIndex == 0 ? Direction.left : Direction.right, Vertical.up, true);

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
                    this.draw(10, null, Direction.right, Vertical.up, true);
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
                                circleSize-=40;
                                this.drawBlackClipCircle(this.targetDom, this.position, circleSize, circleAnimationCount);
                                circleAnimationCount++;
                                if(circleSize <= 0){
                                    clearInterval(circleTimer);
                                    this.destroy();
                                }
                            }, this.frameInterval);
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
            element.id = `blackout_circle_${count}`;
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
                    switch(e.targetTouches.length){
                        case 1:
                            this.onGrab();
                            break;
                        case 2:
                            this.onJump();                     
                            break;
                        case 3:
                            this.onSpecialJump();
                            break;
                        default:
                            this.onJump();                     
                    }
                });
                document.addEventListener('touchend', (e)=>{
                    if(e.targetTouches.length > 0){
                        this.onAbortJump();
                    }else{
                        this.onAbortGrab();
                        this.onAbortJump();
                    }
                });
                document.addEventListener('touchcancel', (e)=>{
                    if(e.targetTouches.length > 0){
                        this.onAbortJump();
                    }else{
                        this.onAbortGrab();
                        this.onAbortJump();
                    }
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
                    if(Math.abs(motion) >= 20 && this._canSpeedUpForMobile){
                        if(this._direction == Direction.left && motion < 0){
                            this._canSpeedUpForMobile = false;
                            this.onSpeedUp();
                        }else if(this._direction == Direction.right && motion > 0){
                            this._canSpeedUpForMobile = false;
                            this.onSpeedUp();
                        }
                    }else if(Math.abs(motion) < 20 && !this._canSpeedUpForMobile){
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
                    if (e.keyCode == 88 && !this._isSquat) {
                        this.onSpecialJump();
                    }

                    if (e.keyCode == 66 && !this._isJumping && !this._isSquat) {
                        this.onSpeedUp();
                        this.onGrab();
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
                    if (e.keyCode == 66) {
                        this.onAbortSpeedUp();
                        this.onAbortGrab();
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
    }
}

