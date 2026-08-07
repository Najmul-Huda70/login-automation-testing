import { MongoClient } from "mongodb";

// Reuse a single connection across requests / hot reloads (NFR-3).
// Never throw at import time — the app must still be able to `next build`
// without a live database (NFR-3, Acceptance Criteria).

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClientPromise(): Promise<MongoClient> | undefined {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    // No URI at build time / static analysis — defer connection until it's
    // actually needed at request time instead of crashing the build.
    return undefined;
  }

  const client = new MongoClient(uri);

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  return client.connect();
}

let clientPromise: Promise<MongoClient> | undefined = createClientPromise();

// Lazily (re)initializes the connection the first time it's actually needed,
// e.g. inside an API route handler at request time.
export function getMongoClientPromise(): Promise<MongoClient> {
  if (!clientPromise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error(
        "MONGODB_URI is not set. Configure it in .env (see .env.example)."
      );
    }
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export default clientPromise;
