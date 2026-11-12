'use client';

import { useCallback, useEffect, useState } from 'react';
import { Alert, BodyShort, Box, Heading, HGrid, HStack, Loader, Tabs, Tag, VStack } from '@navikt/ds-react';
import { FetchJsonBody, hentSakDriftsinfo } from 'lib/clientApi';
import { SakInfoPanel } from 'components/drift/sakogbehandling/SakInfoPanel';
import { capitalize, normaliserSaksnummer } from 'lib/utils/formatting';
import { BehandlingOversikt } from 'components/drift/sakogbehandling/behandlinger/BehandlingOversikt';
import { JournalposterForSak } from 'components/drift/sakogbehandling/JournalposterForSak';
import { MottatteDokumenter } from 'components/drift/sakogbehandling/dokumenter/MottatteDokumenter';
import { Dialogmeldinger } from 'components/drift/sakogbehandling/dialogmeldinger/Dialogmeldinger';
import { Meldekort } from 'components/drift/sakogbehandling/meldekort/Meldekort';
import { BrevBestillinger } from 'components/drift/sakogbehandling/brev/BrevBestillinger';
import { UtbetalingPanel } from 'components/drift/sakogbehandling/utbetaling/UtbetalingPanel';
import { useSearchParams } from 'next/navigation';

type SakDriftsinfoDTO = FetchJsonBody<ReturnType<typeof hentSakDriftsinfo>>;

enum Tab {
  BEHANDLINGER = 'behandlinger',
  JOURNALPOSTER = 'journalposter',
  MOTTATTE_DOKUMENTER = 'mottatte-dokumenter',
  DIALOGMELDINGER = 'dialogmeldinger',
  MELDEKORT = 'meldekort',
  BREV = 'brev',
  UTBETALING = 'utbetaling',
}

export enum SakQueryParam {
  FANE = 'fane',
  BEHANDLINGREF = 'behandlingref',
}

export const SakOversikt = ({ saksnummer, harDriftTilgang }: { saksnummer: string; harDriftTilgang: boolean }) => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sak, setSak] = useState<SakDriftsinfoDTO>();

  const searchParams = useSearchParams();
  const fane = searchParams.get(SakQueryParam.FANE);
  const tab = Object.values(Tab).find((value) => value === fane) ?? Tab.BEHANDLINGER;

  const endreFane = (value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set(SakQueryParam.FANE, value);

    if (value !== Tab.BEHANDLINGER) {
      url.searchParams.delete(SakQueryParam.BEHANDLINGREF);
    }

    window.history.pushState(null, '', url);
  };

  const hentSak = useCallback(async (saksnummer: string) => {
    setSak(undefined);
    setError(undefined);

    try {
      await hentSakDriftsinfo(normaliserSaksnummer(saksnummer.trim()))
        .then(async (res) => {
          if (res.ok) return await res.json();
          else throw Error(await res.text());
        })
        .then((sak: SakDriftsinfoDTO) => {
          setSak(sak);
        });
    } catch (err) {
      console.log(err);
      setError(`Noe gikk galt: ${err}`);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    hentSak(saksnummer);
  }, [saksnummer, hentSak]);

  if (isLoading) return <Loader />;
  else if (!sak) return <BodyShort>Ingen sak funnet for saksnummer {saksnummer}</BodyShort>;

  return (
    <Box borderColor="neutral-subtle" borderWidth="1 0 1 0" background="default">
      <HStack gap="space-16" align="center" margin="space-16">
        <Heading size="large">Sak {sak.saksnummer}</Heading>
        <Tag variant="info" size="medium">
          {capitalize(sak.status)}
        </Tag>
      </HStack>

      <Box borderColor="neutral-subtle" borderWidth="1 0 0 0" height="90vh" background="default">
        <HGrid columns="1fr 4fr" height="100%">
          <Box background="default" padding="space-16" borderColor="neutral-subtle" borderWidth="0 1 0 0" height="100%">
            <VStack gap="space-16">
              {error && (
                <Alert variant="error" size="small">
                  {error}
                </Alert>
              )}
              {sak && !isLoading && <SakInfoPanel sak={sak} />}
            </VStack>
          </Box>

          <Tabs onChange={endreFane} value={tab}>
            <Tabs.List>
              <Tabs.Tab value={Tab.BEHANDLINGER} label="Behandlinger" />
              <Tabs.Tab value={Tab.JOURNALPOSTER} label="Journalposter" />
              <Tabs.Tab value={Tab.MOTTATTE_DOKUMENTER} label="Mottatte dokumenter" />
              <Tabs.Tab value={Tab.DIALOGMELDINGER} label="Dialogmeldinger" />
              <Tabs.Tab value={Tab.MELDEKORT} label="Meldekort" />
              <Tabs.Tab value={Tab.BREV} label="Brev" />
              <Tabs.Tab value={Tab.UTBETALING} label="Utbetaling" />
            </Tabs.List>

            <Tabs.Panel value={Tab.BEHANDLINGER}>
              <BehandlingOversikt saksnummer={saksnummer} behandlinger={sak?.behandlinger ?? []} />
            </Tabs.Panel>
            <Tabs.Panel value={Tab.JOURNALPOSTER}>
              <JournalposterForSak key={saksnummer} saksnummer={normaliserSaksnummer(saksnummer.trim())} />
            </Tabs.Panel>
            <Tabs.Panel value={Tab.MOTTATTE_DOKUMENTER}>
              <MottatteDokumenter saksnummer={saksnummer} />
            </Tabs.Panel>
            <Tabs.Panel value={Tab.DIALOGMELDINGER}>
              <Dialogmeldinger saksnummer={saksnummer} />
            </Tabs.Panel>
            <Tabs.Panel value={Tab.MELDEKORT}>
              <Meldekort
                saksnummer={saksnummer}
                sakRettighetsperiode={sak.rettighetsperiode}
                harDriftTilgang={harDriftTilgang}
              />
            </Tabs.Panel>
            <Tabs.Panel value={Tab.BREV}>
              <BrevBestillinger saksnummer={saksnummer} />
            </Tabs.Panel>
            <Tabs.Panel value={Tab.UTBETALING}>
              <UtbetalingPanel saksnummer={saksnummer} />
            </Tabs.Panel>
          </Tabs>
        </HGrid>
      </Box>
    </Box>
  );
};
