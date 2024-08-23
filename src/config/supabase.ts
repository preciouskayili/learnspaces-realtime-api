import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { Database } from "../../types/supabase";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

/**
 * Creates a Supabase client instance with the given token.
 *
 * @param {string} token - The authentication token to use for the client.
 * @returns {SupabaseClient<Database>} - A Supabase client instance with the specified token.
 *
 * @example
 * const token = 'my-secret-token';
 * const client = supabaseClient(token);
 * client.from('my_table').select('column1, column2').then((data) => console.log(data));
 */
export const supabaseClient = (token: string): SupabaseClient<Database> =>
  createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
