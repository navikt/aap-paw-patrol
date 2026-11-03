import { Alert, BodyShort, Heading, VStack } from '@navikt/ds-react';
import { Page, PageBlock } from '@navikt/ds-react/Page';
import { IngenTilgangAlert } from 'components/drift/IngenTilgangAlert';
import { OppgaverIkkeEndretDataGrid } from 'components/drift/oppgave/OppgaverIkkeEndretDataGrid';
import { harLeseTilgang, hentRollerForBruker } from 'lib/azure/azureUserService';
import { hentOppgaverIkkeEndret } from 'lib/services/oppgaveService';

export default async function OppgaverIkkeEndretPage() {
  const roller = await hentRollerForBruker();
  if (!harLeseTilgang(roller)) {
    return (
      <Page>
        <PageBlock width="2xl">
          <IngenTilgangAlert krevesLeseTilgang handling="oppslag i gamle oppgaver" />
        </PageBlock>
      </Page>
    );
  }

  const oppgaver = await hentOppgaverIkkeEndret();
  return (
    <Page>
      <PageBlock width="2xl">
        <VStack gap="space-16" marginBlock="space-32">
          <Heading size="large">Gamle oppgaver som ikke er endret</Heading>
          <BodyShort>Oppgaver som oppgavetjenesten har identifisert som gamle og ikke endret.</BodyShort>
          {oppgaver.length === 0 ? (
            <Alert variant="info">Ingen gamle oppgaver som ikke er endret.</Alert>
          ) : (
            <OppgaverIkkeEndretDataGrid oppgaver={oppgaver} />
          )}
        </VStack>
      </PageBlock>
    </Page>
  );
}
