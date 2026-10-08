import { WhatsAppIcon } from "@/components/ui/Icons";
import { SITE } from "@/lib/site";

/**
 * "Need Help? Chat with us" button from the WordPress WhatsApp plugin.
 * Rendered only when NEXT_PUBLIC_WHATSAPP_NUMBER is set: the plugin was configured with
 * "+1293850400", which is not a valid international number, so it must be confirmed first.
 */
export function WhatsAppButton() {
  const number = SITE.whatsappNumber.replace(/\D/g, "");
  if (!number) return null;
  return (
    <a className="wc-wa" href={`https://wa.me/${number}?text=Book`} target="_blank" rel="noopener noreferrer">
      <span className="label">
        Need Help? <strong>Chat with us</strong>
      </span>
      <span className="icon">
        <WhatsAppIcon />
      </span>
      <span className="sr-only">(opens WhatsApp in a new tab)</span>
    </a>
  );
}
