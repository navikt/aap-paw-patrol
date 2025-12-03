'use client';
import { useState } from 'react';
import { BodyShort, Button, Heading, HStack, TextField, VStack } from '@navikt/ds-react';
import { triggProsesserbehandlingIPostmottak } from '../../../lib/clientApi';

export const TriggProsesserBehandling = () => {
  const [behandlingsreferanse, setBehandlingsreferanse] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const onClick = async () => {
    setIsLoading(true);
    setMessage('');

    console.log('kjør-fra-steg', { behandlingsreferanse });

    try {
      const response = await triggProsesserbehandlingIPostmottak(behandlingsreferanse);
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
    <VStack gap="4" marginBlock="8">
      <Heading size="medium">Trigg prosesser behandling</Heading>
      <HStack gap="2" align="end">
        <TextField
          label="Behandlingsreferanse (UUID)"
          value={behandlingsreferanse}
          onChange={(e) => setBehandlingsreferanse(e.target.value)}
        />
        <Button onClick={onClick} loading={isLoading}>
          Sett aktivt steg
        </Button>
      </HStack>
      {message && <BodyShort>{message}</BodyShort>}
    </VStack>
  );
};
