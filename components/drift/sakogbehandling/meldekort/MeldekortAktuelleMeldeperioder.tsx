import { Alert, Box, Button, Heading, HStack, Table } from '@navikt/ds-react';
import { AktuelleMeldeperioderDriftsinfo } from 'lib/types/meldekort';
import { formaterPeriodeV2 } from 'lib/utils/date';
import { oppdaterMeldeperioder } from 'lib/clientApi';
import { useState } from 'react';

export const MeldekortAktuelleMeldeperioder = ({
  saksnummer,
  aktuelleMeldeperioder,
}: {
  saksnummer: string;
  aktuelleMeldeperioder: AktuelleMeldeperioderDriftsinfo[];
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{ success: boolean; message: string }>();

  const oppdater = async () => {
    setIsLoading(true);
    setResult(undefined);

    try {
      const response = await oppdaterMeldeperioder(saksnummer);
      setResult({ success: response.ok, message: await response.text() });
    } catch (err) {
      console.log(err);
      setResult({ success: false, message: 'Noe gikk galt' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      background="neutral-soft"
      padding="space-16"
      marginBlock="space-16"
      borderRadius="16"
      borderColor="neutral-subtle"
      borderWidth="1"
    >
      <Heading size="medium" textColor="subtle" spacing>
        <HStack justify="space-between">
          <span>Aktuelle meldeperioder ({aktuelleMeldeperioder.length ?? 0})</span>
          <Button size="small" onClick={oppdater} loading={isLoading}>
            Oppdater meldeperioder
          </Button>
        </HStack>
      </Heading>

      {result?.success === true && <Alert variant="info">{result.message}</Alert>}
      {result?.success === false && <Alert variant="error">{result.message}</Alert>}

      {!aktuelleMeldeperioder.length ? (
        <Alert variant="info">Ingen aktuelle meldeperioder funnet</Alert>
      ) : (
        <Table size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">Ubesvarte meldeperioder</Table.HeaderCell>
              <Table.HeaderCell scope="col">Mangler opplysninger (periode)</Table.HeaderCell>
              <Table.HeaderCell scope="col">Neste meldeperiode</Table.HeaderCell>
              <Table.HeaderCell scope="col">Neste meldevindu</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {aktuelleMeldeperioder.map((rad, idx) => (
              <Table.Row
                key={idx}
                style={{
                  backgroundColor: rad.nesteMeldeperiode?.meldevindu?.fom ? 'var(--ax-bg-neutral-soft)' : 'inherit',
                }}
              >
                <Table.DataCell>{rad.antallUbesvarteMeldeperioder}</Table.DataCell>
                <Table.DataCell>
                  {rad.manglerOpplysninger ? formaterPeriodeV2(rad.manglerOpplysninger) : '–'}
                </Table.DataCell>
                <Table.DataCell>
                  {rad.nesteMeldeperiode ? formaterPeriodeV2(rad.nesteMeldeperiode.meldeperioden) : '–'}
                </Table.DataCell>
                <Table.DataCell>
                  {rad.nesteMeldeperiode ? formaterPeriodeV2(rad.nesteMeldeperiode.meldevindu) : '–'}
                </Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Box>
  );
};
