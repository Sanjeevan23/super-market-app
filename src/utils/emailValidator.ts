export type EmailErrorCode =
  | ''
  | 'EMAIL_MISSING_AT'
  | 'EMAIL_LOCAL_TOO_SHORT'
  | 'EMAIL_DOMAIN_MISSING'
  | 'EMAIL_TLD_MISSING'
  | 'EMAIL_DOMAIN_INVALID'
  | 'EMAIL_TLD_INVALID'
  | 'EMAIL_FORMAT_INVALID';

export const validateEmailLive = (value: string): EmailErrorCode => {
  if (!value) return '';

  if (!value.includes('@')) return 'EMAIL_MISSING_AT';

  const [local, ...rest] = value.split('@');
  const domain = rest.join('@');

  if (!local || local.length < 2) return 'EMAIL_LOCAL_TOO_SHORT';
  if (!domain) return 'EMAIL_DOMAIN_MISSING';
  if (!domain.includes('.')) return 'EMAIL_TLD_MISSING';

  const parts = domain.split('.');
  if (parts.some(p => p.length === 0)) return 'EMAIL_DOMAIN_INVALID';

  const tld = parts[parts.length - 1];
  if (tld.length < 2) return 'EMAIL_TLD_INVALID';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'EMAIL_FORMAT_INVALID';
  }

  return '';
};
