export interface JwtPayload {
    sub: string;
    auth: string[];
    exp: number;
}
