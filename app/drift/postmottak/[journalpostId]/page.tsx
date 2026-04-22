import { Page, PageBlock } from '@navikt/ds-react/Page';
import { hentRollerForBruker, Roller } from 'lib/azure/azureUserService';
import { Alert } from '@navikt/ds-react';
import { JournalpostOversikt } from 'components/drift/postmottak/JournalpostOversikt';
import { Metadata } from 'next';

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

  return roller.includes(Roller.DRIFT) ? (
    <JournalpostOversikt journalpostId={journalpostId} />
  ) : (
    <Page>
      <PageBlock width="2xl">
        <Alert variant="warning">
          Du har ikke tilgang til denne siden. AD-rollen <strong>0000-GA-AAP_DRIFT</strong> er påkrevd.
        </Alert>
      </PageBlock>
    </Page>
  );
};

export default JournalpostPage;

