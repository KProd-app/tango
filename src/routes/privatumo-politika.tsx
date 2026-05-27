import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/LegalPageLayout";

export const Route = createFileRoute("/privatumo-politika")({
  component: PrivatumoPolitika,
  head: () => ({
    meta: [
      { title: "Privatumo politika — Tango Pizza & Grill" },
      {
        name: "description",
        content:
          "Tango Pizza & Grill privatumo politika: kaip renkame, naudojame ir saugome jūsų asmeninę informaciją bei slapukų naudojimo politika.",
      },
      { property: "og:title", content: "Privatumo politika — Tango Pizza & Grill" },
      {
        property: "og:description",
        content: "Sužinokite, kaip Tango Pizza & Grill renka, naudoja ir saugo jūsų asmeninę informaciją bei slapukus.",
      },
    ],
    links: [{ rel: "canonical", href: "/privatumo-politika" }],
  }),
});

function PrivatumoPolitika() {
  return (
    <LegalPageLayout
      title="PRIVATUMO POLITIKA"
      subtitle="Privatumo politika ir slapukų naudojimo politika — mums rūpi jūsų privatumas."
    >
      <h2>Mums rūpi jūsų privatumas</h2>
      <p>
        Šios Privatumo politikos ir Slapukų naudojimo politikos sąlygos yra taikomos visiems
        mūsų interneto svetainės naudotojams.
      </p>
      <p>
        Šią interneto svetainę valdo bendrovė UAB „Tango Pizza", įsteigta pagal Lietuvos
        Respublikos įstatymus. Bendrovė UAB „Tango Pizza" yra duomenų, kuriuos mums pateikiate
        šioje interneto svetainėje, valdytoja.
      </p>
      <p>
        „Tango Pizza & Grill" restoranai, veikiantys Lietuvoje, priklauso UAB „Tango Pizza" ir
        yra valdomi šios bendrovės. Mes esame įsipareigoję saugoti jūsų privatumą remdamiesi
        savarankiško verslo principais.
      </p>

      <h3>Kokią asmeninę informaciją renkame iš vartotojų?</h3>
      <p>
        Asmeninė informacija — tai informacija, kuri savaime arba kartu su kita informacija
        leidžia nustatyti fizinio asmens tapatybę. Apie jus renkame asmeninę informaciją,
        kurią jūs savanoriškai mums pateikiate:
      </p>
      <ul>
        <li>jūsų vardas arba pavardė;</li>
        <li>
          pristatymo tikslais nurodytas išsamus jūsų gatvės adresas, įskaitant miestą, šalį,
          pašto kodą ir telefono numerius;
        </li>
        <li>
          informacija, kurią mums pateikiate pranešdami apie problemas, susijusias su
          interneto svetainių veikimu;
        </li>
        <li>
          duomenys, būtini dalyvaujant akcijose arba internetinėse apklausose;
        </li>
        <li>
          informacija apie jūsų „patinka" paspaudimus arba įrašus mūsų socialinių tinklų
          puslapiuose;
        </li>
        <li>
          duomenys apie jūsų geografinę vietovę (kai apsilankote mūsų picerijoje arba
          aktyvuojate atitinkamas svetainės funkcijas);
        </li>
        <li>
          vardas, pavardė, gimimo data, telefono numeris, el. pašto adresas, užsakymo duomenys
          ir kliento pageidavimai — pagrįstais verslo tikslais;
        </li>
        <li>
          jūsų naudojimosi Interneto svetaine įpročiai ir bet kokia kita informacija, kurią
          savanoriškai pateikiate.
        </li>
      </ul>
      <p>
        <strong>Mes neišsaugome mokėjimo informacijos</strong>, pvz., kreditinės ar debetinės
        kortelės duomenų.
      </p>
      <p>Taip pat renkame techninę informaciją:</p>
      <ul>
        <li>
          <strong>Paslaugų metaduomenys</strong> — užsakymo duomenys ir prisijungimo
          informacija pagalbai teikti;
        </li>
        <li>
          <strong>Žurnalo duomenys</strong> — IP adresas, naršyklės tipas, datos ir laikai,
          slapukų duomenys;
        </li>
        <li>
          <strong>Informacija apie įrenginius</strong> — įrenginio tipas, OS, unikalūs
          identifikatoriai, gedimo duomenys;
        </li>
        <li>
          <strong>Informacija apie geografinę vietovę</strong> — apytikslė vieta pagal IP arba
          įrenginio duomenis.
        </li>
      </ul>

      <h3>Kaip surinktą informaciją naudojame?</h3>
      <p>
        Duomenų valdytojas tvarko apie vartotoją surinktus duomenis tik tuo atveju, jei tam yra
        priežastis, ir jei ta priežastis yra leistina pagal duomenų apsaugos įstatymą.
        Duomenis naudojame, siekdami:
      </p>
      <ul>
        <li>suteikti jums prieigą prie atitinkamų Interneto svetainės dalių;</li>
        <li>parduoti jūsų pageidaujamas prekes;</li>
        <li>
          su jumis susisiekti dėl mūsų paslaugų (spręsti problemas, atsakyti į užklausas);
        </li>
        <li>patikrinti jūsų pateiktus duomenis sukčiavimo prevencijos tikslais;</li>
        <li>greičiau apdoroti jūsų užsakymą kitą kartą;</li>
        <li>administruoti jūsų paskyrą;</li>
        <li>tobulinti savo produktus ir paslaugas;</li>
        <li>laikytis teisinių ir priežiūros reikalavimų;</li>
        <li>siųsti aktualią reklamą ir specialius pasiūlymus (gavę jūsų sutikimą).</li>
      </ul>

      <h3>Kiek laiko saugomi vartotojų duomenys?</h3>
      <p>
        Jūsų duomenis saugome tiek laiko, kiek tai yra būtina aukščiau nurodytiems tikslams
        pasiekti. Jūs galite bet kuriuo metu mūsų paprašyti ištrinti visą asmeninę jūsų
        informaciją susisiekę nurodytais kontaktais.
      </p>

      <h3>Kaip užtikrinama vartotojų informacijos apsauga?</h3>
      <p>
        Jūsų informacija yra apsaugota slaptažodžiu. Patariame niekam neatskleisti savo
        slaptažodžio. Naudojamės debesijos platforma „Azure" (Microsoft), kurioje saugome
        jūsų pateiktą informaciją. Prieigą prie serverių kontroliuoja užkardos ir saugos
        sistemos. Jūsų asmeninės informacijos neperduodame už Europos ekonominės erdvės ribų.
      </p>

      <h3>Su kuo dalijamės jūsų informacija?</h3>
      <p>
        Siekdami nurodytų tikslų, galime pasidalyti jūsų informacija su kruopščiai
        atrinktomis trečiosiomis šalimis:
      </p>
      <ul>
        <li>
          <strong>Mokėjimo paslaugų teikėjai</strong> — atsiskaitymų apdorojimui ir sukčiavimo
          prevencijai;
        </li>
        <li>
          <strong>IT paslaugų teikėjai</strong> — duomenų saugojimui ir analizei;
        </li>
        <li>
          <strong>„Tango Pizza & Grill" picerijos</strong> — užsakymams vykdyti;
        </li>
        <li>
          <strong>Pristatymo paslaugas teikiantys vairuotojai</strong> — užsakymo pristatymui;
        </li>
        <li>
          <strong>Klientų aptarnavimo partneriai</strong> — problemų sprendimui;
        </li>
        <li>
          <strong>Rinkodaros ir reklamos partneriai</strong> — aktualios reklamos rodymui;
        </li>
        <li>
          <strong>Duomenų analitikai ir tyrimų bendrovės</strong> — paslaugų tobulinimui.
        </li>
      </ul>

      <h3>Vaikų privatumas</h3>
      <p>
        Reikalaujame, kad vartotojai, norintys pateikti savo asmeninę informaciją, būtų
        sulaukę 16 metų amžiaus arba vyresni, arba kad nepilnamečiai, prieš pateikdami tokią
        informaciją, iš savo tėvų ar teisėtų globėjų tam gautų leidimą. Jaunesnių nei 16 metų
        vaikų neprašome pateikti asmenį identifikuojančios informacijos ir tokios informacijos
        sąmoningai nerenkame.
      </p>

      <h3>Jūsų teisės</h3>
      <ul>
        <li>
          <strong>Teisė susipažinti</strong> su informacija, kurią apie jus saugome;
        </li>
        <li>
          <strong>Teisė reikalauti ištaisyti</strong> netikslius arba neišsamius duomenis;
        </li>
        <li>
          <strong>Teisė reikalauti ištrinti duomenis</strong> („teisė būti užmirštam");
        </li>
        <li>
          <strong>Teisė prašyti apriboti duomenų tvarkymą;</strong>
        </li>
        <li>
          <strong>Teisė į duomenų perkeliamumą</strong> — gauti duomenis prieinamu formatu;
        </li>
        <li>
          <strong>Teisė atšaukti sutikimą</strong> bet kuriuo metu;
        </li>
        <li>
          <strong>Teisė prieštarauti duomenų tvarkymui</strong>, įskaitant tiesioginę
          rinkodarą.
        </li>
      </ul>

      <h2>Slapukų naudojimo politika</h2>
      <p>
        Mūsų naudojami slapukai nerenka jokių kitų duomenų iš jūsų įrenginio standžiojo disko
        ir neperduoda kompiuterio virusų. Jeigu jūs paprasčiausiai naršote mūsų interneto
        svetainėje, slapukas atpažįsta jūsų naršyklę ir lankytojo ID numerį (tačiau nenustato
        jūsų tapatybės).
      </p>
      <p>Slapukus naudojame šiais tikslais:</p>
      <ul>
        <li>analizuojant lankytojų veiklą, kad galėtume tobulinti Interneto svetainę;</li>
        <li>siekdami pagerinti svetainės funkcionalumą ir lankytojų patirtį;</li>
        <li>
          renkant duomenis apie naršyklės tipą, serverį, kalbos nuostatas — sklandesniam
          naudojimuisi;
        </li>
        <li>
          rinkodaros tikslais — naudojame trečiųjų šalių („Google", „Facebook") slapukus
          aktualios reklamos rodymui;
        </li>
        <li>užkertant kelią tam tikroms kibernetinėms atakoms;</li>
        <li>atliekant A/B testavimą siekiant patobulinti pasiūlymus;</li>
        <li>gerinant svetainės veikimą ir patikimumą.</li>
      </ul>

      <h2>Susisiekite su mumis</h2>
      <p>
        Jei turite kokių nors klausimų ar pastabų, susijusių su šia interneto svetaine,
        maloniai prašome su mumis susisiekti adresu:{" "}
        <a href="mailto:info@tangopizza.lt">info@tangopizza.lt</a>.
      </p>
      <p>
        <strong>Paskutinį kartą atnaujinta: 2020-09-25</strong>
      </p>
    </LegalPageLayout>
  );
}
