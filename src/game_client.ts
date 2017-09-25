/// <reference path="./abstract_game_peer.ts" />

namespace Charjs {
    export class GameClient extends AbstractGamePeer {

        private _hostInitDoneDefer: MyQ.Deferred<{}> = MyQ.Deferred.defer<{}>();
        public static apiKey = null;

        public static GetController(peerId?: string, targetDom?: HTMLElement, charSize?: number, frameInterval?: number, goolCallback?: { (name: string, point: number) }, gameoverCallback?: { (name: string, point: number) }): GameHost {
            let gameClient = null;
            if (peerId) {
                gameClient = GameClient.GAME_MASTERS[peerId];
                if (gameClient) {
                    return gameClient;
                }
            }

            if (targetDom) {
                gameClient = new GameClient(targetDom, charSize, frameInterval, goolCallback, gameoverCallback);
                gameClient.createPeer(GameClient.apiKey);
                gameClient.registerEvent();
                return gameClient;
            } else {
                return null;
            }
        }

        public connectToRemoteHost(peerId: string): MyQ.Promise<{}> {
            GameClient.GAME_MASTERS[peerId] = this;
            this.setPeerId(peerId);
            this.createPeer().connect(this._peerId).then(() => {
                this._peer.send(AbstractGamePeer.CONNECTED_COMMAND, []);
            });
            return this._hostInitDoneDefer.promise;
        }

        public registerEvent() {
            this._peer.setReciveCallback(AbstractGamePeer.HOST_INIT_DONE_COMMAND, this._hostInitDone);
            this._peer.setReciveCallback(AbstractGamePeer.INIT_COMMAND, this._init);
            this._peer.setReciveCallback(AbstractGamePeer.START_COMMAND, this._start);
            this._peer.setReciveCallback(AbstractGamePeer.CREATE_PLAYER_COMMAND, this.createRemotePlayer);
            this._peer.setReciveCallback(AbstractGamePeer.CREATE_ENEMY_COMMAND, this.createRemoteEnemy);
            this._peer.setReciveCallback(AbstractGamePeer.CREATE_OBJECT_COMMAND, this.createRemoteObject);
        }

        public initDone() {
            this._peer.send(AbstractGamePeer.CLIENT_INIT_DONE_COMMAND, []);
        }

        _hostInitDone = (command: IRemoteCommand) => {
            this._hostInitDoneDefer.resolve({});
        }

        _init = (command: IRemoteCommand) => {
            super.init();
        }

        _start = (command: IRemoteCommand) => {
            super.start();
        }

        createRemotePlayer = (command: IRemoteCommand) => {
            let args: any[] = [];
            args.push(ClassUtil.getClass(command.target, Charjs));

            let master = GameClient.GetController(this._peerId);
            let player = master.CreatePlayerInstance.apply(this, args.concat(command.data));
            let controller = new PlayerProxy(player, this._peer);
            this._peer.setReciveCallback(player._name, controller.onCommand);
        }

        createRemoteEnemy = (command: IRemoteCommand) => {
            let args: any[] = [];
            args.push(ClassUtil.getClass(command.target, Charjs));

            let master = GameClient.GetController(this._peerId);
            master.CreateEnemyInstance.apply(this, args.concat(command.data));
        }

        createRemoteObject = (command: IRemoteCommand) => {
            let args: any[] = [];
            args.push(ClassUtil.getClass(command.target, Charjs));

            let master = GameClient.GetController(this._peerId);
            master.CreateObjectInstance.apply(this, args.concat(command.data));
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
    }
}