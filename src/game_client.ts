/// <reference path="./abstract_game_peer.ts" />

namespace Charjs {
    export class GameClient extends AbstractGamePeer {


        public static GetController(gameId?: string, targetDom?: HTMLElement, charSize?: number, frameInterval?: number, goolCallback?: { (name: string, point: number) }, gameoverCallback?: { (name: string, point: number) }): GameHost {
            let gameClient = null;
            if (gameId) {
                gameClient = GameClient.GAME_MASTERS[gameId];
                if (gameClient) {
                    return gameClient;
                }
            }

            if (targetDom) {
                gameClient = new GameClient(targetDom, charSize, frameInterval, goolCallback, gameoverCallback).connectToRemoteHost(gameId);
                GameClient.GAME_MASTERS[gameId] = gameClient;
                gameClient.registerEvent();
                return gameClient;
            } else {
                return null;
            }
        }

        public connectToRemoteHost(peerId: string) {
            this.setPeerId(peerId);
            this.createPeer().connect(this._peerId).then(() => {
                // send init message
                this._peer.send("init", []);
            });
            return this;
        }

        public registerEvent() {
            this._peer.setReciveCallback(AbstractGamePeer.CREATE_PLAYER_COMMAND, this.createRemotePlayer);
            this._peer.setReciveCallback(AbstractGamePeer.CREATE_ENEMY_COMMAND, this.createRemoteEnemy);
            this._peer.setReciveCallback(AbstractGamePeer.CREATE_OBJECT_COMMAND, this.createRemoteObject);
        }

        createRemotePlayer = (command: IRemoteCommand) => {
            let args: any[] = [];
            args.push(ClassUtil.getClass(command.target, Charjs));

            let master = GameClient.GetController(this._peerId);
            let player = master.CreatePlayerInstance.apply(this, args.concat(command.data));
            let controller = new Charjs.RemoteControllerHost().setPeer(this._peer).init(player);
            this._peer.setReciveCallback("control", controller.onRecive);
        }

        createRemoteEnemy = (command: IRemoteCommand) => {
            let args: any[] = [];
            args.push(ClassUtil.getClass(command.target, Charjs));

            let master = GameClient.GetController(this._peerId);
            let player = master.CreatePlayerInstance.apply(this, args.concat(command.data));
        }

        createRemoteObject = (command: IRemoteCommand) => {
            let args: any[] = [];
            args.push(ClassUtil.getClass(command.target, Charjs));

            let master = GameClient.GetController(this._peerId);
            master.CreateObjectInstance.apply(this, args.concat(command.data));
        }
    }
}