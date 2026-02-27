import { BodyShort, Box, CopyButton, Heading, HGrid, HStack, Table, Tabs, Tag } from '@navikt/ds-react';
import { formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import { capitalize, formaterBehandlingType } from 'lib/utils/formatting';
import { AvklaringsbehovInfo } from 'components/drift/sakogbehandling/avklaringsbehov/AvklaringsbehovInfo';
import { SettAktivtStegV2 } from 'components/drift/sakogbehandling/avklaringsbehov/SettAktivtStegV2';
import { Vilkårsresultat } from 'components/drift/sakogbehandling/vilkårsresultat/Vilkårsresultat';
import { Oppgaver } from 'components/drift/sakogbehandling/oppgave/Oppgaver';
import { useEffect, useState } from 'react';
import { BehandlingDriftsinfo } from 'lib/types/avklaringsbehov';
import { useRouter, useSearchParams } from 'next/navigation';

enum Tab {
  AVKLARINGSBEHOV = 'AVKLARINGSBEHOV',
  VILKÅRSRESULTAT = 'VILKÅRSRESULTAT',
  OPPGAVER = 'OPPGAVER',
}

export const BehandlingOversikt = ({
  saksnummer,
  behandlinger,
}: {
  saksnummer: string;
  behandlinger: BehandlingDriftsinfo[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tab, setTab] = useState<Tab>(Tab.AVKLARINGSBEHOV);
  const [valgtBehandling, setValgtBehandling] = useState<BehandlingDriftsinfo>();

  useEffect(() => {
    if (behandlinger?.length === 1) {
      oppdaterValgtBehandling(behandlinger[0]);
    } else if (searchParams.get('behandlingref')) {
      const behandling = behandlinger.find((b) => b.referanse === searchParams.get('behandlingref'));
      oppdaterValgtBehandling(behandling);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [behandlinger]);

  const oppdaterValgtBehandling = (behandling?: BehandlingDriftsinfo) => {
    if (behandling) {
      router.replace(`?behandlingref=${behandling.referanse}`);
    } else {
      router.replace('');
    }
    setValgtBehandling(behandling);
  };

  return (
    <Box margin="space-16">
      {!behandlinger?.length ? (
        <BodyShort>Ingen behandlinger funnet for saksnummer {saksnummer}</BodyShort>
      ) : (
        <Box
          background="neutral-soft"
          padding="space-16"
          borderRadius="16"
          borderColor="neutral-subtle"
          borderWidth="1"
        >
          <Heading size="medium" textColor="subtle">
            Alle behandlinger ({behandlinger.length})
          </Heading>

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
              {behandlinger.map((behandling) => {
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
                    <Table.DataCell>{behandling.vurderingsbehov.map((v) => capitalize(v)).join(', ')}</Table.DataCell>
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
        </Box>
      )}

      {valgtBehandling && (
        <Box
          background="neutral-soft"
          padding="space-16"
          marginBlock="space-16"
          borderRadius="16"
          borderColor="neutral-subtle"
          borderWidth="1"
        >
          <HStack gap="space-16" align="center" marginBlock="space-0 space-16">
            <Heading size="medium" textColor="subtle">
              {formaterBehandlingType(valgtBehandling.type)}
              {valgtBehandling.årsakTilOpprettelse && ` | ${capitalize(valgtBehandling.årsakTilOpprettelse)}`}
            </Heading>
            <Tag variant="info" size="small">
              {capitalize(valgtBehandling.status)}
            </Tag>
          </HStack>

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
    </Box>
  );
};
