import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    firstName?: string | null
    lastName?: string | null
    role?: string
  }

  interface Session {
    user: {
      id: string
      firstName?: string | null
      lastName?: string | null
      role?: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    firstName?: string | null
    lastName?: string | null
    role?: string
  }
}
