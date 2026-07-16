import { NextResponse } from "next/server";

export async function GET() {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Restaurante Doña Inés
ORG:Restaurante Doña Inés
TEL;TYPE=CELL,WORK:+56921787611
EMAIL:marciamaturana55@gmail.com
ADR;TYPE=WORK:;;Los Pinos 2202, Macal 2, El Melón;Nogales;Valparaíso;;;Chile
URL:https://maps.google.com/?q=-32.6849758,-71.2118846
NOTE:Restaurante - Comida casera chilena, colaciones empresariales y eventos.
END:VCARD`;

  return new NextResponse(vcard, {
    headers: {
      "Content-Type": "text/vcard",
      "Content-Disposition": 'attachment; filename="dona_ines_contacto.vcf"',
    },
  });
}