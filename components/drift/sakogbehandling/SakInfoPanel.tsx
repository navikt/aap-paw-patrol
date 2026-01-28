import { BodyShort, Box, HStack, Label, Tag } from '@navikt/ds-react';
import { SakDriftsinfoDTO } from 'lib/types/avklaringsbehov';
import { formaterDatoForFrontend, formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import { capitalize } from 'lib/utils/formatting';

export const SakInfoPanel = ({ sak }: { sak: SakDriftsinfoDTO }) => (
  <Box background="default" padding="space-16" marginBlock="space-32" borderRadius="16">
    <HStack gap="space-32" marginBlock="space-0 space-32">
      <div>
        <Label>Saksnummer</Label>
        <BodyShort>{sak.saksnummer}</BodyShort>
      </div>
      <div>
        <Label>Status</Label>
        <BodyShort>
          <Tag variant="info" size="small">
            {capitalize(sak.status)}
          </Tag>
        </BodyShort>
      </div>
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
    </HStack>
  </Box>
);
