/// <reference path="./abstract_game_peer.ts" />

namespace Charjs {
    export class GameHost extends AbstractGamePeer {

        private _initDefer: MyQ.Deferred<{}> = MyQ.Deferred.defer<{}>();;

        public getRemoteClient(): RemoteClient {
            return new RemoteClient();
        }

        public getRemoteControllerHost(player: IPlayer): RemoteControllerHost {
            let remoteController = new RemoteControllerHost().setPeer(this.createPeer()).init(player);
            remoteController.registerCommand();
            return remoteController;
        }

        public static GetController(gameId?: string, targetDom?: HTMLElement, charSize?: number, frameInterval?: number, goolCallback?: { (name: string, point: number) }, gameoverCallback?: { (name: string, point: number) }): GameHost {
            let gameHost = null;
            if (gameId) {
                gameHost = GameHost.GAME_MASTERS[gameId];
                if (gameHost) {
                    return gameHost;
                }
            }

            if (targetDom) {
                gameHost = new GameHost(targetDom, charSize, frameInterval, goolCallback, gameoverCallback);
                return gameHost;
            } else {
                return null;
            }
        }

        public openHost(): MyQ.Promise<string> {
            let d = MyQ.Deferred.defer<string>();
            let peer = this.createPeer()

            peer.setReciveCallback("init", () => {
                this._initDefer.resolve({});
            });

            peer.open().then((id) => {
                this._peerId = id;
                GameHost[id] = this;
                d.resolve(id);
            });
            return d.promise;
        }

        public onInit(): MyQ.Promise<{}> {
            return this._initDefer.promise;
        }

        public CreatePlayerInstance(clz: any, position: IPosition, direction = Direction.Right, name?: string): AbstractPlayer {
            let command: IRemoteCommand = {
                target: clz.name,
                data: [position, direction, name]
            }
            this._peer.send(GameHost.CREATE_PLAYER_COMMAND, command);
            return super.CreatePlayerInstance(clz, position, direction, name);
        }

        public CreateEnemyInstance(clz: any, position: IPosition, direction = Direction.Right): AbstractEnemy {
            let command: IRemoteCommand = {
                target: clz.name,
                data: [position, direction]
            }
            this._peer.send(GameHost.CREATE_ENEMY_COMMAND, command);
            return super.CreateEnemyInstance(clz, position, direction);
        }

        public CreateObjectInstance(clz: any, position: IPosition): AbstractOtherObject {
            let command: IRemoteCommand = {
                target: clz.name,
                data: [position]
            }
            this._peer.send(GameHost.CREATE_OBJECT_COMMAND, command);
            return super.CreateObjectInstance(clz, position);
        }
    }
}