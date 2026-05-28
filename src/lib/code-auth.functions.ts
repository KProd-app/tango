// Code-based admin login. The user enters a numeric code on /auth and is
// signed in as a hidden internal admin account. The access code is stored
// in the `admin_settings` table so it can be changed from the admin panel.
import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const HIDDEN_ADMIN_EMAIL = "admin@tango.internal";
const HIDDEN_ADMIN_PASSWORD = "tg!9F2pK7vQzR4mXh8N";

const schema = z.object({ code: z.string().min(1).max(64) });

export const loginWithCode = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    // Fetch current access code from DB
    const { data: settings, error: settingsErr } = await supabaseAdmin
      .from("admin_settings")
      .select("access_code")
      .eq("id", true)
      .maybeSingle();
    if (settingsErr) throw new Error("Nepavyko patikrinti kodo");
    const expected = settings?.access_code ?? "";

    if (data.code.trim() !== expected || expected.length === 0) {
      throw new Error("Neteisingas kodas");
    }

    // Find the hidden admin user if they exist
    const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (listErr) throw new Error(listErr.message);
 
    let hiddenAdminId: string | null = null;
    for (const u of list.users) {
      if (u.email === HIDDEN_ADMIN_EMAIL) {
        hiddenAdminId = u.id;
        break;
      }
    }
 
    if (!hiddenAdminId) {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: HIDDEN_ADMIN_EMAIL,
        password: HIDDEN_ADMIN_PASSWORD,
        email_confirm: true,
      });
      if (createErr) throw new Error(createErr.message);
      hiddenAdminId = created.user!.id;
    } else {
      await supabaseAdmin.auth.admin.updateUserById(hiddenAdminId, {
        password: HIDDEN_ADMIN_PASSWORD,
      });
    }
 
    // Clear and insert user roles
    await supabaseAdmin.from("user_roles").delete().eq("user_id", hiddenAdminId);
    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: hiddenAdminId, role: "admin" });
    if (roleErr) throw new Error(roleErr.message);

    return { email: HIDDEN_ADMIN_EMAIL, password: HIDDEN_ADMIN_PASSWORD };
  });

// Admin-only: read current access code
export const getAccessCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: roleData } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleData) throw new Error("Forbidden");

    const { data, error } = await supabaseAdmin
      .from("admin_settings")
      .select("access_code")
      .eq("id", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { code: data?.access_code ?? "" };
  });

const updateSchema = z.object({
  code: z.string().trim().min(4).max(64).regex(/^[A-Za-z0-9_-]+$/, "Tik raidės, skaičiai, _ ir -"),
});

// Admin-only: update access code
export const updateAccessCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: roleData } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleData) throw new Error("Forbidden");

    const { error } = await supabaseAdmin
      .from("admin_settings")
      .update({ access_code: data.code, updated_at: new Date().toISOString() })
      .eq("id", true);
    if (error) throw new Error(error.message);
    return { success: true };
  });
