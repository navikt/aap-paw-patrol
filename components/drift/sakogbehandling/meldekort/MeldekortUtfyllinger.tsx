import { useState } from 'react';
import { Alert, Box, Heading, Table } from '@navikt/ds-react';
import type { SortState } from '@navikt/ds-react';
import type { UtfyllingDriftsinfo } from 'lib/types/meldekort';
import { formaterDatoMedTidspunktSekunderForFrontend, formaterPeriode } from 'lib/utils/date';

export const MeldekortUtfyllinger = ({ utfyllinger }: { utfyllinger: UtfyllingDriftsinfo[] }) => {
  const [sort, setSort] = useState<SortState | undefined>({ orderBy: 'sistEndret', direction: 'descending' });

  const handleSortChange = (sortKey: string) => {
    setSort((currentSort) => ({
      orderBy: sortKey,
      direction: currentSort?.orderBy === sortKey && currentSort.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  };

  const sorterteUtfyllinger = [...utfyllinger].sort((a, b) => {
    const sammenligning = Date.parse(a.sistEndret) - Date.parse(b.sistEndret);
    return sort?.direction === 'descending' ? -sammenligning : sammenligning;
  });

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
        Utfyllinger ({utfyllinger.length ?? 0})
      </Heading>

      {!utfyllinger.length ? (
        <Alert variant="info">Ingen utfyllinger funnet</Alert>
      ) : (
        <Table size="small" sort={sort} onSortChange={handleSortChange}>
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
              <Table.ColumnHeader sortKey="sistEndret" sortable>
                Sist endret
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sorterteUtfyllinger.map((utfylling) => (
              <Table.Row key={utfylling.referanse}>
                <Table.DataCell>{utfylling.referanse}</Table.DataCell>
                <Table.DataCell>{utfylling.fagsak.system}</Table.DataCell>
                <Table.DataCell>{utfylling.fagsak.nummer.asString}</Table.DataCell>
                <Table.DataCell>{formaterPeriode(utfylling.periode)}</Table.DataCell>
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
};
