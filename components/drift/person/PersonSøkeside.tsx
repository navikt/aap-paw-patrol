'use client';

import { Alert, Box, Button, Heading, Link, Table, TextField, VStack } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { Periode } from 'lib/types/felles';
import { formaterPeriodeV2 } from 'lib/utils/date';
import { StorageKey } from 'lib/keys';

interface PersonSøkDriftsinfoDto {
  saker: {
    saksnummer: string;
    rettighetsperiode: Periode;
  }[];
}

export const PersonSøkeside = () => {
  const [ident, setIdent] = useState('');
  const [result, setResult] = useState<PersonSøkDriftsinfoDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const lagretIdent = sessionStorage.getItem(StorageKey.PersonSøkIdent);
    if (lagretIdent) {
      sessionStorage.removeItem(StorageKey.PersonSøkIdent);
      setIdent(lagretIdent);
      hentDataForIdent(lagretIdent);
    }
  }, []);

  const hentDataForIdent = async (ident: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/drift/person', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ident }),
      });

      if (!res.ok) {
        const melding = await res.text();
        setError(melding || `Feil ved henting av saker (${res.status})`);
        return;
      }

      setResult(await res.json());
    } catch {
      setError('Ukjent feil ved henting av saker');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    hentDataForIdent(ident);
  };

  return (
    <VStack gap="space-16" marginBlock="space-32" justify="center">
      <Heading size="medium">Hent persondata</Heading>

      <Alert variant="info" inline>
        Henter saker tilknyttet oppgitt person.
      </Alert>

      <form onSubmit={handleSubmit}>
        <VStack gap="space-12">
          <TextField
            label="Ident"
            value={ident}
            onChange={(e) => setIdent(e.target.value.trim())}
            htmlSize={40}
            error={ident && ident.length < 11 ? 'Ident må bestå av 11 siffer' : undefined}
          />
          <div>
            <Button icon={<MagnifyingGlassIcon />} disabled={ident.length !== 11} loading={isLoading}>
              Søk
            </Button>
          </div>
        </VStack>
      </form>

      {error && <p style={{ color: 'var(--a-text-danger)' }}>{error}</p>}

      {result !== null &&
        (result.saker.length === 0 ? (
          <p>Ingen saker funnet for oppgitt ident.</p>
        ) : (
          <Box
            background="neutral-soft"
            borderColor="neutral-subtle"
            borderWidth="1"
            borderRadius="8"
            padding="space-16"
          >
            <Heading size="small" spacing>
              Saker
            </Heading>
            <Table size="small">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Saksnummer</Table.HeaderCell>
                  <Table.HeaderCell>Rettighetsperiode</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {result.saker.map((sak) => (
                  <Table.Row key={sak.saksnummer}>
                    <Table.DataCell>
                      <Link href={`/drift/sak/${sak.saksnummer}`}>{sak.saksnummer}</Link>
                    </Table.DataCell>
                    <Table.DataCell>{formaterPeriodeV2(sak.rettighetsperiode)}</Table.DataCell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Box>
        ))}
    </VStack>
  );
};
