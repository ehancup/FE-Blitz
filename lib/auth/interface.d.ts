export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    rpw? : string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    data: {
        id: string;
        name: string;
        email: string;
        role: "user" | "seller" | "admin";
        access_token: string;
        refresh_token: string;
    }
}

export interface ProfileResponse {
    data: {
        id: string;
        name: string;
        email: string;
        avatar: string;
        role: "user" | "seller" | "admin";
        gender: "pria" | "wanita" | "unknown";
        refresh_token: string;
        provider: "credential";
        created_at: string;
        updated_at: string;
        last_logged_in: string;
    }
}