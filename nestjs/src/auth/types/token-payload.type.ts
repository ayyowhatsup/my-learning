type JwtTokenPayload = {
  sub: number;
  iat: number;
  exp: number;
  iss?: number;
};

export default JwtTokenPayload;
