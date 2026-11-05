import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Growth Capital Services" },
      { name: "description", content: "How Growth Capital Services collects, uses and protects your personal information." },
    ],
  }),
  component: () => <LegalPage slug="privacy-policy" />,
});
