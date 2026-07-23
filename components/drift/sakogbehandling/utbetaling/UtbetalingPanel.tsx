import { useEffect, useState } from 'react';
import { Alert, Box, Heading, Loader, Table } from '@navikt/ds-react';
import { hentUtbetalingstidslinje } from 'lib/clientApi';
import { UtbetalingstidslinjeDto } from 'lib/types/utbetaling';
import { formaterDatoForFrontend, formaterPeriode } from 'lib/utils/date';
import { formaterTilNok } from 'lib/utils/formatting';

export const UtbetalingPanel = ({ saksnummer }: { saksnummer: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const [resultat, setResultat] = useState<UtbetalingstidslinjeDto>();

  useEffect(() => {
    const hent = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const response = await hentUtbetalingstidslinje(saksnummer);
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

    void hent();
  }, [saksnummer]);

  if (isLoading) return <Loader />;

  if (error)
    return (
      <Alert variant="error" size="small">
        {error}
      </Alert>
    );

  if (!resultat?.utbetalinger?.length)
    return <Alert variant="info">Ingen utbetalinger funnet for saksnummer {saksnummer}.</Alert>;

  return (
    <Box
      background="neutral-soft"
      padding="space-16"
      margin="space-16"
      borderRadius="16"
      borderColor="neutral-subtle"
      borderWidth="1"
    >
      <Heading size="medium" textColor="subtle" spacing>
        Utbetalinger ({resultat.utbetalinger.length})
      </Heading>

      <Table size="medium">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
            <Table.HeaderCell scope="col">Utbetalingsdato</Table.HeaderCell>
            <Table.HeaderCell scope="col">Fastsatt dagsats</Table.HeaderCell>
            <Table.HeaderCell scope="col">Beløp</Table.HeaderCell>
            <Table.HeaderCell scope="col">UtbetalingRef</Table.HeaderCell>
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
    </Box>
  );
};
