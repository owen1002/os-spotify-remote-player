import NextAuth, { Account, User } from 'next-auth';
import SpotifyProvider, { SpotifyProfile } from 'next-auth/providers/spotify';
import spotifyApi, { LOGIN_URL } from '../../../lib/spotify';
import { JWT } from 'next-auth/jwt';
import { Session } from 'inspector';
import { ERROR } from '../../../lib/const';

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** Expires */
    accessTokenExpires: number;
    accessToken: string;
    refreshToken: string;
    username: string;
  }
}
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** accessToken. */
      accessToken: string;
      refreshToken: string;
      username: string;
      image: string;
      name: string;
      email: string;
    };
  }
}

async function refreshAccessToken(token: any) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);
    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    console.log(`REFRESH TOKEN IS ${refreshedToken.toString()}`);
    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error(token);
    return {
      ...token,
      error: ERROR.REFRESH_ACCESS_TOKEN_ERROR,
    };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET!,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      //init sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at! * 1000,
        };
      }

      // return previous token if access token has not expired
      if (Date.now() < token.accessTokenExpires!) {
        console.log('ACCESS TOKEN STILL VALID!');
        return token;
      }

      // access token has expired, refreshing...
      console.log('ACCESS TOKEN EXPIRED, REFRESHING...');
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;
      return session;
    },
  },
});
