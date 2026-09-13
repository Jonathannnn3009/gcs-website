export type LocationContent = {
  slug: string;
  city: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  hasOffice: boolean;
  serviceNote: string;
  faqs: { q: string; a: string }[];
};

export const LOCATIONS: LocationContent[] = [
  {
    slug: "mumbai",
    city: "Mumbai",
    metaTitle: "Loan Consultant in Mumbai | Home, Business & Property Loans | Growth Capital Services",
    metaDescription:
      "Growth Capital Services is based in Ghatkopar West, Mumbai — home loans, business loans, loan against property and more, arranged across 75+ Banks and NBFCs.",
    intro:
      "Our advisory office sits on the Andheri-Ghatkopar Road in Ghatkopar West, in the middle of Mumbai's western suburbs. If you're anywhere from Andheri to Mulund, Bandra to Chembur, a senior advisor is a short trip away — or a phone call, if that's easier.",
    hasOffice: true,
    serviceNote:
      "Walk in by appointment for a face-to-face file review, or handle the entire process over phone, WhatsApp and email — most Mumbai clients do a mix of both.",
    faqs: [
      {
        q: "Where exactly is your Mumbai office?",
        a: "CCTV Towers, Andheri-Ghatkopar Road, Ghatkopar West, Mumbai 400084 — a short walk from Ghatkopar station on both the suburban line and Metro Line 1.",
      },
      {
        q: "Can I meet an advisor in person?",
        a: "Yes, by appointment, Monday to Saturday, 10 AM to 6 PM. Call ahead so the right advisor for your loan type is free.",
      },
      {
        q: "Do you cover all of Mumbai, or just the western suburbs?",
        a: "All of it — South Mumbai, the western and eastern suburbs, Navi Mumbai and Thane are all within our regular service area.",
      },
    ],
  },
  {
    slug: "thane",
    city: "Thane",
    metaTitle: "Loan Consultant in Thane | Home, Business & Property Loans | Growth Capital Services",
    metaDescription:
      "Home loans, business loans, loan against property and more for Thane residents and businesses — arranged across 75+ Banks and NBFCs, with digital documentation and doorstep support.",
    intro:
      "We don't have a branch counter in Thane — most of our Thane clients never needed one. Your file moves through us digitally from wherever you are, with a senior advisor on call throughout.",
    hasOffice: false,
    serviceNote:
      "Documents collected digitally or by doorstep pickup, video or phone consultations with a senior advisor, and an in-person meeting at our Ghatkopar West office when a file genuinely needs it.",
    faqs: [
      {
        q: "Do you have an office in Thane?",
        a: "Not a physical branch — our office is in Ghatkopar West, Mumbai. Thane clients are served digitally, with doorstep document pickup and an in-person option in Ghatkopar when needed.",
      },
      {
        q: "Does that slow things down compared to a local DSA?",
        a: "Usually the opposite — no branch queue, and your advisor is reachable directly on phone or WhatsApp through the whole process.",
      },
      {
        q: "Which lenders do you work with for Thane customers?",
        a: "The same 75+ Bank and NBFC network we use everywhere — lender fit depends on your profile and loan type, not your address.",
      },
    ],
  },
  {
    slug: "navi-mumbai",
    city: "Navi Mumbai",
    metaTitle: "Loan Consultant in Navi Mumbai | Home, Business & Property Loans | Growth Capital Services",
    metaDescription:
      "Home loans, business loans, loan against property and more for Navi Mumbai residents and businesses — arranged across 75+ Banks and NBFCs, with digital documentation and doorstep support.",
    intro:
      "From Vashi to Kharghar to Panvel, we handle Navi Mumbai files the same way we handle everything else — digitally, with a named advisor who stays on the case start to finish.",
    hasOffice: false,
    serviceNote:
      "Documents collected digitally or by doorstep pickup, video or phone consultations with a senior advisor, and an in-person meeting at our Ghatkopar West office when a file genuinely needs it.",
    faqs: [
      {
        q: "Do you have an office in Navi Mumbai?",
        a: "Not a physical branch — our office is in Ghatkopar West, Mumbai. Navi Mumbai clients are served digitally, with doorstep document pickup and an in-person option in Ghatkopar when needed.",
      },
      {
        q: "I'm a business owner in a MIDC/TTC industrial area — do you handle business loans here?",
        a: "Yes — GST-based and banking-based business loan programmes work the same way regardless of which part of Navi Mumbai you're in.",
      },
      {
        q: "Can I get a Loan Against Property for a Navi Mumbai property?",
        a: "Yes, residential and commercial property in Navi Mumbai is accepted security, subject to the usual title and valuation checks.",
      },
    ],
  },
  {
    slug: "pune",
    city: "Pune",
    metaTitle: "Loan Consultant in Pune | Home, Business & Property Loans | Growth Capital Services",
    metaDescription:
      "Home loans, business loans, loan against property and more for Pune residents and businesses — arranged across 75+ Banks and NBFCs, with digital documentation and doorstep support.",
    intro:
      "Pune is the farthest city we actively serve, and it works because almost nothing in the process needs you to be in the same room as us — documents, discussion and disbursal all move digitally.",
    hasOffice: false,
    serviceNote:
      "Documents collected digitally or by courier, video or phone consultations with a senior advisor, and an in-person meeting at our Ghatkopar West, Mumbai office for the rare file that needs it.",
    faqs: [
      {
        q: "Do you have an office in Pune?",
        a: "Not yet — our office is in Ghatkopar West, Mumbai. Pune clients are served entirely digitally, with courier pickup for physical documents where needed.",
      },
      {
        q: "Is the process any slower for Pune compared to Mumbai clients?",
        a: "No — sanction and disbursal timelines are set by the lender's process, not by distance from our office.",
      },
      {
        q: "Do you work with Pune-based IT/MSME businesses for working capital?",
        a: "Yes — working capital, cash credit and overdraft programmes are available the same way as for our Mumbai clients, assessed on GST, banking and financials.",
      },
    ],
  },
];

export const getLocation = (slug: string) => LOCATIONS.find((l) => l.slug === slug);
