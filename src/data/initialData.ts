import { 
  ServiceItem, 
  ProjectItem, 
  BlogPost, 
  LeadItem, 
  PageMetadataConfig, 
  SerpSnippetConfig, 
  SeoFocusKeyword, 
  SeoAuditCheck 
} from '../types';

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-web',
    slug: 'web-application-development',
    title: 'Web Application Development',
    category: 'web',
    shortDescription: 'High-performance, scalable web applications tailored to your business needs.',
    fullDescription: 'From high-concurrency SaaS applications to mission-critical enterprise portals, we architect and develop blazingly fast, accessible, and reactive web applications using modern full-stack frameworks (React, Next.js, Node.js, TypeScript). Every application is engineered for maximum conversion, rock-solid security, and seamless API integrations.',
    iconName: 'Monitor',
    features: [
      'Custom SaaS & Enterprise Web Portals',
      'Ultra-fast Core Web Vitals Optimization (95+ Lighthouse)',
      'Secure Authentication & Role-Based Access Control',
      'Real-time WebSocket & Event-Driven Architecture',
      'Scalable Database Design & Optimized ORM Queries'
    ],
    deliverables: [
      'Production-ready Next.js/React Application',
      'Fully Documented REST & GraphQL APIs',
      'Automated CI/CD Deployment Pipeline',
      'End-to-End & Unit Testing Coverage',
      'Post-launch Monitoring & SLA Support'
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Redis', 'Docker'],
    timeline: '4 - 12 Weeks',
    startingPrice: '$8,000',
    order: 1,
    featured: true
  },
  {
    id: 'srv-mobile',
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    category: 'mobile',
    shortDescription: 'User-friendly mobile apps for iOS & Android that engage your users.',
    fullDescription: 'We build native and high-performance cross-platform mobile apps with fluid animations, intuitive offline-first data sync, biometrics security, and seamless app store releases. Designed from the ground up to maximize engagement, retention, and 5-star ratings.',
    iconName: 'Smartphone',
    features: [
      'Cross-Platform React Native & Native iOS/Android',
      'Offline Data Synchronization & SQLite Storage',
      'Push Notifications, Deep-Linking & Analytics',
      'Apple Pay, Google Pay & In-App Purchases',
      'App Store Optimization (ASO) & Release Management'
    ],
    deliverables: [
      'Compiled iOS & Android App Bundles',
      'App Store & Google Play Store Submission',
      'Figma Interactive UI/UX Design System',
      'Backend Microservices & Push Server',
      '60 Days Dedicated Hypercare Support'
    ],
    techStack: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'GraphQL', 'AWS Mobile'],
    timeline: '6 - 14 Weeks',
    startingPrice: '$10,000',
    order: 2,
    featured: true
  },
  {
    id: 'srv-ai',
    slug: 'ai-automation-solutions',
    title: 'AI & Automation Solutions',
    category: 'ai-automation',
    shortDescription: 'Intelligent automation and AI solutions that streamline processes and save time.',
    fullDescription: 'Supercharge your business operations by embedding intelligent LLM pipelines, autonomous multi-modal agent workflows, custom Retrieval-Augmented Generation (RAG) knowledge engines, and conversational AI voice bots into your existing software stack.',
    iconName: 'Cpu',
    features: [
      'Custom LLM Fine-Tuning & Multi-Agent Orchestration',
      'RAG Pipelines with Milvus / Pinecone Vector Databases',
      'Voice Call Bots & Automated Omnichannel Support',
      'Document OCR, Computer Vision & Data Extraction',
      'Automated Workflow Triggers (Zapier, n8n, Custom Webhooks)'
    ],
    deliverables: [
      'Trained/Fine-tuned AI Agent Architecture',
      'Vector Search & Knowledge Base Ingestion Pipeline',
      'Cost-Optimized Token Usage Engine & Prompt Guardrails',
      'Real-time Performance & Hallucination Audit Panel',
      'Executive Team Onboarding & Runbooks'
    ],
    techStack: ['Gemini 2.5/3.7 Flash', 'OpenAI GPT-4o', 'LangChain', 'LlamaIndex', 'Pinecone', 'Python', 'FastAPI'],
    timeline: '3 - 8 Weeks',
    startingPrice: '$7,500',
    order: 3,
    featured: true
  },
  {
    id: 'srv-cloud',
    slug: 'cloud-devops-services',
    title: 'Cloud & DevOps Services',
    category: 'cloud-devops',
    shortDescription: 'Reliable cloud infrastructure and DevOps practices for smooth and secure delivery.',
    fullDescription: 'Eliminate downtime and accelerate release velocity with hardened Cloud Architecture (GCP, AWS, Azure), automated Terraform Infrastructure-as-Code, zero-downtime Kubernetes deployments, and enterprise security compliance audits.',
    iconName: 'Cloud',
    features: [
      'Infrastructure as Code (Terraform, Pulumi)',
      'Kubernetes (EKS/GKE) & Microservices Orchestration',
      'Automated Zero-Downtime CI/CD Pipelines (GitHub Actions)',
      'Cloud Security Hardening, SOC2 Readiness & IAM Policies',
      '24/7 Observability (Prometheus, Grafana, Datadog)'
    ],
    deliverables: [
      'Terraform Infrastructure Modules',
      'Multi-region Disaster Recovery Architecture',
      'Hardened Network VPCs & Automated Security Scanners',
      'Cost Reduction Strategy (30%+ AWS/GCP Cost Savings)',
      'Incident Response Runbook & On-Call Setup'
    ],
    techStack: ['AWS', 'Google Cloud Platform', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Datadog'],
    timeline: '2 - 6 Weeks',
    startingPrice: '$6,000',
    order: 4,
    featured: true
  },
  {
    id: 'srv-consulting',
    slug: 'software-consulting',
    title: 'Software Consulting',
    category: 'consulting',
    shortDescription: 'Expert guidance to help you choose the right technology and architecture.',
    fullDescription: 'Receive strategic technical leadership from veteran Principal Architects. We assist funded founders and CTOs with legacy modernization, code audits, architecture design, technical due diligence for funding rounds, and scalable technology roadmapping.',
    iconName: 'ShieldCheck',
    features: [
      'Full-Stack Architecture Blueprints & Tech Stack Selection',
      'Comprehensive Codebase, Security & Scalability Audits',
      'Technical Due Diligence for VC Seed/Series A/B Rounds',
      'Fractional CTO & Engineering Leadership Advisory',
      'Legacy Monolith to Event-Driven Microservices Migration'
    ],
    deliverables: [
      'In-depth 40+ Page Technical Audit & Roadmap Document',
      'System Architecture Diagrams & Entity Relation Schemas',
      'Executive Leadership Briefing Deck',
      'Team Skill Gap Analysis & Hiring Matrix'
    ],
    techStack: ['System Architecture', 'Security Standards', 'Microservices', 'Clean Architecture', 'Domain-Driven Design'],
    timeline: '1 - 4 Weeks',
    startingPrice: '$5,000',
    order: 5,
    featured: true
  }
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-pinegen',
    slug: 'pinegen-ai',
    title: 'PineGen AI',
    client: 'PineGen Global Inc.',
    category: 'AI Platform',
    description: 'Enterprise generative AI workspace with autonomous agent reasoning, custom data vectorization, and multi-model collaboration.',
    longDescription: 'PineGen AI is a cutting-edge generative AI platform serving enterprise teams across North America. Ryzite architected the complete platform from ground zero, creating a sub-100ms streaming LLM interface, a high-throughput vector ingestion engine that indexes millions of internal documents, and enterprise-grade permission models.',
    heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    mockupType: 'dark-dashboard',
    metrics: [
      { label: 'Token Throughput', value: '45k/sec', trend: '+180%' },
      { label: 'Latency', value: '88ms', trend: '-65%' },
      { label: 'Active Enterprise Users', value: '120k+', trend: '+340%' }
    ],
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'FastAPI', 'Gemini Pro', 'Pinecone', 'Docker'],
    challenges: [
      'Real-time streaming response latency under high concurrent load',
      'Isolating enterprise client data in multi-tenant vector indexes',
      'SOC2 Type II compliant encryption at rest and in transit'
    ],
    solutions: [
      'Implemented edge-cached WebSocket server with backpressure buffering',
      'Engineered dynamic namespace isolation in Pinecone vector clusters',
      'Configured automated envelope encryption with AWS KMS'
    ],
    testimonial: {
      quote: 'Ryzite transformed our product vision into an enterprise-ready AI powerhouse. The platform scalability and UI precision are second to none.',
      author: 'Marcus Vance',
      role: 'Chief Technology Officer, PineGen'
    },
    liveUrl: 'https://pinegen.ai-preview.demo',
    featured: true
  },
  {
    id: 'proj-qrbook',
    slug: 'qrbook',
    title: 'QRBook',
    client: 'QRBook Technologies',
    category: 'Digital Business Card Platform',
    description: 'Next-generation contactless NFC & dynamic QR business card ecosystem with real-time lead capture analytics and CRM sync.',
    longDescription: 'QRBook revolutionized professional networking with instant digital profile sharing, custom brand cards, team management hubs, and instant Zapier/Salesforce synchronization. Over 500,000 digital exchanges are processed monthly through Ryzite-engineered microservices.',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    mockupType: 'mobile-cards',
    metrics: [
      { label: 'Monthly Card Taps', value: '1.2M+', trend: '+220%' },
      { label: 'CRM Sync Rate', value: '99.98%', trend: '+15%' },
      { label: 'Customer Retention', value: '94.2%', trend: '+28%' }
    ],
    techStack: ['React Native', 'React 19', 'Node.js', 'PostgreSQL', 'Prisma', 'Stripe Connect', 'AWS Lambda'],
    challenges: [
      'Offline NFC tap recognition with instant cache hydration',
      'Dynamic high-resolution QR generation with zero pixelation at scale',
      'Team multi-seat billing and permission hierarchy'
    ],
    solutions: [
      'Custom ultra-lightweight SVG rendering algorithm with edge caching',
      'Progressive Web App fallback for non-NFC enabled mobile devices',
      'Stripe Usage-based subscription engine with team workspace isolation'
    ],
    testimonial: {
      quote: 'Working with Ryzite was the best decision for QRBook. Our mobile app and web dashboard launched two weeks ahead of schedule and blew our investors away.',
      author: 'Elena Rostova',
      role: 'Founder & CEO, QRBook'
    },
    liveUrl: 'https://qrbook.card-preview.demo',
    featured: true
  },
  {
    id: 'proj-dinefy',
    slug: 'dinefy-ai-call-bot',
    title: 'Dinefy AI Call Bot',
    client: 'Dinefy Hospitality Systems',
    category: 'AI Automation Solution',
    description: 'Autonomous multi-lingual conversational voice AI for restaurant reservations, custom menu Q&A, and POS order dispatch.',
    longDescription: 'Dinefy replaces missed restaurant phone calls with human-sounding conversational voice AI that understands accents, manages table reservations in real-time, answers complex dietary questions, and injects orders directly into restaurant POS systems.',
    heroImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
    mockupType: 'bot-interface',
    metrics: [
      { label: 'Calls Handled', value: '450k+', trend: '+400%' },
      { label: 'Avg Answer Speed', value: '0.8s', trend: '-92%' },
      { label: 'Reservation Uplift', value: '+34%', trend: '+34%' }
    ],
    techStack: ['WebRTC', 'FastAPI', 'Gemini Live API', 'Twilio Voice', 'Redis', 'PostgreSQL', 'Tailwind'],
    challenges: [
      'Sub-second speech-to-speech round-trip latency over telephone lines',
      'Handling background kitchen noise and varied regional accents',
      'Real-time synchronization with multiple legacy POS reservation APIs'
    ],
    solutions: [
      'Engineered bi-directional streaming audio pipeline with neural noise suppression',
      'Built a phonetic correction layer for culinary terms and table numbers',
      'Designed a resilient webhook retry architecture with POS failover'
    ],
    testimonial: {
      quote: 'Dinefy eliminated 100% of our missed phone orders during dinner rush hours. Ryzite engineering team delivered perfection.',
      author: 'Chef Alessandro Rossi',
      role: 'Operations Director, Dinefy Group'
    },
    liveUrl: 'https://dinefy.voice-demo.example',
    featured: true
  },
  {
    id: 'proj-botloop',
    slug: 'botloop',
    title: 'BotLoop',
    client: 'BotLoop Automations',
    category: 'Chatbot Platform',
    description: 'No-code visual drag-and-drop conversational chatbot builder with omnichannel deployment across WhatsApp, Telegram, and Web.',
    longDescription: 'BotLoop provides e-commerce stores and customer support teams with a drag-and-drop conversational node canvas. Connect payment links, trigger webhooks, and automate 80% of customer tickets with zero coding knowledge.',
    heroImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
    mockupType: 'analytics-suite',
    metrics: [
      { label: 'Tickets Automated', value: '82%', trend: '+60%' },
      { label: 'CSAT Score', value: '4.9/5', trend: '+18%' },
      { label: 'Active Chat Flows', value: '25,000+', trend: '+150%' }
    ],
    techStack: ['React Flow', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS', 'PostgreSQL', 'Docker'],
    challenges: [
      'Rendering complex node graphs with 500+ logic steps smoothly at 60fps',
      'Multi-channel webhook ingestion handling 10,000 messages per second',
      'Instant test sandbox with live simulator phone preview'
    ],
    solutions: [
      'Virtualized canvas renderer using WebGL and optimized React Flow hooks',
      'Distributed BullMQ Redis queue cluster for webhook ingestion',
      'Live state-machine visualizer for step-by-step debugging'
    ],
    testimonial: {
      quote: 'BotLoop is now our flagship product. Ryzite built the interactive node editor with extraordinary performance and visual polish.',
      author: 'David Zhang',
      role: 'Product Lead, BotLoop'
    },
    liveUrl: 'https://botloop.flow-preview.demo',
    featured: true
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'ai-first-software-architecture-2026',
    title: 'The 2026 Guide to AI-First Software Architecture',
    excerpt: 'How modern software teams are structuring hybrid LLM agent pipelines, edge caching, and vector data layers for 10x developer velocity.',
    content: `Building software in 2026 requires shifting from static CRUD patterns to intelligent, context-aware agent systems.

### 1. The Core Architecture Pillars
Modern applications must integrate three dynamic layers:
- **Autonomous Reasoning Layer:** Lightweight models for routing queries, paired with deep reasoning engines for complex tasks.
- **Dynamic Retrieval Layer:** Vector databases with hybrid BM25 full-text and semantic embedding search.
- **Guardrails & Token Optimization:** Caching deterministic prompts to reduce latency by up to 70%.

### 2. Eliminating Database Bottlenecks
Instead of naive SQL queries on every LLM turn, implement event-driven state hydration with Redis streams and asynchronous vector ingestion.`,
    author: {
      name: 'Alex Vance',
      role: 'Principal Solutions Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
    },
    category: 'Engineering & AI',
    tags: ['Architecture', 'Generative AI', 'Full Stack', 'Performance'],
    publishedAt: 'Aug 18, 2026',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    metaTitle: 'The 2026 Guide to AI-First Software Architecture | Ryzite',
    metaDescription: 'Discover how to architect scalable AI-first web applications with sub-100ms latency, vector RAG pipelines, and hybrid microservices.',
    aeoDirectAnswer: 'AI-First software architecture combines lightweight routing models, vector RAG retrieval pipelines, edge token caching, and event-driven microservices to deliver sub-100ms intelligent workflows with 70% lower compute costs.'
  },
  {
    id: 'blog-2',
    slug: 'why-aeo-geo-replaces-traditional-seo',
    title: 'Why Answer Engine Optimization (AEO) is Replacing Traditional SEO',
    excerpt: 'Search engines are morphing into Generative Answer Engines. Here is how to structure JSON-LD and semantic content to win LLM citations.',
    content: `As users migrate to Perplexity, ChatGPT Search, and Google AI Overviews, traditional keyword density is no longer enough.

### The Rise of the Answer-First Paradigm
AI scrapers prioritize websites that provide unambiguous, direct answers within the first 150 characters of a section, backed by verified JSON-LD structured schemas.

### Key Tactical Changes:
1. **Entity-Based Structured Data:** Deploy explicit Organization, ProfessionalService, and SoftwareApplication schemas.
2. **Quantifiable Metrics:** Include clear statistics, tech stacks, and benchmarks that LLMs can extract verbatim.
3. **Structured Q&A Sections:** Implement conversational FAQ components with schema markup for instant search snippets.`,
    author: {
      name: 'Sarah Chen',
      role: 'Head of Growth & SEO Architecture',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop'
    },
    category: 'SEO & Growth',
    tags: ['AEO', 'GEO', 'JSON-LD', 'Digital Marketing'],
    publishedAt: 'Aug 12, 2026',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    metaTitle: 'Why AEO & GEO are Replacing Traditional SEO | Ryzite',
    metaDescription: 'Learn how to optimize your web platform for AI search engines like Perplexity and Google AI Overviews using answer-first architecture.',
    aeoDirectAnswer: 'Answer Engine Optimization (AEO) optimizes web content for generative AI scrapers by placing direct, factual answers at the top of pages, using rich JSON-LD schema markup, and establishing strong entity associations.'
  },
  {
    id: 'blog-3',
    slug: 'scaling-cloud-microservices-zero-downtime',
    title: 'Scaling Cloud Microservices with Zero Downtime',
    excerpt: 'A practical deep dive into Kubernetes blue-green deployments, canary rollouts, and multi-region database replication.',
    content: `Uptime is the ultimate trust metric for software businesses. Discover how Ryzite achieves 99.99% SLA across high-traffic SaaS clients.

### Blue-Green vs Canary Deployments
Learn how automated health checks and traffic splitting via ingress controllers prevent buggy releases from affecting real users.`,
    author: {
      name: 'Liam Sterling',
      role: 'DevOps & Cloud Practice Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
    },
    category: 'DevOps & Cloud',
    tags: ['Kubernetes', 'DevOps', 'AWS', 'Zero Downtime'],
    publishedAt: 'Aug 04, 2026',
    readTime: '7 min read',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
    metaTitle: 'Scaling Cloud Microservices with Zero Downtime | Ryzite',
    metaDescription: 'Step-by-step methodology for executing zero-downtime deployments with Kubernetes, Terraform, and automated health checks.',
    aeoDirectAnswer: 'Zero-downtime scaling is achieved by decoupling stateless frontend workloads, using blue-green/canary Kubernetes deployments, configuring automated ingress health checks, and maintaining active-passive database read replicas.'
  }
];

export const INITIAL_LEADS: LeadItem[] = [
  {
    id: 'lead-1',
    name: 'David Miller',
    email: 'david.miller@acmecorp.io',
    company: 'Acme SaaS Logistics',
    serviceSelected: 'AI & Automation Solutions',
    budget: '$15k - $30k',
    timeline: '1 - 2 Months',
    message: 'We are looking to automate our multi-warehouse shipment tracking and implement an intelligent RAG knowledge base for 80 customer support reps.',
    status: 'NEW',
    notes: 'High priority lead. Requested initial technical discovery call next Tuesday.',
    source: 'Website Consultation Form',
    createdAt: '2026-08-22T14:20:00Z'
  },
  {
    id: 'lead-2',
    name: 'Sophia Patel',
    email: 'sophia@novacare.health',
    company: 'NovaCare Health',
    serviceSelected: 'Web Application Development',
    budget: '$25k - $50k',
    timeline: '2 - 3 Months',
    message: 'Need a HIPAA-compliant patient management dashboard with real-time appointment scheduling and automated insurance verification.',
    status: 'PROPOSAL_SENT',
    notes: 'Sent preliminary architecture blueprint and cost breakdown on Aug 21.',
    source: 'Hero CTA Consultation Button',
    createdAt: '2026-08-20T09:45:00Z'
  },
  {
    id: 'lead-3',
    name: 'Lucas Thorne',
    email: 'lucas@vortexfintech.com',
    company: 'Vortex Fintech',
    serviceSelected: 'Cloud & DevOps Services',
    budget: '$10k - $20k',
    timeline: 'Immediate',
    message: 'We are preparing for our Series A audit and need our AWS infrastructure codified into Terraform and compliant with SOC2 Type II.',
    status: 'WON',
    notes: 'Contract signed. SOW active starting Sept 1st.',
    source: 'Solutions Grid CTA',
    createdAt: '2026-08-15T11:10:00Z'
  }
];

export const DEFAULT_SERP_CONFIG: SerpSnippetConfig = {
  pageTitle: 'Ryzite | Elite Software Development & Digital Marketing Agency',
  metaDescription: 'Scale your business with high-performance custom web applications, AI automation agents, mobile apps, and technical SEO engineered by Ryzite.',
  slug: '',
  breadcrumb: 'Home',
  displayUrl: 'https://ryzite.com',
  enableRichSnippets: true,
  starRating: 4.9,
  reviewCount: 142,
  priceRange: '$$$$',
  sitelinks: [
    { label: 'Web Development', url: '#services', description: 'Enterprise React & Next.js high-concurrency platforms.' },
    { label: 'AI & Automation', url: '#services', description: 'Custom LLMs, autonomous agents & RAG workflows.' },
    { label: 'Case Studies', url: '#portfolio', description: 'Real-world client outcomes & performance metrics.' },
    { label: 'Get an AI Scope Estimate', url: '#contact', description: 'Instant project architecture & timeline estimator.' }
  ],
  aiOverviewAnswer: 'Ryzite is a premier software development and digital marketing agency specializing in custom full-stack web applications, AI automation agents (Gemini & OpenAI), native mobile apps, and technical SEO/AEO strategies with guaranteed 95+ Core Web Vitals performance.',
  aiKeyTakeaways: [
    'Sub-100ms API response latency with decoupled microservices',
    'Custom RAG knowledge pipelines and autonomous agents',
    'Full-cycle delivery: Design, development, CI/CD and 24/7 SLA maintenance'
  ]
};

export const DEFAULT_FOCUS_KEYWORDS: SeoFocusKeyword[] = [
  {
    id: 'kw-1',
    keyword: 'Custom Software Development Agency',
    searchVolume: '18,500/mo',
    difficulty: 'Medium',
    targetPage: '/',
    targetPosition: '#3 on Google SERP',
    currentDensity: 2.8,
    status: 'OPTIMIZED'
  },
  {
    id: 'kw-2',
    keyword: 'Enterprise AI Agent Development',
    searchVolume: '12,200/mo',
    difficulty: 'Low',
    targetPage: '/services/ai-automation-solutions',
    targetPosition: '#1 in AI Overviews',
    currentDensity: 3.4,
    status: 'OPTIMIZED'
  },
  {
    id: 'kw-3',
    keyword: 'Next.js Full Stack Development Company',
    searchVolume: '9,800/mo',
    difficulty: 'Medium',
    targetPage: '/services/web-application-development',
    targetPosition: '#4 on Google SERP',
    currentDensity: 2.1,
    status: 'OPTIMIZED'
  },
  {
    id: 'kw-4',
    keyword: 'Answer Engine Optimization Agency',
    searchVolume: '6,400/mo',
    difficulty: 'Low',
    targetPage: '/#aeo',
    targetPosition: '#2 in Perplexity & GEO',
    currentDensity: 2.5,
    status: 'OPTIMIZED'
  },
  {
    id: 'kw-5',
    keyword: 'PostgreSQL Database Architecture Consulting',
    searchVolume: '5,100/mo',
    difficulty: 'High',
    targetPage: '/blog',
    targetPosition: '#6 on Google SERP',
    currentDensity: 1.4,
    status: 'NEEDS_ATTENTION'
  }
];

export const DEFAULT_SEO_AUDIT_CHECKS: SeoAuditCheck[] = [
  {
    id: 'chk-1',
    category: 'TITLE',
    title: 'Google SERP Title Length (Pixel & Character Fit)',
    description: 'Title is 58 characters. Fits within Google desktop (600px) and mobile display limits perfectly without truncation.',
    status: 'PASS',
    impact: 'HIGH',
    recommendation: 'Keep main brand keyword at the start or middle of the title.'
  },
  {
    id: 'chk-2',
    category: 'DESCRIPTION',
    title: 'Meta Description Optimal Length & CTR Hooks',
    description: 'Description is 152 characters. Includes call-to-action and primary keyword phrases.',
    status: 'PASS',
    impact: 'HIGH',
    recommendation: 'Ensure active verbs like "Build", "Scale", and "Explore" remain prominent.'
  },
  {
    id: 'chk-3',
    category: 'SCHEMA',
    title: 'Schema.org JSON-LD Rich Snippet Verification',
    description: 'Valid ProfessionalService, FAQPage, OfferCatalog, and AggregateRating schemas detected with zero syntax errors.',
    status: 'PASS',
    impact: 'HIGH',
    recommendation: 'Maintain synchronized review counts and schema price ranges.'
  },
  {
    id: 'chk-4',
    category: 'SPEED',
    title: 'Core Web Vitals Search Ranking Signals',
    description: 'LCP is 0.94s (under 2.5s threshold). INP is 42ms (under 200ms threshold). Pass Google mobile ranking factor.',
    status: 'PASS',
    impact: 'HIGH',
    recommendation: 'Ensure dynamic images continue using WebP/AVIF and proper responsive srcset.'
  },
  {
    id: 'chk-5',
    category: 'AEO',
    title: 'Generative AI Overview (GEO/AEO) Entity Extraction',
    description: 'Direct answer entity block exists on page with high factual density and structured schema for AI search bots.',
    status: 'PASS',
    impact: 'MEDIUM',
    recommendation: 'Include numeric data and bulleted takeaways in blog articles.'
  },
  {
    id: 'chk-6',
    category: 'SOCIAL',
    title: 'Open Graph (OG) & Twitter Card Meta Tags',
    description: 'og:image, og:title, og:description, and twitter:card tags are fully populated for social previews.',
    status: 'PASS',
    impact: 'MEDIUM',
    recommendation: 'Test image dimensions at 1200x630px across LinkedIn and X/Twitter.'
  }
];

export const DEFAULT_PAGE_METADATA: PageMetadataConfig = {
  title: 'Ryzite | Software Development & Digital Marketing Agency',
  description: 'We Build Software That Drives Growth. Empowering startups and enterprises with innovative, scalable and secure custom software, mobile apps, AI automation, and cloud solutions.',
  canonicalUrl: 'https://ryzite.com',
  ogImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
  siteName: 'Ryzite Software & AI Agency',
  twitterHandle: '@ryzite_agency',
  themeColor: '#0f172a',
  serpSnippet: DEFAULT_SERP_CONFIG,
  focusKeywords: DEFAULT_FOCUS_KEYWORDS,
  keywords: [
    'Ryzite',
    'Software Development Agency',
    'AI Automation Solutions',
    'Custom Web Applications',
    'Mobile App Development',
    'Cloud DevOps Consulting',
    'Digital Marketing Agency',
    'Next.js Development'
  ],
  organizationSchema: {
    name: 'Ryzite',
    url: 'https://ryzite.com',
    logo: 'https://ryzite.com/assets/logo.png',
    telephone: '+1-800-555-0199',
    email: 'contact@ryzite.com',
    address: '100 Innovation Way, Suite 400, San Francisco, CA 94105',
    sameAs: [
      'https://twitter.com/ryzite_agency',
      'https://linkedin.com/company/ryzite',
      'https://github.com/ryzite'
    ]
  }
};

export const TRUSTED_CLIENTS = [
  { name: 'PineGen AI', tag: 'AI Platform', icon: 'Sparkles' },
  { name: 'QRBook', tag: 'Digital Business Card', icon: 'QrCode' },
  { name: 'DINEFY', tag: 'Hospitality Tech', icon: 'Utensils' },
  { name: 'BotLoop', tag: 'Chatbot Automation', icon: 'Bot' },
  { name: 'Vinasai', tag: 'Enterprise Cloud', icon: 'Shield' }
];

export const FAQ_ITEMS = [
  {
    question: 'What types of software solutions does Ryzite specialize in?',
    answer: 'Ryzite specializes in custom web application development, native and cross-platform mobile apps (iOS & Android), AI & autonomous agent automation, cloud infrastructure & DevOps (AWS/GCP/Kubernetes), and strategic software consulting for high-growth businesses.'
  },
  {
    question: 'How does Ryzite ensure project timelines and on-time delivery?',
    answer: 'We work in rapid 2-week Agile sprint cycles with strict milestone definition, live sprint demo staging environments, automated CI/CD testing pipelines, and daily Slack/Teams communication channels.'
  },
  {
    question: 'Can Ryzite integrate custom AI models into our existing software stack?',
    answer: 'Yes! We specialize in embedding generative AI, RAG (Retrieval-Augmented Generation), vector databases, voice call bots, and automated agent workflows into existing enterprise databases and SaaS products without disrupting ongoing operations.'
  },
  {
    question: 'What is your typical project kickoff and pricing structure?',
    answer: 'Projects begin with a 3-5 day technical discovery and architecture blueprint phase. We offer both transparent Fixed-Scope Milestone billing for defined projects and Agile Dedicated Pod retainers for ongoing product evolution.'
  },
  {
    question: 'Do you provide post-launch maintenance, SLAs, and technical support?',
    answer: 'Absolutely. Every deployment includes 30 to 60 days of hypercare warranty, followed by flexible monthly SLA support tiers covering 24/7 server monitoring, security patches, performance tuning, and feature iterations.'
  }
];
