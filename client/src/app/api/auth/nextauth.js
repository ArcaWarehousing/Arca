import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
// import { OracleAdapter } from '../../../lib/auth/oracle-adapter';
// import { verifyPassword } from '../../../lib/auth/password-util';
// import { getDbConnection } from '../../../lib/db';

export default NextAuth({
    providers: [
        CredentialsProvider({
        name: 'Credentials',
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            const connection = await getOracleConnection();
            // check if user with given email, username etc exists
            try {
            const result = await connection.execute(
                `SELECT * FROM users WHERE email = :email`,
                { email: credentials.email },
                { outFormat: connection.OUT_FORMAT_OBJECT }
            );
            
            if (result.rows.length === 0) {
                return null;
            }
            
            const user = result.rows[0];
            // if user exists, check user entered correct pw
            const isValid = await verifyPassword(credentials.password, user.password_hash);
            
            if (!isValid) {
                return null;
            }
            
            return {
                id: user.id,
                name: user.name,
                email: user.email
            };
            } finally {
            if (connection) {
                try {
                await connection.close();
                } catch (err) {
                console.error('Error closing connection', err);
                }
            }
            }
        }
        })
        // TODO: Add other providers as needed (Google, GitHub, etc.)
    ],
    adapter: OracleAdapter(), // adapter is responsible for managing interactions with oracle ADB
    session: { // session management
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }) {
        if (user) {
            token.userId = user.id;
        }
        return token;
        },
        async session({ session, token }) {
        session.user.id = token.userId;
        return session;
        }
    },
    pages: {
        signIn: '/auth/signin', //TODO: add error and signout pages
        // error: '/auth/error',
        // signOut: '/auth/signout'
    },
    secret: process.env.NEXTAUTH_SECRET // secret used to sign and encrypt jwts
});
