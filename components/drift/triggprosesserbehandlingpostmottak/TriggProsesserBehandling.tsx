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

    console.log('trigg-behandling:', { behandlingsreferanse });

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
    <VStack gap="space-16" marginBlock="space-32">
      <Heading size="medium">Trigg prosesser behandling</Heading>
      <HStack gap="space-8" align="end">
        <TextField
          label="Behandlingsreferanse (UUID)"
          value={behandlingsreferanse}
          onChange={(e) => setBehandlingsreferanse(e.target.value)}
        />
        <Button onClick={onClick} loading={isLoading}>
          Trigg
        </Button>
      </HStack>
      {message && <BodyShort>{message}</BodyShort>}
    </VStack>
  );
};
