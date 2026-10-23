export interface CreatorConfig {
  name: string;
  shortName: string;
  handle: string;
  domain: string;
  url: string;
  location: string;
  year: string;
  role: string;
  tagline: string;
}

export const defaultCreatorConfig: CreatorConfig = {
  name: 'A.Gure',
  shortName: 'AGURE',
  handle: '@agure',
  domain: 'agure.space',
  url: 'https://agure.space',
  location: 'OSLO, NORWAY',
  year: '2026',
  role: 'CREATIVE TECHNOLOGIST',
  tagline: 'Handcrafted digital artifacts & bespoke web builds',
};
