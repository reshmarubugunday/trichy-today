import { NewsArticle } from '@/types/news';

export const mockNews: NewsArticle[] = [
  {
    id: '1',
    slug: 'rockfort-temple-renovation-complete',
    title: 'Rockfort Ucchi Pillayar Temple Completes Major Renovation After 3 Years',
    titleTamil: 'மூன்று ஆண்டுகளுக்கு பிறகு உச்சிப்பிள்ளையார் கோவில் புனரமைப்பு நிறைவு',
    excerpt:
      'The iconic Ucchi Pillayar Temple atop Rockfort has completed its extensive renovation project, with new stone carvings and improved pilgrim facilities unveiled this week.',
    body: `<p>The Ucchi Pillayar Temple, perched atop the 83-metre high Rockfort rock in the heart of Trichy, has completed a major three-year renovation project. The Hindu Religious and Charitable Endowments Department oversaw the ₹4.2 crore project which included restoration of ancient stone carvings, improved lighting, and expanded facilities for pilgrims.</p>
    <p>The temple, dedicated to Lord Ganesha, attracts thousands of devotees daily who climb the 437 steps to reach the summit. The newly laid granite steps and the restored gopuram are the highlights of the renovation.</p>
    <p>"We are delighted to reopen the fully renovated temple to devotees. The original architectural character has been maintained while adding modern safety features," said the temple's executive officer.</p>
    <p>The renovation also included installation of CCTV cameras, improved drainage, and a new queue management system for peak festival days.</p>`,
    category: 'local',
    tags: ['rockfort', 'temple', 'renovation', 'heritage'],
    heroImageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80',
    author: { id: 'a1', name: 'Priya Sundaram', avatarUrl: '' },
    publishedAt: '2026-04-04T08:30:00Z',
    isFeatured: true,
    isBreaking: false,
    viewCount: 4820,
  },
  {
    id: '2',
    slug: 'bhel-trichy-ev-components-order',
    title: 'BHEL Trichy Bags ₹800 Crore Order for EV Charging Infrastructure Components',
    excerpt:
      'Bharat Heavy Electricals Limited Trichy unit secures a landmark order from the National Highways Authority to supply transformer equipment for highway EV charging stations.',
    body: `<p>BHEL's Trichy plant has secured an ₹800 crore order from the National Highways Authority of India (NHAI) to supply high-capacity transformers and power distribution equipment for the country's expanding EV charging network on national highways.</p>
    <p>The order covers supply of 2,000 distribution transformers across 500 highway EV charging stations over the next 24 months. The Trichy plant, which employs over 12,000 workers, will begin production next month.</p>
    <p>Union Minister for Heavy Industries called this "a testament to BHEL's technological leadership in the green energy transition."</p>`,
    category: 'business',
    tags: ['bhel', 'ev', 'order', 'manufacturing'],
    heroImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    author: { id: 'a2', name: 'Karthik Rajan' },
    publishedAt: '2026-04-03T11:00:00Z',
    isFeatured: true,
    isBreaking: false,
    viewCount: 3210,
  },
  {
    id: '3',
    slug: 'nit-trichy-startup-funding',
    title: 'NIT-T Startup Raises $2M Seed Funding for AI-Powered Agri-Tech Platform',
    excerpt:
      'A startup founded by NIT Trichy alumni has secured seed funding from prominent Chennai and Bengaluru VCs for their crop yield prediction platform used by Tamil Nadu farmers.',
    body: `<p>CropSense AI, a startup founded by three NIT Trichy alumni, has raised $2 million in seed funding from a consortium of venture capital firms including TVS Capital and Accel India. The platform uses satellite imagery and AI models to predict crop yields and detect disease outbreaks early.</p>
    <p>Currently deployed across 15,000 acres of farmland in Thanjavur and Trichy districts, the platform has helped reduce crop losses by up to 30% for participating farmers.</p>
    <p>"We want to build the intelligence layer for Indian agriculture," said co-founder Arun Prakash, who graduated from NIT-T's Computer Science department in 2021.</p>`,
    category: 'education',
    tags: ['nit-trichy', 'startup', 'agritech', 'funding'],
    heroImageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&q=80',
    author: { id: 'a3', name: 'Meena Krishnan' },
    publishedAt: '2026-04-03T09:15:00Z',
    isFeatured: true,
    isBreaking: false,
    viewCount: 2890,
  },
  {
    id: '4',
    slug: 'grand-anicut-water-level-rise',
    title: 'Grand Anicut Water Level Rises; Farmers in Cauvery Delta Hope for Timely Irrigation',
    excerpt:
      'The Kallanai dam (Grand Anicut), one of the world\'s oldest dams, recorded a water level of 14.2 feet this week, bringing relief to farmers in Thanjavur and Nagapattinam districts.',
    body: `<p>The Grand Anicut, locally known as Kallanai and built by Karikala Chola over 2,000 years ago, has seen its water levels rise to 14.2 feet following good monsoon inflows from the upper catchment areas.</p>
    <p>District officials have begun releasing water through the main canal networks, with farmers in the Cauvery Delta expressing hope for a good samba season.</p>
    <p>The Public Works Department has deployed additional teams to monitor the canal bunds and ensure equitable water distribution across all taluks.</p>`,
    category: 'local',
    tags: ['grand-anicut', 'cauvery', 'irrigation', 'farmers'],
    heroImageUrl: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=1200&q=80',
    author: { id: 'a1', name: 'Priya Sundaram' },
    publishedAt: '2026-04-02T14:45:00Z',
    isFeatured: false,
    isBreaking: true,
    viewCount: 5100,
  },
  {
    id: '5',
    slug: 'trichy-airport-new-international-routes',
    title: 'Trichy Airport to Launch Direct Flights to Dubai and Singapore From June',
    excerpt:
      'Civil Aviation Minister confirms two new international routes from Trichy International Airport, set to boost tourism and NRI connectivity to the region.',
    body: `<p>Trichy International Airport is set to gain two new international routes starting June 2026, with IndiGo launching direct flights to Dubai and Air Asia beginning services to Kuala Lumpur and Singapore.</p>
    <p>The announcement was made by the Civil Aviation Minister during a press conference at the airport. The Dubai route will operate four times a week and the Singapore route three times a week.</p>
    <p>Trichy has a significant NRI population in West Asia and Malaysia, and this move is expected to substantially reduce travel costs and transit times for these communities.</p>`,
    category: 'local',
    tags: ['airport', 'aviation', 'international', 'nri'],
    heroImageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80',
    author: { id: 'a4', name: 'Suresh Babu' },
    publishedAt: '2026-04-01T10:00:00Z',
    isFeatured: false,
    isBreaking: true,
    viewCount: 7200,
  },
  {
    id: '6',
    slug: 'mahatma-gandhi-hospital-new-icu',
    title: 'Mahatma Gandhi Memorial Hospital Inaugurates 50-Bed Cardiac ICU',
    excerpt:
      'The newly built cardiac intensive care unit at Government Mahatma Gandhi Hospital will serve patients from Trichy and five surrounding districts, equipped with latest cardiac monitoring systems.',
    body: `<p>The Government Mahatma Gandhi Memorial Hospital in Trichy inaugurated a new 50-bed Cardiac Intensive Care Unit (CICU) on Friday, funded by the Tamil Nadu government's healthcare infrastructure drive worth ₹45 crore.</p>
    <p>The unit features advanced hemodynamic monitoring, IABP machines, and a catheterization lab that can handle complex cardiac procedures. Previously, patients from Trichy and surrounding districts had to travel to Chennai for specialized cardiac care.</p>
    <p>Dean of the hospital stated that the CICU is expected to serve over 3,000 patients annually from Trichy, Karur, Pudukkottai, Perambalur, and Ariyalur districts.</p>`,
    category: 'health',
    tags: ['hospital', 'healthcare', 'cardiac', 'government'],
    heroImageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80',
    author: { id: 'a3', name: 'Meena Krishnan' },
    publishedAt: '2026-03-31T07:30:00Z',
    isFeatured: false,
    isBreaking: false,
    viewCount: 3400,
  },
  {
    id: '7',
    slug: 'trichy-ipl-screening-srirangam',
    title: 'Massive IPL Screening Event Planned at Srirangam for CSK Opening Match',
    excerpt:
      'Local organizers plan a free open-air IPL screening for Chennai Super Kings\' first match of the season at Srirangam grounds, expecting over 10,000 fans.',
    body: `<p>A massive free IPL screening event is being organized at the VOC Ground in Srirangam for CSK's opening match of the IPL 2026 season. Local organizers expect over 10,000 fans to attend the event which will feature giant LED screens, food stalls, and entertainment.</p>
    <p>CSK's loyal fan base in Trichy has consistently organized some of the most vibrant match screenings in Tamil Nadu. The organizers have coordinated with local police for traffic management around Srirangam.</p>`,
    category: 'sports',
    tags: ['ipl', 'csk', 'cricket', 'srirangam'],
    heroImageUrl: 'https://images.unsplash.com/photo-1540747913346-19212a729de3?w=1200&q=80',
    author: { id: 'a2', name: 'Karthik Rajan' },
    publishedAt: '2026-04-04T06:00:00Z',
    isFeatured: false,
    isBreaking: false,
    viewCount: 8900,
  },
  {
    id: '8',
    slug: 'trichy-corporation-digital-property-tax',
    title: 'Trichy Corporation Launches Digital Property Tax Payment Portal',
    excerpt:
      'Residents can now pay property taxes, get NOCs, and track building plan approvals entirely online through the newly launched Trichy Smart City portal.',
    body: `<p>The Trichy City Corporation has launched a comprehensive digital portal allowing residents to pay property taxes, apply for building plan approvals, and obtain No Objection Certificates without visiting Corporation offices.</p>
    <p>The Mayor inaugurated the "Trichy Smart City" portal at a function at the Corporation headquarters. The portal accepts all major payment modes including UPI, net banking, and credit/debit cards.</p>
    <p>Early payment incentives of 5% discount on property tax are available for payments made before April 30, 2026.</p>`,
    category: 'local',
    tags: ['corporation', 'digital', 'property-tax', 'smart-city'],
    heroImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    author: { id: 'a4', name: 'Suresh Babu' },
    publishedAt: '2026-04-03T13:00:00Z',
    isFeatured: false,
    isBreaking: false,
    viewCount: 2100,
  },
];
