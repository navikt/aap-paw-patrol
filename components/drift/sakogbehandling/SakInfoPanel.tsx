import { BodyShort, Label, VStack } from '@navikt/ds-react';
import { SakDriftsinfoDTO } from 'lib/types/avklaringsbehov';
import { formaterDatoForFrontend, formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';

export const SakInfoPanel = ({ sak }: { sak: SakDriftsinfoDTO }) => (
  <VStack gap="space-32" marginBlock="space-0 space-32">
    <div>
      <Label>Rettighetsperiode</Label>
      <BodyShort>
        {formaterDatoForFrontend(sak.rettighetsperiode.fom)} - {formaterDatoForFrontend(sak.rettighetsperiode.tom)}
      </BodyShort>
    </div>
    <div>
      <Label>Opprettet</Label>
      <BodyShort>{formaterDatoMedTidspunktSekunderForFrontend(sak.opprettetTidspunkt)}</BodyShort>
    </div>
    <div>
      <Label>Behandlinger</Label>
      <BodyShort>
        {sak.behandlinger.length} ({sak.behandlinger.filter((b) => b.årsakTilOpprettelse === 'MELDEKORT').length}{' '}
        meldekort)
      </BodyShort>
    </div>
  </VStack>
);
