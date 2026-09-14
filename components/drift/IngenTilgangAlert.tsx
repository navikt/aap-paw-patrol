import { Alert } from '@navikt/ds-react';

interface IngenTilgangAlertProps {
  /** Sett til true dersom siden også er tilgjengelig med AAP_DRIFT_LES (ren lesetilgang). */
  krevesLeseTilgang?: boolean;
  /** Hva brukeren forsøkte å gjøre, f.eks. "oppslag" eller "hente saksinformasjon". Utelates for en generisk melding. */
  handling?: string;
}

export const IngenTilgangAlert = ({ krevesLeseTilgang = false, handling }: IngenTilgangAlertProps) => (
  <Alert variant="warning">
    Du har ikke tilgang til denne siden. AD-rollen <strong>0000-GA-AAP_DRIFT</strong>
    {krevesLeseTilgang && (
      <>
        {' '}
        eller <strong>0000-GA-AAP_DRIFT_LES</strong>
      </>
    )}{' '}
    er påkrevd{handling ? ` for å gjøre ${handling}.` : '.'}
  </Alert>
);
