import * as bcrypt from 'bcrypt';

const SALT_FACTOR = 10;

export function generateRandomPassword() {
  return Math.random().toString(36).substring(2, 8);
}
export function verifyPassword(
  plain: string,
  hashed: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt
    .genSalt(SALT_FACTOR)
    .then((salt) => bcrypt.hash(password, salt));
}
