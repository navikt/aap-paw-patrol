import { Box, Table } from '@navikt/ds-react';
import type { components } from 'lib/types/generated/postmottak';

type VurderingerDriftsinfo = components['schemas']['no.nav.aap.postmottak.api.drift.VurderingerDriftsinfo'];

const digitaliseringskategorier = {
  SØKNAD: 'Søknad',
  MELDEKORT: 'Meldekort',
  LEGEERKLÆRING: 'Legeerklæring',
  KLAGE: 'Klage',
  ANNET_RELEVANT_DOKUMENT: 'Annet relevant dokument',
  NY_ÅRSAK_TIL_BEHANDLING: 'Ny årsak til behandling',
  ANNEN_KATEGORI: 'Annen kategori',
} satisfies Record<NonNullable<VurderingerDriftsinfo['digitalisering']>['kategori'], string>;

const formaterBoolskVerdi = (verdi: boolean | null | undefined): string => {
  if (verdi === null || verdi === undefined) return 'Ikke vurdert';
  return verdi ? 'Ja' : 'Nei';
};

export const Vurderinger = ({ vurderinger }: { vurderinger?: VurderingerDriftsinfo | null }) => {
  const kategori = vurderinger?.digitalisering?.kategori;
  const felter = [
    { navn: 'Fordelt til', verdi: vurderinger?.fordeling?.system },
    { navn: 'Skal til AAP', verdi: formaterBoolskVerdi(vurderinger?.tema?.skalTilAap) },
    { navn: 'Tema', verdi: vurderinger?.tema?.tema },
    { navn: 'Generell sak', verdi: formaterBoolskVerdi(vurderinger?.sak?.generellSak) },
    { navn: 'Opprettet ny sak', verdi: formaterBoolskVerdi(vurderinger?.sak?.opprettetNy) },
    { navn: 'Kategori', verdi: kategori == null ? undefined : digitaliseringskategorier[kategori] },
    {
      navn: 'Digitalisert manuelt gjennom Postmottak',
      verdi: formaterBoolskVerdi(vurderinger?.digitalisering?.digitalisertManueltGjennomPostmottak),
    },
    {
      navn: 'Skal overleveres til Kelvin',
      verdi: formaterBoolskVerdi(vurderinger?.overlevering?.skalOverleveresTilKelvin),
    },
  ];

  return (
    <Box
      background="neutral-soft"
      padding="space-16"
      borderRadius="16"
      borderColor="neutral-subtle"
      borderWidth="1"
      marginBlock="space-16"
    >
      <Table size="small" aria-label="Vurderinger">
        <Table.Body>
          {felter.map(({ navn, verdi }) => (
            <Table.Row key={navn}>
              <Table.HeaderCell scope="row">{navn}</Table.HeaderCell>
              <Table.DataCell>{verdi ?? 'Ikke vurdert'}</Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Box>
  );
};
