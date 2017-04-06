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
            let charSize = this.pixSize * this.chars[0].length;
            let url = `url(${this.createBorderImage()})`;

            this.targetDom.style.webkitBorderImage = `${url} ${charSize} round`;
            this.targetDom.style.borderImage = `${url} ${charSize} fill round`;
            this.targetDom.style.borderStyle = 'solid';
            this.targetDom.style.borderWidth = `${charSize}px ${charSize}px 0px ${charSize}px`;
        }        

        private createBorderImage() : string {
            let element = document.createElement("canvas");

            let ctx = element.getContext("2d");
            let size = this.pixSize * this.chars[0].length * 3;

            element.setAttribute("width", size.toString());
            element.setAttribute("height", size.toString());

            let offsetSize = this.pixSize * this.chars[0].length;

            ctx.drawImage(this.createImage(this.chars[0],false, false),0,0);
            ctx.drawImage(this.createImage(this.chars[1],false, false),offsetSize,0);
            ctx.drawImage(this.createImage(this.chars[0],true, false),offsetSize * 2,0);
            ctx.drawImage(this.createImage(this.chars[2],false, false),0,offsetSize);
            ctx.drawImage(this.createImage(this.chars[3],false, false),offsetSize,offsetSize);
            ctx.drawImage(this.createImage(this.chars[2],true, false),offsetSize * 2,offsetSize);
            ctx.drawImage(this.createImage(this.chars[0],false, true),0,offsetSize * 2);
            ctx.drawImage(this.createImage(this.chars[1],false, true),offsetSize,offsetSize * 2);
            ctx.drawImage(this.createImage(this.chars[0],true, true),offsetSize * 2,offsetSize * 2);

            return element.toDataURL();   
        }

        private createImage(map:number[][], reverse: boolean, vertical: boolean) : HTMLImageElement {
            let element = document.createElement('canvas');
            let ctx = element.getContext("2d");

            AbstractCharacter.drawCharacter(ctx,map,this.colors,this.pixSize,reverse,vertical);
            let img = new Image();
            img.src = element.toDataURL();
            return img;
        }
    }
}