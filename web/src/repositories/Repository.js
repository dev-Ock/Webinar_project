import axios from "axios";

export const AuthTokenStorageKey = '__OTL_Authentication_Token__';

export const RoomMakeID= '__OTL_RoomMake_Id__';
export const RoomMakePublisherId = '__OTL_RoomMake_PublisherId__';
export const RoomMakeStreamUrl = '__OTL_RoomMake_StreamUrl__';


// const LogPrefix = '[Repository]';
export class Repository {
    getRequestPromise = (method, url, data, contentType) => {
        const token = sessionStorage.getItem(AuthTokenStorageKey);
        const headers = Boolean(token) ? {'X-Auth-Token': token, 'Content-Type': (contentType ? contentType : 'application/json')} : {};

        return new Promise((resolve, reject) => {
            const config = {
                method: method,
                url: url,
                headers: headers,
                data: data,
            };
            
            console.log("url : ", config.url)
            // console.log(LogPrefix, 'HTTP requesting :', config);
            axios.request(config)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    getAuthTokenFromStorage = () => {
        return sessionStorage.getItem(AuthTokenStorageKey);
    }

    setAuthTokenToStorage = (token) => {
        sessionStorage.setItem(AuthTokenStorageKey, token);
    }

    removeAuthTokenFromStorage = () => {
        sessionStorage.removeItem(AuthTokenStorageKey);
    }

    // streamUrl store 저장할때까지 임시로 seesionStorage에 저장
    // getRoomStreamURlToStorage = () => {
    //     sessionStorage.getItem(RoomMakeStreamUrl);
    // }
    
    setRoomStreamURlToStorage = (streamUrl) => {
        sessionStorage.setItem(RoomMakeStreamUrl, streamUrl);
    }
    
    setRoomdataToStorage = (key, value) => {
        sessionStorage.setItem(key, value);
    }
    
    removeRoomdataFromStorage = (key) => {
        sessionStorage.removeItem(key);
    }
    
    removeRoomStreamURlToStorage = () => {
        sessionStorage.removeItem(RoomMakeStreamUrl);
    }
}