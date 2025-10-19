import { getApiBaseUrl } from "./api-config";

export const authConfig = {
  googleAuthUrl: `${getApiBaseUrl()}/api/auth/google`,
  authUrl: `${getApiBaseUrl()}/api/auth`,
  googleStatusUrl: `${getApiBaseUrl()}/api/auth/google/status`,
  redirectUri:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://nirvanaflow.vercel.app",
};
