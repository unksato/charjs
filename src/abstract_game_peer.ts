namespace Charjs {
    export abstract class AbstractGamePeer extends GameMaster {
        protected _peer: PeerConnector = null;

        public createPeer(): PeerConnector {
            if (!this._peer)
                this._peer = PeerConnector.getPeer();
            return this._peer;
        }

    }
}