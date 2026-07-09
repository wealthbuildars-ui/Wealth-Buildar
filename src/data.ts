import { Article, QuizQuestion, AffiliateProduct, AdminSettings } from './types';

export const ARTICLES: Article[] = [
  {
    id: "affiliate_01",
    title: "Ethical Affiliate Marketing Blueprint",
    subtitle: "Build a sustainable, trust-first affiliate business from scratch.",
    category: "AFFILIATE_MARKETING",
    readTimeMinutes: 8,
    difficulty: "Beginner",
    tags: ["Passive Income", "SEO", "Niche Sites"],
    earningPotential: "$500 - $10,000 / month",
    iconName: "Share",
    isFeatured: true,
    content: `
Affiliate marketing is the practice of earning a commission by promoting another company's products or services. Done ethically, it is one of the most powerful business models available today.

### The Core Philosophy: Trust is Currency
Many affiliate marketers fail because they promote junk products simply to make a quick buck. This is a dead-end strategy. Sustainable wealth is built by providing genuine value and only recommending products you have tested and fully believe in.

### Step 1: Choose Your Core Focus (Your Niche)
Do not attempt to build an "everything" store. Focus on a specific sub-niche where you have interest or expertise. Examples:
• Instead of "Fitness", focus on "Kettlebell training for desk workers over 40".
• Instead of "Finance", focus on "SaaS tool reviews for freelance web designers".

### Step 2: Set Up Your Platform
While you can start on social media, owning your distribution channel (a WordPress, Ghost, or static blog/newsletter) is critical. This protects you from algorithm changes.

### Step 3: Produce Search-Optimized, Problem-Solving Content
Create content that answers specific search queries. Examples:
• **"Best [Product Category] for [Specific Audience]"** (e.g., Best microphones for remote podcasting)
• **"Product A vs. Product B Comparison"**
• **In-depth, hands-on reviews with original photography/screenshots**

### Step 4: Sign Up for Legitimate Networks
Start with trusted affiliate platforms:
1. **Amazon Associates**: Great for beginners, huge catalog, but low commissions (1% - 4%).
2. **ShareASale & CJ Affiliate**: Host thousands of intermediate brands.
3. **Direct SaaS Affiliate Programs**: Recommend software you already use (often pay 20% - 40% recurring monthly commissions!).

### Step 5: Master the Art of Ethical Disclosure
Always clearly disclose that you earn a small commission at no extra cost to the user. This builds deep credibility and aligns with legal regulations.
    `.trim()
  },
  {
    id: "freelance_01",
    title: "The $5k/Month Freelancing Roadmap",
    subtitle: "Transition from gig-platform dependency to high-paying direct clients.",
    category: "FREELANCING",
    readTimeMinutes: 10,
    difficulty: "Intermediate",
    tags: ["Freelancing", "High-Paying", "Client Acquisition"],
    earningPotential: "$1,000 - $15,000 / month",
    iconName: "Work",
    isFeatured: true,
    content: `
Freelancing lets you trade your skills for immediate income. The challenge isn't finding work—it is escaping low-tier, price-competitive bidding sites and securing high-value contracts.

### Phase 1: Identify Your High-Income Skill (HIS)
The market values specific, business-impacting skills far higher than generic services.
• **Low Value**: "Writing articles" vs. **High Value**: "Writing conversion-optimized email flows for Shopify stores."
• **Low Value**: "Building websites" vs. **High Value**: "Designing high-converting landing pages for B2B tech companies."

### Phase 2: Create a Stand-Alone Portfolio
Do not rely on resume sheets. Build a simple 3-page personal portfolio.
• **The Hook**: Clear headline stating WHO you help and HOW.
• **Case Studies**: Instead of showing final screenshots, outline:
  1. The Client's original problem.
  2. Your custom strategic solution.
  3. The measurable results (e.g., 22% increase in sales or 40 hours saved).

### Phase 3: Escape the Platform Trap
Fiverr and Upwork are okay for first-month confidence, but they take 10%-20% of your earnings and force you into price bidding wars. To scale, go direct:
1. **LinkedIn Outbound**: Search for marketing managers, content directors, or founders at target mid-sized companies. Connect and offer a quick value-add audit.
2. **Cold Emailing**: Research 50 prospects who need your service. Send short, personalized emails showing them exactly how they could improve their current output.

### Phase 4: Master the Value-Based Pricing
Never quote hourly rates if you can avoid it. Clients don't buy hours; they buy outcomes. Quote flat project rates.
• If a website redesign will bring a client an extra $10,000/month, charging $3,000 for the project is an absolute bargain for them, even if it only takes you 15 hours to complete.
    `.trim()
  },
  {
    id: "digital_01",
    title: "Digital Product Design & Launch",
    subtitle: "Package your knowledge into high-margin assets that sell while you sleep.",
    category: "DIGITAL_PRODUCTS",
    readTimeMinutes: 9,
    difficulty: "Advanced",
    tags: ["Digital Products", "Gumroad", "Notion Templates"],
    earningPotential: "$200 - $30,000 / month",
    iconName: "ShoppingBag",
    isFeatured: false,
    content: `
Digital products—e-books, Notion templates, checklists, video courses, or custom spreadsheets—have 99% profit margins and near-zero inventory costs. Once built, they can sell indefinitely.

### The Minimum Viable Product (MVP) Rule
Never spend six months building a digital product in secret. It is highly likely nobody will buy it because it hasn't been validated. Build a "Minimum Viable Product" first:
• Instead of a 10-hour masterclass video course, create a highly detailed, 15-page actionable PDF guide or a customized Notion dashboard.
• Release it to a small group of people for free in exchange for feedback and testimonials.

### Step 1: Brainstorm Your Value Asset
Ask yourself: What is a problem you solved for yourself that others are struggling with?
• **Example 1**: "My personalized budget tracker that helped me clear $20k in student loans." (Target: Young adults looking to clear debt)
• **Example 2**: "My custom Figma UI kit that saves 5 hours per design project." (Target: Figma web designers)

### Step 2: Set Up Gumroad or Lemon Squeezy
These platforms handle payment processing, sales tax, PDF stamping, and automatic product delivery out-of-the-box. Setup takes less than 30 minutes.

### Step 3: Build the Distribution Flywheel
Great products don't sell themselves. You need a simple marketing mechanism:
1. **The Lead Magnet**: Give away a smaller, highly useful free version (e.g., a simple checklist) in exchange for their email address.
2. **The Email Sequence**: Send a series of educational emails over 5 days, building up to a special discount offer for your main product.
3. **Short-Form Content**: Post bite-sized tips, breakdowns, or tutorials on platforms like TikTok, YouTube Shorts, or LinkedIn, linking to your free lead magnet.
    `.trim()
  },
  {
    id: "edu_01",
    title: "The Power of Compound Interest",
    subtitle: "Uncover the mathematical miracle behind long-term wealth accumulation.",
    category: "FINANCIAL_EDUCATION",
    readTimeMinutes: 7,
    difficulty: "Beginner",
    tags: ["Investing", "Personal Finance", "Wealth Building"],
    earningPotential: "Long-term Wealth Freedom",
    iconName: "ShowChart",
    isFeatured: false,
    content: `
All the online income in the world won't make you wealthy if you don't understand how to keep it and make it grow. The cornerstone of financial education is mastering compound interest.

### What is Compound Interest?
Compound interest is the interest you earn on interest. Over time, it turns a linear savings graph into a steep, exponential hockey-stick curve. Albert Einstein famously called it the "Eighth Wonder of the World."

### The Simple Formula
Every dollar you invest is a tiny employee working for you. 
• Year 1: You invest $1,000 at a 10% average annual return. You earn $100. Your balance is $1,100.
• Year 2: You earn 10% interest not on $1,000, but on **$1,100**. You earn $110. Your balance is $1,210.
• Year 10: Your $1,000 has grown to $2,593 with zero extra contributions.
• Year 30: Your $1,000 has grown to **$17,449**!

### The Cost of Delay
Time is the absolute most critical factor in compounding.
• **Investor A** starts at age 20, investing $200 a month for 10 years, then stops contributing entirely.
• **Investor B** starts at age 30, investing $200 a month for 30 years until retirement.
• At age 60, who has more money? **Investor A** has significantly more, despite only contributing for 10 years instead of 30, because their money had an extra 10-year head start to compound!

### How to Start Participating Legitimately
1. **Eradicate High-Interest Debt**: Paying off a credit card with 20% interest is the equivalent of a guaranteed 20% tax-free investment return!
2. **Build an Emergency Fund**: Put 3-6 months of expenses in a High-Yield Savings Account (HYSA) so you never have to pull money out of long-term investments during a crisis.
3. **Automate Index Fund Investing**: Set up automatic monthly purchases of broad-market index funds (like S&P 500 or Total World Stock ETFs). These offer historical average returns of 8%-10% per year with highly diversified safety.
    `.trim()
  },
  {
    id: "edu_02",
    title: "Niche Site Monetization Strategies",
    subtitle: "Learn how to capture target search traffic and convert readers into buyers.",
    category: "AFFILIATE_MARKETING",
    readTimeMinutes: 6,
    difficulty: "Intermediate",
    tags: ["SEO", "Monetization", "Ads"],
    earningPotential: "$300 - $5,000 / month",
    iconName: "AccountBalance",
    isFeatured: false,
    content: `
Building an audience online is great, but knowing how to monetize that audience is a science in itself.

### The Three Pillars of Site Monetization
Once your blog or niche site receives over 10,000 monthly visits, three main income streams unlock:

1. **Display Advertising**:
   Instead of low-paying Google AdSense, apply to premium ad networks like **Mediavine** or **Raptive** once you hit their traffic thresholds. These pay up to $20-$40 per 1,000 page views (RPM).

2. **Affiliate Recommendations**:
   Integrate contextual affiliate links naturally within your articles. If someone searches "how to clean suede shoes" and you write a detailed tutorial recommending a specific $15 brush, the buyer conversion rate will be extremely high.

3. **Digital Info-Products**:
   If your readers ask the same questions repeatedly, bundle the answers into a premium $29 e-book or printable template, capturing 100% of the margins.

### SEO SEO and SEO
To get visitors without spending money, your articles must rank on Google. Write extremely focused, helpful, comprehensive guides that directly satisfy the searcher's query. Better user experience (longer read time, clear headings, zero spam) translates directly to higher rankings.
    `.trim()
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "quiz_01",
    category: "FINANCIAL_EDUCATION",
    question: "Which asset class has historically provided the most consistent long-term returns above inflation?",
    options: ["Physical Gold", "Broad-Market Stock Index Funds", "Cryptocurrency", "Regular Bank Savings Account"],
    correctAnswerIndex = 1,
    explanation: "Over the past 100 years, broad-market stock index funds (like the S&P 500) have returned a historical average of 8%-10% per year, consistently outperforming gold and inflation."
  },
  {
    id: "quiz_02",
    category: "AFFILIATE_MARKETING",
    question: "What is the most sustainable and high-converting strategy for an affiliate marketer?",
    options: [
      "Posting affiliate links in random social media comment sections",
      "Promoting every product that pays a high commission, regardless of quality",
      "Building trust by writing comprehensive, honest reviews based on hands-on testing",
      "Buying paid traffic to direct affiliate links"
    ],
    correctAnswerIndex = 2,
    explanation: "Authenticity and user trust are the ultimate metrics in affiliate marketing. Honest reviews based on real testing convert significantly better and build long-term reader loyalty."
  },
  {
    id: "quiz_03",
    category: "FREELANCING",
    question: "To escape low-paying bids and earn $5,000/month as a freelancer, what should you transition to?",
    options: [
      "Bidding on cheaper jobs to win more work",
      "Specializing in a high-income skill and pitching mid-sized businesses directly via LinkedIn/Email",
      "Working 90 hours a week on Fiverr",
      "Changing your profile name to sound more corporate"
    ],
    correctAnswerIndex = 1,
    explanation: "Specializing in a high-value business-impacting skill (e.g., copywriting for SaaS) and pitching companies directly removes you from platform fee cuts and intense price competition."
  },
  {
    id: "quiz_04",
    category: "DIGITAL_PRODUCTS",
    question: "What is a 'Lead Magnet' in digital product marketing?",
    options: [
      "A magnet that attracts metal hard drives",
      "A highly expensive product that drives 90% of your business profits",
      "A high-quality, free value asset given to readers in exchange for their email address",
      "An online advertisement that forces people to buy instantly"
    ],
    correctAnswerIndex = 2,
    explanation: "A Lead Magnet (like a free checklist or guide) builds email subscribers, allowing you to nurture relationships and pitch your main digital product via an automated email funnel."
  },
  {
    id: "quiz_05",
    category: "FINANCIAL_EDUCATION",
    question: "If Investor A starts saving at 20 and Investor B starts at 30, with both earning 9% return, why does Investor A accumulate vastly more wealth?",
    options: [
      "Because Investor A is naturally luckier",
      "Because they had 10 extra years for compound interest to multiply their interest on interest exponentially",
      "Because younger investors receive better tax breaks",
      "Because of stock splits"
    ],
    correctAnswerIndex = 1,
    explanation: "Time is the absolute multiplier of compound interest. A 10-year head start gives compounding interest an extra decade to double and grow exponentially, making a colossal difference."
  }
];

export const DEFAULT_PRODUCTS: AffiliateProduct[] = [
  {
    id: "prod_01",
    name: "SaaS Sales Master Landing Page Template",
    description: "A conversion-optimized React + Tailwind CSS landing page template designed specifically for software startups and SaaS businesses. High-converting layouts, interactive pricing sliders, responsive grids, and clean visual assets.",
    category: "Development & Templates",
    subcategory: "Website Templates",
    brand: "TailwindCraft",
    images: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60"],
    price: 49.00,
    discountPrice: 39.00,
    currency: "USD",
    affiliateLink: "https://gumroad.com/l/saas-sales-landing-react",
    merchantName: "TailwindCraft Assets",
    stockStatus: "In Stock",
    rating: 4.8,
    reviewCount: 34,
    specifications: {
      "Framework": "React, Vite, TypeScript",
      "Styling": "Tailwind CSS v3.4",
      "Responsive": "Yes, Mobile + Tablet + Desktop optimized",
      "Animations": "Framer Motion integrated"
    },
    dateAdded: Date.now() - 15 * 24 * 60 * 60 * 1000,
    lastUpdated: Date.now(),
    isFeatured: true,
    isTrending: true,
    isRecommended: true,
    isArchived: false,
    partnerId: "partner_01",
    tags: ["React", "Landing Page", "SaaS", "Conversion", "Tailwind"],
    commissionPercent: 40.0,
    status: "Approved",
    sellerId: "",
    sellerName: "Admin",
    rejectionReason: "",
    availableQuantity: 999,
    deliveryFee: 0.0,
    deliveryRegions: "Worldwide Instant Delivery",
    estimatedDeliveryTime: "Immediate via Email Download"
  },
  {
    id: "prod_02",
    name: "Premium Notion Business Workspace Suite",
    description: "The complete system to organize your freelance business, consulting gig, or side-hustle. Features client CRM, invoice generators, project boards, expense trackers, content scheduler, and meeting note organizers in a clean minimalist design.",
    category: "Productivity Tools",
    subcategory: "Notion Templates",
    brand: "Minimalist Systems",
    images: ["https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60"],
    price: 29.00,
    discountPrice: null,
    currency: "USD",
    affiliateLink: "https://gumroad.com/l/notion-business-workspace-suite",
    merchantName: "Minimalist Systems HQ",
    stockStatus: "In Stock",
    rating: 4.9,
    reviewCount: 112,
    specifications: {
      "Platform": "Notion",
      "Difficulty": "Easy Setup (Video tutorial included)",
      "Multi-user Support": "Yes, great for solo or small teams",
      "Updates": "Free lifetime access"
    },
    dateAdded: Date.now() - 30 * 24 * 60 * 60 * 1000,
    lastUpdated: Date.now(),
    isFeatured: true,
    isTrending: false,
    isRecommended: true,
    isArchived: false,
    partnerId: "partner_02",
    tags: ["Notion", "Productivity", "CRM", "Freelancer Tool", "Organizer"],
    commissionPercent: 40.0,
    status: "Approved",
    sellerId: "",
    sellerName: "Admin",
    rejectionReason: "",
    availableQuantity: 999,
    deliveryFee: 0.0,
    deliveryRegions: "Worldwide Instant Delivery",
    estimatedDeliveryTime: "Immediate Notion Duplicate Link"
  },
  {
    id: "prod_03",
    name: "Ultimate Email Pitch Toolkit for Freelancers",
    description: "Stop cold pitching blind. Get our collection of 15+ copy-and-paste email templates that have generated over $500k in deals for web designers, writers, and marketers. Includes follow-up sequences, negotiation handles, and pricing proposals.",
    category: "Marketing & Growth",
    subcategory: "E-books & Guides",
    brand: "Freelance Mastery",
    images: ["https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=600&auto=format&fit=crop&q=60"],
    price: 19.00,
    discountPrice: 15.00,
    currency: "USD",
    affiliateLink: "https://gumroad.com/l/freelance-pitch-email-toolkit",
    merchantName: "Freelance Academy Press",
    stockStatus: "In Stock",
    rating: 4.7,
    reviewCount: 56,
    specifications: {
      "Format": "PDF, Google Docs link",
      "Templates": "15+ customizable pitching sequences",
      "Target Verticals": "SaaS, E-commerce, Real Estate, Local Business",
      "Bonuses": "LinkedIn pitch guides + contract template"
    },
    dateAdded: Date.now() - 5 * 24 * 60 * 60 * 1000,
    lastUpdated: Date.now(),
    isFeatured: false,
    isTrending: true,
    isRecommended: false,
    isArchived: false,
    partnerId: "partner_03",
    tags: ["E-book", "Freelancing", "Pitching", "Emails", "Sales"],
    commissionPercent: 40.0,
    status: "Approved",
    sellerId: "",
    sellerName: "Admin",
    rejectionReason: "",
    availableQuantity: 999,
    deliveryFee: 0.0,
    deliveryRegions: "Worldwide Instant Delivery",
    estimatedDeliveryTime: "Immediate Download Link"
  }
];

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  registrationFee: 5000.0,
  isTimerEnabled: true,
  bankName: "OPay",
  accountNumber: "9162072645",
  accountName: "Chizaram W. Amajor",
  siteName: "Wealth Builder",
  siteDescription: "Build Legitimate Wealth. Learn scalable systems.",
  websiteLogoUrl: "",
  websiteBannerUrl: "",
  isReferralProgramEnabled: true,
  referralRewardAmount: 1500.0,
  grantRewardOnStatus: "Approved",
  homepageHeroTitle: "Build Legitimate Wealth Online",
  homepageHeroSubtitle: "Discover scalable, ethical, and highly lucrative digital business models today.",
  aboutText: "Wealth Builder is a premium e-learning and tracking platform designed to help aspiring digital entrepreneurs build long-term, scalable incomes through affiliate marketing, freelancing, digital products, and sound financial education.",
  contactEmail: "wealthbuildars@gmail.com",
  contactPhone: "+2349162072645",
  businessHours: "Mon - Fri: 9:00 AM - 5:00 PM",
  googleMapsAddress: "Lagos, Nigeria",
  footerCopyright: "© 2026 Wealth Builder. All Rights Reserved.",
  websiteColorPrimary: "#0F9D58",
  websiteColorSecondary: "#F4B400",
  websiteColorBackground: "#FFFFFF",
  featuresList: [
    "Premium Educational Blueprints|Detailed, step-by-step guides on scalable online businesses.",
    "Interactive Earning Trackers|Monitor your goals, saved balances, and referral earnings dynamically.",
    "Active Referral Network|Invite others and earn instant commission upon their account activation.",
    "Dedicated Support System|Instant ticketing channel to get help from expert financial tutors."
  ],
  faqsList: [
    "Is the registration fee a one-time payment?|Yes! The registration is a strict one-time setup fee with no recurring charges.",
    "How long does the approval process take?|Our admin team works around the clock to verify transfers within 1 to 24 hours.",
    "How does the referral program work?|Once approved, you get a unique link/code. When friends register and get verified, you earn instant commissions!"
  ],
  testimonialsList: [
    "Tunde A.|The affiliate blueprint transformed my approach entirely. Within 3 weeks, my first OPay alerts started rolling in!",
    "Chinedu O.|Wealth Builder provides genuine, step-by-step actions. No MLM, no empty promises. Strictly systems that scale.",
    "Amina Y.|The Support Center is incredibly responsive. I asked about freelancers' invoice tools and got an advisor response in 2 hours!"
  ],
  sellerRevenuePercent: 50.0,
  affiliateRevenuePercent: 40.0,
  platformRevenuePercent: 10.0,
  isCustomerDiscountEnabled: true,
  customerDiscountPercent: 5.0
};

// Math calculations

export interface InterestYearData {
  year: number;
  balance: number;
  contributions: number;
  interestEarned: number;
}

export function calculateCompoundInterest(
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  years: number
): InterestYearData[] {
  const r = annualRate / 100.0;
  const n = 12; // monthly compounding
  
  const data: InterestYearData[] = [];
  let currentBalance = principal;
  let totalContributions = principal;

  data.push({ year: 0, balance: principal, contributions: principal, interestEarned: 0 });

  for (let year = 1; year <= years; year++) {
    for (let month = 1; month <= 12; month++) {
      currentBalance = currentBalance * (1.0 + r / n) + monthlyContribution;
      totalContributions += monthlyContribution;
    }
    const totalInterest = currentBalance - totalContributions;
    data.push({
      year,
      balance: parseFloat(currentBalance.toFixed(2)),
      contributions: parseFloat(totalContributions.toFixed(2)),
      interestEarned: parseFloat(totalInterest.toFixed(2))
    });
  }
  return data;
}

export interface FreelanceRateResult {
  hourlyRate: number;
  annualGrossRevenueNeeded: number;
  annualTaxAmount: number;
  hoursPerYear: number;
}

export function calculateFreelanceRate(
  targetMonthlyNet: number,
  monthlyExpenses: number,
  taxRatePercent: number,
  billableHoursPerWeek: number,
  vacationWeeksPerYear: number
): FreelanceRateResult {
  const annualNetNeeded = targetMonthlyNet * 12;
  const annualExpenses = monthlyExpenses * 12;
  
  const taxMultiplier = 1.0 - (taxRatePercent / 100.0);
  const annualGrossNeeded = taxMultiplier > 0 ? annualNetNeeded / taxMultiplier : annualNetNeeded;
  const totalAnnualRevenueNeeded = annualGrossNeeded + annualExpenses;

  const workingWeeks = Math.max(1, 52 - vacationWeeksPerYear);
  const totalAnnualBillableHours = workingWeeks * billableHoursPerWeek;

  const hourlyRateNeeded = totalAnnualBillableHours > 0 
    ? totalAnnualRevenueNeeded / totalAnnualBillableHours 
    : 0;

  return {
    hourlyRate: parseFloat(hourlyRateNeeded.toFixed(2)),
    annualGrossRevenueNeeded: parseFloat(totalAnnualRevenueNeeded.toFixed(2)),
    annualTaxAmount: parseFloat((totalAnnualRevenueNeeded * (taxRatePercent / 100.0)).toFixed(2)),
    hoursPerYear: totalAnnualBillableHours
  };
}

export interface ProductEvaluationResult {
  score: number;
  rating: string;
  breakdown: Array<{ criterion: string; score: number }>;
}

export function evaluateDigitalProductIdea(
  painSeverity: number,
  marketSize: number,
  productionEase: number,
  marginPotential: number
): ProductEvaluationResult {
  const totalScore = ((painSeverity + marketSize + productionEase + marginPotential) / 40) * 100;
  let rating = "";
  if (totalScore >= 80) {
    rating = "Elite Venture (Launch immediately!)";
  } else if (totalScore >= 60) {
    rating = "Strong Concept (Validate with a lead magnet first)";
  } else if (totalScore >= 40) {
    rating = "Moderate Prospect (Refine target problem or audience)";
  } else {
    rating = "High Risk (Pivot to a deeper pain point or smaller scope)";
  }

  return {
    score: parseFloat(totalScore.toFixed(1)),
    rating,
    breakdown: [
      { criterion: "Pain Point Severity", score: painSeverity * 10 },
      { criterion: "Market Interest", score: marketSize * 10 },
      { criterion: "Ease of Production", score: productionEase * 10 },
      { criterion: "Scalability Potential", score: marginPotential * 10 }
    ]
  };
}
