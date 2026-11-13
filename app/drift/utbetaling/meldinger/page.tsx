import { Alert } from 'components/felles/alert/Alert.tsx';
import { Page, PageBlock } from '@navikt/ds-react/Page';
import { Utbetalingsmeldinger } from 'components/drift/utbetaling/Utbetalingsmeldinger';
import { harLeseTilgang, hentRollerForBruker } from 'lib/azure/azureUserService';
import { unstable_rethrow } from 'next/navigation';

export default async function UtbetalingsmeldingerPage() {
  let harTilgang = false;
  try {
    harTilgang = harLeseTilgang(await hentRollerForBruker());
  } catch (error) {
    unstable_rethrow(error);
  }

  return (
    <Page>
      <PageBlock width="lg">
        {harTilgang ? (
          <Utbetalingsmeldinger />
        ) : (
          <Alert variant="warning">
            Du har ikke tilgang til denne siden. AD-rollen <strong>AAP_DRIFT</strong> eller{' '}
            <strong>AAP_DRIFT_LES</strong> er påkrevd.
          </Alert>
        )}
      </PageBlock>
    </Page>
  );
}
