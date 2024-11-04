import { Heading } from '@navikt/ds-react';
import { Jobboversikt } from 'components/drift/jobboversikt/Jobboversikt';
import { AppNavn, hentFeilendeJobber, hentPlanlagteJobber, hentSisteKjørteJobber } from 'lib/services/driftService';

interface Params {
  app: AppNavn;
}

const DriftPage = async ({ params }: { params: Promise<Params> }) => {
  const { app } = await params;
  const feilendeJobber = await hentFeilendeJobber(app);
  const planlagteJobber = await hentPlanlagteJobber(app);
  const sisteKjørteJobber = await hentSisteKjørteJobber(app);

  return (
    <div className={'flex-column'} style={{ padding: '1rem' }}>
      <Heading size={'large'}>Drift console</Heading>
      <Jobboversikt
        appNavn={app}
        feilendeJobber={feilendeJobber}
        planlagteJobber={planlagteJobber}
        sisteKjørteJobber={sisteKjørteJobber}
      />
    </div>
  );
};

export default DriftPage;
