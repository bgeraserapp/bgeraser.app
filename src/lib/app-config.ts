import { env } from '@/env';

const AppConfig = {
  name: 'AI Background Remover',
  title: 'AI Background Remover - Remove Backgrounds Instantly',
  descriptions:
    'AI Background Remover is an AI-powered background remover that helps you effortlessly remove backgrounds from images. Perfect for professionals and creatives looking to save time and enhance their workflow.',
  tagline: 'Remove Backgrounds. Enhance Creativity. Save Time.',
  version: '1.0.0',
  contact: {
    email: 'me@sumantakabiraj.com',
    phone: '+91 (000) 000-0000',
    address: 'Kolkata, India',
  },
  social: {
    twitter: 'https://x.com/infysumanta',
    linkedin: 'https://www.linkedin.com/in/sumanta-kabiraj/',
    github: 'https://github.com/infysumanta',
  },
  company: {
    name: 'Sreemor',
    founded: '2025',
    location: 'Kolkata, India',
  },
  api: {
    baseUrl:
      typeof window !== 'undefined'
        ? window.location.origin
        : env.NEXT_PUBLIC_HOME_URL || 'https://bgeraser.app',
  },
};

export default AppConfig;
