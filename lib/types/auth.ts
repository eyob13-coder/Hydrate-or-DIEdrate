// Authentication related types

// Base params that are common to both sign-up and sign-in
interface BaseAuthParams {
  email: string;
  idToken: string;
}

// Sign-up specific params
export interface SignUpParams extends BaseAuthParams {
  uid: string;
  name: string;
}

// Sign-in specific params
export interface SignInParams extends BaseAuthParams {
  uid?: string;  // Optional for sign-in
  name?: string; // Optional for sign-in
}

export interface User {
  id: string;
  name: string;
  email: string;
  // Optional user properties
  profileURL?: string;
  resumeURL?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Response types for auth actions
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

// Session related types
export interface SessionUser {
  uid: string;
  email: string;
  name: string;
  // Add any additional session-specific fields
} 