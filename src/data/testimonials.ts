export type ClientStory = {
  name: string;
  city: string;
  product: string;
  rating: number;
  quote: string;
};

/** Illustrative client experiences — anonymized composites, not verbatim testimonials. */
export const CLIENT_STORIES: ClientStory[] = [
  {
    name: "Priya Deshmukh",
    city: "Mumbai",
    product: "Home Loan Balance Transfer",
    rating: 5,
    quote:
      "Switched our home loan and shaved ₹3,800 off the EMI within three weeks. Wish we'd called sooner.",
  },
  {
    name: "Rohan Mehta",
    city: "Thane",
    product: "Business Loan",
    rating: 4.5,
    quote:
      "Working capital sanctioned in 9 days flat — right when a big order needed raw materials.",
  },
  {
    name: "Anjali Kulkarni",
    city: "Pune",
    product: "Personal Loan",
    rating: 4,
    quote: "Needed funds fast for a family emergency. Disbursed in two days, no drama at all.",
  },
  {
    name: "Sameer Iyer",
    city: "Navi Mumbai",
    product: "Loan Against Property",
    rating: 5,
    quote:
      "Unlocked funds against our property without touching our savings. Clean process, clear terms.",
  },
  {
    name: "Neha Joshi",
    city: "Mumbai",
    product: "Education Loan",
    rating: 4.5,
    quote: "Got my daughter's admission abroad funded end-to-end, tuition and living costs both.",
  },
  {
    name: "Vikram Shah",
    city: "Pune",
    product: "CGTMSE Funding",
    rating: 4,
    quote: "No collateral, no problem. They found the right scheme for my two-year-old business.",
  },
  {
    name: "Arjun Nair",
    city: "Thane",
    product: "New Car Loan",
    rating: 4.5,
    quote: "100% on-road funding on my first car — didn't touch my savings for the down payment.",
  },
  {
    name: "Kavita Rao",
    city: "Navi Mumbai",
    product: "Balance Transfer",
    rating: 5,
    quote: "One phone call, and my home loan rate dropped by over a full percentage point.",
  },
];
