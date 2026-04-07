'use client';
import { useState } from 'react';
import { BodyShort, Button, Heading, InfoCard, List, TextField, VStack } from '@navikt/ds-react';
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
      <Heading size="medium">Oppdater identer for sak</Heading>
      <InfoCard data-color="info">
        <InfoCard.Header>
          <InfoCard.Title>Person tilknyttet sak får tilført identer fra PDL</InfoCard.Title>
        </InfoCard.Header>
        <InfoCard.Content>
          <BodyShort spacing>
            Denne funksjonaliteten kan benyttes i saker hvor bruker har fått ny ident og sak kun assosieres med
            gammel ident. Eksempelvis bruker har gått fra d-nummer til f-nummer i folkeregisteret. Ident oppdatering
            må gjøres manuelt for hver sak på en person, da meldekort har separate person-identer per sak.
          </BodyShort>
          <BodyShort spacing>
            Behandlingsflyt oppdaterer sin database person med nye identer fra PDL og sender denne informasjonen
            umiddelbart videre til aktuelle apper som også oppdaterer person i egen database tilknyttet sakens
            meldekortdata.
          </BodyShort>
          <strong>Apper som oppdateres:</strong>
          <List>
            <List.Item>api-intern</List.Item>
            <List.Item>meldekort-backend</List.Item>
          </List>
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
