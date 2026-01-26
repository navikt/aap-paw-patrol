'use client';

import { Alert, BodyShort, Button, Heading, HStack, Loader, Table, TextField, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { Behandler } from 'lib/types';

export const Behandleroppslag = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(undefined);
  const [result, setResult] = useState<Behandler[]>([]);

  const [request, setRequest] = useState({ saksnummer: '', fritekst: '' });

  const søkEtterBehandler = async () => {
    if (!request.saksnummer) return setError('Saksnummer må fylles ut.');
    if (!request.fritekst) return setError('Fritekst må fylles ut.');

    setIsLoading(true);
    fetch('/api/drift/behandleroppslag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ saksnummer: request.saksnummer, fritekst: request.fritekst }),
    })
      .then(async (res) => {
        if (!res.ok) {
          setError(`${res.status} ${res.statusText}: ${await res.text()}`);
        } else {
          setResult(await res.json());
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <VStack gap="space-8" marginBlock="space-32">
        <Heading size={'large'}>Behandleroppslag</Heading>

        <BodyShort>
          Søk etter behandler via dokumentinnhenting. Gjør det enklere å debugge feil knyttet til behandleropplysninger.
        </BodyShort>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            søkEtterBehandler();
          }}
        >
          <HStack gap="space-8" align="end">
            <TextField
              label="Saksnummer"
              value={request.saksnummer}
              onChange={(e) => setRequest({ ...request, saksnummer: e.target.value })}
            />
            <TextField
              label="Fritekst"
              value={request.fritekst}
              onChange={(e) => setRequest({ ...request, fritekst: e.target.value })}
            />
            <Button>Søk</Button>
          </HStack>
        </form>

        {error && <Alert variant="error">{error}</Alert>}
      </VStack>
      {isLoading ? (
        <Loader />
      ) : (
        <Table size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Behandlernavn</Table.HeaderCell>
              <Table.HeaderCell>Kontor</Table.HeaderCell>
              <Table.HeaderCell>Behandlerref</Table.HeaderCell>
              <Table.HeaderCell>HPR-nr</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {result?.map((behandler) => (
              <Table.Row key={behandler.behandlerRef}>
                <Table.DataCell>
                  {behandler.fornavn} {behandler.mellomnavn || ''} {behandler.etternavn}
                </Table.DataCell>
                <Table.DataCell>{behandler.kontor}</Table.DataCell>
                <Table.DataCell>{behandler.behandlerRef}</Table.DataCell>
                <Table.DataCell>{behandler.hprId}</Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </>
  );
};
