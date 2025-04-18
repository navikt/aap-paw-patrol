import { Heading } from '@navikt/ds-react';
import { Jobboversikt } from 'components/drift/jobboversikt/Jobboversikt';
import {
  appInfo,
  AppNavn,
  hentFeilendeJobber,
  hentPlanlagteJobber,
  hentSisteKjørteJobber,
} from 'lib/services/driftService';
import { notFound } from 'next/navigation';

interface Params {
  app: AppNavn;
}

const DriftPage = async ({ params }: { params: Promise<Params> }) => {
  const { app } = await params;

  if (appInfo.find((appInfo) => appInfo.name === app) === undefined) {
    return notFound();
  }
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
