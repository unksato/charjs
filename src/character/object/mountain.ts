namespace Charjs {
    export abstract class AbstractMountain extends AbstractPixel {
        abstract colors: string[];
        constructor(private width: number, private height: number, private pixSize: number, private type: number) {
            super();
        }

        draw(): HTMLCanvasElement {
            let element = AbstractMountain.createCanvasElement(this.width * 2, this.height, 1);
            let ctx = element.getContext("2d");
            let center = this.width / 2;

            for (let i = 0; i < this.height; i++) {
                if (i < 3) {
                    for (let w = center - (i + 1) * 2; w < center + (i + i) * 2; w++) {
                        AbstractMountain.drawPixel(ctx, w, i, this.pixSize, this.colors[0]);
                    }
                } else {
                    AbstractMountain.drawPixel(ctx, center - 4 - i, i, this.pixSize, this.colors[0]);
                    AbstractMountain.drawPixel(ctx, center - 5 - i, i, this.pixSize, this.colors[0]);
                    AbstractMountain.drawPixel(ctx, center + 4 + i, i, this.pixSize, this.colors[0]);
                    AbstractMountain.drawPixel(ctx, center + 5 + i, i, this.pixSize, this.colors[0]);
                }
            }
            return element;
        }

    }

    export class Mountain01 extends AbstractMountain {
        colors = ['#6daf91', '#5d9f81', '#4d8f71'];
    }
}