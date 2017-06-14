/// <reference path="./abstract_game_peer.ts" />

namespace Charjs {
    export class GameHost extends AbstractGamePeer {

        public getRemoteClient(): RemoteClient {
            return new RemoteClient();
        }

        public getRemoteControllerHost(player: IPlayer): RemoteControllerHost {
            let remoteController = new RemoteControllerHost().setPeer(this.createPeer()).init(player);
            remoteController.registerCommand();
            return remoteController;
        }

        public openHost(callback: { (id: string) }) {
            this.createPeer().open().then((id) => {
                this._peerId = id;
                if (callback) callback(id);
            });
        }

    }
}