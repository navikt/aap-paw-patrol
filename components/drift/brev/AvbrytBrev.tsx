'use client';
import { useState } from 'react';
import { BodyShort, Button, Heading, InfoCard, Textarea, TextField, VStack } from '@navikt/ds-react';
import { avbrytBrev } from '../../../lib/clientApi';

export const AvbrytBrev = () => {
  const [bestillingsreferanse, setbestillingsreferanse] = useState('');
  const [begrunnelse, setBegrunnelse] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const onClick = async () => {
    setIsLoading(true);
    setMessage('');

    if (!bestillingsreferanse) {
      setMessage('Bestillingsreferanse må fylles ut');
      setIsLoading(false);
      return;
    }
    if (!begrunnelse || begrunnelse.trim() === '') {
      setMessage('Begrunnelse må fylles ut');
      setIsLoading(false);
      return;
    }

    console.log('avbryt-brev', { bestillingsreferanse });

    try {
      const response = await avbrytBrev(bestillingsreferanse, begrunnelse);
      if (response.ok) {
        setMessage('ok 👍');
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
      <Heading size="medium">Avbryt bestilt brev i behandlingsflyt</Heading>
        <InfoCard data-color="info">
          <InfoCard.Header>
            <InfoCard.Title>Avklaringsbehovet blir løst</InfoCard.Title>
          </InfoCard.Header>
          <InfoCard.Content>
            Denne skal brukes for vedtaksbrev i behandlingsflyt. Åpne avklaringsbehov for <code>SKRIV_VEDTAKSBREV</code>{' '}
            blir løst, og du vil stå som løser.
          </InfoCard.Content>
        </InfoCard>
        <TextField
          label="Brevets bestillingsreferanse (UUID)"
          value={bestillingsreferanse}
          onChange={(e) => setbestillingsreferanse(e.target.value)}
        />
        <Textarea
          label="Begrunnelse for avbrytelse"
          value={begrunnelse}
          onChange={(e) => setBegrunnelse(e.target.value)}
        />
        <Button onClick={onClick} loading={isLoading}>
          Avbryt brev og fortsett prosessering
        </Button>
      {message && <BodyShort>{message}</BodyShort>}
    </VStack>
  );
};
