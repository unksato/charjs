namespace Charjs {
    interface IMountData {
        start: number;
        pattern: number[];
        color: string;
        currentOffset?: number;
    }

    export abstract class AbstractMountain extends AbstractPixel {
        abstract colors: string[];
        abstract dataPattern: IMountData[];
        constructor(private width: number, private height: number, private pixSize: number, private type: number) {
            super();
        }

        draw(): HTMLCanvasElement {
            let element = AbstractMountain.createCanvasElement(this.width, this.height, 0);
            let ctx = element.getContext("2d");
            let center = this.width / this.pixSize / 2;

            for (let i = 0; i < this.height; i++) {
                if (i < 3) {
                    for (let w = center - (i + 1) * 2; w < center; w++)
                        this.picWithMirror(center, ctx, w, i, this.colors[0]);
                } else {
                    for (let j = 2; j < 5; j++) {
                        let s = center - i - j;
                        this.picWithMirror(center, ctx, s, i, this.colors[0]);
                        if (i >= 5)
                            this.picWithMirror(center, ctx, s + 2, i, this.colors[1]);
                    }
                }
                if (1 < i && i < 5) {
                    for (let w = center - (i - 1) * 2; w < center; w++)
                        this.picWithMirror(center, ctx, w, i, this.colors[1]);
                }
                if (3 < i && i < 6) {
                    for (let w = center - ((i - 4) * 3) - 2; w < center; w++)
                        this.picWithMirror(center, ctx, w, i, this.colors[2]);
                } else if (i >= 5) {
                    for (let w = center - i; w < center; w++)
                        this.picWithMirror(center, ctx, w, i, this.colors[2]);
                }
            }
            return element;
        }

        draw2(): HTMLCanvasElement {
            let element = AbstractMountain.createCanvasElement(this.width, this.height, 0);
            let ctx = element.getContext("2d");
            let center = this.width / this.pixSize / 2;


            for (let i = 0; i < this.height; i++) {
            }

            return element;
        }

        private picWithMirror(center: number, ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
            AbstractMountain.drawPixel(ctx, x, y, this.pixSize, color);
            let mirrorX = center + (center - x) - 1;
            AbstractMountain.drawPixel(ctx, mirrorX, y, this.pixSize, color);
        }
        private deepCopy<T>(obj:T): T {
            return JSON.parse(JSON.stringify(obj));
        }
    }

    export class Mountain01 extends AbstractMountain {
        colors = ['#6daf91', '#5d9f81', '#4d8f71'];

        dataPattern = [{
            start: 0,
            pattern: [2,2,2,1],
            color:'#6daf91'
        },{
            start: 2,
            pattern: [2,2,2,1],
            color: '#5d9f81'
        },{
            start: 4,
            pattern: [2,3,1],
            color: '#4d8f71'
        }];
    }
}