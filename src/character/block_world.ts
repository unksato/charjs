namespace Charjs {
    export class NormalBlockWorld extends AbstractOtherObject {
        colors = ['','#000000','#ffffff','#fee13d','#ddae50'];
        cchars = [[[0,2,1,12,0,2],[0,1,1,1,2,3,4,9,1,1,0,1],[1,1,2,2,3,9,4,3,1,1],[1,1,2,1,3,11,4,2,1,1],[1,1,2,1,3,11,4,2,1,1],[1,1,4,1,3,3,1,1,3,4,1,1,3,2,4,2,1,1],[1,1,2,1,3,3,1,1,3,4,1,1,3,2,4,2,1,1],[1,1,4,1,3,3,1,1,3,4,1,1,3,2,4,2,1,1],[1,1,4,1,3,3,1,1,3,4,1,1,3,2,4,2,1,1],[1,1,4,1,3,11,4,2,1,1],[1,1,4,1,3,11,4,2,1,1],[1,1,4,1,3,11,4,2,1,1],[1,1,4,2,3,9,4,3,1,1],[1,1,4,14,1,1],[0,1,1,1,4,12,1,1,0,1],[0,2,1,12,0,2]],[[0,16],[0,16],[0,16],[0,1,1,14,0,1],[1,2,2,3,4,9,1,2],[1,1,2,1,1,12,4,1,1,1],[1,2,3,11,4,1,1,2],[1,1,4,1,3,3,1,1,3,4,1,1,3,2,4,2,1,1],[1,1,4,1,3,3,1,1,3,4,1,1,3,2,4,2,1,1],[1,1,4,1,3,11,4,2,1,1],[1,1,4,1,3,11,4,2,1,1],[1,1,4,1,3,10,4,3,1,1],[0,1,1,14,0,1],[0,16],[0,16],[0,16]],[[0,16],[0,16],[0,16],[0,16],[0,16],[0,16],[0,1,1,14,0,1],[1,1,4,14,1,1],[1,1,4,14,1,1],[0,1,1,14,0,1],[0,16],[0,16],[0,16],[0,16],[0,16],[0,16]],[[0,16],[0,16],[0,16],[0,1,1,14,0,1],[1,2,2,10,3,1,2,1,1,2],[1,1,2,8,3,1,2,1,3,1,2,1,3,2,1,1],[1,1,2,4,4,1,2,2,3,1,2,1,4,1,3,4,1,1],[1,1,2,4,4,1,2,1,3,1,2,1,3,1,4,1,3,4,1,1],[1,1,2,1,3,1,2,1,3,1,2,1,3,1,2,1,3,7,1,1],[1,2,3,12,1,2],[1,1,3,1,1,12,4,1,1,1],[1,2,3,9,4,3,1,2],[0,1,1,14,0,1],[0,16],[0,16],[0,16]]];
        chars = null;
/*        chars = [[
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,1,2,2,2,4,4,4,4,4,4,4,4,4,1,0],
            [1,2,2,3,3,3,3,3,3,3,3,3,4,4,4,1],
            [1,2,3,3,3,3,3,3,3,3,3,3,3,4,4,1],
            [1,2,3,3,3,3,3,3,3,3,3,3,3,4,4,1],
            [1,4,3,3,3,1,3,3,3,3,1,3,3,4,4,1],
            [1,2,3,3,3,1,3,3,3,3,1,3,3,4,4,1],
            [1,4,3,3,3,1,3,3,3,3,1,3,3,4,4,1],
            [1,4,3,3,3,1,3,3,3,3,1,3,3,4,4,1],
            [1,4,3,3,3,3,3,3,3,3,3,3,3,4,4,1],
            [1,4,3,3,3,3,3,3,3,3,3,3,3,4,4,1],
            [1,4,3,3,3,3,3,3,3,3,3,3,3,4,4,1],
            [1,4,4,3,3,3,3,3,3,3,3,3,4,4,4,1],
            [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1],
            [0,1,4,4,4,4,4,4,4,4,4,4,4,4,1,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0]
        ],[
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [1,1,2,2,2,4,4,4,4,4,4,4,4,4,1,1],
            [1,2,1,1,1,1,1,1,1,1,1,1,1,1,4,1],
            [1,1,3,3,3,3,3,3,3,3,3,3,3,4,1,1],
            [1,4,3,3,3,1,3,3,3,3,1,3,3,4,4,1],
            [1,4,3,3,3,1,3,3,3,3,1,3,3,4,4,1],
            [1,4,3,3,3,3,3,3,3,3,3,3,3,4,4,1],
            [1,4,3,3,3,3,3,3,3,3,3,3,3,4,4,1],
            [1,4,3,3,3,3,3,3,3,3,3,3,4,4,4,1],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ],[
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1],
            [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]            
        ],[
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [1,1,2,2,2,2,2,2,2,2,2,2,3,2,1,1],
            [1,2,2,2,2,2,2,2,2,3,2,3,2,3,3,1],
            [1,2,2,2,2,4,2,2,3,2,4,3,3,3,3,1],
            [1,2,2,2,2,4,2,3,2,3,4,3,3,3,3,1],
            [1,2,3,2,3,2,3,2,3,3,3,3,3,3,3,1],
            [1,1,3,3,3,3,3,3,3,3,3,3,3,3,1,1],
            [1,3,1,1,1,1,1,1,1,1,1,1,1,1,4,1],
            [1,1,3,3,3,3,3,3,3,3,3,4,4,4,1,1],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]            
        ]];*/

        private static getAnimation(size : number){
            return [
            {yOffset: size * 4, index:0, wait:0},
            {yOffset: size * 8, index:0, wait:0},
            {yOffset: size * 10, index:0, wait:2},
            {yOffset: size * 8, index:0, wait:0},
            {yOffset:0, index:2, wait:2},
            {yOffset:0, index:3, wait:2},
            {yOffset:0, index:0, wait:2},
            {yOffset:0, index:1, wait:2},
            {yOffset:0, index:2, wait:2},
            {yOffset:0, index:3, wait:2},
            {yOffset:0, index:0, wait:2},
            {yOffset:0, index:1, wait:2},
            {yOffset:0, index:2, wait:2},
            {yOffset:0, index:3, wait:2},
            {yOffset:0, index:0, wait:2},
            {yOffset:0, index:1, wait:2},
            {yOffset:0, index:2, wait:2},
            {yOffset:0, index:3, wait:2},
            {yOffset:0, index:0, wait:2},
            {yOffset:0, index:1, wait:2},
            {yOffset:0, index:2, wait:2},
            {yOffset:0, index:3, wait:2},
            {yOffset:0, index:0, wait:2},
            {yOffset:0, index:1, wait:2},
            {yOffset:0, index:2, wait:2},
            {yOffset:0, index:3, wait:2},
            {yOffset:0, index:0, wait:2},
            {yOffset:0, index:1, wait:2},
            {yOffset:0, index:2, wait:2},
            {yOffset:0, index:3, wait:2},
            {yOffset:0, index:0, wait:2}];
        }

        private animation = null;
        private _animationIndex = null;
        private _isStarting = false;

        constructor(targetDom, pixSize:number, position: IPosition, direction: Direction = Direction.Right, zIndex = 2147483640, frameInterval = 45){
            super(targetDom, pixSize,position, direction, false, true, zIndex-2, frameInterval);
        }

        init(): void{
            super.init();
            this.draw(0);
        }

        private start(): void{
            if(this._animationIndex !== null && this.animation != null){
                this.isActive = false;
                this._isStarting = true;
                this._pushedUpTimer = setInterval(() => {
                    if(this._animationIndex >= this.animation.length){
                        this.animation = null;
                        this.isActive = true;
                        this._animationIndex = null;
                        this.removeCommand();
                        this.stop();
                        return;
                    }
                    let pos : IPosition = {x:this.position.x, y: this.position.y};
                    if(this.animation[this._animationIndex].yOffset)
                        pos.y+=this.animation[this._animationIndex].yOffset;
                    this.draw(this.animation[this._animationIndex].index, pos, Direction.Right, Vertical.Up, true);
                    if(this.animation[this._animationIndex].wait){
                        this.animation[this._animationIndex].wait--;
                    }else{
                        this._animationIndex++;
                    }

                }, this.frameInterval);
            }
        }

        private stop():void {
            this._isStarting = false;
            if(this._pushedUpTimer) {
                clearInterval(this._pushedUpTimer);
                this._pushedUpTimer = null;
            }
        }

        private _pushedUpTimer:number = null;

        onPushedUp(): void {
            for(let enemy of this.entityEnemies){
                enemy.onKicked(Direction.Right, 0);
            }

            if(!this._pushedUpTimer){
                this.animation = NormalBlockWorld.getAnimation(this.pixSize);
                this._animationIndex = 0;
                this.registerCommand();
                this.start();
            }
        }

        onTrampled(): void {

        }

        private registerCommand() {
            document.addEventListener('keypress', this.defaultCommand);
        }

        private removeCommand() {
            document.removeEventListener('keypress', this.defaultCommand);
        }

        defaultCommand = (e:KeyboardEvent) => {
            if (e.keyCode == 32) {
                if (this._isStarting) {
                    this.stop();
                } else {
                    this.start();
                }
            }
        }
    }
}