import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/LegalPageLayout";

export const Route = createFileRoute("/pristatymo-politika")({
  component: PristatymoPolitika,
  head: () => ({
    meta: [
      { title: "Pristatymo politika — Tango Pizza & Grill" },
      {
        name: "description",
        content:
          "Tango Pizza & Grill pristatymo sąlygos: pristatymo zona iki 15 km, kainos pagal atstumą, minimali užsakymo suma 15 €.",
      },
      { property: "og:title", content: "Pristatymo politika — Tango Pizza & Grill" },
      {
        property: "og:description",
        content: "Pristatome 15 km spinduliu nuo restorano. Kaina priklauso nuo atstumo, minimali užsakymo suma 15 €.",
      },
    ],
    links: [{ rel: "canonical", href: "/pristatymo-politika" }],
  }),
});

const tariffs = [
  { range: "1 – 3 km", price: "3 €" },
  { range: "3 – 4 km", price: "4 €" },
  { range: "4 – 5 km", price: "5 €" },
  { range: "5 – 6 km", price: "6 €" },
  { range: "6 – 7 km", price: "7 €" },
  { range: "7 – 8 km", price: "8 €" },
  { range: "8 – 9 km", price: "9 €" },
  { range: "9 – 10 km", price: "10 €" },
  { range: "10 – 11 km", price: "11 €" },
  { range: "11 – 12 km", price: "12 €" },
  { range: "12 – 13 km", price: "13 €" },
  { range: "13 – 14 km", price: "14 €" },
  { range: "14 – 15 km", price: "15 €" },
];

function PristatymoPolitika() {
  return (
    <LegalPageLayout
      title="PRISTATYMO POLITIKA"
      subtitle="Pristatome 15 km spinduliu nuo restorano. Pristatymo mokestis priklauso nuo atstumo."
    >
      <h2>Bendros sąlygos</h2>
      <ul>
        <li>
          <strong>Minimali užsakymo suma:</strong> 15 €.
        </li>
        <li>
          <strong>Maksimalus atstumas:</strong> 15 km spinduliu nuo restorano.
        </li>
        <li>
          <strong>Pristatymo kaina:</strong> kintanti, priklausomai nuo atstumo iki restorano.
        </li>
        <li>
          <strong>Sąskaitos faktūros:</strong> išrašomos tik tą pačią dieną.
        </li>
      </ul>

      <h2>Pristatymo kainos pagal atstumą</h2>
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-primary/10">
            <tr>
              <th className="px-4 py-3 text-left font-display tracking-wider text-primary">
                Atstumas
              </th>
              <th className="px-4 py-3 text-right font-display tracking-wider text-primary">
                Kaina
              </th>
            </tr>
          </thead>
          <tbody>
            {tariffs.map((t, idx) => (
              <tr
                key={t.range}
                className={idx % 2 === 0 ? "bg-card/40" : "bg-card/20"}
              >
                <td className="px-4 py-3 text-foreground">{t.range}</td>
                <td className="px-4 py-3 text-right font-medium text-foreground">{t.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Susisiekite</h2>
      <p>
        Iškilus klausimams dėl pristatymo, prašome skambinti{" "}
        <a href="tel:+37064642288">+370 646 42288</a> arba rašyti{" "}
        <a href="mailto:info@tangopizza.lt">info@tangopizza.lt</a>.
      </p>
    </LegalPageLayout>
  );
}
