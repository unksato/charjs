namespace Charjs {
    export abstract class AbstractPixel {
        protected static SHADOW_SIZE = 2;

        protected static drawPixel(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number = 1) {
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.rect(x * size, y * size, size, size);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
        protected static createCanvasElement(width: number, height: number, zIndex: number, shadow: boolean = false): HTMLCanvasElement {
            let element = document.createElement("canvas");
            if (shadow) {
                width += AbstractPixel.SHADOW_SIZE;
            }
            element.setAttribute("width", width.toString());
            element.setAttribute("height", height.toString());
            element.style.cssText = `z-index: ${zIndex}; position: absolute; bottom: 0;`;
            return element;
        }

        toImage(element: HTMLCanvasElement): MyQ.Promise<HTMLImageElement> {
            let q = MyQ.Deferred.defer<HTMLImageElement>();
            let img = new Image();
            img.onload = () => {
                q.resolve(img);
            }
            img.src = element.toDataURL();
            return q.promise;
        }

        static deepCopy<T>(obj: T): T {
            return JSON.parse(JSON.stringify(obj));
        }
    }
}