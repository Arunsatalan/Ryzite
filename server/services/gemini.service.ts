import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

export function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

export interface ProposalScopeInput {
  projectType?: string;
  features?: string[];
  budgetTier?: string;
  targetTimeline?: string;
  techPreferences?: string;
  description?: string;
}

export interface ProposalScopeOutput {
  summary: string;
  recommendedArchitecture: string;
  keyDeliverables: string[];
  recommendedTechStack: string[];
  estimatedWeeks: string;
  estimatedBudgetRange: string;
  riskMitigation: string;
  roiProjection: string;
}

export async function generateArchitectureScope(input: ProposalScopeInput): Promise<{
  aiGenerated: boolean;
  data: ProposalScopeOutput;
}> {
  const ai = getAIClient();
  
  if (ai) {
    try {
      const prompt = `You are a Principal Software Solutions Architect at Ryzite.
Analyze this client project request and generate an executive technical architecture summary and estimation breakdown.

Input Details:
- Project Type: ${input.projectType || 'Custom Software'}
- Selected Features: ${Array.isArray(input.features) ? input.features.join(', ') : 'Standard platform capabilities'}
- Target Budget Tier: ${input.budgetTier || 'Growth Stage ($15k - $30k)'}
- Target Timeline: ${input.targetTimeline || '8 - 12 Weeks'}
- Tech Preferences: ${input.techPreferences || 'Modern React / Next.js / TypeScript / PostgreSQL / Cloud'}
- Client Brief: ${input.description || 'Scalable, secure modern software platform.'}

Return a clean JSON object with this exact structure:
{
  "summary": "Brief executive analysis (2-3 sentences)",
  "recommendedArchitecture": "Technical architecture blueprint and key design decisions",
  "keyDeliverables": ["Deliverable 1", "Deliverable 2", "Deliverable 3", "Deliverable 4"],
  "recommendedTechStack": ["Tech 1", "Tech 2", "Tech 3", "Tech 4", "Tech 5"],
  "estimatedWeeks": "6-10 Weeks",
  "estimatedBudgetRange": "$18,000 - $28,000",
  "riskMitigation": "Key engineering risk and mitigation strategy",
  "roiProjection": "Projected business impact and efficiency gain"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text;
      if (text) {
        try {
          const parsed = JSON.parse(text) as ProposalScopeOutput;
          return { aiGenerated: true, data: parsed };
        } catch {
          // Fall through to algorithmic generator
        }
      }
    } catch (err) {
      console.warn('Gemini estimation failed, using fallback estimator:', err);
    }
  }

  // Fallback high-precision estimation generator
  const featureCount = Array.isArray(input.features) ? input.features.length : 3;
  const baseWeeks = Math.max(4, Math.min(16, 4 + featureCount * 1.5));
  const minCost = 8000 + featureCount * 3500;
  const maxCost = minCost * 1.6;

  return {
    aiGenerated: false,
    data: {
      summary: `Architectural assessment for ${input.projectType || 'Software Solution'}. Ryzite recommends an event-driven, cloud-native architecture optimized for sub-100ms response times and horizontal scalability.`,
      recommendedArchitecture: 'Decoupled Next.js edge-rendered frontend with Node.js/TypeScript microservices, PostgreSQL with connection pooling, Redis streaming cache, and automated CI/CD container orchestration on Google Cloud or AWS.',
      keyDeliverables: [
        'Production Next.js / React Web Application with responsive layout',
        'Secure Authentication & Role-Based Access Control (RBAC)',
        'High-throughput REST & GraphQL API Integration Suite',
        'Automated CI/CD Deployment with Zero-Downtime Pipeline',
        'Post-Launch Hypercare SLA & Performance Monitoring'
      ],
      recommendedTechStack: ['Next.js', 'React 19', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Redis', 'Docker'],
      estimatedWeeks: `${Math.round(baseWeeks)} - ${Math.round(baseWeeks + 4)} Weeks`,
      estimatedBudgetRange: `$${minCost.toLocaleString()} - $${Math.round(maxCost).toLocaleString()}`,
      riskMitigation: 'Isolated micro-module development sprints with automated end-to-end regression tests at each 2-week milestone.',
      roiProjection: 'Estimated 65% reduction in manual operation cycles and +240% increase in user throughput.'
    }
  };
}
