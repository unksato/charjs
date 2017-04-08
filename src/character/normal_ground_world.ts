namespace Charjs{
    export class NormalGroundWorld extends AbstractGround {
        colors = ['','#000000','#2ec720','#177848','#78681a','#c7995c','#e0c057']; 
        cchars = [[[0,4,1,12],[0,2,1,2,2,12],[0,1,1,1,2,14],[0,1,1,1,2,5,3,4,2,3,3,2],[1,1,2,4,3,2,1,4,3,3,1,2],[1,1,2,3,3,2,1,1,4,4,1,3,4,2],[1,1,2,3,3,1,1,1,4,10],[1,1,2,2,3,2,1,1,4,1,5,4,4,3,5,2],[1,1,2,2,3,1,1,1,4,2,5,9],[1,1,2,2,3,1,1,1,4,2,5,6,6,2,5,1],[1,1,2,2,3,1,1,1,4,2,5,6,6,2,5,1],[1,1,2,3,3,1,1,1,4,2,5,5,6,2,5,1],[1,1,2,3,3,1,1,1,4,2,5,2,6,1,5,5],[1,1,2,3,3,1,1,1,4,2,5,2,6,1,5,5],[1,1,2,2,3,1,1,1,4,3,5,8],[1,1,2,2,3,1,1,1,4,2,5,9]],[[1,16],[2,16],[2,16],[3,1,2,7,3,3,2,3,3,2],[1,1,3,2,2,3,3,2,1,3,3,3,1,2],[4,1,1,2,3,3,1,2,4,3,1,3,4,2],[4,3,1,3,4,10],[5,2,4,5,5,4,4,3,5,2],[5,13,6,2,5,1],[5,3,6,2,5,8,6,2,5,1],[5,3,6,2,5,8,6,2,5,1],[5,3,6,2,5,5,6,1,5,5],[5,10,6,1,5,5],[5,16],[5,16],[5,16]],[[1,1,2,2,3,1,1,1,4,2,5,9],[1,1,2,2,3,1,1,1,4,2,5,9],[1,1,2,3,3,1,1,1,4,2,5,8],[1,1,2,3,3,1,1,1,4,2,5,1,6,1,5,6],[1,1,2,4,3,1,1,1,4,1,5,1,6,1,5,6],[1,1,2,4,3,1,1,1,4,1,5,1,6,1,5,6],[1,1,2,4,3,1,1,1,4,1,5,4,6,1,5,3],[1,1,2,3,3,1,1,1,4,2,5,4,6,1,5,3],[1,1,2,2,3,1,1,1,4,2,5,9],[1,1,2,2,3,1,1,1,4,2,5,9],[1,1,2,2,3,1,1,1,4,2,5,5,6,2,5,2],[1,1,2,3,3,1,1,1,4,2,5,4,6,2,5,2],[1,1,2,3,3,1,1,1,4,2,5,4,6,2,5,2],[1,1,2,3,3,1,1,1,4,2,5,1,6,1,5,6],[1,1,2,2,3,1,1,1,4,3,5,1,6,1,5,6],[1,1,2,2,3,1,1,1,4,2,5,9]],[[5,16],[5,5,6,2,5,9],[5,5,6,2,5,3,6,1,5,5],[5,5,6,2,5,3,6,1,5,5],[5,3,6,1,5,6,6,1,5,5],[5,3,6,1,5,6,6,1,5,5],[5,13,6,1,5,2],[5,13,6,1,5,2],[5,16],[5,16],[5,3,6,2,5,8,6,2,5,1],[5,3,6,2,5,8,6,2,5,1],[5,3,6,2,5,5,6,1,5,2,6,2,5,1],[5,10,6,1,5,5],[5,16],[5,16]]];
        chars = null;
/*        chars = [[
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
*/
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
    }
}