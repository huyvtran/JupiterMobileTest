import {IDevice} from './device';

export interface ILogin {
    refreshToken: string;
    accessToken: string;
    serverPath: number;
    pushRegistrationId: string;
    pushEnabled: boolean;
}

export interface LoginPin {
    Pin: string,
    PushRegistrationId: string,
    Device: IDevice,
}

export interface LoginSystem {
    login: string
}

export interface LoginAzurUser {
    pin: string,
    login: string,
    name: string
}