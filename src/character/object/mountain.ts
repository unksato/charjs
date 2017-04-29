namespace Charjs {
    interface IMountData {
        start: number;
        pattern: number[];
        fillPattern: number[];
        color: string;
        currentOffset?: number;
        isFill: boolean;
    }

    export abstract class AbstractMountain extends AbstractPixel {
        abstract dataPattern: IMountData[];
        constructor(private width: number, private height: number, private pixSize: number, private type?: number) {
            super();
        }

        createImage(): MyQ.Promise<HTMLImageElement> {
            return this.toImage(this.draw());
        }

        draw(): HTMLCanvasElement {
            let element = AbstractMountain.createCanvasElement(this.width, this.height, 0);
            let ctx = element.getContext("2d");
            let center = this.width / this.pixSize / 2;
            let datas = this.deepCopy(this.dataPattern);
            for (let data of datas) {
                data.currentOffset = center;
            }

            let mountHeight = ((this.width / 2) - (datas[0].pattern.reduce(function (prev, current) { return prev + current; }) * this.pixSize)) / (datas[0].pattern[datas[0].pattern.length - 1] * this.pixSize) + datas[0].pattern.length;
            let top = (this.height / this.pixSize) - mountHeight;

            for (let i = 0; i < mountHeight; i++) {
                for (let data of datas) {
                    if (data.start <= i) {
                        let start = data.currentOffset - data.pattern[Math.min(i - data.start, data.pattern.length - 1)];
                        let end = data.isFill ? center : data.currentOffset + data.fillPattern[Math.min(i - data.start, data.fillPattern.length - 1)];
                        for (let w = start; w < end; w++) {
                            this.picWithMirror(center, ctx, w, i + top, data.color);
                        }
                        data.currentOffset = start;
                    }
                }
            }
            return element;
        }
        private picWithMirror(center: number, ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
            AbstractMountain.drawPixel(ctx, x, y, this.pixSize, color);
            let mirrorX = center + (center - x) - 1;
            AbstractMountain.drawPixel(ctx, mirrorX, y, this.pixSize, color);
        }
        private deepCopy<T>(obj: T): T {
            return JSON.parse(JSON.stringify(obj));
        }
    }

    export class Mountain01 extends AbstractMountain {
        dataPattern = [{
            start: 0,
            pattern: [2, 2, 2, 1],
            fillPattern: [0, 2, 2, 2, 1],
            color: '#6daf91',
            isFill: false
        }, {
            start: 2,
            pattern: [2, 2, 2, 1],
            fillPattern: [0, 2, 2, 1],
            color: '#5d9f81',
            isFill: false
        }, {
            start: 4,
            pattern: [2, 3, 1],
            fillPattern: [],
            color: '#4d8f71',
            isFill: true
        }];
    }

    export class Mountain02 extends AbstractMountain {
        dataPattern = [{
            start: 0,
            pattern: [2, 3, 3, 2],
            fillPattern: [2, 3, 3, 2],
            color: '#98e0c0',
            isFill: false
        }, {
            start: 2,
            pattern: [2, 4, 2],
            fillPattern: [0, 0, 2],
            color: '#88d0b0',
            isFill: false
        }, {
            start: 3,
            pattern: [2],
            fillPattern: [],
            color: '#78c0a0',
            isFill: true
        }];
    }

    export class Mountain03 extends AbstractMountain {
        dataPattern = [{
            start: 0,
            pattern: [2, 3, 3, 2],
            fillPattern: [0, 2, 3, 1, 2],
            color: '#6daf91',
            isFill: false
        }, {
            start: 2,
            pattern: [2, 5, 1, 2],
            fillPattern: [0, 0, 1, 1, 2],
            color: '#5d9f81',
            isFill: false
        }, {
            start: 3,
            pattern: [5, 1, 1, 1, 2],
            fillPattern: [],
            color: '#4d8f71',
            isFill: true
        }];
    }

    export class Mountains {

        width = 1024;
        height = 864;

        constructor(private pixSize: number) { }
        drawBackgroundImage(targetDom: HTMLElement) {

            targetDom.style.backgroundColor = "#99d9ea";

            let element = document.createElement("canvas");
            let ctx = element.getContext("2d");
            element.setAttribute("width", this.width.toString());
            element.setAttribute("height", this.height.toString());

            let mountains = [];
            mountains.push({ mount: new Mountain02(1120, 300, this.pixSize), offsetX: -340, offsetY: 864 - 235 });
            mountains.push({ mount: new Mountain03(820, 200, this.pixSize), offsetX: 0, offsetY: 864 - 200 });
            mountains.push({ mount: new Mountain02(600, 170, this.pixSize), offsetX: 350, offsetY: 864 - 200 });
            mountains.push({ mount: new Mountain01(350, 170, this.pixSize), offsetX: 0, offsetY: 864 - 170 });

            MyQ.Promise.reduce(mountains, this.composition(ctx)).then(() => {
                targetDom.style.backgroundImage = `url(${element.toDataURL()})`;
                targetDom.style.backgroundPosition = "left bottom";
                targetDom.style.backgroundRepeat = "repeat-x";
            });
        }
        private composition(ctx: CanvasRenderingContext2D): { (q: MyQ.Deferred<{}>, value: { mount: AbstractMountain, offsetX: number, offsetY: number }) } {
            return (q: MyQ.Deferred<{}>, value: { mount: AbstractMountain, offsetX: number, offsetY: number }) => {
                value.mount.createImage().then((img) => {
                    ctx.drawImage(img, value.offsetX, value.offsetY);
                    q.resolve({});
                });
            }
        }
    }
}