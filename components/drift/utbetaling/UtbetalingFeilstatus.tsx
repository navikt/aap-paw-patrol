'use client';

import { Alert, Heading, Loader, Table, VStack } from '@navikt/ds-react';
import { hentUtbetalingStatus } from 'lib/clientApi';
import { UtbetalingInfoDto, UtbetalingStatusDto } from 'lib/types/utbetaling';
import { useEffect, useState } from 'react';

export const UtbetalingFeilstatus = () => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [resultat, setResultat] = useState<UtbetalingStatusDto>();

  useEffect(() => {
    const hentStatus = async () => {
      setError(undefined);
      try {
        const response = await hentUtbetalingStatus();
        if (!response.ok) {
          setResultat(undefined);
          setError(await response.text());
        } else {
          setResultat(await response.json());
        }
      } catch (err) {
        setResultat(undefined);
        setError(`Noe gikk galt: ${String(err)}`);
      } finally {
        setIsLoading(false);
      }
    };

    void hentStatus();
  }, []);

  return (
    <VStack gap="space-16" marginBlock="space-32">
      <Heading size="large">Status på utbetalinger</Heading>

      {isLoading && <Loader />}

      {error && (
        <Alert variant="error" size="small">
          {error}
        </Alert>
      )}

      {resultat && (
        <VStack gap="space-16">
          <StatusTabell
            tittel="Utbetalinger som mangler kvittering"
            elementer={resultat.utbetalingerSomManglerKvittering}
          />
          <StatusTabell
            tittel="Utbetalinger med feilet status"
            elementer={resultat.utbetalingerMedFeiletStatus}
          />
        </VStack>
      )}
    </VStack>
  );
};

const StatusTabell = ({ tittel, elementer }: { tittel: string; elementer: UtbetalingInfoDto[] }) => (
  <VStack gap="space-8">
    <Heading size="small">{tittel}</Heading>
    {elementer.length === 0 ? (
      <Alert variant="info" size="small">
        Ingen treff.
      </Alert>
    ) : (
      <Table size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Saksnummer</Table.HeaderCell>
            <Table.HeaderCell>Behandlingsreferanse</Table.HeaderCell>
            <Table.HeaderCell>Utbetalingref</Table.HeaderCell>
            <Table.HeaderCell>Utbetaling opprettet</Table.HeaderCell>
            <Table.HeaderCell>Utbetaling endret</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {elementer.map((element) => (
            <Table.Row key={element.utbetalingRef}>
              <Table.DataCell>{element.saksnummer}</Table.DataCell>
              <Table.DataCell>{element.behandlingsreferanse}</Table.DataCell>
              <Table.DataCell>{element.utbetalingRef}</Table.DataCell>
              <Table.DataCell>{element.utbetalingOpprettet}</Table.DataCell>
              <Table.DataCell>{element.utbetalingEndret ?? '-'}</Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )}
  </VStack>
);
