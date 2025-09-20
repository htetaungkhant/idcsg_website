import bcrypt from 'bcryptjs';

/**
 * Hash a password using bcrypt
 * @param password - Plain text password to hash
 * @returns Promise that resolves to the hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Higher number = more secure but slower
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against its hash
 * @param password - Plain text password to verify
 * @param hashedPassword - The hashed password to compare against
 * @returns Promise that resolves to true if password matches, false otherwise
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}