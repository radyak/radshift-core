export interface User {
    username: string;
    permissions: string[];
    password?: string;
    passwordRepeat?: string;
}
