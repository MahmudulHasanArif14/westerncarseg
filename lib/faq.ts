import type { FaqItem } from "@/lib/schema";
import { SITE } from "@/lib/site";

/**
 * FAQ content for AEO. Each answer restates facts that are already published on the original
 * site (home page copy, Our Services page, About page or the Terms & Conditions) — nothing new.
 */
export const HOME_FAQ: FaqItem[] = [
  {
    question: "What areas does Western Cars cover?",
    answer:
      "Western Cars is based in Crawley, West Sussex, and covers East and West Sussex, including East Grinstead, Burgess Hill, Haywards Heath, Horsham, Worthing, Chichester and Bognor Regis, as well as all major train stations. We also provide transfers to and from Gatwick, Heathrow, Stansted, Luton, London City, Southend and Biggin Hill airports.",
  },
  {
    question: "Is Western Cars available 24 hours a day?",
    answer: `Yes. Western Cars operates 24-hour taxi services in Crawley, 7 days a week, so you can call us on ${SITE.phone.display} at any time. We do not charge any extra for out-of-hours services and we are available at short notice.`,
  },
  {
    question: "How can I book a taxi with Western Cars?",
    answer: `You can book online through our booking page, by phone on ${SITE.phone.display}, by text, by email at ${SITE.email}, or with the free Western Cars app for iPhone and Android.`,
  },
  {
    question: "Do you provide airport transfers?",
    answer:
      "Yes. We provide transfers to and from Gatwick, Heathrow, Stansted, Luton, London City, Southend and Biggin Hill airports, and other major UK airports. A Meet and Greet service is available if required: the driver waits at arrivals with a name board and our controllers keep an eye on your flight.",
  },
  {
    question: "What types of vehicle do you have?",
    answer:
      "Our fleet includes executive vehicles, saloons, estates, six, seven and eight seater carriers, and vehicles with wheelchair access facilities. Saloon and estate cars carry a maximum of 4 passengers plus luggage.",
  },
  {
    question: "How are fares worked out?",
    answer: "Our prices are based on mileage and vehicle type only. We offer set rates for many destinations, including Gatwick, Heathrow and Stansted.",
  },
];

export const SERVICES_FAQ: FaqItem[] = [
  {
    question: "Can I pay by card?",
    answer:
      "Yes. We accept all major credit, debit and Visa cards. Under our Terms & Conditions, payments made in any form other than cash (pounds sterling) carry a booking fee of £3.00.",
  },
  {
    question: "Do you offer business accounts?",
    answer:
      "Yes. Western Cars offers an account service for corporate customers and individuals. Benefits include priority status over cash-paying customers, monthly invoicing, a 15 to 30 day credit facility, a full explanation of your bookings, and journeys with a fixed pick-up to drop-off price regardless of route or time taken.",
  },
  {
    question: "Can you transport large groups?",
    answer: "Yes. We provide transportation for big groups, whether you are going on a city tour, to a wedding destination or to any other event, using our MPVs and minibuses.",
  },
  {
    question: "Is there a charge for waiting?",
    answer:
      "Under our Terms & Conditions, waiting is free for the first 5 minutes at pick-ups other than airports, then charged at 40p per minute on the entire waiting time. For airport pick-ups, 60 minutes of free waiting time is allowed from the time of landing (more can be requested when booking), then 40p per minute. There is no additional charge for flight delays.",
  },
  {
    question: "What is your cancellation policy?",
    answer: `Cancellations must be made by telephone on ${SITE.phone.display}. Under our Terms & Conditions a cancellation charge applies: £10.00 when cancelled 24 hours or more before the booking, 50% of the quoted price when cancelled 3 to 24 hours before, and 100% of the quoted price where notice is not given up to 3 hours before the booking. Please read the full Terms & Conditions for details.`,
  },
];
