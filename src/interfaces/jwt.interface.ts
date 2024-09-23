export interface JwtPayload {
   id: string;
   role: string;
}

export type Tokens = {
   accessToken: string;
   refreshToken: string;
};