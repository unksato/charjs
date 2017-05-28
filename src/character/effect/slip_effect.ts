
namespace Charjs {
    export class SlipEffect extends AbstractEffect {
        cchars = [[[0, 1, 1, 2, 0, 1], [1, 4], [1, 4], [0, 1, 1, 2, 0, 1]], [[0, 1, 1, 2, 0, 1], [1, 4], [0, 1, 1, 2, 0, 1], [0, 4]], [[0, 4], [0, 1, 1, 1, 0, 2], [0, 4], [0, 4]]];
        colors = ['', '#fff'];
        chars = null;
        // chars = [
        //     [
        //         [0, 1, 1, 0],
        //         [1, 1, 1, 1],
        //         [1, 1, 1, 1],
        //         [0, 1, 1, 0]
        //     ],
        //     [
        //         [0, 1, 1, 0],
        //         [1, 1, 1, 1],
        //         [0, 1, 1, 0],
        //         [0, 0, 0, 0]
        //     ],
        //     [
        //         [0, 0, 0, 0],
        //         [0, 1, 0, 0],
        //         [0, 0, 0, 0],
        //         [0, 0, 0, 0]
        //     ]
        // ];

        init(): StarEffect {
            super.init();
            return this;
        }

        private static staticEffect: SlipEffect = null;

        public static drawSlip(targetDom: HTMLElement, pos: IPosition, pixSize: number) {
            if (!SlipEffect.staticEffect) {
                SlipEffect.staticEffect = new SlipEffect(targetDom, pixSize);
                SlipEffect.staticEffect.init();
            }
            SlipEffect.staticEffect.drawEffect(pos);
        }

        drawEffect(pos: IPosition) {
            let count = 0;
            let current = this.draw(count, pos, undefined, undefined, true, undefined, true);
            count++;
            let tEffect = this.getTimer(() => {
                this.removeCharacter(current);
                if (count >= this.chars.length) {
                    this.destroy();
                    this.removeTimer(tEffect);
                } else {
                    current = this.draw(count, pos, undefined, undefined, true, undefined, true);
                    count++;
                }
            }, this.frameInterval * 2);
        }
    }
}
