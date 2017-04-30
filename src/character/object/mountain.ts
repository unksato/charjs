namespace Charjs {
    interface IBackgroundObjectData {
        start: number;
        end?: number;
        pattern: number[];
        fillPattern: number[];
        color: string;
        currentOffset?: number;
        isFill: boolean;
    }

    export abstract class AbstractBackgroundObject extends AbstractPixel {
        private _element: HTMLCanvasElement = null;
        abstract dataPattern: IBackgroundObjectData[];

        constructor(protected width: number, protected height: number, protected pixSize: number) {
            super();
        }

        createImage(element: HTMLCanvasElement): MyQ.Promise<HTMLImageElement> {
            return this.toImage(element);
        }

        draw(top: number = 0, numberOfLine: number = this.height): HTMLCanvasElement {
            if (!this._element) {
                this._element = AbstractMountain.createCanvasElement(this.width, this.height, 0);
                let ctx = this._element.getContext("2d");
                let center = this.width / this.pixSize / 2;
                let datas = this.deepCopy(this.dataPattern);
                for (let data of datas) {
                    data.currentOffset = center;
                }

                for (let i = 0; i < numberOfLine; i++) {
                    for (let data of datas) {
                        if (data.start <= i && (!data.end || data.end >= i)) {
                            let start = data.currentOffset - data.pattern[Math.min(i - data.start, data.pattern.length - 1)];
                            let end = data.isFill ? center : data.currentOffset + data.fillPattern[Math.min(i - data.start, data.fillPattern.length - 1)];
                            if (start == end) {
                                end++;
                            }
                            for (let w = start; w < end; w++) {
                                this.picWithMirror(center, ctx, w, i + top, data.color);
                            }
                            data.currentOffset = start;
                        }
                    }
                }
            }
            return this._element;
        }
        private picWithMirror(center: number, ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
            AbstractPixel.drawPixel(ctx, x, y, this.pixSize, color);
            let mirrorX = center + (center - x) - 1;
            AbstractPixel.drawPixel(ctx, mirrorX, y, this.pixSize, color);
        }
        private deepCopy<T>(obj: T): T {
            return JSON.parse(JSON.stringify(obj));
        }

    }

    export abstract class AbstractMountain extends AbstractBackgroundObject {

        private tree = [[0, 0, 1, 1, 0, 0],
        [0, 1, 1, 1, 2, 0],
        [0, 1, 1, 2, 2, 0],
        [1, 1, 1, 2, 2, 3],
        [1, 1, 2, 2, 3, 3],
        [1, 2, 2, 3, 3, 3],
        [0, 3, 3, 3, 3, 0],
        [0, 0, 3, 3, 0, 0]];

        abstract treeColors: string[];
        abstract treePattern: { x: number, y: number }[];
        private treeImage: HTMLImageElement = null;

        drawMountain(trees?: { x: number, y: number }[]): MyQ.Promise<HTMLImageElement> {
            let mountHeight = Math.min(this.height / this.pixSize, ((this.width / 2) - (this.dataPattern[0].pattern.reduce(function (prev, current) { return prev + current; }) * this.pixSize)) / (this.dataPattern[0].pattern[this.dataPattern[0].pattern.length - 1] * this.pixSize) + this.dataPattern[0].pattern.length);
            let top = (this.height / this.pixSize) - mountHeight;
            let mountElement = this.draw(top, mountHeight);

            return this.createTree().then((treeImage) => {
                this.treeImage = treeImage;

                for (let tree of trees) {
                    let ctx = mountElement.getContext("2d");
                    ctx.drawImage(this.treeImage, tree.x, tree.y);
                }

                return <any>this.createImage(mountElement);
            });
        }

        private createTree(): MyQ.Promise<HTMLImageElement> {
            if (!this.treeImage) {
                let treeElement = AbstractPixel.createCanvasElement(this.width, this.height, 0);
                let ctx = treeElement.getContext("2d");
                for (let y = 0; y < this.tree.length; y++) {
                    for (let x = 0; x < this.tree[y].length; x++) {
                        if (this.tree[y][x])
                            AbstractPixel.drawPixel(ctx, x, y, this.pixSize, this.treeColors[this.tree[y][x]]);
                    }
                }
                return this.toImage(treeElement);
            }
            return MyQ.Promise.when(this.treeImage);
        }
    }

    export class Cloud extends AbstractBackgroundObject {
        dataPattern = [{
            start: 0,
            pattern: [8, 3, 2, 1, 1, 0, 1, 0, 0, 0, -1, 0, -1, -1, -2, -3],
            fillPattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 5, 13],
            color: '#abe0f7',
            isFill: false
        }, {
            start: 1,
            end: 14,
            pattern: [8, 3, 2, 1, 0, 1, 0, 0, 0, -1, 0, -1, -2, -3],
            fillPattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 13],
            color: '#c3f8f8',
            isFill: false
        }, {
            start: 2,
            end: 13,
            pattern: [8, 3, 2, 0, 1, 0, 0, 0, -1, 0, -2, -3],
            fillPattern: [],
            color: '#e8f0f8',
            isFill: true
        }];

        drawCloud(): MyQ.Promise<HTMLImageElement> {
            let element = this.draw();
            let ctx = element.getContext("2d");
            let c = "#000";
            for (let i = 4; i < 8; i++) {
                AbstractPixel.drawPixel(ctx, 11, i, this.pixSize, c);
                AbstractPixel.drawPixel(ctx, 15, i, this.pixSize, c);
            }
            return this.createImage(element);
        }
    }

    export class Mountain01 extends AbstractMountain {
        treeColors = ['#98e0c0', '#88d0b0', '#78c0a0'];
        treePattern = [{ x: 160, y: 40 },
        { x: 128, y: 76 },
        { x: 193, y: 76 },
        { x: 240, y: 108 },
        { x: 224, y: 125 },
        { x: 80, y: 140 },
        { x: 96, y: 140 },
        { x: 160, y: 140 },
        { x: 63, y: 160 }];
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
        treeColors = ['#6daf91', '#5d9f81', '#4d8f71'];
        treePattern = [{ x: 300, y: 50 },
        { x: 396, y: 80 },
        { x: 427, y: 80 },
        { x: 413, y: 95 },
        { x: 180, y: 100 },
        { x: 365, y: 100 },
        { x: 382, y: 135 },
        { x: 141, y: 135 },
        { x: 267, y: 135 },
        { x: 300, y: 135 },
        { x: 557, y: 135 }]
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

    export class Mountain04 extends Mountain02 {
        treePattern = [{ x: 517, y: 34 },
        { x: 569, y: 34 },
        { x: 584, y: 44 },
        { x: 442, y: 69 },
        { x: 632, y: 68 },
        { x: 377, y: 100 },
        { x: 409, y: 100 },
        { x: 536, y: 100 },
        { x: 666, y: 100 },
        { x: 698, y: 100 },
        { x: 394, y: 116 },
        { x: 682, y: 116 },
        { x: 314, y: 136 },
        { x: 345, y: 136 },
        { x: 601, y: 136 },
        { x: 265, y: 165 },
        { x: 343, y: 165 },
        { x: 617, y: 150 }]
    }

    export class Mountain03 extends Mountain01 {
        treePattern = [{ x: 405, y: 37 },
        { x: 452, y: 37 },
        { x: 438, y: 55 },
        { x: 372, y: 72 },
        { x: 244, y: 103 },
        { x: 196, y: 135 },
        { x: 342, y: 135 },
        { x: 182, y: 152 },
        { x: 213, y: 167 },
        { x: 245, y: 167 }];
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

        drawBackgroundImage(targetDom: HTMLElement): MyQ.Promise<{}> {
            let d = MyQ.Deferred.defer();

            targetDom.style.backgroundColor = "#99d9ea";

            let element = document.createElement("canvas");
            let ctx = element.getContext("2d");
            element.setAttribute("width", this.width.toString());
            element.setAttribute("height", this.height.toString());

            let objs = [];
            let cloud = new Cloud(32 * this.pixSize, 16 * this.pixSize, this.pixSize);
            let rand = new RandomGenerator();

            for (let i = 0; i < 10; i++) {
                objs.push({ cloud: cloud, offsetX: rand.getCognitiveRandom(this.width - 32 * this.pixSize), offsetY: rand.getCognitiveRandom(this.height * 0.7) });
            }

            let mount04 = new Mountain04(1100, 250, this.pixSize);
            objs.push({ mount: mount04, offsetX: -330, offsetY: 864 - 250 });
            objs.push({ mount: mount04, offsetX: 695, offsetY: 864 - 250 });
            objs.push({ mount: new Mountain03(820, 200, this.pixSize), offsetX: 50, offsetY: 864 - 200 });
            objs.push({ mount: new Mountain02(700, 180, this.pixSize), offsetX: 350, offsetY: 864 - 180 });
            objs.push({ mount: new Mountain01(350, 150, this.pixSize), offsetX: 0, offsetY: 864 - 150 });

            MyQ.Promise.reduce(objs, this.composition(ctx)).then(() => {
                targetDom.style.backgroundImage = `url(${element.toDataURL()})`;
                targetDom.style.backgroundPosition = "left bottom";
                targetDom.style.backgroundRepeat = "repeat-x";
                d.resolve({});
            });

            return d.promise;
        }
        private composition(ctx: CanvasRenderingContext2D): { (q: MyQ.Deferred<{}>, value: { mount: AbstractMountain, offsetX: number, offsetY: number }) } {
            return (q: MyQ.Deferred<{}>, value: { mount: AbstractMountain, cloud: Cloud, offsetX: number, offsetY: number }) => {
                if (value.cloud) {
                    value.cloud.drawCloud().then((img) => {
                        ctx.drawImage(img, value.offsetX, value.offsetY);
                        q.resolve({});
                    });
                } else {
                    value.mount.drawMountain(value.mount.treePattern).then((img) => {
                        ctx.drawImage(img, value.offsetX, value.offsetY);
                        q.resolve({});
                    });
                }
            }
        }
    }
}