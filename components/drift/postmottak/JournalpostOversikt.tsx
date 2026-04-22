'use client';

import { useEffect, useState } from 'react';
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
  Tag,
  VStack,
} from '@navikt/ds-react';
import { hentJournalpostInfo } from 'lib/clientApi';
import { JournalpostInfoDTO, kanalInfo, PostmottakAvklaringsbehov, PostmottakBehandling } from 'lib/types/postmottak';
import { formaterDatoForFrontend, formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import { capitalize, formaterBehandlingType } from 'lib/utils/formatting';
import { AvklaringsbehovInfo } from 'components/drift/sakogbehandling/avklaringsbehov/AvklaringsbehovInfo';
import { ForenkletAvklaringsbehov } from 'lib/types/avklaringsbehov';
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import Link from 'next/link';

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
        {capitalize(kanal)} {info.erDigital ? '(digital)' : ''}
      </Tag>
      <HelpText title="Om kanal">{info.beskrivelse}</HelpText>
    </HStack>
  );
};

const FordelingsresultatPanel = ({
  fordelingsresultat,
}: {
  fordelingsresultat: JournalpostInfoDTO['fordelingsresultat'];
}) => (
  <Box background="neutral-soft" padding="space-16" borderRadius="16" borderColor="neutral-subtle" borderWidth="1">
    <VStack gap="space-16">
      <Heading size="small" textColor="subtle">
        Fordelingsresultat
      </Heading>

      <HStack gap="space-8" align="center">
        <Label size="small">Fordelt til:</Label>
        <Tag variant="info" size="medium">
          {fordelingsresultat.systemNavn}
        </Tag>
        <BodyShort size="small" textColor="subtle">
          (journalpost {fordelingsresultat.forJournalpost})
        </BodyShort>
      </HStack>

      <Table size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Regel</Table.HeaderCell>
            <Table.HeaderCell style={{ width: '4rem', textAlign: 'center' }}>Resultat</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.entries(fordelingsresultat.regelMap).map(([regel, resultat]) => (
            <Table.Row key={regel}>
              <Table.DataCell>{regel}</Table.DataCell>
              <Table.DataCell style={{ textAlign: 'center' }}>
                {resultat ? (
                  <CheckmarkCircleFillIcon style={{ color: 'var(--ax-text-success)' }} title="Ja" />
                ) : (
                  <XMarkOctagonFillIcon style={{ color: 'var(--ax-text-danger)' }} title="Nei" />
                )}
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </VStack>
  </Box>
);

const BehandlingerPanel = ({ behandlinger }: { behandlinger: PostmottakBehandling[] }) => {
  const [valgtBehandling, setValgtBehandling] = useState<PostmottakBehandling | undefined>(
    behandlinger.length === 1 ? behandlinger[0] : undefined
  );

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
                    {capitalize(behandling.status)}
                  </Tag>
                </Table.DataCell>
                <Table.DataCell>{capitalize(behandling.aktivtSteg)}</Table.DataCell>
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
        <Box marginBlock="space-16" padding="space-16" borderWidth="1 0 0 0" borderColor="neutral-subtle">
          <Heading size="xsmall" spacing>
            Avklaringsbehovhistorikk – {formaterBehandlingType(valgtBehandling.type)}
          </Heading>
          <AvklaringsbehovInfo avklaringsbehov={valgtBehandling.avklaringsbehov.map(mapTilForenkletAvklaringsbehov)} />
        </Box>
      )}
    </Box>
  );
};

export const JournalpostOversikt = ({ journalpostId }: { journalpostId: string }) => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [journalpost, setJournalpost] = useState<JournalpostInfoDTO>();

  useEffect(() => {
    if (journalpostId.length > 0) {
      setError(undefined);
      hentJournalpost();
    }
  }, [journalpostId]);

  const hentJournalpost = async () => {
    setJournalpost(undefined);
    setError(undefined);
    try {
      await hentJournalpostInfo(journalpostId.trim())
        .then(async (res) => {
          if (res.ok) {
            const json = await res.json()
            console.log(json)
            return json
              }
          else {
            throw Error(await res.text());
          }
        })
        .then((data: JournalpostInfoDTO) => {
          console.log(data)
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
  };

  if (isLoading) return <Loader />;
  if (!journalpost) return <BodyShort>Ingen journalpost funnet for journalpostId {journalpostId}</BodyShort>;

  return (
    <Box borderColor="neutral-subtle" borderWidth="1 0 1 0" background="default">
      <HStack gap="space-16" align="center" margin="space-16">
        <Heading size="large">Journalpost {journalpostId}</Heading>
        <Tag variant="info" size="medium">
          {capitalize(journalpost.innkommendeStatus)}
        </Tag>
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
                <BodyShort>{journalpost.brevkode}</BodyShort>
              </div>
              <div>
                <Label size="small">Tema</Label>
                <BodyShort>{journalpost.tema}</BodyShort>
              </div>
              <div>
                <Label size="small">Journalstatus</Label>
                <BodyShort>{capitalize(journalpost.journalstatus)}</BodyShort>
              </div>
              <div>
                <Label size="small">Mottatt dato</Label>
                <BodyShort>{formaterDatoForFrontend(journalpost.mottattDato)}</BodyShort>
              </div>
              <div>
                <Label size="small">Kanal</Label>
                <KanalTag kanal={journalpost.kanal} />
              </div>
              <div>
                <Label size="small">Saksnummer</Label>
                {journalpost.saksnummer && journalpost.saksnummer !== 'null' ? (
                  <Link href={`/drift/sak/${journalpost.saksnummer}`}>{journalpost.saksnummer}</Link>
                ) : (
                  <BodyShort textColor="subtle">Ikke tildelt</BodyShort>
                )}
              </div>
            </VStack>
          </Box>

          {/* Høyre: fordelingsresultat + behandlinger */}
          <VStack gap="space-16" padding="space-16">
            <FordelingsresultatPanel fordelingsresultat={journalpost.fordelingsresultat} />
            {journalpost.behandlinger.length > 0 && <BehandlingerPanel behandlinger={journalpost.behandlinger} />}
          </VStack>
        </HGrid>
      </Box>
    </Box>
  );
};
