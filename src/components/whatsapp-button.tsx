import { useEffect, useState } from "react";
import { CONTACT } from "@/data/site";

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <a
      href={CONTACT.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      id="whatsapp-float"
      className="fixed right-5 bottom-5 z-50 grid h-[60px] w-[60px] place-items-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_6px_28px_rgba(37,211,102,0.55)]"
      style={{ animation: "gcs-whatsapp-pop 600ms cubic-bezier(0.22,1,0.36,1) both" }}
    >
      <svg
        viewBox="0 0 32 32"
        width="32"
        height="32"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16.004 2.667A13.27 13.27 0 0 0 2.74 15.93a13.18 13.18 0 0 0 1.78 6.617l-1.854 6.786 6.96-1.824a13.21 13.21 0 0 0 6.32 1.612h.006c7.312 0 13.316-5.95 13.32-13.262a13.22 13.22 0 0 0-3.9-9.39 13.23 13.23 0 0 0-9.37-3.802zm0 24.286a10.98 10.98 0 0 1-5.598-1.534l-.402-.238-4.164 1.092 1.112-4.06-.262-.416A10.93 10.93 0 0 1 5 15.932c.002-6.07 4.944-11.01 11.018-11.01a10.94 10.94 0 0 1 7.782 3.226 10.94 10.94 0 0 1 3.218 7.792c-.004 6.07-4.946 11.013-11.014 11.013zm6.04-8.244c-.33-.166-1.96-.968-2.264-1.078-.304-.112-.526-.166-.748.166s-.858 1.078-1.052 1.3c-.194.22-.388.248-.72.082-.33-.166-1.394-.514-2.656-1.638-.982-.874-1.644-1.954-1.836-2.284-.194-.33-.02-.508.146-.672.148-.148.33-.388.496-.58.166-.194.22-.332.332-.554.11-.22.056-.414-.028-.58-.084-.166-.748-1.804-1.026-2.47-.27-.648-.544-.56-.748-.57-.194-.01-.414-.012-.636-.012s-.58.082-.884.414c-.304.33-1.16 1.134-1.16 2.766 0 1.632 1.188 3.208 1.354 3.428.166.22 2.338 3.57 5.664 5.004.792.342 1.41.546 1.892.698.794.254 1.518.218 2.09.132.638-.096 1.96-.802 2.236-1.576.278-.774.278-1.438.194-1.576-.082-.138-.304-.22-.636-.386z" />
      </svg>
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75"></span>
        <span className="relative inline-flex h-4 w-4 rounded-full bg-[#25D366]"></span>
      </span>
    </a>
  );
}
