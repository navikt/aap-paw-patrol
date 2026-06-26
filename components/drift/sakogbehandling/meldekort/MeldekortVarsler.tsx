import { Alert, Box, Heading, Table } from '@navikt/ds-react';
import { Varsel } from 'lib/types/meldekort';
import { formaterDatoMedTidspunktSekunderForFrontend, formaterPeriodeV2 } from 'lib/utils/date';

export const MeldekortVarsler = ({ varsler }: { varsler: Varsel[] }) => (
  <Box
    background="neutral-soft"
    padding="space-16"
    marginBlock="space-16"
    borderRadius="16"
    borderColor="neutral-subtle"
    borderWidth="1"
  >
    <Heading size="medium" textColor="subtle" spacing>
      Varsler ({varsler.length ?? 0})
    </Heading>

    {!varsler.length ? (
      <Alert variant="info">Ingen varsler funnet</Alert>
    ) : (
      <Table size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Varsel ID</Table.HeaderCell>
            <Table.HeaderCell scope="col">Type varsel</Table.HeaderCell>
            <Table.HeaderCell scope="col">Type varsel om</Table.HeaderCell>
            <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
            <Table.HeaderCell scope="col">Status</Table.HeaderCell>
            <Table.HeaderCell scope="col">Sendingstidspunkt</Table.HeaderCell>
            <Table.HeaderCell scope="col">Opprettet</Table.HeaderCell>
            <Table.HeaderCell scope="col">Sist endret</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {varsler.map((varsel) => (
            <Table.Row key={varsel.varselId}>
              <Table.DataCell>{varsel.varselId}</Table.DataCell>
              <Table.DataCell>{varsel.typeVarsel}</Table.DataCell>
              <Table.DataCell>{varsel.typeVarselOm}</Table.DataCell>
              <Table.DataCell>{formaterPeriodeV2(varsel.forPeriode)}</Table.DataCell>
              <Table.DataCell>{varsel.status}</Table.DataCell>
              <Table.DataCell>{formaterDatoMedTidspunktSekunderForFrontend(varsel.sendingstidspunkt)}</Table.DataCell>
              <Table.DataCell>{formaterDatoMedTidspunktSekunderForFrontend(varsel.opprettet)}</Table.DataCell>
              <Table.DataCell>{formaterDatoMedTidspunktSekunderForFrontend(varsel.sistEndret)}</Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )}
  </Box>
);
