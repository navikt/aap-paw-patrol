'use client';
import { useState } from 'react';
import { BodyShort, Button, Heading, HStack, TextField, VStack } from '@navikt/ds-react';
import { avbrytBrev } from '../../../lib/clientApi';

export const AvbrytBrev = () => {
  const [bestillingsreferanse, setbestillingsreferanse] = useState('');
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
    
    console.log('avbryt-brev', { bestillingsreferanse });

    try {
      const response = await avbrytBrev(bestillingsreferanse);
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
      <HStack gap="space-8" align="end">
        <TextField
          label="Brevets bestillingsreferanse (UUID)"
          value={bestillingsreferanse}
          onChange={(e) => setbestillingsreferanse(e.target.value)}
        />
        <Button onClick={onClick} loading={isLoading}>
          Trigg
        </Button>
      </HStack>
      {message && <BodyShort>{message}</BodyShort>}
    </VStack>
  );
};
