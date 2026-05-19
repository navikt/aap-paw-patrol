import { Heading, VStack } from '@navikt/ds-react';
import { Page, PageBlock } from '@navikt/ds-react/Page';
import { OppgavefilterOversikt } from 'components/drift/oppgavefilter/OppgavefilterOversikt';

export default function OppgavefilterPage() {
  return (
    <Page>
      <PageBlock width="xl">
        <VStack gap="space-16" marginBlock="space-32">
          <Heading size="large">Oppgavefiltre (køer)</Heading>
          <OppgavefilterOversikt />
        </VStack>
      </PageBlock>
    </Page>
  );
}

