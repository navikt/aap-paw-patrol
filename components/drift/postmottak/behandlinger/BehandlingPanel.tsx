'use client';

import { BodyShort, Box, CopyButton, Heading, Table, Tabs, Tag } from '@navikt/ds-react';
import { FetchJsonBody, hentJournalpostInfo } from 'lib/clientApi';
import { AvklaringsbehovStatus, ForenkletAvklaringsbehov } from 'lib/types/avklaringsbehov';
import { formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import { formaterBehandlingType } from 'lib/utils/formatting';
import { useState } from 'react';

import { AvklaringsbehovInfo } from 'components/drift/sakogbehandling/avklaringsbehov/AvklaringsbehovInfo';
import { Oppgaver } from 'components/drift/sakogbehandling/oppgave/Oppgaver';

type JournalpostInfoDTO = FetchJsonBody<ReturnType<typeof hentJournalpostInfo>>;
type PostmottakBehandling = JournalpostInfoDTO['behandlinger'][number];
type PostmottakAvklaringsbehov = PostmottakBehandling['avklaringsbehov'][number];

enum BehandlingTab {
  AVKLARINGSBEHOV = 'AVKLARINGSBEHOV',
  OPPGAVER = 'OPPGAVER',
}

function mapTilForenkletAvklaringsbehov(behov: PostmottakAvklaringsbehov): ForenkletAvklaringsbehov {
  return {
    definisjon: {
      ...behov.definisjon,
      kvalitetssikres: false,
      kreverToTrinn: behov.definisjon.kreverToTrinn,
    },
    status: AvklaringsbehovStatus[behov.status],
    tidsstempel: behov.tidsstempel,
    endretAv: behov.endretAv,
    årsakTilSettPåVent: behov.årsakTilSettPåVent ?? undefined,
  };
}

export const BehandlingerPanel = ({ behandlinger }: { behandlinger: PostmottakBehandling[] }) => {
  const [valgtBehandlingReferanse, setValgtBehandlingReferanse] = useState<string | undefined>(
    behandlinger.length === 1 ? behandlinger[0]?.referanse : undefined
  );
  const valgtBehandling = behandlinger.find((behandling) => behandling.referanse === valgtBehandlingReferanse);
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
                onClick={() => setValgtBehandlingReferanse(behandling.referanse)}
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
