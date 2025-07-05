import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { db } from "../database/database";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

export interface User {
  id: string;
  email: string;
  name: string;
  country: string;
  timezone: string;
  base_currency: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  country?: string;
  timezone?: string;
  base_currency?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  static verifyToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return decoded;
    } catch (error) {
      return null;
    }
  }

  static async createUser(userData: CreateUserData): Promise<AuthResult> {
    const {
      email,
      password,
      name,
      country = "Ethiopia",
      timezone = "Africa/Addis_Ababa",
      base_currency = "ETB",
    } = userData;

    // Check if user already exists
    const existingUser = await db.get("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);
    const userId = uuidv4();

    // Create user
    await db.transaction(async () => {
      await db.run(
        `INSERT INTO users (id, email, password_hash, name, country, timezone, base_currency) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, email, passwordHash, name, country, timezone, base_currency],
      );

      // Create default user settings
      await db.run(
        `INSERT INTO user_settings (id, user_id, theme, language, hide_balances, price_alerts, news_updates) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [uuidv4(), userId, "dark", "English", false, true, true],
      );
    });

    // Get created user
    const user = await this.getUserById(userId);
    const token = this.generateToken(userId);

    // Store session
    await this.createSession(userId, token);

    return { user, token };
  }

  static async loginUser(credentials: LoginCredentials): Promise<AuthResult> {
    const { email, password } = credentials;

    // Get user with password hash
    const userWithPassword = await db.get(
      "SELECT id, email, password_hash, name, country, timezone, base_currency, created_at, updated_at FROM users WHERE email = ?",
      [email],
    );

    if (!userWithPassword) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(
      password,
      userWithPassword.password_hash,
    );
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Remove password hash from user object
    const { password_hash, ...user } = userWithPassword;
    const token = this.generateToken(user.id);

    // Store session
    await this.createSession(user.id, token);

    return { user, token };
  }

  static async getUserById(userId: string): Promise<User> {
    const user = await db.get(
      "SELECT id, email, name, country, timezone, base_currency, created_at, updated_at FROM users WHERE id = ?",
      [userId],
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  static async updateUser(
    userId: string,
    updateData: Partial<User>,
  ): Promise<User> {
    const allowedFields = ["name", "country", "timezone", "base_currency"];
    const updates = Object.keys(updateData)
      .filter((key) => allowedFields.includes(key))
      .map((key) => `${key} = ?`)
      .join(", ");

    if (updates.length === 0) {
      throw new Error("No valid fields to update");
    }

    const values = Object.keys(updateData)
      .filter((key) => allowedFields.includes(key))
      .map((key) => updateData[key as keyof User]);

    await db.run(
      `UPDATE users SET ${updates}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, userId],
    );

    return this.getUserById(userId);
  }

  static async createSession(userId: string, token: string): Promise<void> {
    const sessionId = uuidv4();
    const tokenHash = await bcrypt.hash(token, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await db.run(
      "INSERT INTO user_sessions (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)",
      [sessionId, userId, tokenHash, expiresAt.toISOString()],
    );
  }

  static async validateSession(token: string): Promise<User | null> {
    const decoded = this.verifyToken(token);
    if (!decoded) {
      return null;
    }

    try {
      const user = await this.getUserById(decoded.userId);
      return user;
    } catch (error) {
      return null;
    }
  }

  static async logout(userId: string, token: string): Promise<void> {
    const tokenHash = await bcrypt.hash(token, 10);
    await db.run(
      "DELETE FROM user_sessions WHERE user_id = ? AND token_hash = ?",
      [userId, tokenHash],
    );
  }

  static async cleanupExpiredSessions(): Promise<void> {
    await db.run(
      "DELETE FROM user_sessions WHERE expires_at < CURRENT_TIMESTAMP",
    );
  }
}
