import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


// Extend the User and Session types in next-auth
declare module "next-auth" {
  interface User {
    id?: string;
    email?: string | null;
    full_name?: string | null;
    is_superuser?: boolean;
    address_line_1?: string | null;
    address_line_2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    countryCode?: string | null;
    phoneNumber?: string | null;
    
  }

  interface Session {
    user: User;
  }
}



export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Step 1: Fetch JWT token
          const tokenResponse = await fetch(
            "https://api.padlev.com/auth/jwt/create/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            }
          );

          if (!tokenResponse.ok) {
            console.error("Failed to fetch token:", tokenResponse.statusText);
            return null;
          }

          const tokenData = await tokenResponse.json();
          const accessToken = tokenData.access;

          // Step 2: Fetch user data using the token
          const userResponse = await fetch(
            "https://api.padlev.com/api/user/",
            {
              method: "GET",
              headers: {
                Authorization: `JWT ${accessToken}`,
              },
            }
          );

          if (!userResponse.ok) {
            console.error("Failed to fetch user:", userResponse.statusText);
            return null;
          }

          const user = await userResponse.json();

          // Return the user object (this will be stored in the session)
          return {
            id: user.id, // Ensure the user object has an `id` field
            email: user.email,
            name: user.full_name , // Use `name` or `username` as the display name
            is_superuser: user.is_superuser, // Include the `is_superuser` field
            address_line_1:user.address_line_1,
            address_line_2:user.address_line_2,
            city:user.city,
            state:user.state,
            postalCode:user.postalCode,
            countryCode:user.countryCode,
            phoneNumber:user.phoneNumber
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),

  ],
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your environment
  session: {
    strategy: "jwt",
  },
  callbacks: {

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Add user ID to the token
        token.is_superuser = user.is_superuser; // Add `is_superuser` to the token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string; // Add user ID to the session
      session.user.is_superuser = token.is_superuser as boolean; // Add `is_superuser` to the session
      return session;
    },
  },
  pages: {
    signIn: "/login-signin", // Custom sign-in page
  },
});