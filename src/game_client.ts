/// <reference path="./abstract_game_peer.ts" />

namespace Charjs {
    export class GameClinet extends AbstractGamePeer {

        private setPeerId(peerId: string) {
            this._peerId = peerId;
        }

        public connectToRemoteHost(peerId: string) {
            this.setPeerId(peerId);
            this.createPeer().connect(this._peerId).then(() => {
                // send init message
            });
        }
    }
}