import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const adminEmail = 'admin@admin.com';
    const adminPassword = 'admin';

    let adminUserId: string | null = null;

    // Try to create the admin user with email confirmed
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { display_name: 'Admin' },
    });

    if (createError) {
      console.log('createUser error (may already exist):', createError.message);
      // If already exists, try to find it via listUsers
      const { data: users, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (listError) {
        console.error('listUsers error:', listError.message);
        return new Response(JSON.stringify({ error: 'Falha ao garantir usuário admin' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const existing = users.users.find(u => (u.email || '').toLowerCase() === adminEmail);
      adminUserId = existing?.id ?? null;
    } else {
      adminUserId = created.user?.id ?? null;
    }

    if (!adminUserId) {
      return new Response(JSON.stringify({ error: 'Usuário admin não encontrado/criado' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Ensure admin role
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({ user_id: adminUserId, role: 'admin' }, { onConflict: 'user_id,role' });

    if (roleError) {
      console.error('Erro ao definir papel admin:', roleError.message);
      return new Response(JSON.stringify({ error: 'Falha ao definir papel admin' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true, user_id: adminUserId }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Erro na seed-admin function:', error?.message || error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
