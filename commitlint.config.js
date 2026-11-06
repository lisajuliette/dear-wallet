/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'theme',
        'ui',
        'db',
        'items',
        'diary',
        'rewards',
        'goals',
        'recap',
        'settings',
        'lock',
        'auth',
        'sync',
        'onboarding',
        'supabase',
        'ci',
        'deps',
        'docs',
      ],
    ],
  },
};
