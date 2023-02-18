import {serverContextPath} from "./AppConstants";
import AuthRepository from "./repositories/AuthRepository";
import RoomRepository from "./repositories/RoomRepository";
import RoomUserRepository from "./repositories/RoomUserRepository";
import RoomHistoryRepository from "./repositories/RoomHistoryRepository";


import AuthStore from "./stores/AuthStore";
import RoomStore from "./stores/RoomStore";
import RoomUserStore from "./stores/RoomUserStore"
import RoomUserHistoryRepository from "./repositories/RoomUserHistoryRepository";

const repositoryProps = {
    serverContextPath: serverContextPath,
};

const authRepository = new AuthRepository(repositoryProps);
const roomRepository = new RoomRepository(repositoryProps);
const roomUserRepository = new RoomUserRepository(repositoryProps);
const roomHistoryRepository = new RoomHistoryRepository(repositoryProps);
const roomUserHistoryRepository = new RoomUserHistoryRepository(repositoryProps);

const storeProps = {
};

export const stores = {
    authStore: new AuthStore({authRepository, ...storeProps}),
    roomStore: new RoomStore({roomRepository, roomHistoryRepository, ...storeProps}),
    roomUserStore: new RoomUserStore({roomUserRepository, roomUserHistoryRepository,...storeProps}),
};
