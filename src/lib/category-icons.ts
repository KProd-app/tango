import neapolietiskosPicos from "@/assets/categories/neapolietiskos-picos.png";
import susi from "@/assets/categories/susi.png";
import uzkandziuPadeklai from "@/assets/categories/uzkandziu-padeklai.png";
import picuRinkiniai from "@/assets/categories/picu-rinkiniai-kepimui-namuose.png";
import pokeBowl from "@/assets/categories/poke-bowl.png";
import griliausPatiekalai from "@/assets/categories/griliaus-patiekalai.png";
import mesainiai from "@/assets/categories/mesainiai.png";
import miltiniaiPatiekalai from "@/assets/categories/miltiniai-patiekalai.png";
import sriubos from "@/assets/categories/sriubos.png";
import salotos from "@/assets/categories/salotos.png";
import uzkandziai from "@/assets/categories/uzkandziai.png";
import ivairusKokteiliai from "@/assets/categories/ivairus-kokteiliai.png";
import gerimai from "@/assets/categories/gerimai.png";
import padazai from "@/assets/categories/padazai.png";

export const CATEGORY_ICONS: Record<string, string> = {
  "neapolietiskos-picos": neapolietiskosPicos,
  "susi": susi,
  "uzkandziu-padeklai": uzkandziuPadeklai,
  "picu-rinkiniai-kepimui-namuose": picuRinkiniai,
  "poke-bowl": pokeBowl,
  "griliaus-patiekalai": griliausPatiekalai,
  "mesainiai": mesainiai,
  "miltiniai-patiekalai": miltiniaiPatiekalai,
  "sriubos": sriubos,
  "salotos": salotos,
  "uzkandziai": uzkandziai,
  "ivairus-kokteiliai": ivairusKokteiliai,
  "gerimai": gerimai,
  "padazai": padazai,
};

export function getCategoryIcon(slug: string): string | null {
  return CATEGORY_ICONS[slug] ?? null;
}
