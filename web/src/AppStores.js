import {serverContextPath} from "./AppConstants";
import AuthRepository from "./repositories/AuthRepository";
import RoomRepository from "./repositories/RoomRepository";


import AuthStore from "./stores/AuthStore";
import RoomStore from "./stores/RoomStore";

const repositoryProps = {
    serverContextPath: serverContextPath,
};

const authRepository = new AuthRepository(repositoryProps);
const roomRepository = new RoomRepository(repositoryProps);

const storeProps = {
};

export const stores = {
    authStore: new AuthStore({authRepository, ...storeProps}),
    roomStore: new RoomStore({roomRepository, ...storeProps})
};
