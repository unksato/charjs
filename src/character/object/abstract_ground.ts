namespace Charjs {
    export abstract class AbstractGround extends AbstractObject {
        onPushedUp(player: IPlayer) { }
        onStepped(player: IPlayer) { }

        abstract setBorderImage(): void;

        protected createBorderImage(): MyQ.Promise<string> {
            this.uncompress();

            let q = MyQ.Deferred.defer<string>();

            let element = document.createElement("canvas");

            let ctx = element.getContext("2d");
            let size = this.pixSize * this.chars[0].length * 3;

            element.setAttribute("width", size.toString());
            element.setAttribute("height", size.toString());

            let offsetSize = this.pixSize * this.chars[0].length;

            let drawProcess: MyQ.Promise<{}>[] = [];

            drawProcess.push(this.drawImage(ctx, this.chars[0], false, false, 0, 0));
            drawProcess.push(this.drawImage(ctx, this.chars[1], false, false, offsetSize, 0));
            drawProcess.push(this.drawImage(ctx, this.chars[0], true, false, offsetSize * 2, 0));
            drawProcess.push(this.drawImage(ctx, this.chars[2], false, false, 0, offsetSize));
            drawProcess.push(this.drawImage(ctx, this.chars[3], false, false, offsetSize, offsetSize));
            drawProcess.push(this.drawImage(ctx, this.chars[2], true, false, offsetSize * 2, offsetSize));
            drawProcess.push(this.drawImage(ctx, this.chars[0], false, true, 0, offsetSize * 2));
            drawProcess.push(this.drawImage(ctx, this.chars[1], false, true, offsetSize, offsetSize * 2));
            drawProcess.push(this.drawImage(ctx, this.chars[0], true, true, offsetSize * 2, offsetSize * 2));

            MyQ.Promise.all(drawProcess).then(() => {
                q.resolve(element.toDataURL());
            });

            return q.promise;
        }

        private drawImage(ctx: CanvasRenderingContext2D, map: number[][], reverse: boolean, vertical: boolean, offsetX: number, offsetY: number): MyQ.Promise<{}> {
            let q = MyQ.Deferred.defer();
            this.createImage(map, reverse, vertical).then((img) => {
                ctx.drawImage(img, offsetX, offsetY);
                q.resolve({});
            });
            return q.promise;
        }

        private createImage(map: number[][], reverse: boolean, vertical: boolean): MyQ.Promise<HTMLImageElement> {
            let element = document.createElement('canvas');
            let ctx = element.getContext("2d");
            let size = this.pixSize * map.length;
            element.setAttribute("width", size.toString());
            element.setAttribute("height", size.toString());
            AbstractCharacter.drawCharacter(ctx, map, this.colors, this.pixSize, reverse, vertical, false);
            return this.toImage(element);
        }

    }

}