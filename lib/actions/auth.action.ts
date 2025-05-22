"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { SignUpParams, SignInParams, User, AuthResponse } from "@/lib/types/auth";

const SESSION_DURATION = 60 * 60 * 24 * 7;

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();
  
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signUp(params: SignUpParams): Promise<AuthResponse> {
  const { uid, name, email } = params;

  try {
    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };

    const now = new Date();
    const userData: Omit<User, 'id'> = {
      name,
      email,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    // save user to db
    await db.collection("users").doc(uid).set(userData);

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
      user: {
        id: uid,
        ...userData
      }
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle Firebase specific errors
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

export async function signIn(params: SignInParams): Promise<AuthResponse> {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord)
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };

    await setSessionCookie(idToken);

    // Get user data from database
    const dbUser = await db.collection("users").doc(userRecord.uid).get();
    if (!dbUser.exists) {
      return {
        success: false,
        message: "User data not found.",
      };
    }

    const userData = dbUser.data();
    // Convert Firestore Timestamps to ISO strings
    const createdAt = userData?.createdAt?.toDate ? userData.createdAt.toDate().toISOString() : userData?.createdAt ?? null;
    const updatedAt = userData?.updatedAt?.toDate ? userData.updatedAt.toDate().toISOString() : userData?.updatedAt ?? null;

    return {
      success: true,
      message: "Successfully signed in.",
      user: {
        id: dbUser.id,
        name: userData?.name || "",
        email: userData?.email || "",
        ...userData,
        createdAt,
        updatedAt,
      }
    };
  } catch (error: any) {
    console.error("Error signing in:", error);

    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut(): Promise<AuthResponse> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    
    return {
      success: true,
      message: "Successfully signed out.",
    };
  } catch (error) {
    console.error("Error signing out:", error);
    return {
      success: false,
      message: "Failed to sign out. Please try again.",
    };
  }
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // get user info from db
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;

    const userData = userRecord.data();
    if (!userData) return null;

    // Convert Firestore Timestamps to ISO strings
    const createdAt = userData?.createdAt?.toDate ? userData.createdAt.toDate().toISOString() : userData?.createdAt ?? null;
    const updatedAt = userData?.updatedAt?.toDate ? userData.updatedAt.toDate().toISOString() : userData?.updatedAt ?? null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
      createdAt,
      updatedAt,
      
    } as User;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated(){
  const user = await getCurrentUser();
  return !!user;
}