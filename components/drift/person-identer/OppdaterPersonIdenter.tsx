'use client';
import { useState } from 'react';
import { BodyShort, Button, Heading, HStack, InfoCard, Textarea, TextField, VStack } from '@navikt/ds-react';
import { oppdaterPersonIdenter } from '../../../lib/clientApi';

export const OppdaterPersonIdenter = () => {
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

    console.log('oppdater-person-identer', { saksnummer });

    try {
      const response = await oppdaterPersonIdenter(saksnummer);
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
      <Heading size="medium">
        Tving behandlingsflyt til å hente nye personidenter fra PDL for person tilkyttet oppgitt saksnummer
      </Heading>
      <InfoCard data-color="info">
        <InfoCard.Header>
          <InfoCard.Title>Person tilknyttet sak får tilført identer fra PDL</InfoCard.Title>
        </InfoCard.Header>
        <InfoCard.Content>
          <p>
          Denne skal brukes for saker i behandlingsflyt og meldekort hvor bruker har fått ny ident. Eksempel bruker har
          gått fra d-nummer til f-nummer i folkeregisteret.
          </p><p>
          Behandlingsflyt oppdaterer sin database person med nye identer fra PDL og sender denne informasjonen
          umiddelbart videre til meldekort-backend som også oppdaterer person i egen database tilknyttet sakens
          meldekortdata.
          </p><p>
          Dette er f.eks. nyttig ved feilsituasjoner hvor bruker ikke får tilgang til meldekortene sine
          da disse er koblet til kun gammel bruker-ident i behandlingsflyt.
          </p>
        </InfoCard.Content>
      </InfoCard>
      <TextField
        label="Saksnummer i behandlingsflyt"
        value={saksnummer}
        onChange={(e) => setSaksnummer(e.target.value)}
      />
      <Button onClick={onClick} loading={isLoading}>
        Oppdater identer
      </Button>
      {message && <BodyShort>{message}</BodyShort>}
    </VStack>
  );
};
