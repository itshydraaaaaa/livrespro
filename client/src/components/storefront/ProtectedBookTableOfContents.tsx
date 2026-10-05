import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ShieldCheck,
  Lock,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  BookOpen,
  FileText,
  Eye,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export interface BookChapterMeta {
  number: number;
  title: string;
  page: number;
  caseStudy?: {
    name: string;
    title: string;
    page: number;
  };
  sections: { title: string; page: number }[];
}

export const BOOK_CHAPTERS: BookChapterMeta[] = [
  {
    number: 1,
    title: "Performance Branding: Quantifying the Impact of B2B Branding Strategy",
    page: 22,
    caseStudy: {
      name: "Mediterranean School of Business (MSB)",
      title: "Co-designing a Holistic Future Proof Educational Brand",
      page: 34,
    },
    sections: [
      { title: "Performance Branding Defined", page: 23 },
      { title: "How it delivers strategic benefits", page: 24 },
      { title: "Additional critical benefits", page: 24 },
      { title: "Challenges in Brand Management B2B Branding", page: 25 },
      { title: "The Rise of Big Tech and H2H Marketing", page: 25 },
      { title: "What Branding Really Means", page: 26 },
      { title: "Brand Leadership", page: 27 },
      { title: "B2B Performance Branding Benefits", page: 27 },
      { title: "The 95-5 Rule and Performance Branding", page: 28 },
      { title: "Performance Branding in Action", page: 28 },
      { title: "Common Challenges in Performance Branding", page: 29 },
      { title: "AI and Performance Branding in B2B", page: 30 },
      { title: "Summary & Questions for Discussion", page: 31 },
      { title: "Literature", page: 32 },
    ],
  },
  {
    number: 2,
    title: "Digital Transformative reshaping strategies, processes, and outcomes of B2B Marketing",
    page: 48,
    caseStudy: {
      name: "BIAT (MyBIAT)",
      title: "An innovative and responsible digital solution",
      page: 62,
    },
    sections: [
      { title: "Introduction: The Evolution of B2B Branding", page: 48 },
      { title: "Transformative Marketing and Brand Management", page: 49 },
      { title: "Guiding Principles in Transformative Marketing", page: 50 },
      { title: "B2B Market Dynamics & Complexity of Industrial Products", page: 50 },
      { title: "Derived Demand & Organizational Buying", page: 51 },
      { title: "Human Factors in Business Decisions", page: 52 },
      { title: "Brand Relevance and Functions in B2B", page: 53 },
      { title: "Holistic Branding and H2H Marketing", page: 54 },
      { title: "The Branding Triangle & Branding Commodities", page: 55 },
      { title: "The Role of Emotions in B2B Branding", page: 56 },
      { title: "AI and Transformative Marketing in B2B (Hyper-Personalization)", page: 57 },
      { title: "Summary, Questions for Discussion & Literature", page: 59 },
    ],
  },
  {
    number: 3,
    title: "Dimensions of Brand Management and Brand Distinction",
    page: 73,
    caseStudy: {
      name: "ARVEA Nature",
      title: "The Community-Based Brand",
      page: 88,
    },
    sections: [
      { title: "The Evolution of B2B Branding Management", page: 73 },
      { title: "The Four Dimensions of Brand Management", page: 74 },
      { title: "How Brands Create Value in B2B", page: 75 },
      { title: "Make a Consistent Impression", page: 77 },
      { title: "AI and Brand Management Dimensions", page: 78 },
      { title: "Brand Distinction & Return on Brand Investment (ROBI)", page: 79 },
      { title: "Brand Architecture", page: 80 },
      { title: "Brands in Marketing-Mix 5Es", page: 81 },
      { title: "AI and Brand Distinction", page: 83 },
      { title: "Summary, Questions for Discussion & Literature", page: 84 },
    ],
  },
  {
    number: 4,
    title: "Dynamic Capability of Transformative Brand Strategy",
    page: 107,
    caseStudy: {
      name: "Gourmandise & Co.",
      title: "From Garden Oven to Gourmandise Glory: A Mother's Wish Becomes a Legacy Brand",
      page: 125,
    },
    sections: [
      { title: "Introduction: Transformative Brand Strategy", page: 107 },
      { title: "Corporate Brands & Family Brands", page: 109 },
      { title: "Individual, National and International Brands", page: 111 },
      { title: "Brand Elements (Name, Logo, Tagline, Story)", page: 115 },
      { title: "AI and Transformative Brand Strategy", page: 119 },
      { title: "Summary, Questions for Discussion & Literature", page: 120 },
    ],
  },
  {
    number: 5,
    title: "Brand Specialties and Brand Communication",
    page: 142,
    caseStudy: {
      name: "CHO Group (Terra Delyssa)",
      title: "Smart Olive Oil: Blockchain-Enabled Shared Value Creation & Branding",
      page: 157,
    },
    sections: [
      { title: "Introduction: Holistic Brand Communication", page: 142 },
      { title: "The Branding Triangle & Key Communication Tools", page: 144 },
      { title: "Personal Selling, LinkedIn, Direct Marketing & Trade Shows", page: 144 },
      { title: "Sponsoring, Advertising & Sales Promotion", page: 146 },
      { title: "Brand Evaluation & AI in Communication", page: 148 },
      { title: "Living the Brand & Word-of-Mouth Brand Building", page: 149 },
      { title: "Social Branding and Corporate Social Responsibility", page: 151 },
      { title: "Summary, Questions for Discussion & Literature", page: 152 },
    ],
  },
  {
    number: 6,
    title: "The Process of Building B2B Brandings",
    page: 184,
    caseStudy: {
      name: "Wallyscar",
      title: "Wallyscar 619: Turning Crisis Into Opportunity",
      page: 200,
    },
    sections: [
      { title: "Introduction: The Holistic Approach to Brand Building", page: 184 },
      { title: "Service-Dominant Logic and Brand Co-Creation", page: 185 },
      { title: "Brand Planning and Shareholder Value", page: 186 },
      { title: "The Brand Building Process & Branding Principles", page: 187 },
      { title: "Brand Strategy and Analysis", page: 189 },
      { title: "Brand Architecture & Brand Portfolio Management", page: 191 },
      { title: "Brand Audit, Metrics & Business Intelligence", page: 192 },
      { title: "CEO and Personal Branding", page: 194 },
      { title: "Generative AI and Branding", page: 196 },
      { title: "Summary, Questions for Discussion & Literature", page: 197 },
    ],
  },
  {
    number: 7,
    title: "Exercise Caution Regarding Branding Missteps",
    page: 209,
    caseStudy: {
      name: "MPBS",
      title: "Building Brand Power Across the B2B Ecosystem",
      page: 218,
    },
    sections: [
      { title: "Introduction: Learning from Branding Failures", page: 209 },
      { title: "Maintaining Brand Identity", page: 210 },
      { title: "Understanding Branding Obstacles", page: 211 },
      { title: "AI and Branding Obstacles", page: 214 },
      { title: "Summary, Questions for Discussion & Literature", page: 215 },
    ],
  },
  {
    number: 8,
    title: "The Strategic Awakening of B2B in Tunisia",
    page: 226,
    caseStudy: {
      name: "Secteur Optique (Essilor / Partenaires)",
      title: "Organic B2B Branding in the Optical Sector",
      page: 230,
    },
    sections: [
      { title: "Tunisia, a Mediterranean B2B Hub – Potential vs. Brand Reality", page: 227 },
      { title: "The Pioneers: Establishing Proof of Concept", page: 227 },
      { title: "Digital B2B: Visibility Tool or Strategic Lever?", page: 228 },
      { title: "The Shift toward Thought Leadership", page: 229 },
      { title: "The Missing Link: The B2B2C Value Chain", page: 229 },
      { title: "The Systemic Impact: The Expanded Stakeholder Ecosystem", page: 231 },
    ],
  },
  {
    number: 9,
    title: "Future Perspective of B2B Brandings",
    page: 237,
    sections: [
      { title: "The Changing Business Landscape", page: 237 },
      { title: "The Rising Importance of B2B Branding", page: 238 },
      { title: "Artificial Intelligence in B2B Branding Management", page: 239 },
      { title: "Transformative Marketing and Performance Branding", page: 240 },
      { title: "Future Trends in B2B Branding Management", page: 241 },
      { title: "Timeless Principles: Relevance, Simplicity, and Humanity", page: 242 },
      { title: "Co-Creation and Service-Dominant Logic", page: 243 },
      { title: "Conclusion, Summary & Literature", page: 243 },
      { title: "List of Abbreviations", page: 249 },
      { title: "List of Companies Mentioned", page: 253 },
      { title: "List of Figures", page: 277 },
    ],
  },
];

// Definition of all 21 pages rendered strictly in canvas
interface PageRenderData {
  pageNumber: number;
  headerLeft?: string;
  headerRight?: string;
  title?: string;
  subtitle?: string;
  type: "cover" | "text" | "agenda" | "toc" | "legal";
  lines: Array<{
    text: string;
    style?: "title" | "subtitle" | "h1" | "h2" | "body" | "bold" | "bullet" | "quote" | "meta" | "code" | "center";
    indent?: number;
    color?: string;
  }>;
}

const PAGES_DATA: PageRenderData[] = [
  // Page 1: Cover
  {
    pageNumber: 1,
    headerRight: "1",
    type: "cover",
    lines: [
      { text: "B2B Branding Management Case Studies Collection", style: "meta", color: "#5C574C" },
      { text: "", style: "body" },
      { text: "Philip Kotler   Waldemar Pfoertsch   Walid Kallel", style: "bold", color: "#141E33" },
      { text: "", style: "body" },
      { text: "Tunisia Edition", style: "subtitle", color: "#BC3B2C" },
      { text: "", style: "body" },
      { text: "B2B Branding", style: "title", color: "#141E33" },
      { text: "Management", style: "title", color: "#141E33" },
      { text: "", style: "body" },
      { text: "Case Studies Collection", style: "subtitle", color: "#141E33" },
      { text: "", style: "body" },
      { text: "2026", style: "bold", color: "#BC3B2C" },
      { text: "", style: "body" },
      { text: "Global Marketing Nexus", style: "meta", color: "#141E33" },
    ],
  },
  // Page 2: Blank / Half-title
  {
    pageNumber: 2,
    headerLeft: "2",
    headerRight: "B2B Branding Management Case Studies Collection",
    type: "text",
    lines: [
      { text: "", style: "body" },
      { text: "", style: "body" },
      { text: "B2B Branding Management", style: "subtitle", color: "#141E33" },
      { text: "Case Studies Collection — Tunisia Edition 2026", style: "meta", color: "#5C574C" },
    ],
  },
  // Page 3: Imprint & Authors
  {
    pageNumber: 3,
    headerRight: "3",
    type: "legal",
    lines: [
      { text: "B2B Branding Management Case Studies Collection", style: "meta", color: "#5C574C" },
      { text: "", style: "body" },
      { text: "Philip Kotler", style: "bold", color: "#141E33" },
      { text: "Kellogg School of Management", style: "body", color: "#5C574C" },
      { text: "Northwestern University, Evanston, IL, USA", style: "body", color: "#5C574C" },
      { text: "", style: "body" },
      { text: "Waldemar Pfoertsch", style: "bold", color: "#141E33" },
      { text: "CIIM Business School, University of Limassol", style: "body", color: "#5C574C" },
      { text: "Limassol, Cyprus", style: "body", color: "#5C574C" },
      { text: "", style: "body" },
      { text: "Walid Kallel", style: "bold", color: "#141E33" },
      { text: "Strategic Marketing Consultant & Brand Educator", style: "body", color: "#5C574C" },
      { text: "Business Success Tunisia, Tunis, Tunisia", style: "body", color: "#5C574C" },
      { text: "", style: "body" },
      { text: "ISBN-13: 979-8-90243-605-8", style: "bold", color: "#BC3B2C" },
      { text: "© The Authors, under exclusive license to Global Marketing Nexus, 2026", style: "meta", color: "#141E33" },
    ],
  },
  // Page 4: Copyright
  {
    pageNumber: 4,
    headerLeft: "4",
    headerRight: "B2B Branding Management Case Studies Collection",
    type: "legal",
    lines: [
      { text: "Copyright Notice & Intellectual Property", style: "bold", color: "#BC3B2C" },
      { text: "", style: "body" },
      { text: "Copyright protection applies to this work. In particular, the rights of translation, reprinting, reuse of illustrations, recitation, broadcasting, reproduction on microfilms or in any other physical way, and transmission or information storage and retrieval, electronic adaptation, computer software, or by similar or dissimilar methodology that is currently known or will be developed in the future are owned and licensed solely and exclusively by the publisher. This is the case regardless of whether the material is in its entirety or in part.", style: "body", color: "#5C574C" },
      { text: "", style: "body" },
      { text: "Even if there is no explicit declaration to the contrary, the use of general descriptive names, registered names, trademarks, service marks, and other similar names in this book does not imply that these names are exempt from the applicable protective laws and regulations and are therefore free for general use.", style: "body", color: "#5C574C" },
      { text: "", style: "body" },
      { text: "It is reasonable for the publisher, the writers, and the editors to assume that the guidance and information contained in this book are regarded as true and correct as of the date of publication.", style: "body", color: "#5C574C" },
    ],
  },
  // Page 5: Preface
  {
    pageNumber: 5,
    headerRight: "5",
    type: "text",
    lines: [
      { text: "B2B Branding Management Case Studies Collection", style: "meta", color: "#5C574C" },
      { text: "Preface", style: "title", color: "#141E33" },
      { text: "", style: "body" },
      { text: "The Future of B2B Is Human.", style: "bold", color: "#BC3B2C" },
      { text: "The world of business is not simply evolving. It is being reinvented — fundamentally, irreversibly, and at a pace that no playbook can fully capture.", style: "body", color: "#141E33" },
      { text: "We are emerging from a decade of profound disruption: a cascade of technological leaps, geopolitical realignments, climate pressures, and a global pandemic that rewired how we work, communicate, and trust. In this new reality, the old rules of B2B engagement — built on cold logic, rigid hierarchies, and transactional efficiency — no longer hold. They've been exposed as incomplete. Outdated. Fragile.", style: "body", color: "#5C574C" },
      { text: "We now stand at the dawn of a new era. Not of business-to-business, but of human-to-human (H2H) partnership. For decades, B2B Branding management was treated as a secondary function — a matter of polished brochures, corporate logos, and clever taglines. Strategy resided in spreadsheets; branding was left to designers. But today, that separation is not just outdated — it's dangerous.", style: "body", color: "#5C574C" },
      { text: "In a world of noise, skepticism, and endless choice, a strong brand is no longer a nice-to-have. It is the most critical strategic asset a company possesses:", style: "body", color: "#141E33" },
      { text: "•  It is what cuts through complexity.", style: "bullet", color: "#BC3B2C" },
      { text: "•  It is what builds resilience in crisis.", style: "bullet", color: "#BC3B2C" },
      { text: "•  It is what turns data into trust, and trust into loyalty.", style: "bullet", color: "#BC3B2C" },
    ],
  },
  // Page 6: Preface cont.
  {
    pageNumber: 6,
    headerLeft: "6",
    headerRight: "B2B Branding Management Case Studies Collection",
    type: "text",
    lines: [
      { text: "Each case reveals a company that has embraced the H2H philosophy: one that balances analytical rigor with emotional intelligence, leverages artificial intelligence for hyper-personalization, and yet never loses sight of ethics, empathy, and storytelling. You'll meet leaders who use data not to replace human judgment, but to amplify it.", style: "body", color: "#5C574C" },
      { text: "This is not about soft skills. It's about strategic advantage — because in the world of automation, the human touch is the ultimate differentiator.", style: "bold", color: "#141E33" },
      { text: "", style: "body" },
      { text: "This volume is for those shaping the future:", style: "subtitle", color: "#141E33" },
      { text: "• C-Suite Leaders who know that brand is not a cost center, but a growth engine.", style: "bullet", color: "#5C574C" },
      { text: "• Marketing & Sales Pioneers tasked with turning brand promise into measurable impact.", style: "bullet", color: "#5C574C" },
      { text: "• Academics & Educators who are reimagining business curricula for a world where brand and human behavior are inseparable.", style: "bullet", color: "#5C574C" },
      { text: "• Ambitious Students preparing to lead with technical excellence and emotional intelligence.", style: "bullet", color: "#5C574C" },
      { text: "• Every professional who believes business can — and must — be a force for good.", style: "bullet", color: "#5C574C" },
    ],
  },
  // Page 7: Preface acknowledgements
  {
    pageNumber: 7,
    headerRight: "7",
    type: "text",
    lines: [
      { text: "B2B Branding Management Case Studies Collection", style: "meta", color: "#5C574C" },
      { text: "Acknowledgements & Partners", style: "subtitle", color: "#141E33" },
      { text: "A special thank you to Ahmed Kibria and the Global Marketing Nexus team — whose global vision, collaborative spirit, and relentless curiosity made this deep dive possible. Special thanks to Dr. Varsha Agarwal from Atlas University, Mumbai for proofreading the text.", style: "body", color: "#5C574C" },
      { text: "We extend our sincere gratitude to the Mediterranean School of Business (MSB) for their invaluable contribution to the success of this first Tunisian edition of B2B Brand Management Case Studies Collection. As a strategic partner, MSB has demonstrated a remarkable commitment by mobilizing significant resources and expertise.", style: "body", color: "#5C574C" },
      { text: "The future of B2B is not about replacing humans with machines. It is about augmenting human potential with technology. It is a symphony — of data and intuition, of logic and empathy, of strategy and soul.", style: "bold", color: "#141E33" },
      { text: "", style: "body" },
      { text: "April 2026", style: "bold", color: "#BC3B2C" },
      { text: "Longboat Key, Florida, USA | Maroni, Cyprus | Tunis, Tunisia", style: "meta", color: "#5C574C" },
      { text: "", style: "body" },
      { text: "Philip Kotler          pkotler@aol.com", style: "body", color: "#141E33" },
      { text: "Waldemar Pfoertsch   waldemar@pfoertsch.com", style: "body", color: "#141E33" },
      { text: "Walid Kallel         walidkallel@bsuccess.tn", style: "body", color: "#141E33" },
    ],
  },
  // Page 8: Disclaimers
  {
    pageNumber: 8,
    headerLeft: "8",
    headerRight: "B2B Branding Management Case Studies Collection",
    type: "legal",
    lines: [
      { text: "Disclaimer for Content", style: "subtitle", color: "#141E33" },
      { text: "In the preparation of this work, the authors made selective use of artificial intelligence (AI) tools to support and enhance the creative and editorial process. Specifically, AI-assisted technologies were employed for: Idea Generation, Language Improvement, Draft Refinement, and Graph Generation.", style: "body", color: "#5C574C" },
      { text: "All AI-generated suggestions were critically reviewed, fact-checked against original sources, and substantively revised by the human authors. The final content remains the sole intellectual product and responsibility of the authors.", style: "body", color: "#5C574C" },
      { text: "", style: "body" },
      { text: "Disclaimer for Case Studies", style: "subtitle", color: "#141E33" },
      { text: "The cases are developed for class discussion and educational purposes only. It is not intended to illustrate either effective or ineffective handling of an administrative, strategic, or branding situation. The events, data, and company information presented are based on real occurrences and publicly available sources.", style: "body", color: "#5C574C" },
    ],
  },
  // Page 9: Foreword
  {
    pageNumber: 9,
    headerRight: "9",
    type: "text",
    lines: [
      { text: "B2B Branding Management Case Studies Collection", style: "meta", color: "#5C574C" },
      { text: "Foreword", style: "title", color: "#141E33" },
      { text: "By Abdelaziz Makhloufi — Founder and CEO, CHO Group", style: "bold", color: "#BC3B2C" },
      { text: "", style: "body" },
      { text: "There is a moment every exporter knows well. It is the moment your product — something grown in your own soil, bottled with your own labor — crosses a border and becomes something else entirely. On a supermarket shelf in Europe or a dinner table in America, that bottle of olive oil is no longer just agricultural produce. It is a promise. It is a story. It is, for all practical purposes, a diplomat without a passport.", style: "body", color: "#5C574C" },
      { text: "I have spent my career building brands in a global marketplace that does not owe Tunisia any favors. When we created Terra d'Elyssa, we were not simply competing on price or quality — though both must be beyond question. We were asking international agents, distributors, value added reseller, retailers and consumers to trust a Tunisian name, to place it alongside the historic producers of Italy and Spain, and to recognize that excellence has no single address.", style: "body", color: "#5C574C" },
      { text: "This is the reality of B2B Branding management in emerging economies. We do not inherit trust; we earn it, bottle by bottle, contract by contract.", style: "bold", color: "#141E33" },
    ],
  },
  // Page 10: Foreword cont.
  {
    pageNumber: 10,
    headerLeft: "10",
    headerRight: "B2B Branding Management Case Studies Collection",
    type: "text",
    lines: [
      { text: "...port, whether an American distributor renews a contract, and whether a European retailer places our oil at eye level rather than on the bottom shelf.", style: "body", color: "#5C574C" },
      { text: "I commend the authors for tackling these subjects with the seriousness they deserve. In an era where information travels instantly and perception can shift overnight; brand management is not a luxury — it is survival. For Tunisian businesses seeking to expand beyond our borders, for African enterprises claiming their place in global supply chains, and for any B2B leader who understands that reputation is the most valuable asset not listed on a balance sheet, the insights gathered here will prove indispensable.", style: "body", color: "#5C574C" },
      { text: "", style: "body" },
      { text: "May this work inspire you to build brands that endure, that travel well, and that carry the dignity of their origins with them wherever they go.", style: "bold", color: "#141E33" },
      { text: "", style: "body" },
      { text: "By Abdelaziz Makhloufi", style: "bold", color: "#BC3B2C" },
      { text: "Founder and CEO, CHO Group", style: "meta", color: "#141E33" },
    ],
  },
  // Page 11: About Kotler
  {
    pageNumber: 11,
    headerRight: "11",
    type: "text",
    lines: [
      { text: "B2B Branding Management Case Studies Collection", style: "meta", color: "#5C574C" },
      { text: "About the Authors", style: "title", color: "#141E33" },
      { text: "Dr. Philip Kotler", style: "bold", color: "#BC3B2C" },
      { text: "Dr. Philip Kotler is widely recognized as one of the most influential figures in the field of marketing. He was the S.C. Johnson & Son Distinguished Professor of International Marketing at the Kellogg School of Management, Northwestern University, Evanston, Illinois. He received his master's degree at the University of Chicago and his PhD at Massachusetts Institute of Technology, both in economics.", style: "body", color: "#5C574C" },
      { text: "Professor Kotler is the author of more than 100 books, including Marketing Management: Analysis, Planning, Implementation and Control, the most widely used marketing book in graduate business schools worldwide; Principles of Marketing; Strategic Marketing for Non-profit Organizations; Lateral Marketing, and Marketing Insights from A to Z.", style: "body", color: "#5C574C" },
      { text: "He was the first recipient of the AMA's Distinguished Marketing Educator Award (1985), received the Paul Converse Award (1978), and Charles Coolidge Parlin Marketing Research Award (1989).", style: "body", color: "#5C574C" },
    ],
  },
  // Page 12: Kotler cont.
  {
    pageNumber: 12,
    headerLeft: "12",
    headerRight: "B2B Branding Management Case Studies Collection",
    type: "text",
    lines: [
      { text: "Professor Kotler has consulted for such companies as IBM, General Electric, AT&T, Honeywell, Bank of America, Merck and others in the areas of marketing strategy, marketing organization and international marketing.", style: "body", color: "#5C574C" },
      { text: "He has been Chairman of the College of Marketing of the Institute of Management Sciences, a Director of the American Marketing Association, a Trustee of the Marketing Science Institute, and a Member of the Advisory Board of the Drucker Foundation. He has received honorary doctoral degrees from Stockholm University, University of Zurich, Athens University of Economics, DePaul University, Cracow School of Business, Groupe H.E.C. in Paris, and Vienna University.", style: "body", color: "#5C574C" },
      { text: "Philip Kotler is a founding member of The Sarasota Institute, Florida.", style: "bold", color: "#141E33" },
    ],
  },
  // Page 13: About Pfoertsch
  {
    pageNumber: 13,
    headerRight: "13",
    type: "text",
    lines: [
      { text: "B2B Branding Management Case Studies Collection", style: "meta", color: "#5C574C" },
      { text: "About the Authors", style: "title", color: "#141E33" },
      { text: "Dr. Waldemar Pfoertsch", style: "bold", color: "#BC3B2C" },
      { text: "Waldemar Pfoertsch has redefined how organizations approach B2B Branding Management and Human-to-Human (H2H) marketing in a digital, sustainability-focused world. With an academic legacy spanning Europe, the United States, and Asia, his expertise bridges global strategy with authentic customer connection.", style: "body", color: "#5C574C" },
      { text: "Dr. Pfoertsch is Professor of Marketing Management at CIIM Business School of the University of Limassol, Cyprus, and Professor Emeritus of International Business at Pforzheim University, Germany. He has lectured at Mannheim Business School, Tongji University (Shanghai), Technical University of Munich (TUM), and IIM Calcutta.", style: "body", color: "#5C574C" },
      { text: "From 2007 to 2010, he was Professor of Marketing at CEIBS in Shanghai. He has co-authored seminal books, including B2B Brand Management (with Philip Kotler), H2H Marketing, and Transformational Sales.", style: "body", color: "#5C574C" },
    ],
  },
  // Page 14: Pfoertsch cont.
  {
    pageNumber: 14,
    headerLeft: "14",
    headerRight: "B2B Branding Management Case Studies Collection",
    type: "text",
    lines: [
      { text: "Dr. Pfoertsch brings extensive management consulting experience in the USA, Europe, and China. At UBM/Mercer Consulting Group, Arthur Andersen Operational Consulting, and LEK Consulting, he helped companies develop international strategies. Earlier, he held sales and strategy positions at Siemens AG in Germany and the USA and served as an Economic Advisor to UNIDO in Sierra Leone.", style: "body", color: "#5C574C" },
      { text: "His current research focuses on Human-to-Human marketing in industrial companies, particularly the role of artificial intelligence in enabling empathetic customer relationships at scale, and the integration of sustainability metrics into brand valuation frameworks.", style: "body", color: "#5C574C" },
    ],
  },
  // Page 15: About Kallel
  {
    pageNumber: 15,
    headerRight: "15",
    type: "text",
    lines: [
      { text: "B2B Branding Management Case Studies Collection", style: "meta", color: "#5C574C" },
      { text: "About the Authors", style: "title", color: "#141E33" },
      { text: "Walid Kallel", style: "bold", color: "#BC3B2C" },
      { text: "Strategic Marketing Consultant & Brand Educator", style: "subtitle", color: "#141E33" },
      { text: "Walid Kallel is a visionary in the world of brand strategy and marketing transformation, whose work has quietly reshaped the landscape of Tunisian industry. A graduate of the Faculty of Economic and Management Sciences of Tunis, where he earned his master's in economics, and holder of the Advanced Specialized Certificate in Marketing Techniques from ESC Tunis, Walid brings a rare blend of analytical rigor and creative vision.", style: "body", color: "#5C574C" },
      { text: "Over the past two decades, he has advised more than 200 Tunisian enterprises, helping them move beyond transactional marketing to build enduring brand identities rooted in strategic clarity. He has spearheaded brand leadership platforms for pioneering industrial firms such as SIFCOL, MPBS, AMECAP, and WINOX.", style: "body", color: "#5C574C" },
      { text: "His advisory portfolio spans international development institutions such as GIZ, EBRD, and FOPRODEX.", style: "body", color: "#5C574C" },
    ],
  },
  // Page 16: Kallel cont.
  {
    pageNumber: 16,
    headerLeft: "16",
    headerRight: "B2B Branding Management Case Studies Collection",
    type: "text",
    lines: [
      { text: "Walid has partnered with ESSILOR ACADEMY, the academy of the world leader in optical lenses, to train and coach optical clients in Tunisia, Senegal, Ivory Coast, Cameroon, and other countries.", style: "body", color: "#5C574C" },
      { text: "At the core of his philosophy lies a powerful conviction: a company's primary capital is not its machinery, balance sheet, or even its products — it is its brand. This intangible asset — the promise that lives in the customer's mind — is the true engine of value creation.", style: "bold", color: "#141E33" },
      { text: "He calls himself not just a consultant, but a brand educator. Because sustainable change doesn't come from top-down mandates — it comes from shared understanding. From people who believe in the brand because they helped shape it.", style: "body", color: "#5C574C" },
      { text: "", style: "body" },
      { text: "Walid KALLEL — walidkallel@bsuccess.tn", style: "bold", color: "#BC3B2C" },
    ],
  },
  // Page 17: Agenda (Summary Table of Contents)
  {
    pageNumber: 17,
    headerRight: "17",
    type: "agenda",
    lines: [
      { text: "B2B Branding Management Case Studies Collection", style: "meta", color: "#5C574C" },
      { text: "Agenda", style: "title", color: "#141E33" },
      { text: "1  Performance Branding: Quantifying Impact of B2B Strategy ...... 22", style: "bold", color: "#141E33" },
      { text: "   Case Study: Mediterranean School of Business (MSB) .......... 34", style: "bullet", color: "#BC3B2C" },
      { text: "2  Digital Transformative reshaping strategies of B2B Marketing ... 48", style: "bold", color: "#141E33" },
      { text: "   Case Study: MyBIAT: An innovative digital solution ......... 62", style: "bullet", color: "#BC3B2C" },
      { text: "3  Dimensions of Brand Management and Brand Distinction ........... 73", style: "bold", color: "#141E33" },
      { text: "   Case Study: Arvea the Community-Based Brand ................ 88", style: "bullet", color: "#BC3B2C" },
      { text: "4  Dynamic Capability of Transformative Brand Strategy ............ 107", style: "bold", color: "#141E33" },
      { text: "   Case Study: Gourmandise & Co. — A Legacy Brand ............. 125", style: "bullet", color: "#BC3B2C" },
      { text: "5  Brand Specialties and Brand Communication ...................... 142", style: "bold", color: "#141E33" },
      { text: "   Case Study: Smart Olive Oil (Group CHO TUNISIA) ............. 157", style: "bullet", color: "#BC3B2C" },
      { text: "6  The Process of Building B2B Brandings .......................... 184", style: "bold", color: "#141E33" },
      { text: "   Case Study: Wallyscar 619 Turning Crisis Into Opportunity ... 200", style: "bullet", color: "#BC3B2C" },
      { text: "7  Exercise Caution Regarding Branding Missteps ................... 209", style: "bold", color: "#141E33" },
      { text: "   Case Study: MPBS - Building Brand Power ..................... 218", style: "bullet", color: "#BC3B2C" },
      { text: "8  The Strategic Awakening of B2B in Tunisia ...................... 226", style: "bold", color: "#141E33" },
      { text: "   Case Study: Organic B2B Branding in the Optical Sector ...... 230", style: "bullet", color: "#BC3B2C" },
      { text: "9  Future Perspective of B2B Brandings ............................ 237", style: "bold", color: "#141E33" },
      { text: "", style: "body" },
      { text: "Content", style: "subtitle", color: "#BC3B2C" },
      { text: "Preface ............................................................. 5", style: "body", color: "#5C574C" },
      { text: "Foreword ............................................................ 9", style: "body", color: "#5C574C" },
      { text: "About the Authors ................................................... 11", style: "body", color: "#5C574C" },
    ],
  },
  // Page 18: Detailed TOC - Part 1
  {
    pageNumber: 18,
    headerLeft: "18",
    headerRight: "B2B Branding Management Case Studies Collection",
    type: "toc",
    lines: [
      { text: "Performance Branding Defined ......................................... 23", style: "body", color: "#5C574C" },
      { text: "  How it delivers strategic benefits ................................. 24", style: "meta", color: "#5C574C" },
      { text: "  Additional critical benefits ....................................... 24", style: "meta", color: "#5C574C" },
      { text: "Challenges in Brand Management B2B Branding .......................... 25", style: "body", color: "#5C574C" },
      { text: "The Rise of Big Tech and H2H Marketing ................................ 25", style: "body", color: "#5C574C" },
      { text: "  What Branding Really Means ......................................... 26", style: "meta", color: "#5C574C" },
      { text: "Brand Leadership ..................................................... 27", style: "body", color: "#5C574C" },
      { text: "B2B Performance Branding Benefits .................................... 27", style: "body", color: "#5C574C" },
      { text: "The 95-5 Rule and Performance Branding ............................... 28", style: "body", color: "#5C574C" },
      { text: "AI and Performance Branding in B2B ................................... 30", style: "body", color: "#5C574C" },
      { text: "Case Study: MSB (Mediterranean School of Business) ................... 34", style: "bold", color: "#BC3B2C" },
      { text: "", style: "body" },
      { text: "2  Digital Transformative reshaping strategies ......................... 48", style: "bold", color: "#141E33" },
      { text: "  Introduction: The Evolution of B2B Branding ........................ 48", style: "meta", color: "#5C574C" },
      { text: "  Transformative Marketing and Brand Management ....................... 49", style: "meta", color: "#5C574C" },
      { text: "  B2B Market Dynamics & Industrial Products .......................... 50", style: "meta", color: "#5C574C" },
      { text: "  Derived Demand & Organizational Buying ............................. 51", style: "meta", color: "#5C574C" },
      { text: "  Human Factors in Business Decisions ................................ 52", style: "meta", color: "#5C574C" },
      { text: "  Brand Relevance & Functions in B2B ................................. 53", style: "meta", color: "#5C574C" },
      { text: "  Holistic Branding and H2H Marketing ................................ 54", style: "meta", color: "#5C574C" },
      { text: "  The Branding Triangle & Branding Commodities ....................... 55", style: "meta", color: "#5C574C" },
      { text: "  AI and Transformative Marketing in B2B ............................. 57", style: "meta", color: "#5C574C" },
    ],
  },
  // Page 19: Detailed TOC - Part 2
  {
    pageNumber: 19,
    headerRight: "19",
    type: "toc",
    lines: [
      { text: "B2B Branding Management Case Studies Collection", style: "meta", color: "#5C574C" },
      { text: "Case Study: MyBIAT: An innovative and responsible solution ........... 62", style: "bold", color: "#BC3B2C" },
      { text: "", style: "body" },
      { text: "3  Dimensions of Brand Management and Brand Distinction ............... 73", style: "bold", color: "#141E33" },
      { text: "  The Four Dimensions of Brand Management ............................ 74", style: "meta", color: "#5C574C" },
      { text: "  How Brands Create Value in B2B ..................................... 75", style: "meta", color: "#5C574C" },
      { text: "  Return on Brand Investment (ROBI) .................................. 80", style: "meta", color: "#5C574C" },
      { text: "  Brand Architecture & Marketing-Mix 5Es ............................. 80", style: "meta", color: "#5C574C" },
      { text: "  Case Study: Arvea the Community-Based Brand ........................ 88", style: "bold", color: "#BC3B2C" },
      { text: "", style: "body" },
      { text: "4  Dynamic Capability of Transformative Brand Strategy ................. 107", style: "bold", color: "#141E33" },
      { text: "  Corporate, Family, and Individual Brands ........................... 109", style: "meta", color: "#5C574C" },
      { text: "  National and International Brands .................................. 112", style: "meta", color: "#5C574C" },
      { text: "  Brand Elements (Name, Logo, Tagline, Story) ........................ 115", style: "meta", color: "#5C574C" },
      { text: "  Case Study: Gourmandise & Co. — Legacy Brand ....................... 125", style: "bold", color: "#BC3B2C" },
      { text: "", style: "body" },
      { text: "5  Brand Specialties and Brand Communication ........................... 142", style: "bold", color: "#141E33" },
      { text: "  Introduction: Holistic Brand Communication ......................... 142", style: "meta", color: "#5C574C" },
    ],
  },
  // Page 20: Detailed TOC - Part 3
  {
    pageNumber: 20,
    headerLeft: "20",
    headerRight: "B2B Branding Management Case Studies Collection",
    type: "toc",
    lines: [
      { text: "Key Brand Communication Tools (Sales, Social Media, LinkedIn) ....... 144", style: "meta", color: "#5C574C" },
      { text: "Direct Marketing, Trade Shows & Sponsoring ........................... 145", style: "meta", color: "#5C574C" },
      { text: "Brand Evaluation, AI, Living the Brand & Word-of-Mouth ................ 148", style: "meta", color: "#5C574C" },
      { text: "Social Branding and Corporate Social Responsibility .................. 151", style: "meta", color: "#5C574C" },
      { text: "Case Study: Group CHO TUNISIA - Smart Olive Oil ...................... 157", style: "bold", color: "#BC3B2C" },
      { text: "", style: "body" },
      { text: "6  The Process of Building B2B Brandings .............................. 184", style: "bold", color: "#141E33" },
      { text: "  Service-Dominant Logic and Brand Co-Creation ....................... 185", style: "meta", color: "#5C574C" },
      { text: "  Brand Planning and Shareholder Value ............................... 186", style: "meta", color: "#5C574C" },
      { text: "  Brand Building Process & Strategy Analysis ......................... 187", style: "meta", color: "#5C574C" },
      { text: "  Brand Portfolio Management & Brand Audit ........................... 192", style: "meta", color: "#5C574C" },
      { text: "  CEO and Personal Branding / Generative AI .......................... 194", style: "meta", color: "#5C574C" },
      { text: "  Case Study: Wallyscar 619 Turning Crisis Into Opportunity .......... 200", style: "bold", color: "#BC3B2C" },
      { text: "", style: "body" },
      { text: "7  Exercise Caution Regarding Branding Missteps ........................ 209", style: "bold", color: "#141E33" },
    ],
  },
  // Page 21: Detailed TOC - Part 4
  {
    pageNumber: 21,
    headerRight: "21",
    type: "toc",
    lines: [
      { text: "B2B Branding Management Case Studies Collection", style: "meta", color: "#5C574C" },
      { text: "Introduction: Learning from Branding Failures ........................ 209", style: "meta", color: "#5C574C" },
      { text: "Maintaining Brand Identity & Obstacles ............................... 210", style: "meta", color: "#5C574C" },
      { text: "Case Study: MPBS - Building Brand Power Across B2B Ecosystem ......... 218", style: "bold", color: "#BC3B2C" },
      { text: "", style: "body" },
      { text: "8  The Strategic Awakening of B2B in Tunisia ........................... 226", style: "bold", color: "#141E33" },
      { text: "  Tunisia, a Mediterranean B2B Hub – Potential vs. Reality ........... 227", style: "meta", color: "#5C574C" },
      { text: "  Digital B2B & Thought Leadership ................................... 228", style: "meta", color: "#5C574C" },
      { text: "  Case Study: Organic B2B Branding in the Optical Sector ............. 230", style: "bold", color: "#BC3B2C" },
      { text: "  The Systemic Impact: Expanded Stakeholder Ecosystem ................ 231", style: "meta", color: "#5C574C" },
      { text: "", style: "body" },
      { text: "9  Future Perspective of B2B Brandings ................................. 237", style: "bold", color: "#141E33" },
      { text: "  Rising Importance of B2B Branding & AI ............................. 238", style: "meta", color: "#5C574C" },
      { text: "  Future Trends, Relevance, Simplicity, Humanity ..................... 241", style: "meta", color: "#5C574C" },
      { text: "", style: "body" },
      { text: "List of Abbreviations ................................................ 249", style: "bold", color: "#141E33" },
      { text: "List of Companies Mentioned .......................................... 253", style: "bold", color: "#141E33" },
      { text: "List of Figures ...................................................... 277", style: "bold", color: "#141E33" },
    ],
  },
];

export interface ProtectedBookTableOfContentsProps {
  pdfUrl?: string | null;
  bookTitle?: string;
  initialChapters?: BookChapterMeta[];
}

export function ProtectedBookTableOfContents({
  pdfUrl,
  bookTitle = "B2B Brand Management — Tunisia Edition",
  initialChapters,
}: ProtectedBookTableOfContentsProps = {}) {
  const [currentPage, setCurrentPage] = useState<number>(pdfUrl ? 1 : 17);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pdfLoading, setPdfLoading] = useState<boolean>(false);
  const [totalPdfPages, setTotalPdfPages] = useState<number>(21);
  const [zoom, setZoom] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isWindowBlurred, setIsWindowBlurred] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load PDF dynamically when pdfUrl is provided
  useEffect(() => {
    if (!pdfUrl) {
      setPdfDoc(null);
      setTotalPdfPages(21);
      setCurrentPage(17);
      return;
    }

    let isCancelled = false;
    setPdfLoading(true);

    const loadPdf = async () => {
      try {
        const pdfjs = (window as any).pdfjsLib;
        if (!pdfjs) {
          console.warn("pdfjsLib not yet available");
          setPdfLoading(false);
          return;
        }
        const loadingTask = pdfjs.getDocument(pdfUrl);
        const doc = await loadingTask.promise;
        if (!isCancelled) {
          setPdfDoc(doc);
          setTotalPdfPages(doc.numPages);
          setCurrentPage(1);
          setPdfLoading(false);
        }
      } catch (err) {
        console.error("Erreur de chargement du PDF de sommaire:", err);
        if (!isCancelled) {
          setPdfLoading(false);
          toast.error("Impossible de charger le document PDF du sommaire.");
        }
      }
    };

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [pdfUrl]);

  // Security layer: Anti-Screenshot on window blur / tab focus switch
  useEffect(() => {
    const handleBlur = () => setIsWindowBlurred(true);
    const handleFocus = () => setIsWindowBlurred(false);
    const handleVisibility = () => {
      if (document.hidden) {
        setIsWindowBlurred(true);
      } else {
        setIsWindowBlurred(false);
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    // Keyboard protection: intercept PrintScreen, Ctrl+P, Ctrl+S, Inspect
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen interception
      if (e.key === "PrintScreen") {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText("").catch(() => {});
        }
        setIsWindowBlurred(true);
        setTimeout(() => setIsWindowBlurred(false), 1200);
        toast.error("Capture d'écran désactivée pour protéger les droits d'auteur de l'ouvrage.");
      }

      // Print interception (Ctrl+P / Cmd+P)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        toast.error("L'impression est désactivée pour ce document protégé.");
      }

      // Save interception (Ctrl+S / Cmd+S)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        toast.error("Le téléchargement direct de ce document n'est pas autorisé.");
      }

      // Copy interception (Ctrl+C / Cmd+C when inside container)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
          e.preventDefault();
          selection.removeAllRanges();
          toast.error("La copie de texte est protégée contre la reproduction.");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Canvas drawing routine
  const renderCanvasPage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dimensions for high-DPI crispness (aspect ratio standard book 800 x 1130)
    const baseWidth = 800;
    const baseHeight = 1130;
    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    canvas.width = baseWidth * dpr;
    canvas.height = baseHeight * dpr;
    ctx.scale(dpr, dpr);

    // 1. Page Background (Cream book paper)
    ctx.fillStyle = "#FCFAF6";
    ctx.fillRect(0, 0, baseWidth, baseHeight);

    // Subtle paper edge shadow
    ctx.strokeStyle = "rgba(20, 30, 51, 0.08)";
    ctx.lineWidth = 1;
    ctx.strokeRect(1, 1, baseWidth - 2, baseHeight - 2);

    // Subtle margin guide line
    ctx.strokeStyle = "rgba(20, 30, 51, 0.04)";
    ctx.strokeRect(40, 40, baseWidth - 80, baseHeight - 80);

    const pageData = PAGES_DATA.find((p) => p.pageNumber === currentPage) || PAGES_DATA[16];

    // 2. Running Header
    ctx.font = "italic 13px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.fillStyle = "#8C827A";
    if (pageData.headerLeft) {
      ctx.textAlign = "left";
      ctx.fillText(pageData.headerLeft, 60, 55);
    }
    if (pageData.headerRight) {
      ctx.textAlign = "right";
      ctx.fillText(pageData.headerRight, baseWidth - 60, 55);
    }

    // Header divider line
    ctx.beginPath();
    ctx.moveTo(60, 68);
    ctx.lineTo(baseWidth - 60, 68);
    ctx.strokeStyle = "rgba(20, 30, 51, 0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 3. Render Lines
    let currentY = 120;
    const lineHeight = 28;
    const leftMargin = 60;
    const contentWidth = baseWidth - 120;

    pageData.lines.forEach((line) => {
      if (!line.text) {
        currentY += lineHeight * 0.7;
        return;
      }

      ctx.fillStyle = line.color || "#141E33";
      ctx.textAlign = line.style === "center" ? "center" : "left";
      const x = line.style === "center" ? baseWidth / 2 : leftMargin + (line.indent || 0);

      switch (line.style) {
        case "title":
          ctx.font = "bold 32px 'DM Serif Display', Georgia, serif";
          currentY += 12;
          ctx.fillText(line.text, x, currentY);
          currentY += 24;
          break;
        case "subtitle":
          ctx.font = "bold 20px 'DM Serif Display', Georgia, serif";
          currentY += 8;
          ctx.fillText(line.text, x, currentY);
          currentY += 16;
          break;
        case "bold":
          ctx.font = "bold 15px 'Plus Jakarta Sans', system-ui, sans-serif";
          ctx.fillText(line.text, x, currentY);
          currentY += lineHeight;
          break;
        case "bullet":
          ctx.font = "14px 'Plus Jakarta Sans', system-ui, sans-serif";
          ctx.fillText(line.text, x, currentY);
          currentY += lineHeight;
          break;
        case "meta":
          ctx.font = "12px 'Plus Jakarta Sans', system-ui, sans-serif";
          ctx.fillText(line.text, x, currentY);
          currentY += lineHeight * 0.85;
          break;
        default:
          // Body text with word wrap
          ctx.font = "14px 'Plus Jakarta Sans', system-ui, sans-serif";
          const words = line.text.split(" ");
          let currentLine = "";
          for (let n = 0; n < words.length; n++) {
            const testLine = currentLine + words[n] + " ";
            const metrics = ctx.measureText(testLine);
            if (metrics.width > contentWidth && n > 0) {
              ctx.fillText(currentLine, x, currentY);
              currentLine = words[n] + " ";
              currentY += lineHeight;
            } else {
              currentLine = testLine;
            }
          }
          ctx.fillText(currentLine, x, currentY);
          currentY += lineHeight;
          break;
      }
    });

    // 4. Protected DRM Watermark (Diagonal translucent stamp)
    ctx.save();
    ctx.translate(baseWidth / 2, baseHeight / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.font = "bold 22px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "rgba(188, 59, 44, 0.05)";
    ctx.textAlign = "center";
    ctx.fillText("LIVRESPRO.TN · LECTURE SÉCURISÉE · REPRODUCTION INTERDITE", 0, -120);
    ctx.fillText("© 2026 GLOBAL MARKETING NEXUS · KOTLER · PFOERTSCH · KALLEL", 0, 0);
    ctx.fillText("DOCUMENT PROTÉGÉ CONTRE LA COPIE ET LE TÉLÉCHARGEMENT", 0, 120);
    ctx.restore();

    // 5. Running Footer
    ctx.font = "11px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.fillStyle = "#A89F91";
    ctx.textAlign = "center";
    ctx.fillText(
      `LivresPro.tn · Aperçu sous licence exclusive de l’édition tunisienne — Page ${currentPage} / 21`,
      baseWidth / 2,
      baseHeight - 35
    );
  }, [currentPage]);

  // Canvas PDF drawing routine for uploaded PDF tables of contents (>250 books)
  const renderPdfPage = useCallback(async () => {
    if (!pdfDoc) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      const page = await pdfDoc.getPage(currentPage);
      const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      const viewport = page.getViewport({ scale: dpr * zoom * 1.35 });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Render PDF onto canvas
      await page.render({ canvasContext: ctx, viewport }).promise;

      // Apply DRM watermark overlay
      ctx.save();
      ctx.translate(viewport.width / 2, viewport.height / 2);
      ctx.rotate(-Math.PI / 6);
      ctx.font = `bold ${Math.round(22 * zoom * dpr)}px 'Plus Jakarta Sans', system-ui, sans-serif`;
      ctx.fillStyle = "rgba(188, 59, 44, 0.07)";
      ctx.textAlign = "center";
      ctx.fillText("LIVRESPRO.TN · LECTURE SÉCURISÉE · REPRODUCTION INTERDITE", 0, -80);
      ctx.fillText(`TUNISIA EDITION · ${bookTitle.toUpperCase()}`, 0, 0);
      ctx.fillText("DOCUMENT PROTÉGÉ CONTRE LA COPIE ET LE TÉLÉCHARGEMENT", 0, 80);
      ctx.restore();

      // Outer protective border
      ctx.strokeStyle = "rgba(20, 30, 51, 0.12)";
      ctx.lineWidth = 2 * dpr;
      ctx.strokeRect(2, 2, viewport.width - 4, viewport.height - 4);

      // Running Footer
      ctx.font = `${Math.round(11 * dpr)}px 'Plus Jakarta Sans', system-ui, sans-serif`;
      ctx.fillStyle = "#A89F91";
      ctx.textAlign = "center";
      ctx.fillText(
        `LivresPro.tn · Sommaire sous licence exclusive — Page ${currentPage} / ${totalPdfPages}`,
        viewport.width / 2,
        viewport.height - 15 * dpr
      );
    } catch (err) {
      console.error("Erreur de rendu canvas PDF:", err);
    }
  }, [pdfDoc, currentPage, zoom, bookTitle, totalPdfPages]);

  useEffect(() => {
    if (pdfDoc) {
      renderPdfPage();
    } else {
      renderCanvasPage();
    }
  }, [pdfDoc, renderPdfPage, renderCanvasPage, zoom]);

  const maxPages = pdfDoc ? totalPdfPages : 21;

  const handleNextPage = () => {
    if (currentPage < maxPages) setCurrentPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleSelectChapterPage = (pg: number) => {
    if (pdfDoc) {
      const target = Math.min(Math.max(1, pg), maxPages);
      setCurrentPage(target);
      return;
    }
    // Map chapter page to corresponding PDF TOC page (17, 18, 19, 20, 21)
    let target = 17;
    if (pg === 1) target = 1;
    else if (pg >= 22 && pg <= 48) target = 18;
    else if (pg >= 49 && pg <= 141) target = 19;
    else if (pg >= 142 && pg <= 208) target = 20;
    else if (pg >= 209) target = 21;
    setCurrentPage(target);
    toast.success(`Affichage de la page de sommaire correspondante (Page ${target})`);
  };

  return (
    <section
      id="sommaire"
      ref={containerRef}
      className={`relative my-12 overflow-hidden rounded-3xl border border-[#BC3B2C]/25 bg-white shadow-xl transition-all ${
        isFullscreen ? "fixed inset-0 z-50 m-0 rounded-none bg-[#141E33] p-4" : "p-4 sm:p-8"
      }`}
      onContextMenu={(e) => {
        e.preventDefault();
        toast.error("Le clic droit est désactivé sur ce document sous copyright.");
        return false;
      }}
      onCopy={(e) => {
        e.preventDefault();
        toast.error("La copie de texte est strictement interdite sur ce document.");
      }}
      onCut={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* Background ambient accents */}
      <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-[#BC3B2C]/05 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-[#1E5FC2]/05 blur-3xl" />

      {/* Header bar with security credentials */}
      <div className="relative z-10 flex flex-col gap-4 border-b border-[#141E33]/10 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#141E33] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E9DFCF]">
              <Lock className="h-3 w-3 text-[#BC3B2C]" /> Sommaire Officiel Protégé
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#BC3B2C]/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#BC3B2C]">
              <ShieldCheck className="h-3.5 w-3.5" /> DRM Anti-Copie Actif
            </span>
          </div>

          <h2 className="mt-3 font-display text-2xl text-[#141E33] sm:text-3xl md:text-4xl">
            Table des Matières & Structure de l’Ouvrage
          </h2>
          <p className="mt-1 text-xs text-[#5C574C]">
            Édition originale · 9 Chapitres fondamentaux, 7 Études de cas tunisiennes exclusives · 277 pages
          </p>
        </div>

        {/* Security badge & Fullscreen toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#141E33] px-4 py-2 text-xs font-bold text-white shadow-sm">
            <Eye className="h-3.5 w-3.5" /> Lecture Sécurisée
          </span>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#141E33]/10 bg-white text-[#141E33] transition hover:bg-[#F6F1E7]"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* PROTECTED DIGITAL CANVAS READER */}
      <div className="relative mt-6 flex flex-col items-center">
          {/* Quick jump bar */}
          <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#F6F1E7] p-3 text-xs border border-[#141E33]/05">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-extrabold uppercase tracking-wider text-[#5C574C] mr-2">Accès direct :</span>
              {!pdfDoc ? (
                <>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                      currentPage === 1 ? "bg-[#BC3B2C] text-white" : "bg-white text-[#141E33] hover:bg-[#E9DFCF]"
                    }`}
                  >
                    Titre (p. 1)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(3)}
                    className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                      currentPage === 3 ? "bg-[#BC3B2C] text-white" : "bg-white text-[#141E33] hover:bg-[#E9DFCF]"
                    }`}
                  >
                    ISBN & Auteurs (p. 3)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(5)}
                    className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                      currentPage === 5 ? "bg-[#BC3B2C] text-white" : "bg-white text-[#141E33] hover:bg-[#E9DFCF]"
                    }`}
                  >
                    Préface (p. 5)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(17)}
                    className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                      currentPage === 17 ? "bg-[#BC3B2C] text-white" : "bg-white text-[#141E33] hover:bg-[#E9DFCF]"
                    }`}
                  >
                    Agenda (p. 17)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(18)}
                    className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                      currentPage >= 18 && currentPage <= 21
                        ? "bg-[#BC3B2C] text-white"
                        : "bg-white text-[#141E33] hover:bg-[#E9DFCF]"
                    }`}
                  >
                    Sommaire Détaillé (p. 18-21)
                  </button>
                </>
              ) : (
                Array.from({ length: Math.min(maxPages, 8) }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => setCurrentPage(pNum)}
                      className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                        currentPage === pNum ? "bg-[#BC3B2C] text-white" : "bg-white text-[#141E33] hover:bg-[#E9DFCF]"
                      }`}
                    >
                      Page {pNum}
                    </button>
                  );
                })
              )}
            </div>

            {/* Page navigation controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={handlePrevPage}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#141E33] shadow-xs disabled:opacity-40 hover:bg-[#E9DFCF]"
                title="Page précédente"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-bold text-[#141E33] min-w-16 text-center">
                {currentPage} / {maxPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= maxPages}
                onClick={handleNextPage}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#141E33] shadow-xs disabled:opacity-40 hover:bg-[#E9DFCF]"
                title="Page suivante"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Secure Reader Frame */}
          <div className="relative flex justify-center w-full overflow-hidden rounded-2xl bg-[#E9DFCF]/40 p-2 sm:p-6 shadow-inner">
            {/* Anti-screenshot privacy blur mask */}
            {isWindowBlurred && (
              <div
                onClick={() => setIsWindowBlurred(false)}
                className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#141E33]/90 backdrop-blur-md p-6 text-center text-white cursor-pointer"
              >
                <AlertTriangle className="h-12 w-12 text-[#BC3B2C] mb-3 animate-pulse" />
                <h3 className="font-display text-2xl">Affichage Protégé Masqué</h3>
                <p className="mt-2 max-w-md text-xs text-white/70">
                  Le contenu est automatiquement protégé en cas de changement de fenêtre ou d'outil de capture.
                </p>
                <button
                  type="button"
                  onClick={() => setIsWindowBlurred(false)}
                  className="mt-5 rounded-full bg-[#BC3B2C] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#a83426]"
                >
                  Cliquer pour réactiver l’affichage
                </button>
              </div>
            )}

            {/* Invisible event shield to block drag and browser selection */}
            <div
              className="absolute inset-0 z-20 cursor-default select-none"
              style={{ WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none" }}
              onContextMenu={(e) => {
                e.preventDefault();
                toast.error("Document protégé : clic droit désactivé.");
              }}
              onMouseDown={(e) => {
                if (e.detail > 1) e.preventDefault(); // prevent double-click select
              }}
            />

            {/* Loading state for dynamic PDF rendering */}
            {pdfLoading && (
              <div className="absolute inset-0 z-25 flex flex-col items-center justify-center bg-white/85 backdrop-blur-xs">
                <div className="h-9 w-9 animate-spin rounded-full border-3 border-[#BC3B2C] border-t-transparent" />
                <p className="mt-3 text-xs font-bold text-[#141E33]">Sécurisation et rendu du sommaire...</p>
              </div>
            )}

            {/* The High-DPI Canvas Rendering Engine */}
            <div
              className="relative max-w-full overflow-auto rounded-xl shadow-2xl transition-transform"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
              }}
            >
              <canvas
                ref={canvasRef}
                className="block max-w-full h-auto rounded-lg bg-white select-none pointer-events-none"
                style={{
                  width: "100%",
                  maxWidth: "680px",
                  aspectRatio: "800 / 1130",
                }}
              />
            </div>
          </div>

          {/* Bottom Zoom & Protection Notice */}
          <div className="mt-4 flex w-full flex-wrap items-center justify-between gap-3 text-xs text-[#5C574C]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))}
                className="flex items-center gap-1 rounded-lg border border-[#141E33]/10 bg-white px-3 py-1.5 font-semibold text-[#141E33] hover:bg-[#F6F1E7]"
              >
                <ZoomOut className="h-3.5 w-3.5" /> Réduire
              </button>
              <span className="font-bold text-[#141E33]">{Math.round(zoom * 100)}%</span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
                className="flex items-center gap-1 rounded-lg border border-[#141E33]/10 bg-white px-3 py-1.5 font-semibold text-[#141E33] hover:bg-[#F6F1E7]"
              >
                <ZoomIn className="h-3.5 w-3.5" /> Agrandir
              </button>
              <button
                type="button"
                onClick={() => setZoom(1)}
                className="rounded-lg border border-[#141E33]/10 bg-white px-3 py-1.5 font-semibold text-[#141E33] hover:bg-[#F6F1E7]"
                title="Taille normale"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </div>

            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="h-4 w-4 text-[#BC3B2C]" />
              <span>Lecture in-situ protégée · Reproduction et capture interdites</span>
            </div>
          </div>
        </div>
    </section>
  );
}
