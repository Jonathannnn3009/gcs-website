// Server only. The two emails the website sends: a thank-you to the customer and an alert for the team.
// Plain tables and inline styles, because email programs ignore most modern styling.

import { CONTACT } from "@/data/site";

const NAVY = "#0b1849";
const GOLD = "#e4b028";
const GOLD_DARK = "#9c7410";
const PALE = "#fbf5e4";
const MUTED = "#5b6478";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The shared frame: logo band, a gold line, the body, and a footer with how to reach us. */
function frame(origin: string, preheader: string, inner: string): string {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f1f3f8;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;color:#f1f3f8;">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f3f8;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;font-family:Segoe UI,Arial,Helvetica,sans-serif;color:${NAVY};">
<tr><td style="background:${NAVY};padding:22px 28px;" align="left">
<img src="${origin}/brand/gcs-lockup.png" alt="Growth Capital Services" width="150" style="display:block;border:0;height:auto;background:#ffffff;border-radius:8px;padding:6px 10px;">
</td></tr>
<tr><td style="height:4px;background:${GOLD};font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td style="padding:30px 28px 8px 28px;">${inner}</td></tr>
<tr><td style="padding:8px 28px 26px 28px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e6e9f2;">
<tr><td style="padding-top:18px;font-size:13px;line-height:1.6;color:${MUTED};">
<strong style="color:${NAVY};">Growth Capital Services</strong><br>
${esc(CONTACT.address)}<br>
${esc(CONTACT.hours)}<br>
Phone <a href="${CONTACT.phoneHref}" style="color:${GOLD_DARK};text-decoration:none;">${esc(CONTACT.phone)}</a>
 &nbsp;|&nbsp; <a href="mailto:${CONTACT.email}" style="color:${GOLD_DARK};text-decoration:none;">${esc(CONTACT.email)}</a>
</td></tr></table></td></tr>
</table></td></tr></table></body></html>`;
}

const button = (href: string, label: string, solid: boolean) =>
  `<a href="${href}" style="display:inline-block;margin:4px 6px 4px 0;padding:12px 22px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;${
    solid ? `background:${GOLD};color:${NAVY};` : `border:1px solid ${NAVY};color:${NAVY};`
  }">${esc(label)}</a>`;

/** What the customer receives after sending an enquiry. */
export function customerThankYou(origin: string, firstName: string, phone: string): string {
  const steps = [
    ["1", "We review", "A GCS loan expert reads your details."],
    ["2", "We call you", `We contact you on ${esc(phone)} to understand your need.`],
    ["3", "We compare", "We look at suitable Banks and NBFCs for your profile."],
  ]
    .map(
      ([n, t, b]) =>
        `<tr><td valign="top" style="padding:0 0 14px 0;width:34px;"><div style="width:26px;height:26px;border-radius:13px;background:${NAVY};color:#ffffff;text-align:center;line-height:26px;font-size:13px;font-weight:700;">${n}</div></td><td style="padding:0 0 14px 0;font-size:14px;line-height:1.5;"><strong>${t}</strong><br><span style="color:${MUTED};">${b}</span></td></tr>`,
    )
    .join("");
  return frame(
    origin,
    "We have received your enquiry. A loan expert will contact you.",
    `<h1 style="margin:0 0 12px 0;font-size:24px;line-height:1.3;color:${NAVY};">Thank you, ${esc(firstName)}.</h1>
<p style="margin:0 0 18px 0;font-size:15px;line-height:1.6;">We have received your enquiry. One of our loan experts will get in touch with you soon.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PALE};border-radius:10px;margin:0 0 20px 0;"><tr><td style="padding:18px 18px 4px 18px;">
<p style="margin:0 0 12px 0;font-size:12px;font-weight:700;letter-spacing:1.5px;color:${GOLD_DARK};text-transform:uppercase;">What happens next</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${steps}</table></td></tr></table>
<p style="margin:0 0 18px 0;font-size:14px;line-height:1.6;color:${MUTED};">To help us move faster, it may help to keep your identity proof, address proof and recent bank statements handy. We will tell you exactly what applies to you.</p>
<p style="margin:0 0 22px 0;">${button(CONTACT.whatsappLink, "Message us on WhatsApp", true)}${button(CONTACT.phoneHref, "Call us", false)}</p>
<p style="margin:0 0 8px 0;font-size:12px;line-height:1.6;color:${MUTED};">This is an enquiry, not a loan approval. A lender decides after its own checks. If you did not make this enquiry, you can ignore this email.</p>`,
  );
}

type Row = [label: string, value: string];

/** What the team receives for each new enquiry. */
export function teamAlert(origin: string, rows: Row[], detail: string, phoneHref: string): string {
  const table = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:9px 0;width:120px;font-size:13px;color:${MUTED};border-bottom:1px solid #eef0f6;">${esc(k)}</td><td style="padding:9px 0;font-size:14px;font-weight:600;border-bottom:1px solid #eef0f6;">${esc(v)}</td></tr>`,
    )
    .join("");
  return frame(
    origin,
    "A new enquiry has come in from the website.",
    `<p style="margin:0 0 6px 0;font-size:12px;font-weight:700;letter-spacing:1.5px;color:${GOLD_DARK};text-transform:uppercase;">New website enquiry</p>
<h1 style="margin:0 0 18px 0;font-size:22px;line-height:1.3;color:${NAVY};">${esc(rows[0]?.[1] ?? "New enquiry")}</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px 0;">${table}</table>
${
  detail
    ? `<p style="margin:0 0 6px 0;font-size:12px;font-weight:700;letter-spacing:1.5px;color:${GOLD_DARK};text-transform:uppercase;">Details</p>
<div style="background:${PALE};border-radius:10px;padding:14px 16px;font-size:14px;line-height:1.6;white-space:pre-wrap;margin:0 0 20px 0;">${esc(detail)}</div>`
    : ""
}
<p style="margin:0 0 20px 0;">${button(phoneHref, "Call the customer", true)}</p>`,
  );
}
