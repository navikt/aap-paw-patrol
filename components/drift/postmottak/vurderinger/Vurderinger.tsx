import { Box, Table } from '@navikt/ds-react';
import type { components } from 'lib/types/generated/postmottak';

type VurderingerDriftsinfo = components['schemas']['no.nav.aap.postmottak.api.drift.VurderingerDriftsinfo'];

const digitaliseringskategorier: Record<NonNullable<VurderingerDriftsinfo['digitalisering']>['kategori'], string> = {
  AKTIVITETSKORT: 'Aktivitetskort',
  ANNET_RELEVANT_DOKUMENT: 'Annet relevant dokument',
  DIALOGMELDING: 'Dialogmelding',
  FAGSYSTEMINFO_BEHOV_HENDELSE: 'Fagsysteminfo-behov hendelse',
  FORELDREPENGE_VEDTAK_HENDELSE: 'Foreldrepengevedtak hendelse',
  INSTITUSJONSOPPHOLD: 'Institusjonsopphold',
  KABAL_HENDELSE: 'Kabal hendelse',
  KLAGE: 'Klage',
  KORRIGER_SØKNADSDATO: 'Korriger søknadsdato',
  LEGEERKLÆRING: 'Legeerklæring',
  LEGEERKLÆRING_AVVIST: 'Legeerklæring avvist',
  MANUELL_REVURDERING: 'Manuell revurdering',
  MELDEKORT: 'Meldekort',
  MIGRERING_FRA_ARENA: 'Migrering fra Arena',
  NY_ÅRSAK_TIL_BEHANDLING: 'Ny årsak til behandling',
  OMGJØRING_KLAGE_REVURDERING: 'Omgjøring etter klage (revurdering)',
  OPPFØLGINGSOPPGAVE: 'Oppfølgingsoppgave',
  PDL_HENDELSE_DODSFALL_BARN: 'PDL-hendelse: dødsfall barn',
  PDL_HENDELSE_DODSFALL_BRUKER: 'PDL-hendelse: dødsfall bruker',
  PDL_HENDELSE_FOLKEREGISTERIDENT: 'PDL-hendelse: folkeregisterident',
  SYKEPENGE_VEDTAK_HENDELSE: 'Sykepengevedtak hendelse',
  SØKNAD: 'Søknad',
  TILBAKEKREVING_HENDELSE: 'Tilbakekreving hendelse',
  UFØRE_VEDTAK_HENDELSE: 'Uføre vedtak hendelse',
};

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
