import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/LegalPageLayout";

export const Route = createFileRoute("/naudojimo-salygos")({
  component: NaudojimoSalygos,
  head: () => ({
    meta: [
      { title: "Naudojimo sąlygos — Tango Pizza & Grill" },
      {
        name: "description",
        content:
          "Tango Pizza & Grill naudojimo sąlygos: užsakymo pateikimas, atsiskaitymas, atsakomybės apribojimai ir intelektinė nuosavybė.",
      },
      { property: "og:title", content: "Naudojimo sąlygos — Tango Pizza & Grill" },
      {
        property: "og:description",
        content: "Tango Pizza & Grill svetainės naudojimo sąlygos: užsakymai, atsiskaitymas, atsakomybė ir intelektinė nuosavybė.",
      },
    ],
    links: [{ rel: "canonical", href: "/naudojimo-salygos" }],
  }),
});

function NaudojimoSalygos() {
  return (
    <LegalPageLayout
      title="NAUDOJIMO SĄLYGOS"
      subtitle="Šios Naudojimo sąlygos daro įtaką jūsų teisėms, todėl rekomenduojame jas atidžiai perskaityti."
    >
      <h2>Įžanga</h2>
      <p>
        Šioje interneto svetainėje (toliau – „Interneto svetainė") pateiktas maistas yra
        gaminamas ir tiekiamas UAB „Tango Pizza" (toliau – „mes", „mus" arba „mūsų",
        „Restoranas", „Picerija"). Mūsų registracijos adresas: Vytauto g. 11A, Prienai.
      </p>
      <p>
        Įvardis „Jūs" nurodo asmenį, kuris naudojasi Interneto svetaine siekdamas užsisakyti
        Restorano tiekiamus produktus vadovaudamasis šiomis Interneto svetainės naudojimo
        sąlygomis.
      </p>
      <p>
        Prašome atidžiai perskaityti šias sąlygas prieš užsisakydami produktus, nes šios
        sąlygos bus taikomos visiems jūsų pateiktiems užsakymams.
      </p>
      <p>
        Naudodamiesi bet kuria Restorano valdoma interneto svetaine arba programa ir (arba)
        jose lankydamiesi, jūs pareiškiate, kad sutinkate su šiomis Sąlygomis („Naudojimo
        sąlygomis"). Jei nesutinkate su šiomis sąlygomis, prašome šia Interneto svetaine
        nesinaudoti.
      </p>
      <p>
        Restoranas pasilieka teisę bet kada savo nuožiūra keisti šias Naudojimo sąlygas apie
        tai jus įspėjant arba be išankstinio įspėjimo. Naujausia Naudojimo sąlygų versija
        pakeičia visas ankstesnes versijas. Jei Interneto svetaine naudojatės po to, kai
        atliekami pakeitimai, tai reiškia, kad jūs sutinkate su šiais pakeitimais.
      </p>

      <h3>Atsakomybės atsisakymas ir apribojimas</h3>
      <p>
        Jūs sutinkate prisiimti visą riziką, susijusią su naudojimusi šia Interneto svetaine.
        Tiek, kiek tai leidžia įstatymai, Restoranas, jo vadovaujamas pareigas užimantys
        pareigūnai, direktoriai, darbuotojai ir patikėtiniai atsisako suteikti bet kokias
        tiesiogines ar netiesiogines garantijas, susijusias su interneto svetaine ar jos
        naudojimu. Restoranas neprisiima atsakomybės už:
      </p>
      <ul>
        <li>turinio klaidas ar netikslumus;</li>
        <li>
          bet kokio pobūdžio asmens sužalojimą ar žalą turtui, patirtą dėl lankymosi mūsų
          interneto svetainėje ar dėl naudojimosi šia svetaine;
        </li>
        <li>
          neteisėtą prisijungimą prie mūsų serverių arba juose laikomos asmeninės ir (arba)
          finansinės informacijos naudojimą;
        </li>
        <li>informacijos perdavimo naudojantis mūsų interneto svetaine sutrikimus arba sustabdymą;</li>
        <li>
          bet kokias klaidas, virusus, „Trojos arklius" arba panašias programas, kurias
          trečioji šalis gali perduoti per mūsų interneto svetainę.
        </li>
      </ul>
      <p>
        Jūs sutinkate ginti, atlyginti žalą ir apsaugoti Restoraną, jo patronuojančias
        bendroves, filialus, pareigūnus, direktorius, darbuotojus ir patikėtinius nuo bet
        kokių pretenzijų, žalos, įsipareigojimų, nuostolių, atsakomybės ir išlaidų, galinčių
        atsirasti dėl jūsų naudojimosi šia Interneto svetaine, šių Naudojimo sąlygų pažeidimo
        arba trečiosios šalies teisių pažeidimo.
      </p>

      <h3>Intelektinė nuosavybė</h3>
      <p>
        Jums pateikiamą turinį galite saugoti, spausdinti ir rodyti tik asmeniniais tikslais.
      </p>
      <p>
        Draudžiama skelbti, disponuoti, platinti ar kitaip bet kokia forma atgaminti jums
        pateikiamą arba šioje Interneto svetainėje esantį turinį ar jo kopijas. Taip pat
        draudžiama tokį turinį naudoti verslo ar komerciniais tikslais.
      </p>
      <p>
        Visos autorių teisės, prekių ženklai ir kitos intelektinės nuosavybės teisės,
        susijusios su šia Interneto svetaine ir jos turiniu (įskaitant Interneto svetainės
        dizainą, tekstą, grafiką, logotipus, piktogramas, vaizdus ir visą programinę įrangą),
        priklauso mums arba Restoranui.
      </p>

      <h3>Užsakymo pateikimas</h3>
      <p>
        Pasiliekame teisę atsisakyti suteikti paslaugą apie tai neįspėjant tuo atveju, jei
        Pristatymo tarnyba, atvykusi faktiniu pristatymo adresu, negali atlikti Prekių
        perdavimo dėl aplinkybių, už kurias yra atsakingas Klientas (Klientas 5 minutes
        neatsiliepia į telefono skambučius arba neatidaro durų nuskambėjus durų skambučiui ir
        pan.).
      </p>
      <p>
        Per 10 minučių nuo Prekių gavimo klientas gali patikrinti, ar gautos prekės ir jų
        kiekiai atitinka Kliento užsakyme nurodytą informaciją ir ar pristatytos Prekės turi
        vizualiai matomų trūkumų.
      </p>

      <h3>Atsiskaitymas</h3>
      <p>Produktų kainos, minimali ir maksimali užsakymo vertė yra nurodytos Interneto svetainėje.</p>
      <p>Galimi atsiskaitymo būdai:</p>
      <ul>
        <li>grynieji pinigai;</li>
        <li>kreditinė / mokėjimo kortelė: priimamos „Visa" ir „Mastercard" kortelės;</li>
        <li>debetinės kortelės.</li>
      </ul>

      <h3>Reglamentuojantys įstatymai ir jurisdikcija</h3>
      <p>
        Šioms sąlygoms yra taikomi ir jos yra aiškinamos pagal Lietuvos įstatymus. Abi šalys
        neatšaukiamai sutinka su neišimtine Lietuvos teismų jurisdikcija dėl bet kokių
        pretenzijų ar klausimų, susijusių su šiomis sąlygomis. Visos sutartys aiškinamos
        lietuvių kalba.
      </p>

      <h2>Susisiekite su mumis</h2>
      <p>
        Jeigu jums kyla kokių nors klausimų apie „Tango Pizza" produktus ar paslaugas, prašome
        su mumis susisiekti:
      </p>
      <ul>
        <li>
          <strong>Adresas:</strong> Vytauto g. 11A, Prienai
        </li>
        <li>
          <strong>Telefonas:</strong>{" "}
          <a href="tel:+37064642288">+370 646 42288</a>
        </li>
        <li>
          <strong>El. paštas:</strong>{" "}
          <a href="mailto:info@tangopizza.lt">info@tangopizza.lt</a>
        </li>
      </ul>
    </LegalPageLayout>
  );
}
