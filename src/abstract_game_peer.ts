/// <reference path="./game_master.ts" />

namespace Charjs {

    export interface IRemoteCommand {
        target: string;
        data: any[];
    }

    export abstract class AbstractGamePeer extends GameMaster {
        protected _peer: PeerConnector = null;
        protected _peerId: string = null;

        public createPeer(): PeerConnector {
            if (!this._peer)
                this._peer = PeerConnector.getPeer();
            return this._peer;
        }

        public registerEvent() {
            this._peer.setReciveCallback("createPlayer", this.createRemotePlayer);
            this._peer.setReciveCallback("createEnemy", this.createRemoteEnemy);
            this._peer.setReciveCallback("createObject", this.createRemoteObject);
        }

        createRemotePlayer(command: IRemoteCommand) {
            let args: any[] = [];
            args.push(ClassUtil.getClass(command.target, Charjs));

            let master = GameMaster.GetController(this._peerId);
            let player = master.CreatePlayerInstance.apply(this, args.concat(command.data));
            let controller = new Charjs.RemoteControllerHost().setPeer(this._peer).init(player);
            this._peer.setReciveCallback("control", controller.onRecive);
        }

        createRemoteEnemy(command: IRemoteCommand) {
            let args: any[] = [];
            args.push(ClassUtil.getClass(command.target, Charjs));

            let master = GameMaster.GetController(this._peerId);
            let player = master.CreatePlayerInstance.apply(this, args.concat(command.data));
        }

        createRemoteObject(command: IRemoteCommand) {
            let args: any[] = [];
            args.push(ClassUtil.getClass(command.target, Charjs));

            let master = GameMaster.GetController(this._peerId);
            master.CreateObjectInstance.apply(this, args.concat(command.data));
        }
    }

}