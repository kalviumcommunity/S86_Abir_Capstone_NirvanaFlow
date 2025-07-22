import connectDb from './db';
import User from '@/models/Users';
import { oauth2Client } from './google';

export async function getUserTokens(uid: string) {
  await connectDb();
  const user = await User.findOne({ uid });
  if (!user) throw new Error('User not found');

  // Check if token is expired
  if (user.googleTokenExpiry && new Date() > new Date(user.googleTokenExpiry)) {
    try {
      oauth2Client.setCredentials({
        refresh_token: user.googleRefreshToken
      });

      const { credentials } = await oauth2Client.refreshAccessToken();
      
      // Update tokens in database
      await User.findOneAndUpdate(
        { uid },
        {
          googleAccessToken: credentials.access_token,
          googleTokenExpiry: new Date(Date.now() + (credentials.expiry_date || 3600000)),
        }
      );

      return {
        access_token: credentials.access_token,
        refresh_token: user.googleRefreshToken,
      };
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Failed to refresh Google token');
    }
  }

  return {
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
  };
}
