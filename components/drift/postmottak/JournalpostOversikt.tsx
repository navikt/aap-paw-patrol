'use client';

import {
  BodyShort,
  Box,
  Heading,
  HelpText,
  HGrid,
  HStack,
  Label,
  Link,
  Loader,
  Tabs,
  Tag,
  VStack,
} from '@navikt/ds-react';
import { Alert } from 'components/felles/alert/Alert.tsx';
import { FetchJsonBody, hentJournalpostInfo } from 'lib/clientApi';
import { kanalInfo } from 'lib/types/postmottak';
import { formaterDatoForFrontend } from 'lib/utils/date';
import NextLink from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { KopierJournalpost } from 'components/drift/postmottak/KopierJournalpost.tsx';
import { BehandlingerPanel } from 'components/drift/postmottak/behandlinger/BehandlingPanel.tsx';
import { FordelingsresultatPanel } from 'components/drift/postmottak/FordelingsresultatPanel.tsx';
import { VurderingerPanel } from 'components/drift/postmottak/vurderinger/VurderingerPanel.tsx';

export type JournalpostInfoDTO = FetchJsonBody<ReturnType<typeof hentJournalpostInfo>>;

enum Tab {
  BEHANDLINGER = 'Behandlinger',
  VURDERINGER = 'Vurderinger',
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

export const JournalpostOversikt = ({ journalpostId }: { journalpostId: string }) => {
  const [tab, setTab] = useState<Tab>(Tab.BEHANDLINGER);
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
                    <Link as={NextLink} href={`/drift/sak/${journalpost.saksnummer}`}>
                      {journalpost.saksnummer}
                    </Link>
                  </BodyShort>
                ) : (
                  <BodyShort textColor="subtle">Ikke tildelt</BodyShort>
                )}
              </div>
              <KopierJournalpost journalpostId={journalpostId} />
            </VStack>
          </Box>

          {/* Høyre: fordelingsresultat + behandlinger */}
          <Tabs onChange={(value) => setTab(value as Tab)} value={tab}>
            <Tabs.List>
              <Tabs.Tab value={Tab.BEHANDLINGER} label="Behandlinger" />
              <Tabs.Tab value={Tab.VURDERINGER} label="Vurderinger" />
            </Tabs.List>
            <Tabs.Panel value={Tab.BEHANDLINGER}>
              <VStack gap="space-16" padding="space-16">
                {journalpost.fordelingsresultat ? (
                  <FordelingsresultatPanel fordelingsresultat={journalpost.fordelingsresultat} />
                ) : (
                  <BodyShort textColor="subtle">Ingen fordelingsresultat tilgjengelig</BodyShort>
                )}
                {journalpost.behandlinger.length > 0 && <BehandlingerPanel behandlinger={journalpost.behandlinger} />}
              </VStack>
            </Tabs.Panel>
            <Tabs.Panel value={Tab.VURDERINGER}>
              <VurderingerPanel journapostId={journalpostId} />
            </Tabs.Panel>
          </Tabs>
        </HGrid>
      </Box>
    </Box>
  );
};
