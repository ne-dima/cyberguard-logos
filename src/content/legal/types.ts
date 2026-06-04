export interface LegalSection {
  title: string;
  paragraphs: string[];
}

export interface LegalDocument {
  title: string;
  intro?: string;
  sections: LegalSection[];
  footer?: string;
}
