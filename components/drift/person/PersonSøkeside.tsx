'use client';

import { Alert, Box, Button, Heading, Link, Table, TextField, VStack } from '@navikt/ds-react';
import { useCallback, useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { Periode } from 'lib/types/felles';
import { formaterPeriodeV2 } from 'lib/utils/date';
import { StorageKey } from 'lib/keys';
import { hentJournalposterForPerson } from 'lib/clientApi';
import { InnkommendeJournalpostDto } from 'lib/types/postmottak';

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

  const [journalposter, setJournalposter] = useState<InnkommendeJournalpostDto[] | null>(null);
  const [isLoadingJournalposter, setIsLoadingJournalposter] = useState(false);
  const [journalposterError, setJournalposterError] = useState<string | null>(null);

  const hentDataForIdent = useCallback(async (ident: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    setIsLoadingJournalposter(true);
    setJournalposterError(null);
    setJournalposter(null);

    const [sakerRes, journalposterRes] = await Promise.allSettled([
      fetch('/api/drift/person', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ident }),
      }),
      hentJournalposterForPerson(ident),
    ]);

    if (sakerRes.status === 'fulfilled') {
      const res = sakerRes.value;
      if (res.ok) {
        setResult(await res.json());
      } else {
        const melding = await res.text();
        setError(melding || `Feil ved henting av saker (${res.status})`);
      }
    } else {
      setError('Ukjent feil ved henting av saker');
    }
    setIsLoading(false);

    if (journalposterRes.status === 'fulfilled') {
      const res = journalposterRes.value;
      if (res.ok) {
        const data = await res.json();
        setJournalposter(data.journalposter);
      } else {
        const melding = await res.text();
        setJournalposterError(melding || `Feil ved henting av journalposter (${res.status})`);
      }
    } else {
      setJournalposterError('Ukjent feil ved henting av journalposter');
    }
    setIsLoadingJournalposter(false);
  }, []);

  useEffect(() => {
    const lagretIdent = sessionStorage.getItem(StorageKey.PersonSøkIdent);
    if (lagretIdent) {
      sessionStorage.removeItem(StorageKey.PersonSøkIdent);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIdent(lagretIdent);
      hentDataForIdent(lagretIdent);
    }
  }, [hentDataForIdent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    hentDataForIdent(ident);
  };

  return (
    <VStack gap="space-16" marginBlock="space-32" justify="center">
      <Heading size="medium">Hent persondata</Heading>

      <Alert variant="info" inline>
        Henter saker og journalposter tilknyttet oppgitt person.
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
            <Button
              icon={<MagnifyingGlassIcon />}
              disabled={ident.length !== 11}
              loading={isLoading || isLoadingJournalposter}
            >
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

      {journalposterError && <p style={{ color: 'var(--a-text-danger)' }}>{journalposterError}</p>}

      {journalposter !== null &&
        (journalposter.length === 0 ? (
          <p>Ingen journalposter funnet for oppgitt ident.</p>
        ) : (
          <Box
            background="neutral-soft"
            borderColor="neutral-subtle"
            borderWidth="1"
            borderRadius="8"
            padding="space-16"
          >
            <Heading size="small" spacing>
              Journalposter
            </Heading>
            <Table size="small">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>JournalpostId</Table.HeaderCell>
                  <Table.HeaderCell>Brevkode</Table.HeaderCell>
                  <Table.HeaderCell>Enhet</Table.HeaderCell>
                  <Table.HeaderCell>Fordelt til</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Årsak til status</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {journalposter.map((jp) => (
                  <Table.Row key={jp.journalpostId}>
                    <Table.DataCell>
                      <Link href={`/drift/postmottak/${jp.journalpostId}`}>{jp.journalpostId}</Link>
                    </Table.DataCell>
                    <Table.DataCell>{jp.brevkode ?? '-'}</Table.DataCell>
                    <Table.DataCell>{jp.enhet?.enhetNr ?? '-'}</Table.DataCell>
                    <Table.DataCell>{jp.regelresultat?.systemNavn ?? '-'}</Table.DataCell>
                    <Table.DataCell>{jp.status}</Table.DataCell>
                    <Table.DataCell>{jp.årsakTilStatus ?? '-'}</Table.DataCell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Box>
        ))}
    </VStack>
  );
};
