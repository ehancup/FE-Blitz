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

export interface Profile {
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

export interface ProfileResponse {
    data: Profile
}

export interface ForgotPassPayload {
    email: string;
}

export interface ResetPassPayload {
    password: string;
    rpw?: string
}