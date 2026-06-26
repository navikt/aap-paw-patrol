import { Alert, Box, Heading, Table } from '@navikt/ds-react';
import { HistoriskeMeldeperioderDriftsinfo } from 'lib/types/meldekort';
import { formaterPeriodeV2 } from 'lib/utils/date';

export const MeldekortHistoriskeMeldeperioder = ({
  historiskeMeldeperioder,
}: {
  historiskeMeldeperioder: HistoriskeMeldeperioderDriftsinfo[];
}) => (
  <Box
    background="neutral-soft"
    padding="space-16"
    marginBlock="space-16"
    borderRadius="16"
    borderColor="neutral-subtle"
    borderWidth="1"
  >
    <Heading size="medium" textColor="subtle" spacing>
      Historiske meldeperioder ({historiskeMeldeperioder.length ?? 0})
    </Heading>

    {!historiskeMeldeperioder.length ? (
      <Alert variant="info">Ingen historiske meldeperioder funnet</Alert>
    ) : (
      <Table size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Meldeperiode</Table.HeaderCell>
            <Table.HeaderCell scope="col">Meldevindu</Table.HeaderCell>
            <Table.HeaderCell scope="col">Totalt antall timer</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {historiskeMeldeperioder.map((rad, idx) => (
            <Table.Row key={idx}>
              <Table.DataCell>{formaterPeriodeV2(rad.meldeperiode.meldeperioden)}</Table.DataCell>
              <Table.DataCell>{formaterPeriodeV2(rad.meldeperiode.meldevindu)}</Table.DataCell>
              <Table.DataCell>{rad.totaltAntallTimerIPerioden}</Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )}
  </Box>
);
