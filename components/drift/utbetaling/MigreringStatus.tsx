'use client';

import { Alert, Heading, HGrid, Loader, VStack } from '@navikt/ds-react';
import { hentMigreringsStatus } from 'lib/clientApi';
import { MigreringsStatusDto } from 'lib/types/utbetaling';
import { useEffect, useState } from 'react';

export const MigreringStatus = () => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [resultat, setResultat] = useState<MigreringsStatusDto>();

  useEffect(() => {
    const hentStatus = async () => {
      setError(undefined);
      try {
        const response = await hentMigreringsStatus();
        if (!response.ok) {
          setResultat(undefined);
          setError(await response.text());
        } else {
          setResultat(await response.json());
        }
      } catch (err) {
        setResultat(undefined);
        setError(`Noe gikk galt: ${String(err)}`);
      } finally {
        setIsLoading(false);
      }
    };

    void hentStatus();
  }, []);

  return (
    <VStack gap="space-16" marginBlock="space-32">
      <Heading size="large">Migreringsstatus — nytt utbetalingsgrensesnitt</Heading>

      {isLoading && <Loader />}

      {error && (
        <Alert variant="error" size="small">
          {error}
        </Alert>
      )}

      {resultat && (
        <HGrid columns={{ xs: 1, sm: 2 }} gap="space-16">
          <TallKort tittel="Gammelt API" antall={resultat.antallGammeltApi} />
          <TallKort tittel="Nytt API" antall={resultat.antallNyttApi} />
        </HGrid>
      )}
    </VStack>
  );
};

const TallKort = ({ tittel, antall }: { tittel: string; antall: number }) => (
  <VStack
    gap="space-4"
    padding="space-16"
    style={{ background: 'var(--ax-bg-neutral-soft)', borderRadius: '8px' }}
  >
    <Heading size="small">{tittel}</Heading>
    <Heading size="xlarge">{antall}</Heading>
  </VStack>
);
