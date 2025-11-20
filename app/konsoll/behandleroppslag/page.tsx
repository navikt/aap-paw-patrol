'use client';

import { BodyShort, Button, Heading, Page, TextField, VStack } from '@navikt/ds-react';
import { useState } from 'react';

const OppslagPage = () => {
  const [result, setResult] = useState<any>(undefined);

  const [request, setRequest] = useState({ saksnummer: '', fritekst: '' });

  const søkEtterBehandler = async () => {
    fetch('/api/konsoll/behandleroppslag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ saksnummer: request.saksnummer, fritekst: request.fritekst }),
    })
      .then((res) => res.json())
      .then((json) => setResult(json))
      .catch((err) => {
        console.error(err);
        setResult(err);
      });
  };

  return (
    <Page>
      <Page.Block width="lg">
        <VStack gap="2">
          <Heading size={'large'}>Behandleroppslag</Heading>

          <BodyShort>
            Søk etter behandler via dokumentinnhenting. Gjør det enklere å debugge feil knyttet til
            behandleropplysninger.
          </BodyShort>

          <div>
            <TextField
              label="Saksnummer"
              value={request.saksnummer}
              onChange={(e) => setRequest({ ...request, saksnummer: e.target.value })}
            />
          </div>
          <TextField
            label="Fritekst"
            value={request.fritekst}
            onChange={(e) => setRequest({ ...request, fritekst: e.target.value })}
          />

          <Button onClick={søkEtterBehandler}>Søk</Button>
        </VStack>

        {JSON.stringify(result, null, 2)}
      </Page.Block>
    </Page>
  );
};

export default OppslagPage;
