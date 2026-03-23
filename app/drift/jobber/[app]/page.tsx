import { Box, Heading } from '@navikt/ds-react';
import { Jobboversikt } from 'components/drift/jobboversikt/Jobboversikt';
import {
  appInfo,
  AppNavn,
  hentFeilendeJobber,
  hentPlanlagteJobber,
  hentSisteKjørteJobber,
} from 'lib/services/driftService';
import { notFound } from 'next/navigation';
import { Page, PageBlock } from '@navikt/ds-react/Page';
import { JobberNavbar } from 'components/drift/navbar/JobberNavbar';
import { Metadata } from 'next';

interface Params {
  app: AppNavn;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { app } = await params;
  return {
    title: `Paw Patrol - Jobber (${app})`,
    description: `Viser jobber for ${app}`,
  };
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
    <>
      <JobberNavbar currentApp={app} />

      <Page>
        <PageBlock width="2xl">
          <Box marginBlock="space-32">
            <Heading size={'large'} spacing>
              Drift console
            </Heading>

            <Jobboversikt
              appNavn={app}
              feilendeJobber={feilendeJobber}
              planlagteJobber={planlagteJobber}
              sisteKjørteJobber={sisteKjørteJobber}
            />
          </Box>
        </PageBlock>
      </Page>
    </>
  );
};

export default DriftPage;
