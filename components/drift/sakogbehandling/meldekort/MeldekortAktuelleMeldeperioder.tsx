import { Alert, Box, Heading, Table } from '@navikt/ds-react';
import { AktuelleMeldeperioderDriftsinfo } from 'lib/types/meldekort';
import { formaterPeriodeV2 } from 'lib/utils/date';

export const MeldekortAktuelleMeldeperioder = ({
  aktuelleMeldeperioder,
}: {
  aktuelleMeldeperioder: AktuelleMeldeperioderDriftsinfo[];
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
      Aktuelle meldeperioder ({aktuelleMeldeperioder.length ?? 0})
    </Heading>

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
            <Table.Row key={idx}>
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
