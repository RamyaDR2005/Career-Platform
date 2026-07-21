let cachedToken: string | null = null;
let tokenExpiration: number = 0;

export async function getDropboxToken(): Promise<string> {
  // Return cached token if it's still valid for at least 5 more minutes
  if (cachedToken && Date.now() < tokenExpiration - 5 * 60 * 1000) {
    return cachedToken;
  }

  const clientId = process.env.DROPBOX_APP_KEY || process.env.DROPBOX_App_key;
  const clientSecret = process.env.DROPBOX_APP_SECRET || process.env.DROPBOX_App_secret;
  const refreshToken = process.env.DROPBOX_REFRESH_TOKEN || process.env.DROPBOX_Refresh_token;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Dropbox OAuth credentials in environment variables.");
  }

  const tokenUrl = "https://api.dropbox.com/oauth2/token";
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  const authHeader = "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": authHeader,
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Dropbox token refresh failed:", errorText);
    throw new Error("Failed to refresh Dropbox access token");
  }

  const data = await response.json();
  
  cachedToken = data.access_token;
  // data.expires_in is usually 14400 (4 hours)
  tokenExpiration = Date.now() + data.expires_in * 1000;

  return cachedToken as string;
}
