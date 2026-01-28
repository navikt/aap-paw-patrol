import { AvklaringsbehovStatus, ForenkletAvklaringsbehov } from 'lib/types/avklaringsbehov';
import { Process, Tag } from '@navikt/ds-react';
import { formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
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
        title={`${capitalize(behov.definisjon.løsesISteg)}`}
        timestamp={`${formaterDatoMedTidspunktSekunderForFrontend(behov.tidsstempel)} - ${behov.endretAv}`}
        bullet={avklaringsbehov.length - i}
      >
        <Tag size="small" variant={tagStatusColor(behov.status)}>
          {capitalize(behov.status.toString())}
        </Tag>
      </Process.Event>
    ))}
  </Process>
);
