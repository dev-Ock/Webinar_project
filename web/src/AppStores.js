import {serverContextPath} from "./AppConstants";
import AuthRepository from "./repositories/AuthRepository";
import RoomRepository from "./repositories/RoomRepository";
import RoomUserRepository from "./repositories/RoomUserRepository";


import AuthStore from "./stores/AuthStore";
import RoomStore from "./stores/RoomStore";
import RoomUserStore from "./stores/RoomUserStore"

const repositoryProps = {
    serverContextPath: serverContextPath,
};

const authRepository = new AuthRepository(repositoryProps);
const roomRepository = new RoomRepository(repositoryProps);
const roomUserRepository = new RoomUserRepository(repositoryProps);

const storeProps = {
};

export const stores = {
    authStore: new AuthStore({authRepository, ...storeProps}),
    roomStore: new RoomStore({roomRepository, ...storeProps}),
    roomUserStore: new RoomUserStore({roomUserRepository, ...storeProps}),
};
