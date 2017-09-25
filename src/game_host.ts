/// <reference path="./abstract_game_peer.ts" />

namespace Charjs {
    export class GameHost extends AbstractGamePeer {

        private _initDefer: MyQ.Deferred<{}> = MyQ.Deferred.defer<{}>();
        private _clientInitDoneDefer: MyQ.Deferred<{}> = MyQ.Deferred.defer<{}>();
        private _apiKey: string = undefined;

        public static apiKey = null;

        public static GetController(peerId?: string, targetDom?: HTMLElement, charSize?: number, frameInterval?: number, goolCallback?: { (name: string, point: number) }, gameoverCallback?: { (name: string, point: number) }): GameHost {
            let gameHost = null;
            if (peerId) {
                gameHost = GameHost.GAME_MASTERS[peerId];
                if (gameHost) {
                    return gameHost;
                }
            }

            if (targetDom) {
                gameHost = new GameHost(targetDom, charSize, frameInterval, goolCallback, gameoverCallback);
                gameHost._apiKey = GameHost.apiKey;
                return gameHost;
            } else {
                return null;
            }
        }

        public openHost(): MyQ.Promise<string> {
            let d = MyQ.Deferred.defer<string>();
            let peer = this.createPeer(this._apiKey)

            peer.setReciveCallback(AbstractGamePeer.CONNECTED_COMMAND, () => {
                this._initDefer.resolve({});
            });
            peer.setReciveCallback(AbstractGamePeer.CLIENT_INIT_DONE_COMMAND, () => {
                this._clientInitDoneDefer.resolve({});
            })

            peer.open().then((id) => {
                this._peerId = id;
                GameHost.GAME_MASTERS[id] = this;
                d.resolve(id);
            });

            peer.setReciveCallback(AbstractGamePeer.CREATE_PLAYER_COMMAND, this.create2ndPlayer);

            return d.promise;
        }

        create2ndPlayer = (command: IRemoteCommand) => {
            let args: any[] = [];
            args.push(ClassUtil.getClass(command.target, Charjs));

            let master = GameHost.GetController(this._peerId);
            let player = master.CreatePlayerInstance.apply(this, args.concat(command.data));
            let controller = new PlayerProxy(player, this._peer);
            this._peer.setReciveCallback(player._name, controller.onCommand);
        }

        public initDone() {
            this._peer.send(AbstractGamePeer.HOST_INIT_DONE_COMMAND, []);
        }

        public gameStart() {
            this.clinetInit().then(() => {
                this._init();
                this._start();
            });
        }

        private _init() {
            this._peer.send(GameHost.INIT_COMMAND, {});
            super.init();
        }

        private _start() {
            this._peer.send(GameHost.START_COMMAND, {});
            super.start();
        }

        public onClientConnected(): MyQ.Promise<{}> {
            return this._initDefer.promise;
        }

        public clinetInit(): MyQ.Promise<{}> {
            return this._clientInitDoneDefer.promise;
        }

        public CreatePlayerInstanceWithRemote(clz: any, position: IPosition, direction = Direction.Right, name?: string): AbstractPlayer {
            name = name || RandomGenerator.generateUUIDv4();

            let command: IRemoteCommand = {
                target: clz.name,
                data: [position, direction, name]
            }

            this._peer.send(GameHost.CREATE_PLAYER_COMMAND, command);
            return super.CreatePlayerInstance(clz, position, direction, name);
        }

        public CreateEnemyInstanceWithRemote(clz: any, position: IPosition, direction = Direction.Right): AbstractEnemy {
            let command: IRemoteCommand = {
                target: clz.name,
                data: [position, direction]
            }
            this._peer.send(GameHost.CREATE_ENEMY_COMMAND, command);
            return super.CreateEnemyInstance(clz, position, direction);
        }

        public CreateObjectInstanceWithRemote(clz: any, position: IPosition): AbstractOtherObject {
            let command: IRemoteCommand = {
                target: clz.name,
                data: [position]
            }
            this._peer.send(GameHost.CREATE_OBJECT_COMMAND, command);
            return super.CreateObjectInstance(clz, position);
        }
    }
}