import { Page, PageBlock } from '@navikt/ds-react/Page';
import { Utbetalingstidslinje } from 'components/drift/utbetaling/Utbetalingstidslinje';
import { harLeseTilgang, hentRollerForBruker } from 'lib/azure/azureUserService';
import { IngenTilgangAlert } from 'components/drift/IngenTilgangAlert';

const UtbetalingstidslinjeePage = async () => {
  const roller = await hentRollerForBruker();
  const harTilgang = harLeseTilgang(roller);

  return (
    <Page>
      <PageBlock width="lg">
        {harTilgang ? <Utbetalingstidslinje /> : <IngenTilgangAlert krevesLeseTilgang handling="oppslag" />}
      </PageBlock>
    </Page>
  );
};

export default UtbetalingstidslinjeePage;
