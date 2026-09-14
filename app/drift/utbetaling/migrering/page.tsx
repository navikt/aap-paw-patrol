import { Page, PageBlock } from '@navikt/ds-react/Page';
import { MigreringKontroll } from 'components/drift/utbetaling/MigreringKontroll';
import { MigreringStatus } from 'components/drift/utbetaling/MigreringStatus';
import { harDriftTilgang, hentRollerForBruker } from 'lib/azure/azureUserService';
import { IngenTilgangAlert } from 'components/drift/IngenTilgangAlert';

const MigreringPage = async () => {
  const roller = await hentRollerForBruker();
  const harTilgang = harDriftTilgang(roller);

  return (
    <Page>
      <PageBlock width="lg">
        {harTilgang ? (
          <>
            <MigreringStatus />
            <MigreringKontroll />
          </>
        ) : (
          <IngenTilgangAlert handling="oppslag" />
        )}
      </PageBlock>
    </Page>
  );
};

export default MigreringPage;
