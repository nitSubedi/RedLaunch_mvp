import { supabase } from './supabase_client.js';


export async function findUserByUsername(username) {
  const { data, error } = await supabase
    .from('authentication')
    .select(`
      user_id,
      username,
      hashed_password,
      role,
      personnel:personnel(user_id, name, email)
    `)
    .ilike('username', username)
    .single();

  if (error) {
    return { data: null, error };
  }

  // Flatten personnel fields for easier access
  const personnel = data?.personnel || {};

  const user = {
    user_id: data.user_id,
    username: data.username,
    hashed_password: data.hashed_password,
    role: data.role,
    name: personnel.name,
    email: personnel.email,
  };

  return { data: user, error: null };
}

export async function createUser({ username, hashedPassword, role }) {
  return supabase
    .from('authentication')
    .insert([{ username, hashed_password: hashedPassword, role }])
    .select('user_id')
    .single();
}