import { Alert, Heading } from '@navikt/ds-react';
import { Page, PageBlock } from '@navikt/ds-react/Page';
import { redirect } from 'next/navigation';
import { erFødselsnummer, erSaksnummer } from 'lib/utils/validering.ts';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SøkPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const søkeord = q?.trim() ?? '';

  if (!søkeord) {
    return (
      <Page>
        <PageBlock width="2xl">
          <Heading size="medium" spacing>
            Søk
          </Heading>
          <Alert variant="info">Kan ikke gjøre søk uten søkeord</Alert>
        </PageBlock>
      </Page>
    );
  }

  const kunSiffer = /^\d+$/.test(søkeord);

  // Kun siffer og færre enn 11, antas å være journalpostId
  if (kunSiffer && søkeord.length < 11) {
    redirect(`/drift/postmottak/${søkeord}`);
  }

  if (erFødselsnummer(søkeord)) {
    redirect(`/drift/sok/person`);
  }

  if (erSaksnummer(søkeord)) {
    redirect(`/drift/sak/${søkeord}`);
  }

  return (
    <Page>
      <PageBlock width="2xl">
        <Heading size="medium" spacing>
          Søk
        </Heading>
        <Alert variant="warning">
          Ukjent søkeformat for <strong>{søkeord}</strong>. <br />
          Forventet enten journalpostId (opptil 10 siffer) eller saksnummer (bokstaver og siffer).
          {/*, eller fødselsnummer (11 siffer).*/}
        </Alert>
      </PageBlock>
    </Page>
  );
}
