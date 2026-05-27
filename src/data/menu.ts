// Auto-generated from tangopizzagrill.lt WooCommerce Store API
export type MenuItemSize = {
  size: string;
  price: number;
};

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number; // base / starting price
  imageUrl: string;
  sizes: MenuItemSize[] | null;
};

export type MenuCategory = {
  slug: string;
  name: string;
  items: MenuItem[];
};

export const menuCategories: MenuCategory[] = [
  {
    "slug": "neapolietiskos-picos",
    "name": "Neapolietiškos picos",
    "items": [
      {
        "id": 64051,
        "name": "POLLO E FUNGHI",
        "description": "Nat.pomidorų tyrė, sūris fior di latte, pievagrybiai, virtas vištienos kumpis.",
        "price": 6.7,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2026/01/pollo-e-funghi.jpg?fit=524%2C560&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 6.7
          },
          {
            "size": "30cm",
            "price": 10.25
          },
          {
            "size": "40cm",
            "price": 16.6
          }
        ]
      },
      {
        "id": 62067,
        "name": "5 FORMAGGI CON TARTUFO",
        "description": "Pelėsinis sūris gorgonzola, parūkytas sūris scamorza, sūris fior di latte, sūris ricotta, gražgarstė, kietasis sūris parmezanas, migdolų riekelės, triufelių kremas.",
        "price": 7.2,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/10/5-formagi-con-tartufo.jpg?fit=568%2C560&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 7.2
          },
          {
            "size": "30cm",
            "price": 11.25
          },
          {
            "size": "40cm",
            "price": 17.2
          }
        ]
      },
      {
        "id": 62063,
        "name": "TARTUFATA",
        "description": "Grietinėlė, mortadela dešra, sūris for di latte, kietasis sūris, trumų pasta.",
        "price": 7.2,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/10/tartufata.jpg?fit=575%2C560&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 7.2
          },
          {
            "size": "30cm",
            "price": 11.25
          },
          {
            "size": "40cm",
            "price": 17.2
          }
        ]
      },
      {
        "id": 62058,
        "name": "FIAMMA RICOTTA",
        "description": "Sūris ricotta, sūris fior di latte, saliamio dešra salsiccia piccante, svogūnai, tepamoji dešra nduja, sriracha aštrus majonezas, bazilikas.",
        "price": 7.2,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/10/fiamma-ricotta.jpg?fit=556%2C560&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 7.2
          },
          {
            "size": "30cm",
            "price": 11.25
          },
          {
            "size": "40cm",
            "price": 17.2
          }
        ]
      },
      {
        "id": 59420,
        "name": "POLLO",
        "description": "Nat. pomidorų tyrė, špinatai, virtas vištienos kumpis, sūris stracciatella, bazilikų pesto padažas.",
        "price": 6.7,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/07/pollo.jpg?fit=564%2C540&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 6.7
          },
          {
            "size": "30cm",
            "price": 10.25
          },
          {
            "size": "40cm",
            "price": 15.6
          }
        ]
      },
      {
        "id": 52176,
        "name": "CAPRICCIOSA (rekomenduojame)",
        "description": "Nat.pomidorų tyrė, virtas prosciutto cotto kumpis, saliamio dešra salsiccia piccante, pievagrybiai, artišokai, juodosios alyvuogės, sūris fior di latte, kietasis sūris parmezanas, bazilikas, extra virgin alyvuogių aliejus.",
        "price": 7.2,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/09/capriciosa.jpg?fit=840%2C560&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 7.2
          },
          {
            "size": "30cm",
            "price": 11.25
          },
          {
            "size": "40cm",
            "price": 17.2
          }
        ]
      },
      {
        "id": 51891,
        "name": "ROMA",
        "description": "Nat. pomidorų tyrė, sūris fior di latte, pievagrybiai, virtas prosciuto cotto kumpis.",
        "price": 6.7,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/08/Roma.jpg?fit=535%2C560&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 6.7
          },
          {
            "size": "30cm",
            "price": 9.25
          },
          {
            "size": "40cm",
            "price": 14.6
          }
        ]
      },
      {
        "id": 51873,
        "name": "BARI",
        "description": "Nat. pomidorų tyrė, sūris fior di latte, pievagrybiai, pesto padažas, virtas vištienos kumpis, vyšniniai pomidorai.",
        "price": 6.7,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/08/bari.jpg?fit=555%2C560&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 6.7
          },
          {
            "size": "30cm",
            "price": 9.25
          },
          {
            "size": "40cm",
            "price": 14.6
          }
        ]
      },
      {
        "id": 51869,
        "name": "HAWAIANA",
        "description": "Nat. pomidorų tyrė, sūris fior di latte, virtas kumpis prosciutto cotto, kons.ananasai.",
        "price": 6.7,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/08/hawaiana2.jpg?fit=553%2C560&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 6.7
          },
          {
            "size": "30cm",
            "price": 9.25
          },
          {
            "size": "40cm",
            "price": 14.6
          }
        ]
      },
      {
        "id": 50507,
        "name": "BREASOLA (rekomenduojame)",
        "description": "Nat. pomidorų tyrė, vytintas jautienos kumpis „Bresaola\", sūris „Stracciatella\", gražgarstės, vyšniniai pomidorai, extra tyras alyvuogių aliejus, aguonos.",
        "price": 7.2,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/07/bresaola.jpg?fit=537%2C540&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 7.2
          },
          {
            "size": "30cm",
            "price": 11.25
          },
          {
            "size": "40cm",
            "price": 17.2
          }
        ]
      },
      {
        "id": 49548,
        "name": "PICCOLINE (tinka ir vaikams)",
        "description": "Nat.pomidorų tyrė, saliamio dešra milano, sūris fior di latte, kietasis sūris parmezanas.",
        "price": 6.7,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/06/piccoline.jpg?fit=840%2C560&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 6.7
          },
          {
            "size": "30cm",
            "price": 9.25
          },
          {
            "size": "40cm",
            "price": 14.6
          }
        ]
      },
      {
        "id": 49544,
        "name": "BAMBINO (tinka ir vaikams)",
        "description": "Grietinė, keptas kumpis prosciutto cotto, kukurūzai, fior di latte sūris.",
        "price": 6.7,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/06/bambino-scaled.jpg?fit=2560%2C2366&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 6.7
          },
          {
            "size": "30cm",
            "price": 9.25
          },
          {
            "size": "40cm",
            "price": 14.6
          }
        ]
      },
      {
        "id": 49540,
        "name": "BELISSIMA (tinka ir vaikams)",
        "description": "Nat. pomidorų tyrė, keptas kumpis prosciutto cotto, sūris fior di latte.",
        "price": 6.7,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/06/belisima.jpg?fit=840%2C560&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 6.7
          },
          {
            "size": "30cm",
            "price": 9.25
          },
          {
            "size": "40cm",
            "price": 14.6
          }
        ]
      },
      {
        "id": 49536,
        "name": "PULCINELLA",
        "description": "Sūris fior di latte, vytintas prosciuto crudo kumpis, kietasis sūris parmezanas, balzamiko kremas, gražgarstės.",
        "price": 6.7,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/06/pulcinela.jpg?fit=840%2C560&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 6.7
          },
          {
            "size": "30cm",
            "price": 10.25
          },
          {
            "size": "40cm",
            "price": 15.6
          }
        ]
      },
      {
        "id": 49531,
        "name": "PORCHETTA",
        "description": "Nat.pomidorų tyrė, plėšyta kiauliena, mėlynieji svogūnai, parūkytas sūris scamorza, BBQ padažas, kietasis sūris.",
        "price": 6.7,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/06/pocheta.jpg?fit=573%2C540&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 6.7
          },
          {
            "size": "30cm",
            "price": 10.25
          },
          {
            "size": "40cm",
            "price": 15.6
          }
        ]
      },
      {
        "id": 49526,
        "name": "CEZARIO",
        "description": "Vištiena, pievagrybiai, sūris fior di latte, parūkytas sūris scamorza, rukola, cezario padažas, kietasis sūris parmezanas.",
        "price": 6.7,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/06/cezario.jpg?fit=840%2C560&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 6.7
          },
          {
            "size": "30cm",
            "price": 10.25
          },
          {
            "size": "40cm",
            "price": 16.6
          }
        ]
      },
      {
        "id": 49517,
        "name": "PUGLIA",
        "description": "Sūris fior di latte, keptas kumpis prosciutto cotto, sūris stracciatella, pesto padažas su bazilikais, vyšniniai pomidorai, kietasis sūris parmezanas.",
        "price": 7.2,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/06/puglia.jpg?fit=519%2C540&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 7.2
          },
          {
            "size": "30cm",
            "price": 10.25
          },
          {
            "size": "40cm",
            "price": 17.2
          }
        ]
      },
      {
        "id": 49512,
        "name": "ITALIA",
        "description": "Sūris ricotta, sūris fior di latte, vyšniniai pomidorai, pesto padažas su bazilikais.",
        "price": 6.7,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/06/italia.jpg?fit=840%2C560&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 6.7
          },
          {
            "size": "30cm",
            "price": 10.25
          },
          {
            "size": "40cm",
            "price": 15.6
          }
        ]
      },
      {
        "id": 49508,
        "name": "NAPOLETANA",
        "description": "Nat. pomidorų tyrė, kaparėliai, raudonėlis, česnakinis aliejus, ančiuviai, bazilikas, juodosios alyvuogės.",
        "price": 6.7,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/06/neapoletana.jpg?fit=543%2C560&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 6.7
          },
          {
            "size": "30cm",
            "price": 9.25
          },
          {
            "size": "40cm",
            "price": 14.6
          }
        ]
      },
      {
        "id": 49504,
        "name": "MORTADELLA (rekomenduojame)",
        "description": "Sūris fior di latte, virta dešra mortadella, pistacijų kremas, extra vigin alyvuogių aliejus.",
        "price": 7.2,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/06/mortadela.jpg?fit=840%2C560&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 7.2
          },
          {
            "size": "30cm",
            "price": 11.25
          },
          {
            "size": "40cm",
            "price": 17.2
          }
        ]
      },
      {
        "id": 49500,
        "name": "5 FORMAGGI (rekomenduojame)",
        "description": "Pelėsinis sūris gorgonzola, parūkytas sūris scamorza, sūris fior di latte, sūris ricotta, gražgarstė, kietasis sūris parmezanas.",
        "price": 6.7,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/06/5-formagi.jpg?fit=525%2C540&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 6.7
          },
          {
            "size": "30cm",
            "price": 10.25
          },
          {
            "size": "40cm",
            "price": 15.6
          }
        ]
      },
      {
        "id": 49496,
        "name": "MARGHERITA",
        "description": "Nat. pomidorų tyrė, sūris fior di latte, kietasis sūris parmezanas, extra virgin alyvuogių aliejus, bazilikas.",
        "price": 6.7,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/06/margherita.jpg?fit=840%2C560&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 6.7
          },
          {
            "size": "30cm",
            "price": 9.25
          },
          {
            "size": "40cm",
            "price": 14.6
          }
        ]
      },
      {
        "id": 49487,
        "name": "SPINACINA (rekomenduojame)",
        "description": "Sūris ricotta, špinatai, sūris fior di latte, kietasis sūris parmezanas, extra virgin alyvuogių aliejus.",
        "price": 6.7,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/06/spinachina.jpg?fit=840%2C560&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 6.7
          },
          {
            "size": "30cm",
            "price": 9.25
          },
          {
            "size": "40cm",
            "price": 14.6
          }
        ]
      },
      {
        "id": 49483,
        "name": "SUPER DIAVOLA (vidutiniškai aštri)",
        "description": "Nat.pomidorų tyrė, saliamio dešra salsiccia piccante, vytinta tepamoji dešra nduja, parūkytas sūris scamorza, jelapenas, čili pipirai, kietasis sūris parmezanas, bazilikas.",
        "price": 7.2,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/06/super-diavola.jpg?fit=840%2C560&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 7.2
          },
          {
            "size": "30cm",
            "price": 11.25
          },
          {
            "size": "40cm",
            "price": 17.2
          }
        ]
      },
      {
        "id": 49479,
        "name": "MILANO (silpnai aštri)",
        "description": "Nat. pomidorų tyrė, saliamio dešra salsiccia piccante, saliamio dešra milano, sūris fior di latte, kietasis sūris parmezanas, rukola, medus su šiek tiek čili pipirų.",
        "price": 7.2,
        "imageUrl": "",
        "sizes": [
          {
            "size": "22cm",
            "price": 7.2
          },
          {
            "size": "30cm",
            "price": 10.25
          },
          {
            "size": "40cm",
            "price": 16.2
          }
        ]
      },
      {
        "id": 49475,
        "name": "DIAVOLA (silpnai aštri)(rekomenduojame)",
        "description": "Nat. pomidorų tyrė, saliamio dešra salsiccia piccante, sūris fior di latte, kietasis sūris parmezanas, bazilikas.",
        "price": 6.7,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/06/diavola.jpg?fit=840%2C560&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 6.7
          },
          {
            "size": "30cm",
            "price": 10.25
          },
          {
            "size": "40cm",
            "price": 15.6
          }
        ]
      },
      {
        "id": 49471,
        "name": "PAESANA (silpnai aštri)",
        "description": "Sūris ricotta, vytinta šoninė pancetta coppata, vytinta šoninė rustica, sūris fior di latte, vytinta tepamoji dešra nduja, rukola, kietasis sūris parmezanas.",
        "price": 7.2,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/06/paesana.jpg?fit=840%2C560&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 7.2
          },
          {
            "size": "30cm",
            "price": 10.25
          },
          {
            "size": "40cm",
            "price": 17.2
          }
        ]
      },
      {
        "id": 49467,
        "name": "CALABRIA (silpnai aštri)",
        "description": "Sūris fior di latte, parūkytas sūris scamorza, vytinta šoninė pancetta rustica, sūris ricotta, vytinta tepamoji dešra nduja, rukola.",
        "price": 6.7,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/06/calabria.jpg?fit=840%2C560&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 6.7
          },
          {
            "size": "30cm",
            "price": 10.25
          },
          {
            "size": "40cm",
            "price": 15.6
          }
        ]
      },
      {
        "id": 49462,
        "name": "VULCANO (silpnai aštri) (rekomenduojame)",
        "description": "Nat. pomidorų tyrė, saliamio dešra salsiccia piccante, vytinta aštri tepamoji dešra nduja, kiaulienos-jautienos faršas, pelėsinis sūris gorgonzola, sūris fior di latte, parūkytas sūris scamorza, kietasis sūris parmezanas, bazilikas.",
        "price": 7.2,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/06/vulkano.jpg?fit=840%2C560&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 7.2
          },
          {
            "size": "30cm",
            "price": 11.25
          },
          {
            "size": "40cm",
            "price": 17.2
          }
        ]
      },
      {
        "id": 49458,
        "name": "MICHELE‘S SPECIAL (vidutiniškai aštri)",
        "description": "Parūkytas sūris scamorza, sūris fior di latte, vytinta tepamoji dešra nduja, vytinta šoninė pancetta, saulėje džiovinti pomidorai, bazilikas.",
        "price": 7.2,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/06/michele-special.jpg?fit=538%2C560&ssl=1",
        "sizes": [
          {
            "size": "22cm",
            "price": 7.2
          },
          {
            "size": "30cm",
            "price": 11.25
          },
          {
            "size": "40cm",
            "price": 17.2
          }
        ]
      }
    ]
  },
  {
    "slug": "susi",
    "name": "Suši",
    "items": [
      {
        "id": 66251,
        "name": "57. RINKINYS 64 VNT. 6-8 žm.",
        "description": "Nr. 42 – 8 vnt., Nr. 44 – 8 vnt., Nr. 22 – 8 vnt. Nr. 28 – 8 vnt., Nr. 33 – 8 vnt., Nr. 14 – 8 vnt., Nr. 10 – 8 vnt.,Nr. 11 – 8 vnt.",
        "price": 60,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 64850,
        "name": "🗼 Sushi bokštai – bendra informacija užsakymams",
        "description": "uši bokštų sudėtį parenka mūsų komanda.\n\nSudėtis kuriama taip, kad būtų:\n•stabilus bokštas\n•subalansuotas skonis\n•maksimalus WOW efektas\n\nTai ne paprastas suši rinkinys, o režisuotas šventinis produktas.\n\n\nBokštą galima užsakyti vėliausiai viena diena prieš. Bokšto stovui taikomas užstato mokestis 30 eu. Grąžinus bokšto stovą sveiką ir su visais aukštais, grąžinamas užstatas. Jeigu turite klausimų, prašome skambinti mūsų nurodytu telefonu 064642288. Užsakant būtina paminėti ar bokštas bus skirtas vaikams ar suaugusiems valgyti.\n*pateikta nuotrauka yra tik orientacinio pobūdžio. Jūsų produktas užsakymo dieną gali vizualiai skirtis.",
        "price": 0,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2026/02/GRAND-SUSI-BOKSTAS-1.jpg?fit=411%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 64847,
        "name": "🗼 Sushi Tower – GRAND",
        "description": "🗼 Sushi Tower – GRAND\n\n\n15-16\n•9 aukštai\n•120 vnt. suši\n•Maksimalus vizualinis efektas\n•Skirtas didesnėms šventėms",
        "price": 179,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2026/02/Grand-susi-bokstas-.jpg?fit=412%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 64846,
        "name": "🗼 Sushi Tower – SIGNATURE",
        "description": "🗼 Sushi Tower – SIGNATURE\n\n\n\n10–11 asmenų\n•7 aukštai\n•80 vnt. suši",
        "price": 99,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2026/02/signature-susi-bokstas.jpg?fit=446%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 64844,
        "name": "🗼 Sushi Tower – ICON",
        "description": "🗼 Sushi Tower – ICON\n5-6 asmenim\n•5 aukštai\n•48 vnt. suši",
        "price": 69,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2026/02/icon-maziausias-susi-bokstas.jpg?fit=444%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 64194,
        "name": "SUŠI BURITO SU LAŠIŠA",
        "description": "Ryžiai, šviežia lašiša, nori lapai, agurkas, avokadas, iceberg salota, philadephia sūris. Su teriyaki padažu, svogūnų traškučiais, karai padažu.",
        "price": 9.3,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2026/01/burito-su-lasisa.jpg?fit=433%2C540&ssl=1",
        "sizes": null
      },
      {
        "id": 64192,
        "name": "SUŠI BURITO SU VIŠTIENA",
        "description": "Ryžiai, kepta vištiena, nori lapai, mangas, čederio sūris, iceberg salota, philadelphia sūris. Su teriyaki padažu ir svogūnų traškučiais.",
        "price": 9.8,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2026/01/burito-su-vistiena.jpg?fit=413%2C540&ssl=1",
        "sizes": null
      },
      {
        "id": 64190,
        "name": "SUŠI BURITO SU KREVETĖM",
        "description": "Ryžiai, tigrinės krevetės, nori lapai, svogūnų džemas, mangas, iceberg salota, čederio sūris, philadelphia kremas. Teriyaki padažas, svogūnų traškučiai, masago ikrai, juzu padažas.",
        "price": 10.3,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2026/01/burito-su-krevete.jpg?fit=416%2C540&ssl=1",
        "sizes": null
      },
      {
        "id": 64188,
        "name": "SUŠI BURITO SU PLĖŠYTA KIAULIENA",
        "description": "Ryžiai, plėšyta kiauliena, nori lapai, čederio sūris, konc. kukurūzai, švieži agurkai, icebergo salota, philadelphia kremas. Su teriyaki padažu, svogūnų traškučiais, masago ikrais, bbq padažu.",
        "price": 10.8,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2026/01/burito-su-plesyta-kiauliena.jpg?fit=417%2C540&ssl=1",
        "sizes": null
      },
      {
        "id": 63908,
        "name": "Suši laiveliai Nr. 104",
        "description": "Trijų skonių sušiai viename laivelyje. Soja ir lazdelės kiekvienam laiveliui. Nr. 43 Sake hotroll, Nr. 44 Ebi avocado hotroll, Nr. 45 Spicy surimi panko hotroll. Keptų suši rinkinys.",
        "price": 33,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 63906,
        "name": "Suši laiveliai Nr. 103",
        "description": "Trijų skonių sušiai viename laivelyje. Soja ir lazdelės kiekvienam laiveliui. Nr. 31 sake crispy mango, Nr. 20 Green california, Nr. 17 Black maguro.",
        "price": 33,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2026/01/susi-laiveliai-103.jpg?fit=425%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 63905,
        "name": "Suši laiveliai Nr. 102",
        "description": "Trijų skonių sušiai viename laivelyje. Soja ir lazdelės kiekvienam laiveliui. Nr. 14 Sake tempura, Nr. 18 Maguro wasabi, Nr. 24 Spicy sake tempura.",
        "price": 33,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 63903,
        "name": "Suši laiveliai Nr. 101",
        "description": "Trijų skonių sušiai viename laivelyje. Soja ir lazdelės kiekvienam laiveliui. Nr. 22 Jambo, Nr. 33 Ebi unagi, Nr. 29 Ikura avokado.",
        "price": 33,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 61288,
        "name": "55. RINKINYS 40 VNT.",
        "description": "Nr. 14 – 8 vnt., Nr. 34 – 8 vnt., Nr. 19 – 8 vnt. Nr. 18 – 8 vnt., Nr. 31 – 8 vnt.",
        "price": 48,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/09/40-vnt.-rinkinys.jpg?fit=373%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 61287,
        "name": "36. UNAGI WAKAME",
        "description": "Ryžiai, sezamo sėklos, kremas philadephia, ungurys, avokadas, tempura traškučiai, wakame salotos, teriyaki padažas, tobiko ikrai, daigai.",
        "price": 10.8,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/09/36-UNAGI-WAKAME.jpg?fit=793%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 61068,
        "name": "37 MASAGO – Naujas",
        "description": "RYŽIAI, LAŠIŠA, AVOKADAS, PHILADEPHIA KREMAS, MASAGO IKRAI, NORI LAPAS.",
        "price": 8.8,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/09/35a-masago.jpg?fit=927%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 61046,
        "name": "14. SAKE TEMPURA – Naujas",
        "description": "LAŠIŠA, AGURKAS, TEMPURA TRAŠKUČIAI, KREMAS PHILADELPHIA, NORI LAPAS, SEZAMO SĖKLOS, YUZU PADAŽAS.",
        "price": 9.1,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/09/14.-sake-tempura.jpg?fit=840%2C521&ssl=1",
        "sizes": null
      },
      {
        "id": 60662,
        "name": "54. RINKINYS 32 VNT.",
        "description": "Nr. 25 – 8 vnt., Nr. 27 – 8 vnt., Nr. 28 – 8 vnt., Nr. 33 – 8 vnt.",
        "price": 38,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/54.-RINKINYS-32-VNT.--rotated.jpg?fit=420%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 60661,
        "name": "53. RINKINYS 24 VNT.",
        "description": "NR. 262– 8 vnt., Nr. 26 – 8 vnt., Nr 32 – 8 vnt.",
        "price": 27,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/53.-RINKINYS-24-VNT.--rotated.jpg?fit=420%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 60660,
        "name": "52. RINKINYS 16 VNT.",
        "description": "Nr. 18 – 4 vnt., Nr. 37 – 4 vnt., Nr. 44 – 8 vnt.",
        "price": 17.3,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/52.-RINKINYS-16-VNT.-.jpg?fit=747%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 60659,
        "name": "51. RINKINYS 16 VNT.",
        "description": "Nr. 26 – 4 vnt., Nr. 28 – 4 vnt., Nr. 43 keptas – 8 vnt.",
        "price": 17.3,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/51.-RINKINYS-16-VNT.-.jpg?fit=747%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 60217,
        "name": "9. EBI MAKI",
        "description": "KREVETĖ.",
        "price": 4.2,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/9.-ebi-maki.jpg?fit=387%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 60216,
        "name": "8. SAKE AVOKADO MAKI",
        "description": "LAŠIŠA, AVOKADAS.",
        "price": 4.5,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/8.-sake-avocado-maki.jpg?fit=374%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 60172,
        "name": "45. SPICY SURIMI PANKO HOTROLL keptas",
        "description": "PHILADELPHIA SŪRIS, KARAI PADAŽAS, AVOKADAS, KRABŲ LAZDELĖ, MASSAGO IKRAI.",
        "price": 8.8,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/41.--scaled.jpg?fit=1707%2C2560&ssl=1",
        "sizes": null
      },
      {
        "id": 60171,
        "name": "44. EBI AVOCADO HOTROLL keptas",
        "description": "PHILADELPHIA SŪRIS, EBI KRAVETĖS, AVOKADAS, MAJONEZAS, ČESNAKINIAI LAIŠKAI.",
        "price": 9.2,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/40.-EBI-AVOCADO-HORTOLL-scaled.jpg?fit=1739%2C2560&ssl=1",
        "sizes": null
      },
      {
        "id": 60170,
        "name": "43. SAKE HOTROLL keptas",
        "description": "PHILADELPHIA SŪRIS, UNGURYS, LAŠIŠA, AGURKAS,TERIYAKI PADAŽAS, KARAI PADAŽAS, SEZAMŲ SĖKLOS, PORŲ DAIGAI, RIDIKŲ DAIGAI.",
        "price": 9.8,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/39.-SAKE-HOTROLL-scaled.jpg?fit=1775%2C2560&ssl=1",
        "sizes": null
      },
      {
        "id": 60168,
        "name": "42. FUDJI HOTROLL keptas",
        "description": "PHILADELPHIA SŪRIS, LAŠIŠA, AGURKAS, AVOKADAS, TERIYAKI PADAŽAS, SEZAMŲ SĖKLOS, SEZAMŲ SĖKLOS.",
        "price": 9.2,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/37.-FUDJI-HOTROLL-scaled.jpg?fit=1741%2C2560&ssl=1",
        "sizes": null
      },
      {
        "id": 60167,
        "name": "41. CRISPY CHICKEN HOTROLL keptas",
        "description": "PHILADELPHIA SŪRIS, KARAI PADAŽAS, AGURKAS, TRAŠKI  VIŠTIENA, SEZAMO SĖKLOS.",
        "price": 9.5,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/36.-CHRISPY-CHICKEN-HOTROLL-scaled.jpg?fit=1721%2C2560&ssl=1",
        "sizes": null
      },
      {
        "id": 60166,
        "name": "35. SAKE TATAKI – Naujas",
        "description": "KRABŲ MĖSA, AGURKAI, KREMAS PHILADELPHIA, TERYAKI PADAŽAS, LAŠIŠA, NORI LAPAS.",
        "price": 9.3,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/35.-sake-tataki.jpg?fit=840%2C548&ssl=1",
        "sizes": null
      },
      {
        "id": 60165,
        "name": "34. KO EBI – Naujas",
        "description": "AGURKAS, MANGAS, EBI KREVETĖ, PHILADELPHIA KREMAS, TOBIKO IKRAI, KARAI PAD., APELSINO ŽIEVELĖ, WAKAME SALOTA, NORI LAPAS.",
        "price": 10.1,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/34.-ko-ebi.jpg?fit=840%2C534&ssl=1",
        "sizes": null
      },
      {
        "id": 60163,
        "name": "33. EBI UNAGI",
        "description": "PHILADELPHIA SŪRIS, MASAGO IKRAI, TIGRINĖS KREVETĖS, AVOKADAS, UNGURYS, MAJONEZAS, LAŠIŠOS IKRAI, UNAGI PADAŽAS.",
        "price": 10.1,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/33.-ebi-unagi-scaled.jpg?fit=2560%2C1799&ssl=1",
        "sizes": null
      },
      {
        "id": 60159,
        "name": "32. KAEN MAGURO",
        "description": "PHILADELPHIA SŪRIS, AGURKAS, TIGRINĖS KREVETĖS, TUNAS, MANGO YUZU PADAŽAS, TERIYAKI PADAŽAS, ŠVIEŽI ČILI PIPIRAI.",
        "price": 9.2,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/32.-kaen-maguro-scaled.jpg?fit=2560%2C1864&ssl=1",
        "sizes": null
      },
      {
        "id": 60158,
        "name": "31. SAKE CRISPY MANGO – Naujas",
        "description": "LAŠIŠA, MANGAS, KREMAS PHILADEPHIA, SVOGŪNŲ TRAŠKUČIAI, MASAGO IKRAI, NORI LAPAS, KARAI PAD.",
        "price": 9.5,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/31.-sake-crispy-mango.jpg?fit=837%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 60157,
        "name": "30. AVOCADO SAKE TAR TAR",
        "description": "PHILADELPHIA SŪRIS, TIGRINĖS KREVETĖS, AGURKAS, AVOKADAS, KARAI LAŠIŠA, IKRAI, ČILI DRIBSNIAI, DAIGAI.",
        "price": 9.8,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/30.-avocado-sake-tar-tar-scaled.jpg?fit=2560%2C1885&ssl=1",
        "sizes": null
      },
      {
        "id": 60156,
        "name": "29. IKURA AVOCADO",
        "description": "PHILADELPHIA SŪRIS, AGURKAS, LAŠIŠA, AVOKADAS, MANGO YUZU PADAŽAS, TERIYAKI PADAŽAS, ČILI DRIBSNIAI, UPĖTAKIO IKRAI.",
        "price": 9.5,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/29.-ikura-acokado-scaled.jpg?fit=2560%2C1871&ssl=1",
        "sizes": null
      },
      {
        "id": 60155,
        "name": "28. PHILADELPHIA",
        "description": "PHILADELPHIA SŪRIS, AGURKAS, AVOKADAS, LAŠIŠA, KRABŲ LAZDELĖS.",
        "price": 8.8,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/28.-philadelphia-scaled.jpg?fit=2560%2C1712&ssl=1",
        "sizes": null
      },
      {
        "id": 60154,
        "name": "27. RAINBOW",
        "description": "PHILADELPHIA SŪRIS, AGURKAS, AVOKADAS, TUNAS, LAŠIŠA.",
        "price": 9.8,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/27.-rainbow-scaled.jpg?fit=2560%2C1664&ssl=1",
        "sizes": null
      },
      {
        "id": 60153,
        "name": "26. CALIFORNIA",
        "description": "PHILADELPHIA SŪRIS, AVOKADAS, KRABŲ LAZDELĖS,TOBIKO IKRAI.",
        "price": 8.5,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/26.-california-scaled.jpg?fit=2560%2C1764&ssl=1",
        "sizes": null
      },
      {
        "id": 60152,
        "name": "25. SAKE TAR TAR",
        "description": "PHILADELPHIA SŪRIS, AGURKAS, AVOKADAS, SEZAMŲ SĖKLOS, SAKE TAR TAR LAŠIŠA, MANGO YUZU PADAŽAS.",
        "price": 9.8,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/25.-sake-tar-tar--scaled.jpg?fit=2560%2C1759&ssl=1",
        "sizes": null
      },
      {
        "id": 60151,
        "name": "24. SPICY SAKE TEMPURA",
        "description": "PHILADELPHIA SŪRIS, LAŠIŠA, AGURKAS, TEMPURA TRAŠKUČIAI, ČILI DRIBSNIAI.",
        "price": 9.2,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/24.-spicy-sake-tempura--scaled.jpg?fit=2560%2C1862&ssl=1",
        "sizes": null
      },
      {
        "id": 60150,
        "name": "23. SURIMI TEMPURA",
        "description": "PHILADELPHIA SŪRIS, AGURKAS, AVOKADAS, KRABŲ  LAZDELĖS, TEMPUROS TRAŠKUČIAI, SEZAMŲ SĖKLOS.",
        "price": 8.8,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/23.-surimi-tempura-1.jpg?fit=876%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 60149,
        "name": "22. JAMBO",
        "description": "PHILADELPHIA SŪRIS, TIGRINĖS KREVETĖS, AGURKAS, LAŠIŠA, TERIYAKI PADAŽAS, SEZAMŲ SĖKLOS, RIDIKŲ DAIGAI.",
        "price": 9.2,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/22.-jambo--scaled.jpg?fit=2560%2C1879&ssl=1",
        "sizes": null
      },
      {
        "id": 60146,
        "name": "19. EBI ORANGE – Naujas",
        "description": "EBI KREVETĖ, LAŠIŠA, KRABŲ MIŠINYS, SEZAMO SĖKLOS MASAGO IKRAI, KARAI PADAŽAS, SVOGŪNŲ DŽEMAS, PHILADEPHIA KREMAS, NORI LAPAS.",
        "price": 9.5,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/19.-ebi-orange.jpg?fit=774%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 60145,
        "name": "18. MAGURO WASABI – Naujas",
        "description": "TUNAS, AVOKADAS, TEMPURA TRAŠKUČIAI, MASAGO WASABI IKRAI, PHILADEPHIA, SVOGŪNŲ DŽEMAS, ŠVIEŽIAS ČILI PIPIRAS, YUZU PADAŽAS, NORI LAPAS.",
        "price": 9.8,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/18.-mguro-wasabi.jpg?fit=840%2C537&ssl=1",
        "sizes": null
      },
      {
        "id": 60144,
        "name": "17. BLACK MAGURO – Naujas",
        "description": "TUNAS, WAKAME SALOTA, SVOGŪNŲ TRAŠKUČIAI, SŪRIS PHILADEPHIA, MASAGO IKRAI, YUZU PAD. NORI LAPAS.",
        "price": 10.1,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/17.-black-maguro.jpg?fit=840%2C502&ssl=1",
        "sizes": null
      },
      {
        "id": 60143,
        "name": "16. CHEDDAR MAKI – Naujas",
        "description": "KEPTA KREVETĖ, MANGAS, SVOGŪNŲ DŽEMAS, KARAI PADAŽAS, ČESERIO SŪRIS, NORI LAPAS, PHILADELPHIA KREMAS.",
        "price": 9.1,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/16.-cheddar-maki.jpg?fit=762%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 60142,
        "name": "15. KARAI SAKE – Naujas",
        "description": "AGURKAS, AZIJIETIŠKOS MORKOS, KEPTA LAŠIŠA, KREMAS PHILADELPHIA, SEZAMO SĖKLOS, KARAI P. NORI LAPAS.",
        "price": 8.8,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/15.-karai-sake.jpg?fit=840%2C523&ssl=1",
        "sizes": null
      },
      {
        "id": 60140,
        "name": "13. KAPPA MAKI",
        "description": "AGURKAS, IMBIERAS, WASABI.",
        "price": 4,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/13.-kappa-maki.jpg?fit=362%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 60138,
        "name": "12. MAGURO MAKI",
        "description": "TUNAS, IMBIERAS, WASABI.",
        "price": 4.5,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/12.-maguro-maki-rotated.jpg?fit=420%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 60137,
        "name": "11. SAKE MAKI",
        "description": "LAŠIŠA, IMBIERAS, WASABI.",
        "price": 4.2,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/11.-sake-maki-rotated.jpg?fit=420%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 60135,
        "name": "10. SURIMI MAKI – Naujas",
        "description": "KRABŲ MĖSA, IMBIERAS, WASABI.",
        "price": 4.3,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/08/10.-surimi-maki.jpg?fit=420%2C560&ssl=1",
        "sizes": null
      }
    ]
  },
  {
    "slug": "uzkandziu-padeklai",
    "name": "Užkandžių padėklai",
    "items": [
      {
        "id": 64247,
        "name": "Eklerai su vištiena ir karamelizuotais svogūnais 20 vnt.",
        "description": "Eklerai įdaryti keptos vištienos, graikinių riešutų ir karamelizuotų svogūnų kapotiniu. Priimami tik išankstiniai užsakymai. Anksčiausiai galime paruošti sekančiai dienai.",
        "price": 41,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2026/01/eklerai-su-vistiena.jpg?fit=420%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 64245,
        "name": "Eklerai su lašiša ir kaparėliais 20 vnt.",
        "description": "Eklerai įdaryti lašišos ir kaparėlių kapotiniu. Priimami tik išankstiniai užsakymai. Anksčiausiai galime paruošti sekančiai dienai.",
        "price": 41,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2026/01/eklerai-su-lasisa.jpg?fit=414%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 64243,
        "name": "Eklerai su tunu ir karnišonais 20 vnt.",
        "description": "Eklerai įdaryti tuno, karnišonų ir svogūnų kapotiniu. Priimami tik išankstiniai užsakymai. Anksčiausiai galime paruošti sekančiai dienai.",
        "price": 41,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2026/01/eklerai-su-tunu.jpg?fit=427%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 64241,
        "name": "Eklerai su krevete ir mangu 20 vnt.",
        "description": "Eklerai įdaryti krevečių ir mangų kapotiniu. Priimami tik išankstiniai užsakymai. Anksčiausiai galime paruošti sekančiai dienai.",
        "price": 41,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2026/01/eklerai-su-krevete-ir-mangu.jpg?fit=407%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 64239,
        "name": "Eklerai su Gorgonzola ir kriauše 20 vnt.",
        "description": "Eklerai įdaryti kriaušių ir graikinių riešutų kapotiniu, gorgonzolos kremu. Priimami tik išankstiniai užsakymai. Anksčiausiai galime paruošti sekančiai dienai.",
        "price": 41,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2026/01/eklerai-su-gorgonzola-ir-kriause.jpg?fit=412%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 64237,
        "name": "Eklerai su karamelizuotais burokėliais ir silke 20 vnt.",
        "description": "Eklerai su silkutės kapotinio įdaru, karamelizuotų burokėlių kremu. Priimami tik išankstiniai užsakymai. Anksčiausiai galime paruošti sekančiai dienai.",
        "price": 41,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2026/01/eklerai-su-karamlizuotais-burokeliais-ir-silke.jpg?fit=421%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 63908,
        "name": "Suši laiveliai Nr. 104",
        "description": "Trijų skonių sušiai viename laivelyje. Soja ir lazdelės kiekvienam laiveliui. Nr. 43 Sake hotroll, Nr. 44 Ebi avocado hotroll, Nr. 45 Spicy surimi panko hotroll. Keptų suši rinkinys.",
        "price": 33,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 63906,
        "name": "Suši laiveliai Nr. 103",
        "description": "Trijų skonių sušiai viename laivelyje. Soja ir lazdelės kiekvienam laiveliui. Nr. 31 sake crispy mango, Nr. 20 Green california, Nr. 17 Black maguro.",
        "price": 33,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2026/01/susi-laiveliai-103.jpg?fit=425%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 63905,
        "name": "Suši laiveliai Nr. 102",
        "description": "Trijų skonių sušiai viename laivelyje. Soja ir lazdelės kiekvienam laiveliui. Nr. 14 Sake tempura, Nr. 18 Maguro wasabi, Nr. 24 Spicy sake tempura.",
        "price": 33,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 63903,
        "name": "Suši laiveliai Nr. 101",
        "description": "Trijų skonių sušiai viename laivelyje. Soja ir lazdelės kiekvienam laiveliui. Nr. 22 Jambo, Nr. 33 Ebi unagi, Nr. 29 Ikura avokado.",
        "price": 33,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 63902,
        "name": "Mini kruasanai su sūdyta lašiša 16 vnt. Nr. 512",
        "description": "Mini Kroasanai su karamelizuotų  burokėlių kremu, salota, sūdyta lašiša. Uoga persmeigimui. Komplekte 16 vnt. Priimami tik išankstiniai užsakymai. Anksčiausiai galime paruošti sekančiai dienai.",
        "price": 41,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 63901,
        "name": "Mini kruasanai su bresaola 16 vnt. Nr. 512",
        "description": "Mini Kroasanai su rikotos sūriu, bresaolos kumpiu, rukola. Alyvuogė persmeigimui. Komplekte 16 vnt. Priimami tik išankstiniai užsakymai. Anksčiausiai galime paruošti sekančiai dienai.",
        "price": 41,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 63899,
        "name": "Mini kruasanai su mortadela 16 vnt. Nr. 514",
        "description": "Mini Kroasanai su pistacijų pesto kremu, straciatella sūriu, mortadela dešra. Uoga persmeigimui. Komplekte 16 vnt. Priimami tik išankstiniai užsakymai. Anksčiausiai galime paruošti sekančiai dienai.",
        "price": 41,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2026/01/kroasanai-su-mortadela.jpg?fit=550%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 63813,
        "name": "Mini mėsainių rinkinys 14 vnt. su traškia vištiena Nr. 511",
        "description": "Mėsainio su traškia vištiena mini versija. 14 vnt. mėsainių.",
        "price": 36,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/12/mini-mesainiai.jpg?fit=674%2C540&ssl=1",
        "sizes": null
      },
      {
        "id": 63794,
        "name": "Mini mėsainių rinkinys 14 vnt. su plėšyta kiauliena Nr. 510",
        "description": "Mėsainio su plėšyta kiauliena mini versija. 14 vnt. mėsainių.",
        "price": 36,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/12/mini-mesainiai.jpg?fit=674%2C540&ssl=1",
        "sizes": null
      }
    ]
  },
  {
    "slug": "picu-rinkiniai-kepimui-namuose",
    "name": "Picų rinkiniai kepimui namuose",
    "items": [
      {
        "id": 59426,
        "name": "BARI (NEKEPTAS RINKINYS)",
        "description": "Nat. pomidorų tyrė, sūris fior di latte, pievagrybiai, pesto padažas, virtas vištienos kumpis, vyšniniai pomidorai.",
        "price": 7.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 7.25
          }
        ]
      },
      {
        "id": 59424,
        "name": "POLLO (NEKEPTAS RINKINYS)",
        "description": "Sūris fior di latte, keptas kumpis prosciutto cotto, sūris burrata, pesto padažas su bazilikais, vyšniniai pomidorai, kietasis sūris parmezanas.",
        "price": 8.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 8.25
          }
        ]
      },
      {
        "id": 59418,
        "name": "HAWAIANA (NEKEPTAS RINKINYS) (Copy) (Copy)",
        "description": "Nat. pomidorų tyrė, sūris fior di latte, šoninė coppata, virtas kumpis prosciutto cotto, kons.ananasai.",
        "price": 7.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 7.25
          }
        ]
      },
      {
        "id": 59416,
        "name": "ROMA (NEKEPTAS RINKINYS)",
        "description": "Sūris fior di latte, keptas kumpis prosciutto cotto, sūris burrata, pesto padažas su bazilikais, vyšniniai pomidorai, kietasis sūris parmezanas.",
        "price": 8.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 8.25
          }
        ]
      },
      {
        "id": 51867,
        "name": "SPINACINA (NEKEPTAS RINKINYS)",
        "description": "Sūris ricotta, špinatai, sūris fior di latte, kietasis sūris parmezanas, extra virgin alyvuogių aliejus.",
        "price": 7.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 7.25
          }
        ]
      },
      {
        "id": 50505,
        "name": "BRESAOLA (NEKEPTAS RINKINYS)",
        "description": "Nat. pomidorų tyrė, vytintas jautienos kumpis „Bresaola\", sūris „Stracciatella\", gražgarstės, vyšniniai pomidorai, extra tyras alyvuogių aliejus, aguonos.",
        "price": 8.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 8.25
          }
        ]
      },
      {
        "id": 50128,
        "name": "MICHELE‘S SPECIAL (vidutiniškai aštri) (NEKEPTAS RINKINYS)",
        "description": "Parūkytas sūris scamorza, sūris fior di latte, vytinta tepamoji dešra nduja, vytinta šoninė pancetta, saulėje džiovinti pomidorai, bazilikas.",
        "price": 8.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 8.25
          }
        ]
      },
      {
        "id": 50124,
        "name": "VULCANO (silpnai aštri) (NEKEPTAS RINKINYS)",
        "description": "Nat. pomidorų tyrė, saliamio dešra salsiccia piccante, vytinta aštri tepamoji dešra nduja, kiaulienos-jautienos faršas, pelėsinis sūris gorgonzola, sūris fior di latte, parūkytas sūris scamorza, kietasis sūris parmezanas, bazilikas.",
        "price": 8.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 8.25
          }
        ]
      },
      {
        "id": 50120,
        "name": "CALABRIA (silpnai aštri) (NEKEPTAS RINKINYS)",
        "description": "Sūris fior di latte, parūkytas sūris scamorza, vytinta šoninė pancetta rustica, sūris ricotta, vytinta tepamoji dešra nduja, rukola.",
        "price": 7.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 7.25
          }
        ]
      },
      {
        "id": 50116,
        "name": "PAESANA (silpnai aštri) (NEKEPTAS RINKINYS)",
        "description": "Sūris ricotta, vytinta šoninė pancetta coppata, vytinta šoninė rustica, sūris mozzarella, sūris fior di latte, vytinta tepamoji dešra nduja, rukola, kietasis sūris parmezanas.",
        "price": 8.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 8.25
          }
        ]
      },
      {
        "id": 50112,
        "name": "DIAVOLA (silpnai aštri) (NEKEPTAS RINKINYS)",
        "description": "Nat. pomidorų tyrė, saliamio dešra salsiccia piccante, sūris fior di latte, kietasis sūris parmezanas, bazilikas.",
        "price": 7.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 7.25
          }
        ]
      },
      {
        "id": 50108,
        "name": "MILANO (silpnai aštri) (NEKEPTAS RINKINYS)",
        "description": "Nat. pomidorų tyrė, saliamio dešra salsiccia piccante, saliamio dešra milano, sūris fior di latte, kietasis sūris parmezanas, rukola, medus su šiek tiek čili pipirų.",
        "price": 8.25,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/07/milano.jpg?fit=569%2C560&ssl=1",
        "sizes": [
          {
            "size": "30cm",
            "price": 8.25
          }
        ]
      },
      {
        "id": 50104,
        "name": "SUPER DIAVOLA (vidutiniškai aštri) (NEKEPTAS RINKINYS)",
        "description": "Nat.pomidorų tyrė, saliamio dešra salsiccia piccante, vytinta tepamoji dešra nduja, parūkytas sūris scamorza, jelapenas, čili pipirai, kietasis sūris parmezanas, bazilikas.",
        "price": 8.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 8.25
          }
        ]
      },
      {
        "id": 50098,
        "name": "SPINACINA (NEKEPTAS RINKINYS)",
        "description": "Sūris ricotta, špinatai, sūris fior di latte, kietasis sūris parmezanas, extra virgin alyvuogių aliejus.",
        "price": 7.2,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 7.2
          }
        ]
      },
      {
        "id": 50090,
        "name": "MARGHERITA (NEKEPTAS RINKINYS)",
        "description": "Nat. pomidorų tyrė, sūris fior di latte, kietasis sūris parmezanas, extra virgin alyvuogių aliejus, bazilikas.",
        "price": 7.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 7.25
          }
        ]
      },
      {
        "id": 50086,
        "name": "5 FORMAGGI (NEKEPTAS RINKINYS)",
        "description": "Pelėsinis sūris gorgonzola, parūkytas sūris scamorza, sūris fior di latte, sūris ricotta, gražgarstė, kietasis sūris parmezanas.",
        "price": 7.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 7.25
          }
        ]
      },
      {
        "id": 50082,
        "name": "MORTADELLA (NEKEPTAS RINKINYS)",
        "description": "Sūris fior di latte, virta dešra mortadella, pistacijų kremas, extra vigin alyvuogių aliejus.",
        "price": 7.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 7.25
          }
        ]
      },
      {
        "id": 50078,
        "name": "NAPOLETANA (NEKEPTAS RINKINYS)",
        "description": "Nat. pomidorų tyrė, kaparėliai, raudonėlis, česnakinis aliejus, ančiuviai, bazilikas, juodosios alyvuogės.",
        "price": 7.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 7.25
          }
        ]
      },
      {
        "id": 50074,
        "name": "ITALIA (NEKEPTAS RINKINYS)",
        "description": "Sūris ricotta, sūris fior di latte, vyšniniai pomidorai, pesto padažas su bazilikais.",
        "price": 7.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 7.25
          }
        ]
      },
      {
        "id": 50071,
        "name": "PUGLIA (NEKEPTAS RINKINYS)",
        "description": "Sūris fior di latte, keptas kumpis prosciutto cotto, sūris burrata, pesto padažas su bazilikais, vyšniniai pomidorai, kietasis sūris parmezanas.",
        "price": 8.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 8.25
          }
        ]
      },
      {
        "id": 50067,
        "name": "CAPRICCIOSA (NEKEPTAS RINKINYS)",
        "description": "Nat.pomidorų tyrė, virtas prosciutto cotto kumpis, saliamio dešra salsiccia piccante, pievagrybiai, artišokai, juodosios alyvuogės, sūris fior di latte, kietasis sūris parmezanas, bazilikas, extra virgin alyvuogių aliejus.",
        "price": 8.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 8.25
          }
        ]
      },
      {
        "id": 50055,
        "name": "CEZARIO (NEKEPTAS RINKINYS)",
        "description": "Vištiena, pievagrybiai, sūris fior di latte, parūkytas sūris scamorza, rukola, cezario padažas, kietasis sūris parmezanas.",
        "price": 7.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 7.25
          }
        ]
      },
      {
        "id": 50047,
        "name": "PORCHETTA (NEKEPTAS RINKINYS)",
        "description": "Nat.pomidorų tyrė, plėšyta kiauliena, mėlynieji svogūnai, parūkytas sūris scamorza, BBQ padažas, kietasis sūris.",
        "price": 7.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 7.25
          }
        ]
      },
      {
        "id": 50041,
        "name": "PULCINELLA (NEKEPTAS RINKINYS)",
        "description": "Sūris fior di latte, vytintas prosciuto crudo kumpis, kietasis sūris parmezanas, balzamiko kremas, gražgarstės.",
        "price": 7.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 7.25
          }
        ]
      },
      {
        "id": 50032,
        "name": "BELISSIMA (tinka ir vaikams) (NEKEPTAS RINKINYS)",
        "description": "Nat. pomidorų tyrė, keptas kumpis prosciutto cotto, sūris fior di latte.",
        "price": 8.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 8.25
          }
        ]
      },
      {
        "id": 50028,
        "name": "BAMBINO (tinka ir vaikams) (NEKEPTAS RINKINYS)",
        "description": "Grietinė, keptas kumpis prosciutto cotto, kukurūzai, fior di latte sūris.",
        "price": 7.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 7.25
          }
        ]
      },
      {
        "id": 50023,
        "name": "PICCOLINE (tinka ir vaikams) (NEKEPTAS RINKINYS)",
        "description": "Nat.pomidorų tyrė, saliamio dešra milano, sūris fior di latte, kietasis sūris parmezanas.",
        "price": 7.25,
        "imageUrl": "",
        "sizes": [
          {
            "size": "30cm",
            "price": 7.25
          }
        ]
      }
    ]
  },
  {
    "slug": "poke-bowl",
    "name": "Poke Bowl",
    "items": [
      {
        "id": 62190,
        "name": "Tuno omaro padaže poke bowl",
        "description": "Kokosiniai ryžiai, šviežias tunas, vyšniniai pomidorai, iceberg salota, mangas, kimchi agurkai, edamame pupelės, wakame salota, avokadas, omaro padažas, tobiko ikrai, laiškinis česnakas.",
        "price": 10.3,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/10/poke-bowl-su-tunu.jpg?fit=546%2C560&ssl=1",
        "sizes": [
          {
            "size": "Kokosiniai ryžiai",
            "price": 10.3
          }
        ]
      },
      {
        "id": 42923,
        "name": "Sūdytos lašišos poke bowl",
        "description": "Kokosiniai ryžiai arba gruzdinti batatai, sūdyta lašiša, „Wakame\" salotos, paprikos, avokadai, morkos, „Edamame\" sojos pupelės, marinuotas imbieras, laimas, „Teriyaki\" padažas, sezamo sėklos, raudoni aitrūs pipirai, laiškiniai svogūnai.",
        "price": 10.3,
        "imageUrl": "",
        "sizes": [
          {
            "size": "Kokosiniai ryžiai",
            "price": 10.3
          },
          {
            "size": "Gruzdinti batatai (+1eu.)",
            "price": 11.3
          }
        ]
      },
      {
        "id": 42919,
        "name": "Antienos poke bowl",
        "description": "Kokosiniai ryžiai arba gruzdinti batatai, griliuje kepta antiena, „Wakame\" salotos, paprikos, avokadai, morkos, „Edamame\" sojos pupelės, marinuotas imbieras, laimas, „Teriyaki\" padažas, sezamo sėklos, raudoni aitrūs pipirai, laiškiniai svogūnai.",
        "price": 10.3,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2023/12/poke-bowlas-su-antim.jpg?fit=570%2C560&ssl=1",
        "sizes": [
          {
            "size": "Kokosiniai ryžiai",
            "price": 10.3
          },
          {
            "size": "Gruzdinti batatai (+1eu).",
            "price": 11.3
          }
        ]
      },
      {
        "id": 10566,
        "name": "Krevečių Poke Bowl",
        "description": "Kokosiniai ryžiai arba gruzdinti batatai, tempūros tešloje keptos krevetės, „Wakame\" salotos, paprikos, avokadai, morkos, „Edamame\" sojos pupelės, marinuotas imbieras, laimas, „Teriyaki\" padažas, sezamo sėklos, raudoni aitrūs pipirai, laiškiniai svogūnai.",
        "price": 10.3,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2021/04/poke_bowl_su_krevetemis-min-removebg-min.png?fit=3066%2C3075&ssl=1",
        "sizes": [
          {
            "size": "Kokosiniai ryžiai",
            "price": 10.3
          },
          {
            "size": "Gruzdinti batatai (+1eu.)",
            "price": 11.3
          }
        ]
      },
      {
        "id": 10563,
        "name": "Lašišos Poke Bowl",
        "description": "Kokosiniai ryžiai arba gruzdinti batatai, tempūros tešloje kepta lašiša, „Wakame\" salotos, paprikos, avokadai, morkos, „Edamame\" sojos pupelės, marinuotas imbieras, laimas, „Teriyaki\" padažas, sezamo sėklos, raudoni aitrūs pipirai, laiškiniai svogūnai.",
        "price": 10,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2021/04/poke_bowl_su_lasisa__1_-min-removebg-1-min.png?fit=3066%2C2999&ssl=1",
        "sizes": [
          {
            "size": "Kokosiniai ryžiai",
            "price": 10
          },
          {
            "size": "Gruzdinti batatai (+1eu.)",
            "price": 11
          }
        ]
      },
      {
        "id": 10560,
        "name": "Vištienos Poke Bowl",
        "description": "Kokosiniai ryžiai arba gruzdinti batatai, tempūros tešloje kepta vištiena, „Wakame\" salotos, paprikos, avokadai, morkos, „Edamame\" sojos pupelės, marinuotas imbieras, laimas, „Teriyaki\" padažas, sezamo sėklos, raudoni aitrūs pipirai, laiškiniai svogūnai.",
        "price": 9.3,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2021/04/poke_bowl_su_vistiena-min-removebg-min.png?fit=3066%2C3031&ssl=1",
        "sizes": [
          {
            "size": "Kokosiniai ryžiai",
            "price": 9.3
          },
          {
            "size": "Gruzdinti batatai (+1eu.)",
            "price": 10.3
          }
        ]
      }
    ]
  },
  {
    "slug": "griliaus-patiekalai",
    "name": "Griliaus patiekalai",
    "items": [
      {
        "id": 58186,
        "name": "Iberiko kiaulienos šašlykas",
        "description": "Švelniai marinuotas. Pasirinkite du garnyrus ir padažą.",
        "price": 20.6,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/05/iberiko.jpg?fit=705%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 42927,
        "name": "Griliuje keptas antienos kepsnys",
        "description": "",
        "price": 16.6,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 41622,
        "name": "Jautienos dešrelės",
        "description": "Pasirinkite du garnyrus ir padažą.",
        "price": 10.6,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 21503,
        "name": "Telyčaitės nugarinė apie 300 g.",
        "description": "Vidutiniškai keptas. Pasirinkite du garnyrus ir padažą.",
        "price": 22.6,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 5728,
        "name": "Griliuje kepti sparneliai su BBQ glazūra 5vnt.",
        "description": "",
        "price": 10.6,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2020/12/sparneliai-removebg-e1612564699976.png?fit=2578%2C2000&ssl=1",
        "sizes": null
      },
      {
        "id": 1965,
        "name": "Griliuje keptas kiaulienos sprandinės pjausnys 160 g.",
        "description": "",
        "price": 14.6,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2020/08/kiaulienos-pjausnys-min-e1610295957369.png?fit=2000%2C1541&ssl=1",
        "sizes": null
      },
      {
        "id": 1964,
        "name": "Griliuje keptas vištienos krūtinėlės kepsnys",
        "description": "",
        "price": 13.6,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2020/08/vistienos_krutineles_kepsnys-removebg-min-e1612908203103.png?fit=2531%2C2000&ssl=1",
        "sizes": null
      },
      {
        "id": 1962,
        "name": "Lašišos filė kepsnys su „Teriyaki\" glazūra",
        "description": "",
        "price": 15.6,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2020/08/lasisos_kepsnys-min-removebg-e1612469951830.png?fit=2594%2C2000&ssl=1",
        "sizes": null
      },
      {
        "id": 1946,
        "name": "Rūkyta karka XXL 750-900 g.",
        "description": "(1-2 asmenims, 750-900gr. karka)",
        "price": 26.2,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2020/08/karka-min-removebg-min.png?fit=2000%2C1946&ssl=1",
        "sizes": null
      }
    ]
  },
  {
    "slug": "mesainiai",
    "name": "Mėsainiai",
    "items": [
      {
        "id": 63813,
        "name": "Mini mėsainių rinkinys 14 vnt. su traškia vištiena Nr. 511",
        "description": "Mėsainio su traškia vištiena mini versija. 14 vnt. mėsainių.",
        "price": 36,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/12/mini-mesainiai.jpg?fit=674%2C540&ssl=1",
        "sizes": null
      },
      {
        "id": 63794,
        "name": "Mini mėsainių rinkinys 14 vnt. su plėšyta kiauliena Nr. 510",
        "description": "Mėsainio su plėšyta kiauliena mini versija. 14 vnt. mėsainių.",
        "price": 36,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2025/12/mini-mesainiai.jpg?fit=674%2C540&ssl=1",
        "sizes": null
      },
      {
        "id": 53686,
        "name": "Mini mėsainių rinkinys 4 vnt.",
        "description": "Du mėsainiai su plėšyta kiauliena, du mėsainiai su traškia vištiena. Bulvytės, kečupas.",
        "price": 10.1,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/11/4-mini-mesainiai.jpg?fit=666%2C540&ssl=1",
        "sizes": null
      },
      {
        "id": 41590,
        "name": "Mėsainis su Camembertu",
        "description": "Sviestinė bandelė, “Tartar”padažas, salotos, karamelizuoti svogūnai, keptas camembertas, “Cheddar” sūris. Patiekiama su bulvių skiltelėmis, pomidorų padažu, coleslaw salotomis.",
        "price": 11.4,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2023/11/mesainis-su-camambertu.jpg?fit=599%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 20967,
        "name": "Mėsainis su vištiena tempūroje",
        "description": "Sviestinė bandelė, “Tartar”padažas, salotos, marinuotų agurkų ir garstyčių salotos, pomidorai, karamelizuoti svogūnai, vištiena tempūros tešloje, “Cheddar” sūris. Patiekiama su bulvių skiltelėmis, pomidorų padažu, coleslaw salotomis.",
        "price": 11.4,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 1926,
        "name": "Mėsainis su grill jautiena",
        "description": "Sviestinė bandelė, “Tartar”padažas, salotos, marinuotų agurkų ir garstyčių salotos, pomidorai, karamelizuoti svogūnai, grill jautienos maltinukas, “Cheddar” sūris. Patiekiama su bulvių skiltelėmis, pomidorų padažu, coleslaw salotomis.",
        "price": 11.4,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2020/08/mesainis_su_jautiena-min-removebg.png?fit=2000%2C1424&ssl=1",
        "sizes": null
      },
      {
        "id": 1836,
        "name": "Mėsainis su BBQ plėšyta kiauliena",
        "description": "Sviestinė bandelė, padažas “Tartar”, salotos, marinuotų agurkų ir garstyčių salotos, pomidorai, karamelizuoti svogūnai, parūkyta plėšyta kiauliena, sūris „Cheddar\". Patiekiama su bulvių skiltelėmis, pomidorų padažu, coleslaw salotomis.",
        "price": 11.4,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2020/05/mesainis_su_plesyta-removebg-1.png?fit=2000%2C1404&ssl=1",
        "sizes": null
      }
    ]
  },
  {
    "slug": "miltiniai-patiekalai",
    "name": "Miltiniai patiekalai",
    "items": [
      {
        "id": 33237,
        "name": "Mac&#038;Cheese",
        "description": "Makaronai, čederio sūrio padažas, kietas sūris.",
        "price": 7.3,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2023/03/mac-be-mesos.jpg?fit=354%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 15331,
        "name": "Wok makaronai su krevetėmis",
        "description": "Kiaušinio plakinys, česnakų-imbierų košė, cukinijos, morkos, „Shiitake\" grybai, porai, baltas vynas, žolelių sviestas, raudonojo kario arba teriyaki padažas, kiaušininiai makaronai, sojos pupelės, čili pipirai, svogūnų laiškai, laimas, sezamo sėklos, krevetės.",
        "price": 10.2,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 15317,
        "name": "Wok makaronai su vištiena",
        "description": "Kiaušinio plakinys, česnakų-imbierų košė, cukinijos, morkos, „Shiitake\" grybai, porai, baltas vynas, žolelių sviestas, raudonojo kario arba teriyaki padažas, kiaušininiai makaronai, sojos pupelės, čili pipirai, svogūnų laiškai, laimas, sezamo sėklos, vištiena.",
        "price": 10.2,
        "imageUrl": "",
        "sizes": null
      }
    ]
  },
  {
    "slug": "sriubos",
    "name": "Sriubos",
    "items": [
      {
        "id": 54321,
        "name": "Firminė sriuba",
        "description": "Aštri tiršta sriuba su kiaulienos malta mėsa, paprikomis, jalapenu, koncervuotomis pupelėmis, juodosiomis alyvuogėmis. Patiekiama su picos paplotėliu.",
        "price": 8.8,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2024/12/firmine.jpg?fit=508%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 6725,
        "name": "„Tom Yum\" su krevetėmis ir midijomis",
        "description": "6 valandas virtas vištienos sultinys, kokosų pienas, morkos, „Shiitake\" grybai, paprikos, poras, krevetės, sezamo sėklos, laiškinis svogūnas, midijos. Švelniai aštru.",
        "price": 9.3,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 6724,
        "name": "„Tom Kha\" su grill vištiena",
        "description": "6 valandas virtas vištienos sultinys, kokosų pienas, morkos, „Shiitake\" grybai, paprikos, poras, sezamo sėklos, jelapenas, laiškiniai svogūnai, ant griliaus kepta vištiena. Švelniai aštru.",
        "price": 9.3,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2020/12/20210111_162031-removebg-1-min.png?fit=2000%2C2042&ssl=1",
        "sizes": null
      },
      {
        "id": 2529,
        "name": "Vištienos sultinys su makaronais",
        "description": "6 valandas virtas vištienos sultinys su daržovėmis. Patiekiamas makaronais, morkomis, koncervuotais kukurūzais, laiškiniais svogūnais, sezamo sėklomis.",
        "price": 4.8,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 2528,
        "name": "Vištienos ramenas (švelniai aštrus, arba aštrus)",
        "description": "6 valandas virtas vištienos sultinys su daržovėmis. Patiekiamas su grill vištiena, makaronais, morkomis, porais, aitriosiomis paprikomis, jūros dumblių lapais, marinuotu kiaušiniu, „Shiitake\" grybais, sezamo sėklomis, „Sriracha\" padažas.",
        "price": 9.3,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2020/11/1700nauja_burned.png?fit=996%2C995&ssl=1",
        "sizes": null
      },
      {
        "id": 1866,
        "name": "Trinta pievagrybių sriuba",
        "description": "Tik penktadieniais, šeštadieniais ir sekmadieniais. Patiekiama su picos paplotėliu.",
        "price": 7.3,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 1865,
        "name": "Šaltibarščiai",
        "description": "Kefyras, marinuoti burokėliai, agurkai, svogūnų laiškai, krapai, kiaušiniai.\nPatiekiama su gruzdintomis bulvių skiltelėmis.",
        "price": 6.3,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2020/05/saltibarsciai.png?fit=3024%2C4032&ssl=1",
        "sizes": null
      }
    ]
  },
  {
    "slug": "salotos",
    "name": "Salotos",
    "items": [
      {
        "id": 43291,
        "name": "Salotos su karamelizuotais burokėliais ir griliuje kepta antiena",
        "description": "Salotų mišinys, česnakinis varškės kremas, vyšniniai pomidorai, edamame pupelės, karamelizuoti burokėliai, žolelių padažas, bruknių padažas, balzaminis acto kremas, griliuje kepta antiena.",
        "price": 10.2,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 42940,
        "name": "Salotos su keptu camembertu",
        "description": "Salotų mišinys, apelsinas, gervuogės, edamame pupelės, bruknių džemas, žolelių padažas, keptas camembert sūris, graikiniai riešutai",
        "price": 10.2,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 42926,
        "name": "Cezario salotos su sūdyta lašiša",
        "description": "Įvairių salotų mišinys, „Cezario\" padažas, tarkuotas sūris „Džiugas\", šviesios forminės duonos skrebučiai, vyšniniai pomidorai, sūdyta lašiša.",
        "price": 9.3,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 41627,
        "name": "Salotos su karamelizuotais burokėliais ir sūdyta lašiša",
        "description": "Salotų mišinys, česnakinis varškės kremas, vyšniniai pomidorai, edamame pupelės, karamelizuoti burokėliai, žolelių padažas, bruknių padažas, balzaminis acto kremas, sūdyta lašiša.",
        "price": 11.2,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 1872,
        "name": "Cezario salotos su grill lašišos kepsniu",
        "description": "Įvairių salotų mišinys, „Cezario\" padažas, tarkuotas sūris „Džiugas\", šviesios forminės duonos skrebučiai, vyšniniai pomidorai, griliiuje keptas lašišos kepsnys.",
        "price": 11.2,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2020/05/Cezario_salotos_su_lasisa-min-removebg-e1621004292188.png?fit=3813%2C3036&ssl=1",
        "sizes": null
      },
      {
        "id": 1871,
        "name": "Cezario salotos su grill krevečių iešmeliu",
        "description": "Įvairių salotų mišinys, „Cezario“ padažas, tarkuotas sūris „Džiugas“, šviesios forminės duonos skrebučiai, vyšniniai pomidorai, griliuje keptas krevečių iešmelis (5 vnt.).",
        "price": 10.2,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 1870,
        "name": "Cezario salotos su grill vištienos kepsniu 120 g.",
        "description": "Įvairių salotų mišinys, „Cezario“ padažas, tarkuotas sūris „Džiugas“, šviesios forminės duonos skrebučiai, vyšniniai pomidorai, griliuje keptas vištienos krūtinėlės kepsnys.",
        "price": 9.3,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2020/05/20210121_164553-removebg-min-e1611677899240.png?fit=2667%2C2000&ssl=1",
        "sizes": null
      },
      {
        "id": 1868,
        "name": "Salotos su medaus-garstyčių padažu bei grill vištienos kepsniu 120 g.",
        "description": "Įvairių salotų mišinys, agurkai, pomidorai, fetos sūris, saulėje džiovinti pomidorai, griliuje keptas vištienos kepsnys, medaus ir garstyčių padažas, sezamo sėklos.",
        "price": 9.3,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2020/05/Medaus_ir_garstyciu_salotos-removebg-min-e1613428676127.png?fit=2526%2C2000&ssl=1",
        "sizes": null
      }
    ]
  },
  {
    "slug": "uzkandziai",
    "name": "Užkandžiai",
    "items": [
      {
        "id": 63870,
        "name": "Wakame salotos",
        "description": "Patiekiama su sezamo sėklomis.",
        "price": 4.3,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 57015,
        "name": "Batatai",
        "description": "",
        "price": 5,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 42930,
        "name": "Kepta duona",
        "description": "",
        "price": 5.3,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2023/12/KEPTA-DUONA.jpg?fit=511%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 31582,
        "name": "Nachos su plėšyta kiauliena 2-4 asm.",
        "description": "Nachos traškučiai, plėšyta kiauliena, gvakamolė, bbq padažas, grietinė, čederio sūrio padažas, svogūnų laiškai, čili pipirai, laimas.",
        "price": 11.2,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2023/01/nachos-rotated.jpg?fit=420%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 10569,
        "name": "Sūrio spurgelės",
        "description": "8 gruzdintos sūrio spurgelės su pasirinktu padažu.",
        "price": 7.3,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 6769,
        "name": "Picos paplotėlis",
        "description": "Picos paplotėlis, truputį pabarstytas kietuoju sūriu „Džiugas\".",
        "price": 1.8,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 2046,
        "name": "Vištienos lazdelės su morkų šiaudeliais ir pasirinktu padažu",
        "description": "",
        "price": 7.3,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2020/10/vistienos_lazdeles-min-removebg-min-e1622810715189.png?fit=4088%2C2979&ssl=1",
        "sizes": null
      },
      {
        "id": 1960,
        "name": "5 rūšių užkandis",
        "description": "Bulvytės, aštrūs sūrio kąsneliai, meksikietiški trikampėliai, mac&cheese užkandis, kalmarų žiedai, spring rolls'ai. Patiekiama su česnakiniu, kečupu ir sweet chili padažais.",
        "price": 13.8,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 1877,
        "name": "Užkandis  2 asm.",
        "description": "Gruzdinti kalmarų žiedai, kepta duona, duona užkepta sūriu, picos paplotėliai, spring rolls’ai, česnakinis padažas, „sweet chilli“, pomidorų padažas.",
        "price": 12.2,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 1875,
        "name": "BBQ sparnelių užkandis 5 vnt.",
        "description": "",
        "price": 8.3,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2020/05/BBQ_sparneliu_uzkandis-removebg-min-e1612566712373.png?fit=2597%2C2000&ssl=1",
        "sizes": null
      },
      {
        "id": 1874,
        "name": "Naminė Tango duona",
        "description": "Mūsų kepta ir gruzdinta duona su čederio padažu, bei kietuoju sūriu.",
        "price": 6.3,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2020/05/tango-duona.jpg?fit=432%2C560&ssl=1",
        "sizes": null
      },
      {
        "id": 1873,
        "name": "Bulvių šiaudeliai",
        "description": "",
        "price": 4.3,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2020/05/Bulvytes_fri-min-removebg-min-e1622810928254.png?fit=4049%2C2674&ssl=1",
        "sizes": null
      }
    ]
  },
  {
    "slug": "ivairus-kokteiliai",
    "name": "Įvairūs kokteiliai",
    "items": [
      {
        "id": 21512,
        "name": "Oreo sausainių ir ledų kokteilis",
        "description": "Oreo sausainiai, vaniliniai ledai, pienas.",
        "price": 4.3,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 10588,
        "name": "Žaliasis vaisių kokteilis",
        "description": "Pasiflorų tyrė, bananai, špinatai, obuolių sultys, mėtos, ciberžolė.",
        "price": 4.3,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 10202,
        "name": "Ledų – pieno kokteilis",
        "description": "",
        "price": 4.3,
        "imageUrl": "",
        "sizes": [
          {
            "size": "",
            "price": 4.3
          },
          {
            "size": "",
            "price": 4.3
          },
          {
            "size": "",
            "price": 4.3
          },
          {
            "size": "",
            "price": 4.3
          }
        ]
      }
    ]
  },
  {
    "slug": "gerimai",
    "name": "Gėrimai",
    "items": [
      {
        "id": 9798,
        "name": "Mineralinis vanduo „Vichy\" lengvai gazuotas 1,5L",
        "description": "Lengvai gazuotas.",
        "price": 3.5,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 4950,
        "name": "Coca cola, Coca cola zero, Sprite 1,5l",
        "description": "",
        "price": 5.3,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2020/12/coca-cola.jpg?fit=420%2C310&ssl=1",
        "sizes": [
          {
            "size": "cocacola",
            "price": 5.3
          },
          {
            "size": "sprite",
            "price": 5.3
          },
          {
            "size": "cola-zero",
            "price": 5.3
          }
        ]
      },
      {
        "id": 1885,
        "name": "Coca cola, coca cola zero, sprite, fanta 0,25l stikle",
        "description": "",
        "price": 3,
        "imageUrl": "",
        "sizes": [
          {
            "size": "sprite",
            "price": 3
          },
          {
            "size": "cola-zero",
            "price": 3
          },
          {
            "size": "fanta",
            "price": 3
          },
          {
            "size": "cocacola",
            "price": 3
          }
        ]
      },
      {
        "id": 1887,
        "name": "Energinis gėrimas „Red Bull“ 0,25 l",
        "description": "",
        "price": 3,
        "imageUrl": "https://i0.wp.com/tangopizzagrill.lt/wp-content/uploads/2020/05/redbull-min-removebg.png?fit=2000%2C1652&ssl=1",
        "sizes": null
      },
      {
        "id": 1884,
        "name": "Mineralinis vanduo „Neptūnas\" 0,33 l.",
        "description": "Gazuotas, arba negazuotas.",
        "price": 2.5,
        "imageUrl": "",
        "sizes": [
          {
            "size": "negazuotas",
            "price": 2.5
          },
          {
            "size": "gazuotas",
            "price": 2.5
          }
        ]
      },
      {
        "id": 1883,
        "name": "Sultys 1l",
        "description": "Apelsinų, pomidorų, multivitaminų, ananasų, obuolių, vynuogių.",
        "price": 0,
        "imageUrl": "",
        "sizes": [
          {
            "size": "",
            "price": 0
          },
          {
            "size": "persiku",
            "price": 0
          },
          {
            "size": "vynuogiu",
            "price": 0
          },
          {
            "size": "ananasu",
            "price": 5
          },
          {
            "size": "apelsinu",
            "price": 5
          },
          {
            "size": "multivitaminu",
            "price": 5
          },
          {
            "size": "pomidoru",
            "price": 5
          }
        ]
      }
    ]
  },
  {
    "slug": "padazai",
    "name": "Padažai",
    "items": [
      {
        "id": 49933,
        "name": "Ekstra tyras alyvuogių aliejus su rozmarinu",
        "description": "",
        "price": 0.3,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 2354,
        "name": "Česnakinis",
        "description": "",
        "price": 0.3,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 2080,
        "name": "Aštrus",
        "description": "",
        "price": 0.3,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 2077,
        "name": "„Teriyaki\"",
        "description": "",
        "price": 0.3,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 2076,
        "name": "Kečupas",
        "description": "",
        "price": 0.3,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 2075,
        "name": "„Sweet chilli\"",
        "description": "",
        "price": 0.3,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 2074,
        "name": "Pievagrybių",
        "description": "",
        "price": 0.3,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 2073,
        "name": "BBQ aštrus",
        "description": "",
        "price": 0.3,
        "imageUrl": "",
        "sizes": null
      },
      {
        "id": 2071,
        "name": "BBQ",
        "description": "",
        "price": 0.3,
        "imageUrl": "",
        "sizes": null
      }
    ]
  }
];
