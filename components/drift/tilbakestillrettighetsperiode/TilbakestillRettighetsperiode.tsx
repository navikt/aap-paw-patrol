'use client';

import { useState } from 'react';
import { BodyShort, Button, Heading, TextField, VStack } from '@navikt/ds-react';
import { tilbakestillRettighetsperiodeForTrukketSak } from 'lib/clientApi';
import { formaterPeriode } from 'lib/utils/date';

export const TilbakestillRettighetsperiode = () => {
  const [saksnummer, setSaksnummer] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const onClick = async () => {
    setIsLoading(true);
    setMessage('');

    if (!saksnummer) {
      setMessage('Saksnummer må fylles ut');
      setIsLoading(false);
      return;
    }


    try {
      const response = await tilbakestillRettighetsperiodeForTrukketSak(saksnummer);
      if (response.ok) {
        const periode = await response.json();
        setMessage(`Ny rettighetsperiode: ${formaterPeriode(periode)}`);
      } else {
        setMessage(await response.text());
      }
    } catch (err) {
      console.log(err);
      setMessage('Noe gikk galt');
    }
    setIsLoading(false);
  };

  return (
    <VStack gap="space-16" marginBlock="space-32">
      <Heading size="medium">Tilbakestill rettighetsperiode for trukket sak</Heading>

      <TextField
        label="Saksnummer i behandlingsflyt"
        value={saksnummer}
        onChange={(e) => setSaksnummer(e.target.value)}
      />

      <Button onClick={onClick} loading={isLoading}>
        Oppdater
      </Button>
      {message && <BodyShort>{message}</BodyShort>}
    </VStack>
  );
};
