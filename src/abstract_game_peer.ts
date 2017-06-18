/// <reference path="./game_master.ts" />

namespace Charjs {

    export interface IRemoteCommand {
        target: string;
        data: any[];
    }

    export abstract class AbstractGamePeer extends GameMaster {
        protected _peer: PeerConnector = null;
        protected _peerId: string = null;

        protected static INIT_COMMAND = "initGame";
        protected static START_COMMAND = "start";
        protected static CREATE_PLAYER_COMMAND = "createPlayer";
        protected static CREATE_ENEMY_COMMAND = "createEnemy";
        protected static CREATE_OBJECT_COMMAND = "createObject";

        protected static CLIENT_INIT_DONE_COMMAND = "clientInitDone";
        protected static HOST_INIT_DONE_COMMAND = "hostInitDone"

        protected static CONNECTED_COMMAND = "connectSuccess";

        public createPeer(): PeerConnector {
            if (!this._peer)
                this._peer = PeerConnector.getPeer();
            return this._peer;
        }

        protected setPeerId(peerId: string) {
            this._peerId = peerId;
        }
    }
}