'use client';

import { useEffect, useState } from 'react';
import { Alert, BodyShort, Box, Heading, HGrid, HStack, Loader, Tabs, Tag, VStack } from '@navikt/ds-react';
import { hentSakDriftsinfo } from 'lib/clientApi';
import { SakDriftsinfoDTO } from 'lib/types/avklaringsbehov';
import { SakInfoPanel } from 'components/drift/sakogbehandling/SakInfoPanel';
import { capitalize } from 'lib/utils/formatting';
import { BehandlingOversikt } from 'components/drift/sakogbehandling/BehandlingOversikt';
import { MottatteDokumenter } from 'components/drift/sakogbehandling/dokumenter/MottatteDokumenter';

enum Tab {
  BEHANDLINGER = 'BEHANDLINGER',
  MOTTATTE_DOKUMENTER = 'MOTTATTE_DOKUMENTER',
}

export const SakOversikt = ({ saksnummer }: { saksnummer: string }) => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sak, setSak] = useState<SakDriftsinfoDTO>();
  const [tab, setTab] = useState<Tab>(Tab.BEHANDLINGER);

  useEffect(() => {
    if (saksnummer && /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z\d]{7}$/.test(saksnummer)) {
      setError(undefined);
      hentSak();
    } else if (saksnummer) {
      setError('Saksnummer skal bestå av 7 tegn og inneholde både bokstaver og tall.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saksnummer]);

  const hentSak = async () => {
    setSak(undefined);
    setError(undefined);
    setIsLoading(true);

    try {
      await hentSakDriftsinfo(saksnummer.trim())
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
  };

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

          <Tabs defaultValue={Tab.BEHANDLINGER} onChange={(value) => setTab(value as Tab)} value={tab}>
            <Tabs.List>
              <Tabs.Tab value={Tab.BEHANDLINGER} label="Behandlinger" />
              <Tabs.Tab value={Tab.MOTTATTE_DOKUMENTER} label="Mottatte dokumenter" />
            </Tabs.List>

            <Tabs.Panel value={Tab.BEHANDLINGER}>
              <BehandlingOversikt saksnummer={saksnummer} behandlinger={sak?.behandlinger ?? []} />
            </Tabs.Panel>
            <Tabs.Panel value={Tab.MOTTATTE_DOKUMENTER}>
              <MottatteDokumenter saksnummer={saksnummer} />
            </Tabs.Panel>
          </Tabs>
        </HGrid>
      </Box>
    </Box>
  );
};
