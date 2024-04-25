export default () => ({
  storefront_url: process.env.STOREFRONT_URL,
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
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
  mail: {
    sendgrid_api_key: process.env.SENDGRID_API_KEY,
    sendgrid_send_from: process.env.SENDGRID_SEND_FROM,
    sendgrid_user_registration_template_id:
      process.env.SENDGRID_USER_REGISTRATION_TEMPLATE_ID,
    sendgrid_user_reset_password_template_id:
      process.env.SENDGRID_USER_RESET_PASSWORD_TEMPLATE_ID,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
});
