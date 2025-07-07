import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Extend the User and Session types in next-auth
declare module "next-auth" {
  interface User {
    id?: string;
    email?: string | null;
    full_name?: string | null;
    is_superuser?: boolean;
    is_partner?: boolean;
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
            "https://trustdine-backend.vercel.app/auth/jwt/create/",
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
            "https://trustdine-backend.vercel.app/api/user/",
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

          // Return the user object with all fields
          return {
            id: user.id,
            email: user.email,
            name: user.full_name,
            is_superuser: user.is_superuser,
            is_partner: user.is_partner,
            address_line_1: user.address_line_1,
            address_line_2: user.address_line_2,
            city: user.city,
            state: user.state,
            postalCode: user.postalCode,
            countryCode: user.countryCode,
            phoneNumber: user.phoneNumber
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Include all user fields in the token
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          is_superuser: user.is_superuser,
          is_partner: user.is_partner, // Correct spelling here
          address_line_1: user.address_line_1,
          address_line_2: user.address_line_2,
          city: user.city,
          state: user.state,
          postalCode: user.postalCode,
          countryCode: user.countryCode,
          phoneNumber: user.phoneNumber
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Include all fields from token in the session
      session.user = {
        ...session.user,
        id: token.id as string,
        email: token.email as string,
        full_name: token.name as string,
        is_superuser: token.is_superuser as boolean,
        is_partner: token.is_partner as boolean, // Fix this typo!
        address_line_1: token.address_line_1 as string | null,
        address_line_2: token.address_line_2 as string | null,
        city: token.city as string | null,
        state: token.state as string | null,
        postalCode: token.postalCode as string | null,
        countryCode: token.countryCode as string | null,
        phoneNumber: token.phoneNumber as string | null
      };
      return session;
    },
  },
  pages: {
    signIn: "/login", 
  },
});