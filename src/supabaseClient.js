import { createClient } from "@supabase/supabase-js";

// Use global constants defined in vite.config.js
// These constants are replaced by Vite during the build process.
const supabaseUrl = __SUPABASE_URL__;
const supabaseAnonKey = __SUPABASE_PUBLIC_TOKEN__;

// Basic validation (checks if the replacement happened)
if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error(
		"Supabase URL and Public Token were not properly defined during build."
	);
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Optional: Export types if needed later, though usually imported directly where used
// export type { Database } from './types/supabase' // Adjust path if needed
