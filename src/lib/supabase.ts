import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function checkUserAuthorized(phoneNumber: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from("authorized_users")
      .select("*")
      .eq("phone_number", phoneNumber);

    console.log(data);
    if (error) {
      console.error("Erro ao verificar usuário:", error);
      return false;
    }

    if (data.length === 0) {
      return false;
    }

    return data[0];
  } catch (error) {
    console.error("Erro na verificação:", error);
    return false;
  }
}
