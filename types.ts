
export enum PillarType {
  PHARMACY = 'FARMÁCIA NATURAL',
  CHRONOMETER = 'CRONÔMETRO',
  ECONOMIST = 'ECONOMISTA INTELIGENTE'
}

export interface Recipe {
  id: string;
  name: string;
  time: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  functionalAction: string;
  ingredients: string[];
  steps: string[];
  chefTip?: string;
  category: string;
  isFeatured?: boolean;
}

export interface SubCategory {
  id: string;
  name: string;
  description: string;
  recipes: Recipe[];
}

export interface Pillar {
  type: PillarType;
  description: string;
  subcategories: SubCategory[];
}
