import { createFileRoute } from "@tanstack/react-router";
import { LocationPage } from "@/components/location-page";
import { getLocation } from "@/data/locations";

const location = getLocation("thane")!;

export const Route = createFileRoute("/thane")({
  head: () => ({
    meta: [
      { title: location.metaTitle },
      { name: "description", content: location.metaDescription },
      { property: "og:title", content: location.metaTitle },
      { property: "og:description", content: location.metaDescription },
    ],
  }),
  component: () => <LocationPage location={location} />,
});
