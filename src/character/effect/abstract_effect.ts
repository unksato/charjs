namespace Charjs {
    export abstract class AbstractEffect extends AbstractObject {
        constructor(targetDom: HTMLElement, protected pixSize = 2, public zIndex = 110, protected frameInterval = 45) {
            super(targetDom, pixSize, undefined, undefined, false, false, zIndex);
        }
        onPushedUp(player: IPlayer) { }
        onStepped(player: IPlayer) { }
    }
}