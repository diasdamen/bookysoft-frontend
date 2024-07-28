// import {handleAuth} from "@kinde-oss/kinde-auth-nextjs/server";
// export const GET = handleAuth();

import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import type { NextApiRequest, NextApiResponse } from 'next';

// Define the handler function with types
export const GET = handleAuth(async (req: NextApiRequest, res: NextApiResponse) => {
  // Your authentication logic here
  try {
    // Example response
    res.status(200).json({ message: "API is working correctly" });
  } catch (error) {
    console.error('Error in API route:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});