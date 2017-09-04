export interface Login {
    refreshToken: string;
    accessToken: string;
    serverPath: number;
    pushRegistrationId: string;
}

export interface LoginPin {
    Pin: string,
    PushRegistrationId: string,
    Device: string,
}

export interface LoginSystem {
    Email: string,
    Password: string
}

export interface LoginAzurUser {
    pin: string,
    login: string,
    name: string
}