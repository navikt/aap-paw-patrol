'use client';

import { CheckmarkCircleFillIcon, InformationSquareFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import {
  Alert,
  BodyShort,
  Box,
  CopyButton,
  Heading,
  HelpText,
  HGrid,
  HStack,
  Label,
  Loader,
  Table,
  Tabs,
  Tag,
  VStack,
} from '@navikt/ds-react';
import { hentJournalpostInfo } from 'lib/clientApi';
import { ForenkletAvklaringsbehov } from 'lib/types/avklaringsbehov';
import {
  Fordelingsresultat,
  JournalpostInfoDTO,
  kanalInfo,
  PostmottakAvklaringsbehov,
  PostmottakBehandling,
} from 'lib/types/postmottak';
import { formaterDatoForFrontend, formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import { formaterBehandlingType } from 'lib/utils/formatting';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { AvklaringsbehovInfo } from 'components/drift/sakogbehandling/avklaringsbehov/AvklaringsbehovInfo';
import { Oppgaver } from 'components/drift/sakogbehandling/oppgave/Oppgaver';

function mapTilForenkletAvklaringsbehov(behov: PostmottakAvklaringsbehov): ForenkletAvklaringsbehov {
  return {
    definisjon: {
      ...behov.definisjon,
      kvalitetssikres: false,
      kreverToTrinn: behov.definisjon.kreverToTrinn,
    },
    status: behov.status as any,
    tidsstempel: behov.tidsstempel,
    endretAv: behov.endretAv,
    årsakTilSettPåVent: behov.årsakTilSettPåVent ?? undefined,
  };
}

const KanalTag = ({ kanal }: { kanal: string }) => {
  const info = kanalInfo[kanal as keyof typeof kanalInfo];
  if (!info)
    return (
      <Tag variant="neutral" size="small">
        {kanal}
      </Tag>
    );

  return (
    <HStack gap="space-4" align="center">
      <Tag variant={info.erDigital ? 'success' : 'neutral'} size="small">
        {kanal} {info.erDigital ? '(digital)' : ''}
      </Tag>
      <HelpText title="Om kanal">{info.beskrivelse}</HelpText>
    </HStack>
  );
};

// Hva som kreves for at regelen skal bidra til Kelvin-fordeling.
// null = kun logging, påvirker ikke resultatet.
const regelKravForKelvin = (regel: string): boolean | null => {
  switch (regel) {
    // Disse to har omvendt logikk i forhold til de andre reglene, så vi må snu resultatet for å øke lesbarheten.
    case 'ManueltOverstyrtTilArenaRegel':
    case 'ArenaHistorikkRegel':
      return false;
    case 'KelvinSakRegel':
    case 'ArenaSakRegel':
      return null;
    default:
      return true;
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
      return 'Har Kelvin-sak (hurtigbane)';
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
      return resultat ? 'Bruker har signifikant Arena-historikk' : 'Bruker har ingen Arena-historikk';
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
  const krav = regelKravForKelvin(regel);
  const erOK = krav === null ? null : resultat === krav;

  return (
    <Table.Row key={regel}>
      <Table.DataCell>{regel}</Table.DataCell>
      <Table.DataCell>
        <BodyShort textColor="subtle">{mapRegelForventet(regel)}</BodyShort>
      </Table.DataCell>
      <Table.DataCell>
        <HStack gap="space-4" align="center">
          {erOK === null ? (
            <InformationSquareFillIcon
              style={{ color: 'var(--ax-text-info-decoration)' }}
              title={`Resultat = ${resultat}`}
            />
          ) : erOK ? (
            <CheckmarkCircleFillIcon
              style={{ color: 'var(--ax-text-success-decoration)' }}
              title={`Resultat = ${resultat}`}
            />
          ) : (
            <XMarkOctagonFillIcon
              style={{ color: 'var(--ax-text-danger-decoration)' }}
              title={`Resultat = ${resultat}`}
            />
          )}
          <BodyShort>{tittel}</BodyShort>
        </HStack>
      </Table.DataCell>
    </Table.Row>
  );
};

const FordelingsresultatPanel = ({ fordelingsresultat }: { fordelingsresultat: Fordelingsresultat }) => (
  <Box background="neutral-soft" padding="space-16" borderRadius="16" borderColor="neutral-subtle" borderWidth="1">
    <VStack gap="space-16">
      <Heading size="small" textColor="subtle">
        Fordelingsresultat
      </Heading>

      <HStack gap="space-8" align="center">
        <Label size="small">Fordelt til:</Label>
        <Tag variant={fordelingsresultat.systemNavn === 'KELVIN' ? 'success' : 'warning'} size="medium">
          {fordelingsresultat.systemNavn}
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

enum BehandlingTab {
  AVKLARINGSBEHOV = 'AVKLARINGSBEHOV',
  OPPGAVER = 'OPPGAVER',
}

const BehandlingerPanel = ({ behandlinger }: { behandlinger: PostmottakBehandling[] }) => {
  const [valgtBehandling, setValgtBehandling] = useState<PostmottakBehandling | undefined>(
    behandlinger.length === 1 ? behandlinger[0] : undefined
  );
  const [tab, setTab] = useState<BehandlingTab>(BehandlingTab.AVKLARINGSBEHOV);

  return (
    <Box background="neutral-soft" padding="space-16" borderRadius="16" borderColor="neutral-subtle" borderWidth="1">
      <Heading size="small" textColor="subtle">
        Behandlinger ({behandlinger.length})
      </Heading>

      <Table size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Referanse</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Aktivt steg</Table.HeaderCell>
            <Table.HeaderCell>Opprettet</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {behandlinger.map((behandling) => {
            const erValgt = behandling.referanse === valgtBehandling?.referanse;
            return (
              <Table.Row
                key={behandling.referanse}
                onClick={() => setValgtBehandling(behandling)}
                style={{
                  background: erValgt ? 'var(--ax-bg-success-softA)' : 'inherit',
                  cursor: 'pointer',
                }}
              >
                <Table.DataCell>{formaterBehandlingType(behandling.type)}</Table.DataCell>
                <Table.DataCell>
                  <CopyButton
                    size="xsmall"
                    iconPosition="right"
                    copyText={behandling.referanse}
                    text={behandling.referanse}
                    style={{ whiteSpace: 'nowrap' }}
                  />
                </Table.DataCell>
                <Table.DataCell>
                  <Tag variant="info" size="small">
                    {behandling.status}
                  </Tag>
                </Table.DataCell>
                <Table.DataCell>{behandling.aktivtSteg}</Table.DataCell>
                <Table.DataCell>
                  <BodyShort style={{ whiteSpace: 'nowrap' }}>
                    {formaterDatoMedTidspunktSekunderForFrontend(behandling.opprettet)}
                  </BodyShort>
                </Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>

      {valgtBehandling && (
        <Box marginBlock="space-16" borderWidth="1 0 0 0" borderColor="neutral-subtle">
          <Tabs
            defaultValue={BehandlingTab.AVKLARINGSBEHOV}
            onChange={(value) => setTab(value as BehandlingTab)}
            value={tab}
          >
            <Tabs.List>
              <Tabs.Tab value={BehandlingTab.AVKLARINGSBEHOV} label="Avklaringsbehov" />
              <Tabs.Tab value={BehandlingTab.OPPGAVER} label="Oppgaver" />
            </Tabs.List>
            <Tabs.Panel value={BehandlingTab.AVKLARINGSBEHOV}>
              <Box padding="space-16">
                <AvklaringsbehovInfo
                  avklaringsbehov={valgtBehandling.avklaringsbehov.map(mapTilForenkletAvklaringsbehov)}
                />
              </Box>
            </Tabs.Panel>
            <Tabs.Panel value={BehandlingTab.OPPGAVER}>
              <Oppgaver behandlingsreferanse={valgtBehandling.referanse} />
            </Tabs.Panel>
          </Tabs>
        </Box>
      )}
    </Box>
  );
};

export const JournalpostOversikt = ({ journalpostId }: { journalpostId: string }) => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [journalpost, setJournalpost] = useState<JournalpostInfoDTO>();

  const hentJournalpost = useCallback(async () => {
    setJournalpost(undefined);
    setError(undefined);
    try {
      await hentJournalpostInfo(journalpostId.trim())
        .then(async (res) => {
          if (res.ok) {
            return await res.json();
          } else {
            throw Error(await res.text());
          }
        })
        .then((data: JournalpostInfoDTO) => {
          setJournalpost(data);
        })
        .catch((err) => {
          console.log(err);
          setError(`Noe gikk galt: ${err}`);
        });
    } catch (err) {
      console.log(err);
      setError(`Noe gikk galt: ${err}`);
    }
    setIsLoading(false);
  }, [journalpostId]);

  useEffect(() => {
    if (journalpostId.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      hentJournalpost();
    }
  }, [journalpostId, hentJournalpost]);

  if (isLoading) return <Loader />;
  if (!journalpost) return <BodyShort>Ingen journalpost funnet for journalpostId {journalpostId}</BodyShort>;

  return (
    <Box borderColor="neutral-subtle" borderWidth="1 0 1 0" background="default">
      <HStack gap="space-16" align="center" margin="space-16">
        <Heading size="large">Journalpost {journalpostId}</Heading>
        {journalpost.innkommendeStatus && (
          <Tag variant="info" size="medium">
            {journalpost.innkommendeStatus}
          </Tag>
        )}
      </HStack>

      <Box borderColor="neutral-subtle" borderWidth="1 0 0 0" background="default">
        <HGrid columns="1fr 3fr" gap="space-16">
          {/* Venstre: nøkkelinfo */}
          <Box background="default" padding="space-16" borderColor="neutral-subtle" borderWidth="0 1 0 0">
            <VStack gap="space-16">
              {error && (
                <Alert variant="error" size="small">
                  {error}
                </Alert>
              )}
              <div>
                <Label size="small">Brevkode</Label>
                <BodyShort>{journalpost.brevkode || '-'}</BodyShort>
              </div>
              <div>
                <Label size="small">Tema</Label>
                <BodyShort>{journalpost.tema || '-'}</BodyShort>
              </div>
              <div>
                <Label size="small">Journalstatus</Label>
                <BodyShort>{journalpost.journalstatus || '-'}</BodyShort>
              </div>
              <div>
                <Label size="small">Mottatt dato</Label>
                <BodyShort>
                  {journalpost.mottattDato ? formaterDatoForFrontend(journalpost.mottattDato) : '-'}
                </BodyShort>
              </div>
              <div>
                <Label size="small">Kanal</Label>
                {journalpost.kanal ? <KanalTag kanal={journalpost.kanal} /> : '-'}
              </div>
              <div>
                <Label size="small">Saksnummer</Label>
                {journalpost.saksnummer ? (
                  <BodyShort>
                    <Link href={`/drift/sak/${journalpost.saksnummer}`}>{journalpost.saksnummer}</Link>
                  </BodyShort>
                ) : (
                  <BodyShort textColor="subtle">Ikke tildelt</BodyShort>
                )}
              </div>
            </VStack>
          </Box>

          {/* Høyre: fordelingsresultat + behandlinger */}
          <VStack gap="space-16" padding="space-16">
            {journalpost.fordelingsresultat ? (
              <FordelingsresultatPanel fordelingsresultat={journalpost.fordelingsresultat} />
            ) : (
              <BodyShort textColor="subtle">Ingen fordelingsresultat tilgjengelig</BodyShort>
            )}
            {journalpost.behandlinger.length > 0 && <BehandlingerPanel behandlinger={journalpost.behandlinger} />}
          </VStack>
        </HGrid>
      </Box>
    </Box>
  );
};
