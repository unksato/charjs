namespace Charjs {
    export class NormalBlockWorld extends AbstractOtherObject {
        colors = ['','#000000','#ffffff','#fee13d','#ddae50'];
        chars = [[
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
        ]];

        constructor(targetDom, pixSize:number, position: Position, direction: Direction = Direction.right, zIndex = 2147483640, frameInterval = 45){
            super(targetDom, pixSize,position, direction, false, true, zIndex-2, frameInterval);
        }

        init(): void{
            super.init();
            this.draw(0);
        }


        private _pushedUpTimer:number = null;

        onPushedUp(): void {
            let animation = [
                {yOffset:this.pixSize * 4, index:0, wait:0},
                {yOffset:this.pixSize * 8, index:0, wait:0},
                {yOffset:this.pixSize * 10, index:0, wait: 2},
                {yOffset:this.pixSize * 8, index:0, wait:0},
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

            let animationIndex = 0;
            let currnetAnimation = null;
            if(!this._pushedUpTimer){
                this.isActive = false;
                this._pushedUpTimer = setInterval(() => {
                    if(animationIndex >= animation.length){
                        clearInterval(this._pushedUpTimer);
                        this._pushedUpTimer = null;
                        this.isActive = true;
                        return;
                    }
                    let pos : Position = {x:this.position.x, y: this.position.y};
                    if(animation[animationIndex].yOffset)
                        pos.y+=animation[animationIndex].yOffset;
                    this.draw(animation[animationIndex].index, pos, Direction.right, Vertical.up, true);
                    if(animation[animationIndex].wait){
                        animation[animationIndex].wait--;
                    }else{
                        animationIndex++;
                    }

                }, this.frameInterval);
            }
        }

        onTrampled(): void {

        }
    }
}