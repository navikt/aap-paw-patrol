import { Page, PageBlock } from '@navikt/ds-react/Page';
import { harLeseTilgang, hentRollerForBruker } from 'lib/azure/azureUserService';
import { JournalpostOversikt } from 'components/drift/postmottak/JournalpostOversikt';
import { IngenTilgangAlert } from 'components/drift/IngenTilgangAlert';
import { Metadata } from 'next';
import { JournalpostNavbar } from 'components/drift/navbar/JournalpostNavbar.tsx';

export async function generateMetadata({ params }: { params: Promise<{ journalpostId: string }> }): Promise<Metadata> {
  const { journalpostId } = await params;
  return {
    title: `Paw Patrol - Journalpost ${journalpostId}`,
    description: `Viser journalpostdetaljer for ${journalpostId}`,
  };
}

const JournalpostPage = async ({ params }: { params: Promise<{ journalpostId: string }> }) => {
  const { journalpostId } = await params;
  const roller = await hentRollerForBruker();

  return (
    <Page>
      <JournalpostNavbar journalpostId={journalpostId} />

      {harLeseTilgang(roller) ? (
        <JournalpostOversikt journalpostId={journalpostId} />
      ) : (
        <PageBlock width="2xl">
          <IngenTilgangAlert krevesLeseTilgang />
        </PageBlock>
      )}
    </Page>
  );
};

export default JournalpostPage;
