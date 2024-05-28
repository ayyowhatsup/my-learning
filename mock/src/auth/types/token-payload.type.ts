type JwtTokenPayload = {
  sub: number;
  isAdmin?: boolean;
  iat: number;
  exp: number;
  iss?: number;
};

export default JwtTokenPayload;
