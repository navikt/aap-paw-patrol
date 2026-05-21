import { Heading, VStack } from '@navikt/ds-react';
import { Page, PageBlock } from '@navikt/ds-react/Page';
import { OppgavefilterOversikt } from 'components/drift/oppgavefilter/OppgavefilterOversikt';
import { hentBrukerInformasjon } from 'lib/azure/azureUserService';

export default async function OppgavefilterPage() {
  const bruker = await hentBrukerInformasjon();

  return (
    <Page>
      <PageBlock width="xl">
        <VStack gap="space-16" marginBlock="space-32">
          <Heading size="large">Oppgavefiltre (køer)</Heading>
          <OppgavefilterOversikt navIdent={bruker.NAVident ?? ''} />
        </VStack>
      </PageBlock>
    </Page>
  );
}
