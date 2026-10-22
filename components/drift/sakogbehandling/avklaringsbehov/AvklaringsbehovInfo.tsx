import { FetchJsonBody, hentSakDriftsinfo } from 'lib/clientApi';
import { ForenkletAvklaringsbehov as SimplifiedAvklaringsbehov } from 'lib/types/avklaringsbehov';
import { BodyShort, InlineMessage, Process, Tag, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend, formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import { capitalize } from 'lib/utils/formatting';

type BehandlingsflytAvklaringsbehov = FetchJsonBody<
  ReturnType<typeof hentSakDriftsinfo>
>['behandlinger'][number]['avklaringsbehov'][number];
type ForenkletAvklaringsbehov = BehandlingsflytAvklaringsbehov | SimplifiedAvklaringsbehov;

const tagStatusColor = (status: string) => {
  switch (status) {
    case 'OPPRETTET':
      return 'info';
    case 'KVALITETSSIKRET':
    case 'TOTRINNS_VURDERT':
      return 'success';
    case 'SENDT_TILBAKE_FRA_KVALITETSSIKRER':
    case 'SENDT_TILBAKE_FRA_BESLUTTER':
      return 'warning';
    case 'AVBRUTT':
      return 'error';
    case 'AVSLUTTET':
    default:
      return 'neutral';
  }
};

export const AvklaringsbehovInfo = ({ avklaringsbehov }: { avklaringsbehov: ForenkletAvklaringsbehov[] }) => {
  if (avklaringsbehov.length === 0) {
    return <BodyShort textColor="subtle">Ingen avklaringsbehov funnet.</BodyShort>;
  }

  return (
    <Process>
      {avklaringsbehov.map((behov, i) => (
        <Process.Event
          key={`${behov.definisjon}-${i}`}
          title={
            behov.årsakTilSettPåVent
              ? `${capitalize(behov.årsakTilSettPåVent)} (frist ${behov.fristSettPåVent ? formaterDatoForFrontend(behov.fristSettPåVent) : 'N/A'})`
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
};
