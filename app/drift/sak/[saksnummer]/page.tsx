import { Page, PageBlock } from '@navikt/ds-react/Page';
import { harDriftTilgang, harLeseTilgang, hentRollerForBruker } from 'lib/azure/azureUserService';
import { Alert } from '@navikt/ds-react';
import { SakOversikt } from 'components/drift/sakogbehandling/SakOversikt';
import { SakNavbar } from 'components/drift/navbar/SakNavbar';
import { IngenTilgangAlert } from 'components/drift/IngenTilgangAlert';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ saksnummer: string }> }): Promise<Metadata> {
  const { saksnummer } = await params;
  return {
    title: `Paw Patrol - Sak ${saksnummer}`,
    description: `Viser saksdetaljer for ${saksnummer}`,
  };
}

const SakPage = async ({ params }: { params: Promise<{ saksnummer: string }> }) => {
  const { saksnummer } = await params;

  const roller = await hentRollerForBruker();

  return (
    <Page>
      <SakNavbar saksnummer={saksnummer} />

      {harLeseTilgang(roller) ? (
        erGyldigSaksnummer(saksnummer) ? (
          <SakOversikt saksnummer={saksnummer} harDriftTilgang={harDriftTilgang(roller)} />
        ) : (
          <Alert variant="error" size="small">
            Saksnummer skal bestå av 7 tegn og inneholde både bokstaver og tall.
          </Alert>
        )
      ) : (
        <PageBlock width="2xl">
          <IngenTilgangAlert krevesLeseTilgang handling="hente saksinformasjon" />
        </PageBlock>
      )}
    </Page>
  );
};

const erGyldigSaksnummer = (saksnummer: string) => {
  if (!saksnummer) {
    return false;
  } else
    return !!(
      saksnummer &&
      (process.env.NAIS_APP_NAME !== 'prod-gcp' || /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z\d]{7}$/.test(saksnummer))
    );
};

export default SakPage;
