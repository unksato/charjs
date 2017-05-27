
namespace Charjs {
    export class StarEffect extends AbstractEffect {
        cchars = [[[0, 7, 1, 2, 0, 7], [0, 7, 1, 2, 0, 5, 1, 2], [0, 6, 1, 3, 0, 3, 1, 4], [0, 6, 1, 9, 0, 1], [0, 6, 1, 9, 0, 1], [0, 5, 1, 9, 0, 2], [1, 14, 0, 2], [1, 13, 0, 3], [0, 1, 1, 13, 0, 2], [0, 2, 1, 13, 0, 1], [0, 3, 1, 13], [0, 2, 1, 14], [0, 1, 1, 9, 0, 6], [0, 1, 1, 8, 0, 7], [1, 4, 0, 2, 1, 3, 0, 7], [1, 2, 0, 5, 1, 1, 0, 8]]];
        colors = ['', '#fff'];
        chars = null;
        // chars = [
        //     [
        //         [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        //         [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1],
        //         [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1],
        //         [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        //         [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        //         [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        //         [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        //         [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        //         [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        //         [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        //         [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        //         [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        //         [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        //         [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        //         [1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        //         [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]
        //     ]
        // ];

        init(): StarEffect {
            super.init();
            return this;
        }

        private static staticEffect: StarEffect = null;

        public static drawStar(targetDom: HTMLElement, pos: IPosition, pixSize: number) {
            if (!StarEffect.staticEffect) {
                StarEffect.staticEffect = new StarEffect(targetDom, pixSize);
                StarEffect.staticEffect.init();
            }
            StarEffect.staticEffect.drawEffect(pos);
        }

        drawEffect(pos: IPosition) {
            this.draw(0, pos);
            let tEffect = this.getTimer(() => {
                this.destroy();
                this.removeTimer(tEffect);
            }, this.frameInterval);
        }
    }
}
