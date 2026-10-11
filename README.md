# Growth Capital Hub (70)

Build a modern, enterprise-grade, fully responsive financial services web application for "Growth Capital Services" (Established in 2017, specializing in tailored loan solutions across Mumbai, Thane, Navi Mumbai, and Pune). 

The design must look professional, clean, and high-end—avoiding any generic AI aesthetics. Use a sophisticated corporate color palette: Deep Navy (#0F172A), Slate Gray, Crisp White, and Electric Blue/Teal accents.

### Core Architecture & Navigation Tabs:
1. Navbar: Sticky header with logo, links for "Home", "Services", "Our Bank Partners", "Why Us", "FAQs", and a prominent "Apply Now / Contact" CTA button and phone number (+91 88280 01700).
2. Hero Section: 
   - Headline: "Your Dreams, Our Funding Expertise."
   - Subheadline: "Experience financial freedom with Growth Capital Services. Tailored loan solutions from major Banks and NBFCs with zero hassle."
   - Interactive CTA buttons: "Explore Loan Products" and "Get Free Expert Consultation".
3. Services Tab / Section (Interactive Cards with smooth transitions):
   - Home Loan (Top-up & Balance Transfer, Tax Benefits Section 80C, Smart Saver / Max Gain Facility)
   - Loan Against Property (High tenure up to 20 years, LTV 60% to 100%)
   - Business Loan & Working Capital / Cash Credit / Overdraft Facility
   - Personal Loan, Car Loan, Education Loan (Tax benefits Section 80E)
4. Bank Partners Grid:
   - An interactive, cleanly styled logo marquee or grid displaying network partners: HDFC Bank, ICICI Bank, SBI Home Loans, Axis Bank, Bank of India, Kotak Mahindra, Yes Bank, Bajaj Finserv, Tata Capital, Standard Chartered, HSBC, IDBI, and others.
5. "Why Choose Us" & Customer Pain Points Section:
   - Addressing key customer hurdles: How to select the right bank, transferring home loans for better terms, maximizing loan eligibility, checking credit score impacts, avoiding hidden charges, and ensuring prompt disbursal.
   - Company Mission & Vision cards.
6. Contact & Consultation Section:
   - Direct contact details: Phone (+91 88280 01700), Email (growthcs17@gmail.com), Address (CCTV Towers, Andheri-Ghatkopar Rd, Bhatwadi, Kaju Pada, Barve Nagar, Ghatkopar West, Mumbai 400084).
   - Working hours: Monday to Saturday (10:00 AM - 6:00 PM).
   - An interactive lead generation / loan inquiry form with fields: Name, Phone, Email, Loan Type required, and City.

Ensure buttery-smooth tab transitions, subtle hover states on cards, mobile responsiveness, and clean typography (Inter or Plus Jakarta Sans).
use the logo I have provided for now 
include all the tabs and dashboard sections of the website "VIVASCOPE"

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/72d6c40a-d011-4397-b210-f308f5ef4403).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## AI assistant ("Gia")

A chat button in the corner of every page opens an AI assistant that answers loan questions, runs
EMI / eligibility / stamp-duty / balance-transfer / prepayment numbers with the same maths as the
calculators, shares the rates and contact details staff keep in the CRM, and turns "talk to an
advisor" into a short callback form that arrives in the CRM as a lead (source `website-chat`).

- **Name**: temporary. Change `ASSISTANT_NAME` in `src/lib/chat/config.ts`.
- **Setup**: set `OPENAI_API_KEY` as a server secret (see `.env.example`). Locally, put it in `.env.local`.
  It is read only on the server by `POST /api/chat` and never reaches the browser.
- **What it knows**: `src/lib/chat/prompt.server.ts` builds its instructions from the site's own data
  (loans, FAQs, contact details) with the CRM's edits laid over it; `src/lib/chat/tools.server.ts` holds the calculators and look-ups.
- **Cost control**: each visitor is limited to 25 questions per 5 minutes and 150 a day (per server instance),
  answers are capped at about 700 tokens, and the conversation sent is the last 14 messages. Also set a
  monthly spending limit on the OpenAI account.
- **Sign-in**: before any question, the visitor confirms their mobile number with a 6-digit code texted to
  them (`src/components/chat-gate.tsx`). The CRM sends and checks the code (`backend/src/chat-auth`), keeps the
  person as a lead marked a "Chatbot contact", and hands the browser a 7-day pass. `/api/chat` refuses requests
  without a pass the CRM approves. The live CRM needs an SMS provider (`SMS_PROVIDER`, `MSG91_AUTH_KEY`,
  `MSG91_TEMPLATE_ID`); without one, codes can't be sent and the chat stays closed.
- Other parts of the site can open it: `window.dispatchEvent(new CustomEvent("gcs:open-chat", { detail: { message: "..." } }))`.
