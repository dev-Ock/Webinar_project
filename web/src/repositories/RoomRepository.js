import {Repository} from "./Repository";

export default class RoomRepository extends Repository {
    constructor(props) {
        super();

        this.requestPrefix = props.serverContextPath + "/api/v1/rooms";
    }

    makeRoom = (param) => {
        return new Promise((resolve, reject) => {
            this.getRequestPromise('post', this.requestPrefix + '/insert', param)
                .then(data => {
                    console.log('roomdata',data)
                    // const token = data.token;
                    // this.setAuthTokenToStorage(token);

                    resolve(data.room);
                })
                .catch(error => {
                    console.log('roomerror',error)
                    // this.removeAuthTokenFromStorage();

                    reject(error);
                });
        });
    }
}