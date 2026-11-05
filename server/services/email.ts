/**
 * Order Confirmation Email Service
 * Uses the Resend API (https://resend.com) if RESEND_API_KEY is set.
 * Falls back silently — email failure never blocks order creation.
 */

export interface OrderEmailData {
  orderNumber: string;
  orderId: number | string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string | null;
  governorate: string | null;
  subtotal: string;
  shippingCost: string;
  totalAmount: string;
  currency: string;
  paymentMethod: string;
  orderDate: string;
}

export interface OrderEmailItem {
  product_title: string;
  format: string;
  unit_price: string;
  quantity: number;
  subtotal: string;
}

function formatDate(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat("fr-TN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "Africa/Tunis",
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

function formatPaymentMethod(method: string): string {
  if (method === "cash_on_delivery") return "Paiement à la réception (Cash on Delivery)";
  return method;
}

function buildEmailHtml(data: OrderEmailData, items: OrderEmailItem[]): string {
  const itemRows = items
    .map(
      (it) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e8e3d9;font-size:13px;color:#141E33;">${it.product_title}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e8e3d9;font-size:13px;color:#5C574C;text-align:center;">${it.format}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e8e3d9;font-size:13px;text-align:center;color:#141E33;">${it.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e8e3d9;font-size:13px;text-align:right;color:#141E33;">${it.unit_price} ${data.currency}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e8e3d9;font-size:13px;text-align:right;font-weight:600;color:#141E33;">${it.subtotal} ${data.currency}</td>
      </tr>`
    )
    .join("");

  const locationLine = [data.city, data.governorate].filter(Boolean).join(", ");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmation de commande ${data.orderNumber}</title>
</head>
<body style="margin:0;padding:0;background-color:#F6F1E7;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F6F1E7;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(20,30,51,0.10);">

          <!-- Header -->
          <tr>
            <td style="background:#141E33;padding:28px 36px;text-align:center;">
              <p style="margin:0 0 4px 0;color:#BC3B2C;font-size:11px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;">L'Atelier des Pages · Liverspro.shop</p>
              <h1 style="margin:0;color:#F6F1E7;font-size:22px;font-weight:700;">Commande Confirmée ✓</h1>
            </td>
          </tr>

          <!-- Order Reference Banner -->
          <tr>
            <td style="background:#BC3B2C;padding:14px 36px;text-align:center;">
              <p style="margin:0;color:#ffffff;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">Référence de commande</p>
              <p style="margin:4px 0 0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:0.08em;">${data.orderNumber}</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:28px 36px 0;">
              <p style="margin:0;font-size:15px;color:#141E33;line-height:1.6;">
                Bonjour <strong>${data.customerFirstName} ${data.customerLastName}</strong>,
              </p>
              <p style="margin:12px 0 0;font-size:14px;color:#5C574C;line-height:1.6;">
                Nous avons bien reçu votre commande et elle est en cours de traitement. Vous recevrez une confirmation dès l'expédition de votre colis.
              </p>
            </td>
          </tr>

          <!-- Order Info -->
          <tr>
            <td style="padding:20px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#F6F1E7;border-radius:10px;padding:16px;">
                <tr>
                  <td style="font-size:12px;color:#5C574C;padding:4px 0;">
                    <strong style="color:#141E33;">Date de commande :</strong>&nbsp;${formatDate(data.orderDate)}
                  </td>
                </tr>
                <tr>
                  <td style="font-size:12px;color:#5C574C;padding:4px 0;">
                    <strong style="color:#141E33;">Mode de paiement :</strong>&nbsp;${formatPaymentMethod(data.paymentMethod)}
                  </td>
                </tr>
                <tr>
                  <td style="font-size:12px;color:#5C574C;padding:4px 0;">
                    <strong style="color:#141E33;">Téléphone :</strong>&nbsp;${data.customerPhone}
                  </td>
                </tr>
                <tr>
                  <td style="font-size:12px;color:#5C574C;padding:4px 0;">
                    <strong style="color:#141E33;">Adresse de livraison :</strong>&nbsp;${data.deliveryAddress}${locationLine ? ` — ${locationLine}` : ""}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding:0 36px 20px;">
              <p style="margin:0 0 10px;font-size:13px;font-weight:800;color:#141E33;text-transform:uppercase;letter-spacing:0.12em;">Détail de la commande</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e3d9;border-radius:8px;overflow:hidden;">
                <thead>
                  <tr style="background:#F6F1E7;">
                    <th style="padding:10px 12px;text-align:left;font-size:11px;color:#5C574C;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Ouvrage</th>
                    <th style="padding:10px 12px;text-align:center;font-size:11px;color:#5C574C;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Format</th>
                    <th style="padding:10px 12px;text-align:center;font-size:11px;color:#5C574C;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Qté</th>
                    <th style="padding:10px 12px;text-align:right;font-size:11px;color:#5C574C;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">P.U.</th>
                    <th style="padding:10px 12px;text-align:right;font-size:11px;color:#5C574C;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Sous-total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding:0 36px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:13px;color:#5C574C;padding:4px 0;">Sous-total produits</td>
                  <td style="font-size:13px;color:#141E33;text-align:right;padding:4px 0;">${data.subtotal} ${data.currency}</td>
                </tr>
                <tr>
                  <td style="font-size:13px;color:#5C574C;padding:4px 0;">Frais de livraison</td>
                  <td style="font-size:13px;color:#141E33;text-align:right;padding:4px 0;">${data.shippingCost} ${data.currency}</td>
                </tr>
                <tr>
                  <td style="border-top:2px solid #141E33;font-size:15px;font-weight:800;color:#141E33;padding:10px 0 4px;">TOTAL À PAYER</td>
                  <td style="border-top:2px solid #141E33;font-size:15px;font-weight:800;color:#BC3B2C;text-align:right;padding:10px 0 4px;">${data.totalAmount} ${data.currency}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Next Steps -->
          <tr>
            <td style="padding:0 36px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#E8F5E9;border-left:4px solid #2E7D32;border-radius:0 8px 8px 0;padding:14px 16px;">
                <tr>
                  <td>
                    <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#1B5E20;">Prochaines étapes</p>
                    <ul style="margin:0;padding-left:18px;font-size:12px;color:#2E7D32;line-height:1.8;">
                      <li>Notre équipe prépare votre commande sous 24 à 48 h.</li>
                      <li>Livraison Cash on Delivery (COD) partout en Tunisie.</li>
                      <li>Le paiement est effectué à la réception du colis.</li>
                      <li>Pour toute question : <a href="mailto:contact@liverspro.shop" style="color:#2E7D32;">contact@liverspro.shop</a></li>
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F6F1E7;padding:20px 36px;text-align:center;border-top:1px solid #e8e3d9;">
              <p style="margin:0;font-size:11px;color:#8C827A;">
                © 2026 L'Atelier des Pages · Liverspro.shop · Une marque de BUSINESS SUCCESS<br/>
                Référence commande : <strong>${data.orderNumber}</strong>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildEmailText(data: OrderEmailData, items: OrderEmailItem[]): string {
  const itemLines = items
    .map((it) => `  - ${it.product_title} (${it.format}) × ${it.quantity} → ${it.subtotal} ${data.currency}`)
    .join("\n");

  return `CONFIRMATION DE COMMANDE — ${data.orderNumber}
L'Atelier des Pages · Liverspro.shop

Bonjour ${data.customerFirstName} ${data.customerLastName},

Votre commande a bien été enregistrée.

RÉCAPITULATIF
Référence : ${data.orderNumber}
Date : ${formatDate(data.orderDate)}
Paiement : ${formatPaymentMethod(data.paymentMethod)}
Téléphone : ${data.customerPhone}
Adresse : ${data.deliveryAddress}${data.city ? `, ${data.city}` : ""}${data.governorate ? `, ${data.governorate}` : ""}

ARTICLES COMMANDÉS
${itemLines}

Sous-total : ${data.subtotal} ${data.currency}
Livraison  : ${data.shippingCost} ${data.currency}
TOTAL      : ${data.totalAmount} ${data.currency}

PROCHAINES ÉTAPES
- Préparation sous 24-48 h
- Livraison COD sur toute la Tunisie
- Paiement à la réception du colis
- Contact : contact@liverspro.shop

© 2026 L'Atelier des Pages · Liverspro.shop`;
}

/**
 * Send order confirmation email via Resend API.
 * Requires RESEND_API_KEY environment variable.
 * Silently skips if key is not configured.
 */
export async function sendOrderConfirmationEmail(
  data: OrderEmailData,
  items: OrderEmailItem[]
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !data.customerEmail) return;

  const fromAddress = process.env.RESEND_FROM_EMAIL || "L'Atelier des Pages <noreply@liverspro.shop>";

  const payload = {
    from: fromAddress,
    to: [data.customerEmail],
    subject: `✅ Commande ${data.orderNumber} confirmée — L'Atelier des Pages`,
    html: buildEmailHtml(data, items),
    text: buildEmailText(data, items),
  };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.warn(`[Email] Resend API error ${res.status}: ${body}`);
  } else {
    console.log(`[Email] Confirmation sent to ${data.customerEmail} for order ${data.orderNumber}`);
  }
}
