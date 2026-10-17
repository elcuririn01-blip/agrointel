export type SkillCategory = string;

export interface CategoryInfo {
  id: string;
  code?: string;
  label: string;
  shortDescription: string;
  iconName: string;
  color?: string;
  count?: number;
}

export type SkillFieldType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'select' 
  | 'date' 
  | 'checkbox' 
  | 'multiselect';

export interface SkillFieldOption {
  label: string;
  value: string;
}

export interface SkillField {
  id: string;
  label: string;
  type: SkillFieldType;
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  unit?: string;
  options?: SkillFieldOption[];
  helperText?: string;
  gridSpan?: 'full' | 'half' | 'third';
  section?: string;
}

export interface Skill {
  id: string;
  code?: string;
  name: string;
  slug: string;
  category: string;
  categoryLabel: string;
  documentType?: string;
  summary: string;
  description: string;
  iconName: string;
  estimatedMinutes: number;
  technicalRole: string;
  tags: string[];
  knowledge?: string[];
  context?: string[];
  briefingQuestions?: { k: string; p: string }[];
  diagnostics?: string[];
  nonPresumptions?: string[];
  requiredDocs?: string[];
  outputStructure?: string[];
  checklist?: string[];
  alerts?: string[];
  commands?: string[];
  exampleInput?: string;
  exampleOutput?: string;
  fields: SkillField[];
  defaultExample: Record<string, any>;
  promptTemplate?: (inputs: Record<string, any>, settings: UserSettings) => string;
}

export interface Agent {
  id: string;
  code?: string;
  name: string;
  slug: string;
  group?: string;
  cropOrFocus: string;
  role: string;
  summary: string;
  description: string;
  knowledge?: string[];
  capabilities: string[];
  questions?: { k: string; p: string }[];
  responseFormat?: string[];
  constraints?: string[];
  systemInstructions: string;
  recommendedPrompts: {
    title: string;
    description: string;
    prefillPrompt: string;
  }[];
  exampleInput?: string;
  exampleOutput?: string;
  iconName: string;
}

export interface HistoryEntry {
  id: string;
  skillId: string;
  skillName: string;
  category: string;
  categoryLabel: string;
  timestamp: string;
  inputs: Record<string, any>;
  generatedPrompt: string;
  targetModel: 'claude' | 'gemini' | 'chatgpt';
  summaryLabel: string;
}

export interface UserSettings {
  agronomistName: string;
  creaNumber: string;
  companyName: string;
  defaultRegion: string;
  defaultModel: 'claude' | 'gemini' | 'chatgpt';
  includeDisclaimer: boolean;
}

export interface NoteEntry {
  id: string;
  title: string;
  content: string;
  category?: string;
  farmOrClient?: string;
  culture?: string;
  createdAt: string;
  updatedAt: string;
  sourceSkillId?: string;
  sourceSkillName?: string;
  tags?: string[];
}
