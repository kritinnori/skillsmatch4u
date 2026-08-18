import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";

// --- Pool configuration ---

const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || "",
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || "",
};

export const userPool = new CognitoUserPool(poolData);

// --- Types ---

export interface AuthUser {
  id: string; // Cognito sub
  email?: string;
  created_at?: string;
  user_metadata?: { name?: string; full_name?: string };
}

// --- Sign Up ---

export function signUp(email: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const attributeList = [
      new CognitoUserAttribute({ Name: "email", Value: email }),
    ];

    userPool.signUp(email, password, attributeList, [], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      if (!result) {
        reject(new Error("Sign up failed with no result"));
        return;
      }
      resolve();
    });
  });
}

// --- Confirm Sign Up (email verification code) ---

export function confirmSignUp(email: string, code: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.confirmRegistration(code, true, (err, _result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

// --- Resend confirmation code ---

export function resendConfirmationCode(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.resendConfirmationCode((err, _result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

// --- Sign In ---

export function signIn(email: string, password: string): Promise<CognitoUserSession> {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session) => {
        resolve(session);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
}

// --- Sign Out ---

export function signOut(): void {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
}

// --- Get Current User ---

export function getCurrentUser(): CognitoUser | null {
  return userPool.getCurrentUser();
}

// --- Get Session (returns access token JWT) ---

export function getSession(): Promise<CognitoUserSession> {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) {
      reject(new Error("No user signed in"));
      return;
    }

    cognitoUser.getSession(
      (err: Error | null, session: CognitoUserSession | null) => {
        if (err || !session) {
          reject(err || new Error("No session"));
          return;
        }
        if (!session.isValid()) {
          reject(new Error("Session expired"));
          return;
        }
        resolve(session);
      }
    );
  });
}

// --- Get Access Token string (used for API authorization) ---
// We use the ID token because it contains email and sub claims
// that the backend needs for user identification.

export async function getAccessToken(): Promise<string> {
  const session = await getSession();
  return session.getIdToken().getJwtToken();
}

// --- Get ID Token string (contains email, sub, etc.) ---

export async function getIdToken(): Promise<string> {
  const session = await getSession();
  return session.getIdToken().getJwtToken();
}

// --- Get authenticated user info ---

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const session = await getSession();
    const idToken = session.getIdToken();
    const payload = idToken.decodePayload();

    return {
      id: payload.sub,
      email: payload.email,
      created_at: payload.auth_time
        ? new Date(payload.auth_time * 1000).toISOString()
        : undefined,
      user_metadata: {
        name: payload.name || payload.email?.split("@")[0],
      },
    };
  } catch {
    return null;
  }
}

// --- Forgot Password ---

export function forgotPassword(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.forgotPassword({
      onSuccess: () => {
        resolve();
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
}

// --- Confirm new password (after forgotPassword) ---

export function confirmNewPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: () => {
        resolve();
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
}

// --- Listen for auth state changes (polling-based since Cognito SDK doesn't have real-time listeners) ---

type AuthChangeCallback = (user: AuthUser | null) => void;

let authListener: ReturnType<typeof setInterval> | null = null;
let lastKnownUser: string | null = null;

export function onAuthStateChange(callback: AuthChangeCallback): () => void {
  // Initial check
  getAuthUser().then((user) => {
    lastKnownUser = user?.id ?? null;
    callback(user);
  });

  // Poll every 2 seconds for session changes (sign in/out from other tabs, etc.)
  authListener = setInterval(async () => {
    const user = await getAuthUser();
    const currentId = user?.id ?? null;
    if (currentId !== lastKnownUser) {
      lastKnownUser = currentId;
      callback(user);
    }
  }, 2000);

  // Return unsubscribe function
  return () => {
    if (authListener) {
      clearInterval(authListener);
      authListener = null;
    }
  };
}
