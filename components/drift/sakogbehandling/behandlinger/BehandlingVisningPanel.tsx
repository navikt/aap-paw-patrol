import { Box, Heading, HGrid, HStack, Tabs, Tag } from '@navikt/ds-react';
import { capitalize, formaterBehandlingType } from 'lib/utils/formatting.ts';
import { AvklaringsbehovInfo } from 'components/drift/sakogbehandling/avklaringsbehov/AvklaringsbehovInfo.tsx';
import { SettAktivtStegV2 } from 'components/drift/sakogbehandling/avklaringsbehov/SettAktivtStegV2.tsx';
import { Vilkårsresultat } from 'components/drift/sakogbehandling/vilkårsresultat/Vilkårsresultat.tsx';
import { KravOgStønadsperiode } from 'components/drift/sakogbehandling/kravogstonadsperiode/KravOgStonadsperiode.tsx';
import { Oppgaver } from 'components/drift/sakogbehandling/oppgave/Oppgaver.tsx';
import { TilkjentYtelse } from 'components/drift/sakogbehandling/tilkjentytelse/TilkjentYtelse.tsx';
import { TidligereVurderinger } from 'components/drift/sakogbehandling/tidligereVurderinger/TidligereVurderinger.tsx';
import { BrevBestillinger } from 'components/drift/sakogbehandling/brev/BrevBestillinger.tsx';
import { Yrkesskader } from 'components/drift/sakogbehandling/yrkesskade/Yrkesskader.tsx';
import { ProsesserBehandling } from 'components/drift/sakogbehandling/avklaringsbehov/ProsesserBehandling.tsx';
import { BehandlingDriftsinfo } from 'components/drift/sakogbehandling/behandlinger/BehandlingOversikt.tsx';
import { useState } from 'react';

enum BehandlingFane {
  AVKLARINGSBEHOV = 'AVKLARINGSBEHOV',
  VILKÅRSRESULTAT = 'VILKÅRSRESULTAT',
  KRAV_OG_STØNADSPERIODE = 'KRAV_OG_STØNADSPERIODE',
  OPPGAVER = 'OPPGAVER',
  TILKJENT_YTELSE = 'TILKJENT_YTELSE',
  TIDLIGERE_VURDERINGER = 'TIDLIGERE_VURDERINGER',
  PROSESSER = 'PROSESSER',
  BREV = 'BREV',
  YRKESSKADE = 'YRKESSKADE',
}

export const BehandlingVisningPanel = ({ valgtBehandling }: { valgtBehandling: BehandlingDriftsinfo }) => {
  const [fane, setFane] = useState<BehandlingFane>(BehandlingFane.AVKLARINGSBEHOV);

  return (
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

      <Tabs
        defaultValue={BehandlingFane.AVKLARINGSBEHOV}
        onChange={(value) => setFane(value as BehandlingFane)}
        value={fane}
      >
        <Tabs.List>
          <Tabs.Tab value={BehandlingFane.AVKLARINGSBEHOV} label="Avklaringsbehov" />
          <Tabs.Tab value={BehandlingFane.VILKÅRSRESULTAT} label="Vilkårsresultat" />
          <Tabs.Tab value={BehandlingFane.KRAV_OG_STØNADSPERIODE} label="Krav og stønadsperiode" />
          <Tabs.Tab value={BehandlingFane.OPPGAVER} label="Oppgaver" />
          <Tabs.Tab value={BehandlingFane.TILKJENT_YTELSE} label="Tilkjent ytelse" />
          <Tabs.Tab value={BehandlingFane.TIDLIGERE_VURDERINGER} label="Tidligere vurderinger" />
          <Tabs.Tab value={BehandlingFane.BREV} label="Brev" />
          <Tabs.Tab value={BehandlingFane.YRKESSKADE} label="Yrkesskade" />
          <Tabs.Tab value={BehandlingFane.PROSESSER} label="Prossesser behandling" />
        </Tabs.List>

        <Tabs.Panel value={BehandlingFane.AVKLARINGSBEHOV}>
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
        <Tabs.Panel value={BehandlingFane.VILKÅRSRESULTAT}>
          <Vilkårsresultat key={valgtBehandling.referanse} behandlingsreferanse={valgtBehandling.referanse} />
        </Tabs.Panel>
        <Tabs.Panel value={BehandlingFane.KRAV_OG_STØNADSPERIODE}>
          <KravOgStønadsperiode key={valgtBehandling.referanse} behandlingsreferanse={valgtBehandling.referanse} />
        </Tabs.Panel>
        <Tabs.Panel value={BehandlingFane.OPPGAVER}>
          <Oppgaver behandlingsreferanse={valgtBehandling.referanse} />
        </Tabs.Panel>
        <Tabs.Panel value={BehandlingFane.TILKJENT_YTELSE}>
          <TilkjentYtelse key={valgtBehandling.referanse} behandlingsreferanse={valgtBehandling.referanse} />
        </Tabs.Panel>
        <Tabs.Panel value={BehandlingFane.TIDLIGERE_VURDERINGER}>
          <TidligereVurderinger key={valgtBehandling.referanse} behandlingsreferanse={valgtBehandling.referanse} />
        </Tabs.Panel>
        <Tabs.Panel value={BehandlingFane.BREV}>
          <BrevBestillinger behandlingRef={valgtBehandling.referanse} />
        </Tabs.Panel>
        <Tabs.Panel value={BehandlingFane.YRKESSKADE}>
          <Yrkesskader key={valgtBehandling.referanse} behandlingsreferanse={valgtBehandling.referanse} />
        </Tabs.Panel>
        <Tabs.Panel value={BehandlingFane.PROSESSER}>
          <ProsesserBehandling behandling={valgtBehandling} />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};
