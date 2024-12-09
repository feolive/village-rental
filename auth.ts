import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import Credentials from 'next-auth/providers/credentials';
import {z} from 'zod';
import {LocalUser} from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';

 
async function getUser(email: string): Promise<LocalUser | undefined> {
    try {
      // const user = await sql<LocalUser>`SELECT * FROM users WHERE email=${email}`;
      const user: LocalUser[] = [{
        id: '1',
        email: 'test_account@gmail.com',
        password: '123456'
      }];
      return user[0];
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({
    async authorize(credentials) {
      const parsedCredentials = z.object({
        email: z.string(),
        password: z.string(),
      }).safeParse(credentials);
      // Add your authentication logic here
      if (parsedCredentials.success) {
        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);
        if (!user) return null;
        const passwordsMatch = password === user.password;
        
        if (passwordsMatch) return user;
      }
      return null;
    },
  })],
});