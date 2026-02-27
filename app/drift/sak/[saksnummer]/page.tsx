import { Page, PageBlock } from '@navikt/ds-react/Page';
import { hentRollerForBruker, Roller } from 'lib/azure/azureUserService';
import { Alert } from '@navikt/ds-react';
import { SakOversikt } from 'components/drift/sakogbehandling/SakOversikt';
import { SakNavbar } from 'components/drift/navbar/SakNavbar';

const SakPage = async ({ params }: { params: Promise<{ saksnummer: string }> }) => {
  const { saksnummer } = await params;

  const roller = await hentRollerForBruker();

  return (
    <>
      <SakNavbar saksnummer={saksnummer} />

      {roller.includes(Roller.DRIFT) ? (
        <SakOversikt saksnummer={saksnummer} />
      ) : (
        <Page>
          <PageBlock width="2xl">
            <Alert variant="warning">
              Du har ikke tilgang til denne siden. AD-rollen <strong>0000-GA-AAP_DRIFT</strong> er påkrevd for å gjøre
              hente saksinformasjon.
            </Alert>
          </PageBlock>
        </Page>
      )}
    </>
  );
};

export default SakPage;
