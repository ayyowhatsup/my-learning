export default () => ({
  storefront_reset_password_url: process.env.STOREFRONT_RESET_PASSWORD_URL,
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: process.env.DATABASE_TYPE || 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
  auth: {
    password_hash_salt_factor: parseInt(process.env.PASSWORD_HASH_SALT_FACTOR),
    jwt_secret: process.env.JWT_SECRET,
    jwt_access_token_ttl: process.env.JWT_ACCESS_TOKEN_TTL,
    refresh_token_ttl: process.env.REFRESH_TOKEN_TTL,
    register_token_ttl: process.env.REGISTER_TOKEN_TTL,
    reset_password_ttl: process.env.RESET_PASSWORD_TTL,
  },
  google: {
    auth: {
      access_token: process.env.GOOGLE_AUTH_ACCESS_TOKEN,
      refresh_token: process.env.GOOGLE_AUTH_REFRESH_TOKEN,
      client_id: process.env.GOOGLE_AUTH_CLIENT_ID,
      client_secret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      user: process.env.GOOGLE_AUTH_USER,
    },
  },
  redis: {
    url: process.env.REDIS_URL,
  },
});
