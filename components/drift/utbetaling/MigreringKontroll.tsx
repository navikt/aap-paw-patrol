'use client';

import { Alert, Button, Heading, Switch, Table, TextField, VStack } from '@navikt/ds-react';
import { startMigreringAntall, startMigreringEnkeltSak } from 'lib/clientApi';
import { MigreringsresultatDto } from 'lib/types/utbetaling';
import { useState } from 'react';

export const MigreringKontroll = () => {
  const [dryRun, setDryRun] = useState(true);

  return (
    <VStack gap="space-16" marginBlock="space-32">
      <Heading size="large">Migrer saker — nytt utbetalingsgrensesnitt</Heading>

      <VStack gap="space-8">
        <Switch checked={dryRun} onChange={(e) => setDryRun(e.target.checked)}>
          Tørrkjør (dry run)
        </Switch>
        {!dryRun && (
          <Alert variant="warning" size="small">
            OBS: Endringer vil lagres! Deaktiver kun hvis du er sikker på at migreringen skal gjennomføres.
          </Alert>
        )}
      </VStack>

      <MigrerBatch dryRun={dryRun} />
      <MigrerEnkeltSak dryRun={dryRun} />
    </VStack>
  );
};

const MigrerBatch = ({ dryRun }: { dryRun: boolean }) => {
  const [antall, setAntall] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [resultat, setResultat] = useState<MigreringsresultatDto>();

  const migrer = async () => {
    const maxAntall = parseInt(antall, 10);
    if (!antall || isNaN(maxAntall) || maxAntall < 1) return;

    setIsLoading(true);
    setError(undefined);
    setResultat(undefined);

    try {
      const response = await startMigreringAntall(maxAntall, dryRun);
      if (!response.ok) {
        setError(await response.text());
      } else {
        setResultat(await response.json());
      }
    } catch (err) {
      setError(`Noe gikk galt: ${String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack gap="space-8">
      <Heading size="medium">Migrer et antall saker</Heading>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
        <TextField
          label="Maks antall saker"
          type="number"
          min={1}
          value={antall}
          onChange={(e) => setAntall(e.target.value)}
          style={{ width: '200px' }}
        />
        <Button onClick={migrer} loading={isLoading} disabled={!antall || parseInt(antall, 10) < 1}>
          Start migrering
        </Button>
      </div>

      {error && (
        <Alert variant="error" size="small">
          {error}
        </Alert>
      )}

      {resultat && <MigreringsresultatTabell resultat={resultat} />}
    </VStack>
  );
};

const MigrerEnkeltSak = ({ dryRun }: { dryRun: boolean }) => {
  const [saksnummer, setSaksnummer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [resultat, setResultat] = useState<MigreringsresultatDto>();

  const migrer = async () => {
    const trimmed = saksnummer.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError(undefined);
    setResultat(undefined);

    try {
      const response = await startMigreringEnkeltSak(trimmed, dryRun);
      if (!response.ok) {
        setError(await response.text());
      } else {
        setResultat(await response.json());
      }
    } catch (err) {
      setError(`Noe gikk galt: ${String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack gap="space-8">
      <Heading size="medium">Migrer enkelt sak</Heading>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
        <TextField
          label="Saksnummer"
          placeholder="Skriv inn saksnummer"
          value={saksnummer}
          onChange={(e) => setSaksnummer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void migrer();
          }}
          style={{ width: '200px' }}
        />
        <Button onClick={migrer} loading={isLoading} disabled={!saksnummer.trim()}>
          Migrer sak
        </Button>
      </div>

      {error && (
        <Alert variant="error" size="small">
          {error}
        </Alert>
      )}

      {resultat && <MigreringsresultatTabell resultat={resultat} />}
    </VStack>
  );
};

const MigreringsresultatTabell = ({ resultat }: { resultat: MigreringsresultatDto }) => {
  const alleRader = [
    ...resultat.migrerteSaker.map((sak) => ({ saksnummer: sak, status: 'Migrert' as const })),
    ...resultat.feiledeMigreringer.map((sak) => ({ saksnummer: sak, status: 'Feilet' as const })),
  ];

  if (alleRader.length === 0) {
    return (
      <Alert variant="info" size="small">
        Ingen saker ble prosessert.
      </Alert>
    );
  }

  return (
    <Table size="medium">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Saksnummer</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {alleRader.map((rad) => (
          <Table.Row key={rad.saksnummer}>
            <Table.DataCell textSize="small">{rad.saksnummer}</Table.DataCell>
            <Table.DataCell textSize="small">
              <span style={{ color: rad.status === 'Migrert' ? 'var(--ax-text-success)' : 'var(--ax-text-danger)' }}>
                {rad.status}
              </span>
            </Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
