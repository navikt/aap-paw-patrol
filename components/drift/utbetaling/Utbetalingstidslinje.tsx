'use client';

import { Alert, Heading, Loader, Search, Table, VStack } from '@navikt/ds-react';
import { hentUtbetalingstidslinje } from 'lib/clientApi';
import { UtbetalingstidslinjeDto } from 'lib/types/utbetaling';
import { useState } from 'react';
import { formaterDatoForFrontend, formaterPeriode } from 'lib/utils/date';
import { formaterTilNok } from 'lib/utils/formatting';

export const Utbetalingstidslinje = () => {
  const [saksnummer, setSaksnummer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [resultat, setResultat] = useState<UtbetalingstidslinjeDto>();

  const søk = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError(undefined);
    setResultat(undefined);

    try {
      const response = await hentUtbetalingstidslinje(trimmed);
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
    <VStack gap="space-16" marginBlock="space-32">
      <Heading size="large">Utbetalinger for sak</Heading>

      <Search
        label="Saksnummer"
        placeholder="Skriv inn saksnummer"
        value={saksnummer}
        onChange={setSaksnummer}
        onSearchClick={søk}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            void søk(saksnummer);
          }
        }}
      />

      {isLoading && <Loader />}

      {error && (
        <Alert variant="error" size="small">
          {error}
        </Alert>
      )}

      {resultat && resultat.utbetalinger.length === 0 && (
        <Alert variant="info" size="small">
          Ingen utbetalinger funnet for saksnummer {saksnummer}.
        </Alert>
      )}

      {resultat && resultat.utbetalinger.length > 0 && (
        <Table size="medium">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Periode</Table.HeaderCell>
              <Table.HeaderCell>Utbetalingsdato</Table.HeaderCell>
              <Table.HeaderCell>Fastsatt dagsats</Table.HeaderCell>
              <Table.HeaderCell>Beløp</Table.HeaderCell>
              <Table.HeaderCell>UtbetalingRef</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {resultat.utbetalinger.map((utbetaling) => (
              <Table.Row key={utbetaling.utbetalingRef}>
                <Table.DataCell textSize="small">{formaterPeriode(utbetaling.fom, utbetaling.tom)}</Table.DataCell>
                <Table.DataCell textSize="small">{formaterDatoForFrontend(utbetaling.utbetalingsdato)}</Table.DataCell>
                <Table.DataCell textSize="small">{formaterTilNok(utbetaling.fastsattDagsats)}</Table.DataCell>
                <Table.DataCell textSize="small">{formaterTilNok(utbetaling.beløp)}</Table.DataCell>
                <Table.DataCell textSize="small">{utbetaling.utbetalingRef}</Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </VStack>
  );
};
