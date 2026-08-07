import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getMongoClientPromise } from "./mongodb";

// Get the DB instance or pass the database directly
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  
  // Pass the db instance/adapter directly
  database: mongodbAdapter(
    // Execute or resolve your client promise directly
    (await getMongoClientPromise()).db(process.env.MONGODB_DB ?? "login_system"),
    {
      transaction: false,
    }
  ),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    disableSignUp: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
});

export type Session = typeof auth.$Infer.Session;