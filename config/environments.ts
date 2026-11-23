export type Environment = 'dev' | 'staging' | 'prod';

const env = (process.env.TEST_ENV as Environment) || 'dev';

interface EnvConfig {
  uiBaseURL: string;
  apiBaseURL: string;
}

const configs: Record<Environment, EnvConfig> = {
  dev:     { uiBaseURL: 'https://www.saucedemo.com',       apiBaseURL: 'https://jsonplaceholder.typicode.com' },
  staging: { uiBaseURL: 'https://www.saucedemo.com',       apiBaseURL: 'https://jsonplaceholder.typicode.com' },
  prod:    { uiBaseURL: 'https://www.saucedemo.com',       apiBaseURL: 'https://jsonplaceholder.typicode.com' },
};

export const environments: EnvConfig = configs[env];
