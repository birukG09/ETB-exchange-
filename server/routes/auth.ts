import { RequestHandler } from "express";
import {
  AuthService,
  CreateUserData,
  LoginCredentials,
} from "../services/authService";
import { AuthenticatedRequest } from "../middleware/auth";

export const handleRegister: RequestHandler = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      country,
      timezone,
      base_currency,
    }: CreateUserData = req.body;

    // Basic validation
    if (!email || !password || !name) {
      res.status(400).json({
        success: false,
        error: "Email, password, and name are required",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters long",
      });
      return;
    }

    const result = await AuthService.createUser({
      email,
      password,
      name,
      country,
      timezone,
      base_currency,
    });

    res.status(201).json({
      success: true,
      data: result,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Registration failed",
    });
  }
};

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password }: LoginCredentials = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
      return;
    }

    const result = await AuthService.loginUser({ email, password });

    res.json({
      success: true,
      data: result,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    });
  }
};

export const handleLogout: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
) => {
  try {
    const userId = req.user?.id;
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (userId && token) {
      await AuthService.logout(userId, token);
    }

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      error: "Logout failed",
    });
  }
};

export const handleGetProfile: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
) => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get profile",
    });
  }
};

export const handleUpdateProfile: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }

    const { name, country, timezone, base_currency } = req.body;
    const updateData: any = {};

    if (name) updateData.name = name;
    if (country) updateData.country = country;
    if (timezone) updateData.timezone = timezone;
    if (base_currency) updateData.base_currency = base_currency;

    const updatedUser = await AuthService.updateUser(userId, updateData);

    res.json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    });
  }
};
