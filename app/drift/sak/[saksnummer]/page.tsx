import { Page, PageBlock } from '@navikt/ds-react/Page';
import { hentRollerForBruker, Roller } from 'lib/azure/azureUserService';
import { Alert } from '@navikt/ds-react';
import { SakOversikt } from 'components/drift/sakogbehandling/SakOversikt';
import { SakNavbar } from 'components/drift/navbar/SakNavbar';
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
    <>
      <SakNavbar saksnummer={saksnummer} />

      {roller.includes(Roller.DRIFT) ? (
        erGyldigSaksnummer(saksnummer) ? (
          <SakOversikt saksnummer={saksnummer} />
        ) : (
          <Alert variant="error" size="small">
            Saksnummer skal bestå av 7 tegn og inneholde både bokstaver og tall.
          </Alert>
        )
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
