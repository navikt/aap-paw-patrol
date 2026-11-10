import { Page, PageBlock } from '@navikt/ds-react/Page';
import { IngenTilgangAlert } from 'components/drift/IngenTilgangAlert';
import { UtbetalingStatus } from 'components/drift/utbetaling/UtbetalingStatus';
import { harLeseTilgang, hentRollerForBruker } from 'lib/azure/azureUserService';

const UtbetalingStatusPage = async () => {
  const roller = await hentRollerForBruker();
  const harTilgang = harLeseTilgang(roller);

  return (
    <Page>
      <PageBlock width="lg">
        {harTilgang ? <UtbetalingStatus /> : <IngenTilgangAlert krevesLeseTilgang handling="oppslag" />}
      </PageBlock>
    </Page>
  );
};

export default UtbetalingStatusPage;
