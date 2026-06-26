import { Alert, Box, Heading, Table } from '@navikt/ds-react';
import { UtfyllingDriftsinfo } from 'lib/types/meldekort';
import { formaterDatoMedTidspunktSekunderForFrontend, formaterPeriodeV2 } from 'lib/utils/date';

export const MeldekortUtfyllinger = ({ utfyllinger }: { utfyllinger: UtfyllingDriftsinfo[] }) => (
  <Box
    background="neutral-soft"
    padding="space-16"
    marginBlock="space-16"
    borderRadius="16"
    borderColor="neutral-subtle"
    borderWidth="1"
  >
    <Heading size="medium" textColor="subtle" spacing>
      Utfyllinger ({utfyllinger.length ?? 0})
    </Heading>

    {!utfyllinger.length ? (
      <Alert variant="info">Ingen utfyllinger funnet</Alert>
    ) : (
      <Table size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Referanse</Table.HeaderCell>
            <Table.HeaderCell scope="col">Fagsystem</Table.HeaderCell>
            <Table.HeaderCell scope="col">Saksnummer</Table.HeaderCell>
            <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
            <Table.HeaderCell scope="col">Flyt</Table.HeaderCell>
            <Table.HeaderCell scope="col">Aktivt steg</Table.HeaderCell>
            <Table.HeaderCell scope="col">Digitalisert</Table.HeaderCell>
            <Table.HeaderCell scope="col">Opprettet</Table.HeaderCell>
            <Table.HeaderCell scope="col">Sist endret</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {utfyllinger.map((utfylling) => (
            <Table.Row key={utfylling.referanse}>
              <Table.DataCell>{utfylling.referanse}</Table.DataCell>
              <Table.DataCell>{utfylling.fagsak.system}</Table.DataCell>
              <Table.DataCell>{utfylling.fagsak.nummer.asString}</Table.DataCell>
              <Table.DataCell>{formaterPeriodeV2(utfylling.periode)}</Table.DataCell>
              <Table.DataCell>{utfylling.flyt}</Table.DataCell>
              <Table.DataCell>{utfylling.aktivtSteg}</Table.DataCell>
              <Table.DataCell>
                {utfylling.erDigitalisert === null ? '-' : utfylling.erDigitalisert ? 'Ja' : 'Nei'}
              </Table.DataCell>
              <Table.DataCell>{formaterDatoMedTidspunktSekunderForFrontend(utfylling.opprettet)}</Table.DataCell>
              <Table.DataCell>{formaterDatoMedTidspunktSekunderForFrontend(utfylling.sistEndret)}</Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )}
  </Box>
);
