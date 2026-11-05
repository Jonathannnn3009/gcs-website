import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Growth Capital Services" },
      { name: "description", content: "The terms for using the Growth Capital Services website and our advisory services." },
    ],
  }),
  component: () => <LegalPage slug="terms-and-conditions" />,
});
