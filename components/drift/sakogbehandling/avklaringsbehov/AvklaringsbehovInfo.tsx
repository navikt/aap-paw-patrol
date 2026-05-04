import { AvklaringsbehovStatus, ForenkletAvklaringsbehov } from 'lib/types/avklaringsbehov';
import { InlineMessage, Process, Tag, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend, formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import { capitalize } from 'lib/utils/formatting';

const tagStatusColor = (status: AvklaringsbehovStatus) => {
  switch (status) {
    case AvklaringsbehovStatus.OPPRETTET:
      return 'info';
    case AvklaringsbehovStatus.KVALITETSSIKRET:
    case AvklaringsbehovStatus.TOTRINNS_VURDERT:
      return 'success';
    case AvklaringsbehovStatus.SENDT_TILBAKE_FRA_KVALITETSSIKRER:
    case AvklaringsbehovStatus.SENDT_TILBAKE_FRA_BESLUTTER:
      return 'warning';
    case AvklaringsbehovStatus.AVBRUTT:
      return 'error';
    case AvklaringsbehovStatus.AVSLUTTET:
    default:
      return 'neutral';
  }
};

export const AvklaringsbehovInfo = ({ avklaringsbehov }: { avklaringsbehov: ForenkletAvklaringsbehov[] }) => (
  <Process>
    {avklaringsbehov.map((behov, i) => (
      <Process.Event
        key={`${behov.definisjon}-${i}`}
        title={
          behov.årsakTilSettPåVent
            ? `${capitalize(behov.årsakTilSettPåVent)}`
            : `${capitalize(behov.definisjon.løsesISteg)} (${behov.definisjon.kode})`
        }
        timestamp={`${formaterDatoMedTidspunktSekunderForFrontend(behov.tidsstempel)} - ${behov.endretAv}`}
        bullet={avklaringsbehov.length - i}
      >
        <VStack gap="space-16" align="start">
          <Tag size="small" variant={tagStatusColor(behov.status)}>
            {capitalize(behov.status.toString())}
          </Tag>

          {!!behov.perioderKreverVurdering?.length && (
            <InlineMessage status="warning" size="small">
              Perioder som krever vurdering:{' '}
              {behov.perioderKreverVurdering?.map(
                (periode) => `${formaterDatoForFrontend(periode.fom)} - ${formaterDatoForFrontend(periode.tom)}`
              )}
            </InlineMessage>
          )}
          {!!behov.perioderUgyldigVurdering?.length && (
            <InlineMessage status="warning" size="small">
              Perioder med ugyldig vurdering:{' '}
              {behov.perioderUgyldigVurdering?.map(
                (periode) => `${formaterDatoForFrontend(periode.fom)} - ${formaterDatoForFrontend(periode.tom)}`
              )}
            </InlineMessage>
          )}
        </VStack>
      </Process.Event>
    ))}
  </Process>
);
