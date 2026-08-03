import { getToken, validateAzureToken } from '@navikt/oasis';
import { redirect } from 'next/navigation';
import { isLocal } from '@navikt/aap-felles-utils';

export async function validerToken(token: string) {
  const validationResult = await validateAzureToken(token);
  if (!validationResult.ok) {
    throw new Error(`Klarte ikke å validere token: ${validationResult.error.message}`);
  }
  return validationResult.payload;
}

const lokalFakeAccessToken = isLocal();
export function getAccessTokenOrRedirectToLogin(headers: Headers): string {
  if (lokalFakeAccessToken) return 'fake-token';

  const redirectPath = headers.get('x-path');
  const token = getToken(headers);
  if (!token) {
    redirect(`/oauth2/login?redirect=${redirectPath}`);
  }

  return token;
}
