namespace Charjs{
    export class NormalGroundWorld extends AbstractGround {
        colors = ['','#000000','#2ec720','#177848','#78681a','#c7995c','#e0c057']; 
        chars = [[
            [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
            [0,0,1,1,2,2,2,2,2,2,2,2,2,2,2,2],
            [0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [0,1,2,2,2,2,2,3,3,3,3,2,2,2,3,3],
            [1,2,2,2,2,3,3,1,1,1,1,3,3,3,1,1],
            [1,2,2,2,3,3,1,4,4,4,4,1,1,1,4,4],
            [1,2,2,2,3,1,4,4,4,4,4,4,4,4,4,4],
            [1,2,2,3,3,1,4,5,5,5,5,4,4,4,5,5],
            [1,2,2,3,1,4,4,5,5,5,5,5,5,5,5,5],
            [1,2,2,3,1,4,4,5,5,5,5,5,5,6,6,5],
            [1,2,2,3,1,4,4,5,5,5,5,5,5,6,6,5],
            [1,2,2,2,3,1,4,4,5,5,5,5,5,6,6,5],
            [1,2,2,2,3,1,4,4,5,5,6,5,5,5,5,5],
            [1,2,2,2,3,1,4,4,5,5,6,5,5,5,5,5],
            [1,2,2,3,1,4,4,4,5,5,5,5,5,5,5,5],
            [1,2,2,3,1,4,4,5,5,5,5,5,5,5,5,5]
        ],[
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [3,2,2,2,2,2,2,2,3,3,3,2,2,2,3,3],
            [1,3,3,2,2,2,3,3,1,1,1,3,3,3,1,1],
            [4,1,1,3,3,3,1,1,4,4,4,1,1,1,4,4],
            [4,4,4,1,1,1,4,4,4,4,4,4,4,4,4,4],
            [5,5,4,4,4,4,4,5,5,5,5,4,4,4,5,5],
            [5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,5],
            [5,5,5,6,6,5,5,5,5,5,5,5,5,6,6,5],
            [5,5,5,6,6,5,5,5,5,5,5,5,5,6,6,5],
            [5,5,5,6,6,5,5,5,5,5,6,5,5,5,5,5],
            [5,5,5,5,5,5,5,5,5,5,6,5,5,5,5,5],
            [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
            [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
            [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]
        ],[
            [1,2,2,3,1,4,4,5,5,5,5,5,5,5,5,5],
            [1,2,2,3,1,4,4,5,5,5,5,5,5,5,5,5],
            [1,2,2,2,3,1,4,4,5,5,5,5,5,5,5,5],
            [1,2,2,2,3,1,4,4,5,6,5,5,5,5,5,5],
            [1,2,2,2,2,3,1,4,5,6,5,5,5,5,5,5],
            [1,2,2,2,2,3,1,4,5,6,5,5,5,5,5,5],
            [1,2,2,2,2,3,1,4,5,5,5,5,6,5,5,5],
            [1,2,2,2,3,1,4,4,5,5,5,5,6,5,5,5],
            [1,2,2,3,1,4,4,5,5,5,5,5,5,5,5,5],
            [1,2,2,3,1,4,4,5,5,5,5,5,5,5,5,5],
            [1,2,2,3,1,4,4,5,5,5,5,5,6,6,5,5],
            [1,2,2,2,3,1,4,4,5,5,5,5,6,6,5,5],
            [1,2,2,2,3,1,4,4,5,5,5,5,6,6,5,5],
            [1,2,2,2,3,1,4,4,5,6,5,5,5,5,5,5],
            [1,2,2,3,1,4,4,4,5,6,5,5,5,5,5,5],
            [1,2,2,3,1,4,4,5,5,5,5,5,5,5,5,5]
        ],[
            [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
            [5,5,5,5,5,6,6,5,5,5,5,5,5,5,5,5],
            [5,5,5,5,5,6,6,5,5,5,6,5,5,5,5,5],
            [5,5,5,5,5,6,6,5,5,5,6,5,5,5,5,5],
            [5,5,5,6,5,5,5,5,5,5,6,5,5,5,5,5],
            [5,5,5,6,5,5,5,5,5,5,6,5,5,5,5,5],
            [5,5,5,5,5,5,5,5,5,5,5,5,5,6,5,5],
            [5,5,5,5,5,5,5,5,5,5,5,5,5,6,5,5],
            [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
            [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
            [5,5,5,6,6,5,5,5,5,5,5,5,5,6,6,5],
            [5,5,5,6,6,5,5,5,5,5,5,5,5,6,6,5],
            [5,5,5,6,6,5,5,5,5,5,6,5,5,6,6,5],
            [5,5,5,5,5,5,5,5,5,5,6,5,5,5,5,5],
            [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
            [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]
        ]];

        public setBorderImage() : void {
            this.createBorderImage().then((url)=> {
                let charSize = this.pixSize * this.chars[0].length;
                url = `url(${url})`;
                this.targetDom.style.borderImage = `${url} ${charSize} fill round`;
                this.targetDom.style.borderStyle = 'solid';
                this.targetDom.style.borderWidth = `${charSize}px ${charSize}px 0px ${charSize}px`;
                this.targetDom.style.webkitBorderImage = `${url} ${charSize} round`;
            })
        }        

        private createBorderImage() : MyQ.Promise<string> {
            let q = MyQ.Deferred.defer<string>();

            let element = document.createElement("canvas");

            let ctx = element.getContext("2d");
            let size = this.pixSize * this.chars[0].length * 3;

            element.setAttribute("width", size.toString());
            element.setAttribute("height", size.toString());

            let offsetSize = this.pixSize * this.chars[0].length;

            let drawProcess: MyQ.Promise<{}>[] = [];

            drawProcess.push(this.drawImage(ctx,this.chars[0],false,false, 0,              0));
            drawProcess.push(this.drawImage(ctx,this.chars[1],false,false, offsetSize,     0));
            drawProcess.push(this.drawImage(ctx,this.chars[0],true,false,  offsetSize * 2, 0));
            drawProcess.push(this.drawImage(ctx,this.chars[2],false,false, 0,              offsetSize));
            drawProcess.push(this.drawImage(ctx,this.chars[3],false,false, offsetSize,     offsetSize));
            drawProcess.push(this.drawImage(ctx,this.chars[2],true,false,  offsetSize * 2, offsetSize));
            drawProcess.push(this.drawImage(ctx,this.chars[0],false,true,  0,              offsetSize * 2));
            drawProcess.push(this.drawImage(ctx,this.chars[1],false,true,  offsetSize,     offsetSize * 2));
            drawProcess.push(this.drawImage(ctx,this.chars[0],true,true,   offsetSize * 2, offsetSize * 2));

            MyQ.Promise.all(drawProcess).then(()=>{
                q.resolve(element.toDataURL());
            });

            return q.promise;
        }

        private drawImage(ctx: CanvasRenderingContext2D, map:number[][], reverse: boolean, vertical: boolean, offsetX:number, offsetY:number) : MyQ.Promise<{}>  {
            let q = MyQ.Deferred.defer();
            this.createImage(map,reverse, vertical).then((img) => {
                ctx.drawImage(img,offsetX,offsetY);
                q.resolve({});
            });
            return q.promise;
        }

        private createImage(map:number[][], reverse: boolean, vertical: boolean) : MyQ.Promise<HTMLImageElement> {
            let q = MyQ.Deferred.defer<HTMLImageElement>();

            let element = document.createElement('canvas');
            let ctx = element.getContext("2d");

            let size = this.pixSize * map.length;

            element.setAttribute("width", size.toString());
            element.setAttribute("height", size.toString());

            AbstractCharacter.drawCharacter(ctx,map,this.colors,this.pixSize,reverse,vertical);
            let img = new Image();
            
            img.onload = () => {
                q.resolve(img);
            }
            img.src = element.toDataURL();
            return q.promise;
        }
    }
}