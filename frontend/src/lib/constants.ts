import { PromptCategoryOption, ResponseStyleOption } from '@/types';

export const PROMPT_CATEGORIES: PromptCategoryOption[] = [
  {
    value: 'doubt',
    label: 'Question & Doubt',
    description: 'Get clear answers to your questions',
    icon: '❓',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  {
    value: 'image_generation',
    label: 'Image Generation',
    description: 'Create detailed image prompts',
    icon: '🎨',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  {
    value: 'learning_roadmap',
    label: 'Learning Roadmap',
    description: 'Build structured learning paths',
    icon: '🗺️',
    color: 'bg-green-100 text-green-700 border-green-200',
  },
  {
    value: 'video_generation',
    label: 'Video Generation',
    description: 'Generate video scripts and concepts',
    icon: '🎬',
    color: 'bg-red-100 text-red-700 border-red-200',
  },
  {
    value: 'deep_research',
    label: 'Deep Research',
    description: 'Comprehensive research and analysis',
    icon: '🔬',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  },
  {
    value: 'idea_exploration',
    label: 'Idea Exploration',
    description: 'Brainstorm and explore new concepts',
    icon: '💡',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  },
];

export const RESPONSE_STYLES: ResponseStyleOption[] = [
  {
    value: 'concise',
    label: 'Concise',
    description: 'Brief and to-the-point responses',
    icon: '⚡',
  },
  {
    value: 'detailed',
    label: 'Detailed',
    description: 'Comprehensive and thorough explanations',
    icon: '📋',
  },
  {
    value: 'creative',
    label: 'Creative',
    description: 'Imaginative and innovative approaches',
    icon: '🎭',
  },
  {
    value: 'formal',
    label: 'Formal',
    description: 'Professional and structured tone',
    icon: '👔',
  },
  {
    value: 'technical',
    label: 'Technical',
    description: 'In-depth technical explanations',
    icon: '⚙️',
  },
];

export const USER_ROLES = [
  { value: 'student', label: 'Student' },
  { value: 'educator', label: 'Educator' },
  { value: 'researcher', label: 'Researcher' },
  { value: 'developer', label: 'Developer' },
  { value: 'designer', label: 'Designer' },
  { value: 'writer', label: 'Writer' },
  { value: 'marketer', label: 'Marketer' },
  { value: 'entrepreneur', label: 'Entrepreneur' },
  { value: 'other', label: 'Other' },
];

export const PROMPT_TEMPLATES = {
  doubt: (username: string, role: string, inputText: string, style: string, description?: string) => `
As an AI assistant helping ${username} (a ${role}), please provide a ${style} answer to the following question:

Question: ${inputText}

${description ? `Additional context: ${description}` : ''}

Please ensure your response is ${style} and tailored to someone with a ${role} background.
  `.trim(),

  image_generation: (username: string, role: string, inputText: string, style: string, description?: string) => `
Create a ${style} image generation prompt based on the following request from ${username} (a ${role}):

Request: ${inputText}

${description ? `Additional requirements: ${description}` : ''}

Generate a detailed prompt that includes:
- Visual style and composition
- Lighting and atmosphere
- Color palette suggestions
- Technical specifications
- Art style references

Make it suitable for AI image generation tools and ${style} in nature.
  `.trim(),

  learning_roadmap: (username: string, role: string, inputText: string, style: string, description?: string) => `
Create a ${style} learning roadmap for ${username} (a ${role}) on the following topic:

Topic: ${inputText}

${description ? `Learning goals: ${description}` : ''}

Please provide:
- Learning objectives
- Step-by-step progression
- Recommended resources
- Time estimates
- Milestone assessments
- Practical projects

Tailor the roadmap to a ${role} background and make it ${style}.
  `.trim(),

  video_generation: (username: string, role: string, inputText: string, style: string, description?: string) => `
Develop a ${style} video concept and script for ${username} (a ${role}) based on:

Video idea: ${inputText}

${description ? `Additional requirements: ${description}` : ''}

Please include:
- Video concept overview
- Target audience
- Script outline
- Visual suggestions
- Pacing and structure
- Call-to-action

Make it engaging and ${style}, suitable for a ${role}'s perspective.
  `.trim(),

  deep_research: (username: string, role: string, inputText: string, style: string, description?: string) => `
Conduct a ${style} research analysis for ${username} (a ${role}) on:

Research topic: ${inputText}

${description ? `Research focus: ${description}` : ''}

Please provide:
- Research methodology
- Key findings and insights
- Data analysis
- Supporting evidence
- Conclusions and implications
- Further research suggestions

Present the research in a ${style} manner appropriate for a ${role}.
  `.trim(),

  idea_exploration: (username: string, role: string, inputText: string, style: string, description?: string) => `
Explore and expand on the following idea for ${username} (a ${role}):

Initial idea: ${inputText}

${description ? `Exploration direction: ${description}` : ''}

Please provide:
- Concept expansion
- Creative variations
- Implementation possibilities
- Potential challenges
- Market opportunities
- Next steps

Make the exploration ${style} and relevant to a ${role}'s perspective.
  `.trim(),
};
