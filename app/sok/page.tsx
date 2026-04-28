import { Alert, Heading } from '@navikt/ds-react';
import { Page, PageBlock } from '@navikt/ds-react/Page';
import { redirect } from 'next/navigation';

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

  // Nøyaktig 11 siffer antas å være fødselsnummer
  // TODO: Håndtere fødselsnummer
  if (kunSiffer && søkeord.length === 11) {
    return (
      <Page>
        <PageBlock width="2xl">
          <Heading size="medium" spacing>
            Søk
          </Heading>
          <Alert variant="info">Fødselsnummer-søk er ikke implementert ennå.</Alert>
        </PageBlock>
      </Page>
    );
  }

  // Saksnummer skal bestå av både tall og bokstaver
  const erSaksnummer = /[a-zA-ZæøåÆØÅ]/.test(søkeord) && /\d/.test(søkeord);

  if (erSaksnummer) {
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
