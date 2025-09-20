import { supabase } from './supabase_client.js';


export async function findUserByUsername(username) {

  return supabase
    .from('authentication')
    .select('user_id, username, hashed_password, role')
    .eq('username', username)
    .single();
}

export async function createUser({ username, hashedPassword, role }) {
  return supabase
    .from('authentication')
    .insert([{ username, hashed_password: hashedPassword, role }])
    .select('user_id')
    .single();
}