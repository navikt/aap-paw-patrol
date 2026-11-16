import { BodyShort, Box, Heading, HelpText, HStack, Label, Table, Tag, VStack } from '@navikt/ds-react';
import { CheckmarkCircleFillIcon, InformationSquareFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';

import { JournalpostInfoDTO } from 'components/drift/postmottak/JournalpostOversikt.tsx';

type Fordelingsresultat = NonNullable<JournalpostInfoDTO['fordelingsresultat']>;

export const FordelingsresultatPanel = ({ fordelingsresultat }: { fordelingsresultat: Fordelingsresultat }) => (
  <Box background="neutral-soft" padding="space-16" borderRadius="16" borderColor="neutral-subtle" borderWidth="1">
    <VStack gap="space-16">
      <Heading size="small" textColor="subtle">
        Fordelingsresultat
      </Heading>

      <HStack gap="space-8" align="center">
        <Label size="small">Fordelt til:</Label>
        <Tag variant={fordelingsresultat.systemNavn === 'KELVIN' ? 'success' : 'warning'} size="medium">
          {fordelingsresultat.systemNavn ?? 'Ukjent'}
        </Tag>
      </HStack>

      <Table size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Regel</Table.HeaderCell>
            <Table.HeaderCell>
              <HStack gap="space-4">
                Forventet
                <HelpText>Hva som forventes for at en journalpost skal gå til Kelvin</HelpText>
              </HStack>
            </Table.HeaderCell>
            <Table.HeaderCell>Resultat</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.entries(fordelingsresultat.regelMap).map(([regel, resultat]) => mapRegel(regel, resultat))}
        </Table.Body>
      </Table>
    </VStack>
  </Box>
);

const mapIkon = (regel: string, resultat: boolean) => {
  switch (regel) {
    // Legger til litt omvendt logikk her for å kunne vise grønn hake når det IKKE er overstyrt til Arena.
    case 'ManueltOverstyrtTilArenaRegel':
      return !resultat ? (
        <CheckmarkCircleFillIcon
          style={{ color: 'var(--ax-text-success-decoration)' }}
          title={`Resultat = ${resultat}`}
        />
      ) : (
        <XMarkOctagonFillIcon style={{ color: 'var(--ax-text-danger-decoration)' }} title={`Resultat = ${resultat}`} />
      );
    // Disse brukes primært til logging og påvirker ikke resultatet. Viser derfor bare et info-ikon.
    case 'KelvinSakRegel':
    case 'ArenaSakRegel':
      return (
        <InformationSquareFillIcon
          style={{ color: 'var(--ax-text-info-decoration)' }}
          title={`Resultat = ${resultat}`}
        />
      );
    default:
      return resultat ? (
        <CheckmarkCircleFillIcon
          style={{ color: 'var(--ax-text-success-decoration)' }}
          title={`Resultat = ${resultat}`}
        />
      ) : (
        <XMarkOctagonFillIcon style={{ color: 'var(--ax-text-danger-decoration)' }} title={`Resultat = ${resultat}`} />
      );
  }
};

const mapRegelForventet = (regel: string): string => {
  switch (regel) {
    case 'ManueltOverstyrtTilArenaRegel':
      return 'Ikke overstyrt til Arena';
    case 'ArenaHistorikkRegel':
      return 'Ingen signifikant Arena-historikk';
    case 'Aldersregel':
      return '≥ 18 år';
    case 'ArenaSakRegel':
      return 'Kun logging - uten betydning';
    case 'ErIkkeAnkeRegel':
      return 'Ikke anke';
    case 'ErIkkeReisestønadRegel':
      return 'Ikke reisestønad';
    case 'KelvinSakRegel':
      return 'Har Kelvin-sak (fast-track)';
    case 'SøknadRegel':
      return 'Brevkoden er søknad';
    default:
      return '-';
  }
};

const mapRegelTittel = (regel: string, resultat: boolean) => {
  switch (regel) {
    case 'ManueltOverstyrtTilArenaRegel':
      return resultat ? 'Overstyrt til Arena' : 'Ikke overstyrt til Arena';
    case 'ArenaHistorikkRegel':
      return resultat ? 'Bruker har ingen signifikant Arena-historikk' : 'Bruker har signifikant Arena-historikk';
    case 'Aldersregel':
      return resultat ? 'Bruker er over 18 år' : 'Bruker er under 18 år';
    case 'ArenaSakRegel':
      return resultat ? 'Bruker har Arena-sak' : 'Bruker har ikke Arena-sak';
    case 'ErIkkeAnkeRegel':
      return resultat ? 'Brevkoden er ikke anke' : 'Brevkoden er anke';
    case 'ErIkkeReisestønadRegel':
      return resultat ? 'Brevkoden er ikke reisestønad' : 'Brevkoden er reisestønad';
    case 'KelvinSakRegel':
      return resultat ? 'Bruker har Kelvin-sak (fast-track)' : 'Bruker har ikke Kelvin-sak';
    case 'SøknadRegel':
      return resultat ? 'Brevkoden er søknad' : 'Brevkoden er ikke søknad';
    default:
      return `Ukjent regel: ${regel}`;
  }
};

const mapRegel = (regel: string, resultat: boolean) => {
  const tittel = mapRegelTittel(regel, resultat);

  return (
    <Table.Row key={regel}>
      <Table.DataCell>{regel}</Table.DataCell>
      <Table.DataCell>
        <BodyShort textColor="subtle">{mapRegelForventet(regel)}</BodyShort>
      </Table.DataCell>
      <Table.DataCell>
        <HStack gap="space-4" align="center">
          {mapIkon(regel, resultat)}
          <BodyShort>{tittel}</BodyShort>
        </HStack>
      </Table.DataCell>
    </Table.Row>
  );
};
