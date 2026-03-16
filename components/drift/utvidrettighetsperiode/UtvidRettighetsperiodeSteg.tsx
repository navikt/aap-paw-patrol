'use client';
import { useEffect, useState } from 'react';
import { Alert, Button, Heading, TextField, VStack } from '@navikt/ds-react';
import { utvidRettighetsperiodeOgKjørFraStart } from 'lib/clientApi';

export const UtvidRettighetsperiodeSteg = () => {
  const [behandlingsreferanse, setBehandlingsreferanse] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    if (behandlingsreferanse) {
      setError(undefined);
    }
  }, [behandlingsreferanse]);

  const onClick = async () => {
    setMessage(undefined);
    setError(undefined);

    if (!behandlingsreferanse) {
      setError('Behandlingsreferanse må fylles ut');
      return;
    }

    setIsLoading(true);
    console.log('utvid-rettighetsperiode-manuelt', { behandlingsreferanse });

    try {
      await utvidRettighetsperiodeOgKjørFraStart(behandlingsreferanse).then(async (res) => {
        if (res.ok) setMessage('ok 👍');
        else setError(await res.text());
      });
    } catch (err) {
      console.log(err);
      setError(`Noe gikk galt: ${err}`);
    }
    setIsLoading(false);
  };

  return (
    <VStack gap="space-16" marginBlock="space-32">
      <Heading size="medium">Utvid rettighetsperiode og kjør fra start for åpen behandling</Heading>
      <TextField
        label="Behandlingsreferanse (UUID)"
        value={behandlingsreferanse}
        onChange={(e) => setBehandlingsreferanse(e.target.value)}
      />

      <div>
        <Button onClick={onClick} loading={isLoading}>
          Utvid rettighetsperiode
        </Button>
      </div>

      {message && <Alert variant="info">{message}</Alert>}
      {error && <Alert variant="error">{error}</Alert>}
    </VStack>
  );
};
