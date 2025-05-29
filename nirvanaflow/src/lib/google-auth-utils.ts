
import connectDb from './db';
import User from '@/models/Users';

export async function getUserTokens(uid: string) {
  await connectDb();
  const user = await User.findOne({ uid });
  if (!user) throw new Error('User not found');

  return {
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
  };
}
