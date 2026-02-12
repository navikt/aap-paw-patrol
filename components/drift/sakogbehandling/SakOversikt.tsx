'use client';

import { useEffect, useState } from 'react';
import { Alert, BodyShort, Box, CopyButton, HGrid, Loader, Table, Tabs, Tag, VStack } from '@navikt/ds-react';
import { hentSakDriftsinfo } from 'lib/clientApi';
import { BehandlingDriftsinfo, SakDriftsinfoDTO } from 'lib/types/avklaringsbehov';
import { formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import { SakInfoPanel } from 'components/drift/sakogbehandling/SakInfoPanel';
import { capitalize, formaterBehandlingType } from 'lib/utils/formatting';
import { AvklaringsbehovInfo } from 'components/drift/sakogbehandling/avklaringsbehov/AvklaringsbehovInfo';
import { SettAktivtStegV2 } from 'components/drift/sakogbehandling/avklaringsbehov/SettAktivtStegV2';
import { Vilkårsresultat } from 'components/drift/sakogbehandling/vilkårsresultat/Vilkårsresultat';
import { Oppgaver } from 'components/drift/sakogbehandling/oppgave/Oppgaver';

enum Tab {
  AVKLARINGSBEHOV = 'AVKLARINGSBEHOV',
  VILKÅRSRESULTAT = 'VILKÅRSRESULTAT',
  OPPGAVER = 'OPPGAVER',
}

export const SakOversikt = ({ saksnummer }: { saksnummer: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sak, setSak] = useState<SakDriftsinfoDTO>();
  const [tab, setTab] = useState<Tab>(Tab.AVKLARINGSBEHOV);

  const [valgtBehandling, setValgtBehandling] = useState<BehandlingDriftsinfo>();

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
    oppdaterValgtBehandling(undefined);
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

          if (sak.behandlinger.length === 1) {
            oppdaterValgtBehandling(sak.behandlinger[0]);
          } else if (searchParams.get('behandlingref')) {
            const behandling = sak.behandlinger.find((b) => b.referanse === searchParams.get('behandlingref'));
            oppdaterValgtBehandling(behandling);
          }
        });
    } catch (err) {
      console.log(err);
      setError(`Noe gikk galt: ${err}`);
    }
    setIsLoading(false);
  };

  const oppdaterValgtBehandling = (behandling?: BehandlingDriftsinfo) => {
    if (behandling) {
      router.replace(`?behandlingref=${behandling.referanse}`);
    } else {
      router.replace('');
    }
    setValgtBehandling(behandling);
  };

  return (
    <>
      <Box
        background="neutral-soft"
        padding="space-16"
        marginBlock="space-32"
        borderRadius="16"
        borderColor="neutral-subtle"
        borderWidth="1"
      >
        <VStack gap="space-16">
          {error && (
            <Alert variant="error" size="small">
              {error}
            </Alert>
          )}
          {sak && !isLoading && (
            <>
              <SakInfoPanel sak={sak} />

              {!sak?.behandlinger?.length ? (
                <BodyShort>Ingen behandlinger funnet for saksnummer {saksnummer}</BodyShort>
              ) : (
                <Table size="small">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Type</Table.HeaderCell>
                      <Table.HeaderCell>Referanse</Table.HeaderCell>
                      <Table.HeaderCell>Status</Table.HeaderCell>
                      <Table.HeaderCell>Vurderingsbehov</Table.HeaderCell>
                      <Table.HeaderCell>Årsak til opprettelse</Table.HeaderCell>
                      <Table.HeaderCell>Opprettet</Table.HeaderCell>
                      <Table.HeaderCell style={{ width: '2rem' }} />
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {sak.behandlinger.map((behandling) => {
                      const erValgtBehandling = behandling.referanse === valgtBehandling?.referanse;

                      return (
                        <Table.Row
                          key={behandling.referanse}
                          onClick={() => oppdaterValgtBehandling(behandling)}
                          style={{
                            background: erValgtBehandling ? 'var(--ax-bg-success-softA)' : 'inherit',
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
                          <Table.DataCell>
                            {behandling.vurderingsbehov.map((v) => capitalize(v)).join(', ')}
                          </Table.DataCell>
                          <Table.DataCell>
                            {behandling.årsakTilOpprettelse ? capitalize(behandling.årsakTilOpprettelse) : '-'}
                          </Table.DataCell>
                          <Table.DataCell>
                            <BodyShort style={{ whiteSpace: 'nowrap' }}>
                              {formaterDatoMedTidspunktSekunderForFrontend(behandling.opprettet)}
                            </BodyShort>
                          </Table.DataCell>
                          <Table.DataCell>
                            {erValgtBehandling && <CheckmarkCircleFillIcon style={{ color: 'green' }} />}
                          </Table.DataCell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              )}
            </>
          )}
        </VStack>
      </Box>

      {isLoading && <Loader />}

      {!isLoading && !!valgtBehandling && (
        <Box
          background="neutral-soft"
          padding="space-16"
          marginBlock="space-32"
          borderRadius="16"
          borderColor="neutral-subtle"
          borderWidth="1"
        >
          <Tabs defaultValue={Tab.AVKLARINGSBEHOV} onChange={(value) => setTab(value as Tab)} value={tab}>
            <Tabs.List>
              <Tabs.Tab value={Tab.AVKLARINGSBEHOV} label="Avklaringsbehov" />
              <Tabs.Tab value={Tab.VILKÅRSRESULTAT} label="Vilkårsresultat" />
              <Tabs.Tab value={Tab.OPPGAVER} label="Oppgaver" />
            </Tabs.List>

            <Tabs.Panel value={Tab.AVKLARINGSBEHOV}>
              <HGrid columns="4fr 2fr" gap="space-16" marginInline={'auto'} marginBlock="space-0">
                <Box padding="space-16" borderRadius="16">
                  <AvklaringsbehovInfo avklaringsbehov={valgtBehandling.avklaringsbehov} />
                </Box>
                <Box paddingInline="space-32" borderWidth="0 0 0 1" borderColor="neutral-subtle">
                  <Box position="sticky" top="space-0" paddingBlock="space-8">
                    <SettAktivtStegV2 behandling={valgtBehandling} />
                  </Box>
                </Box>
              </HGrid>
            </Tabs.Panel>
            <Tabs.Panel value={Tab.VILKÅRSRESULTAT}>
              <Vilkårsresultat behandlingsreferanse={valgtBehandling.referanse} />
            </Tabs.Panel>
            <Tabs.Panel value={Tab.OPPGAVER}>
              <Oppgaver behandlingsreferanse={valgtBehandling.referanse} />
            </Tabs.Panel>
          </Tabs>
        </Box>
      )}
    </>
  );
};
