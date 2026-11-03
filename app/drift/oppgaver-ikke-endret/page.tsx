import { Alert, BodyShort, Button, Heading, HStack, Select, TextField, VStack } from '@navikt/ds-react';
import { Page, PageBlock } from '@navikt/ds-react/Page';
import { IngenTilgangAlert } from 'components/drift/IngenTilgangAlert';
import { OppgaverIkkeEndretDataGrid } from 'components/drift/oppgave/OppgaverIkkeEndretDataGrid';
import { harLeseTilgang, hentRollerForBruker } from 'lib/azure/azureUserService';
import { hentOppgaverIkkeEndret } from 'lib/services/oppgaveService';

type Query = { antallUker?: string | string[]; kunUreserverte?: string | string[] };

export default async function OppgaverIkkeEndretPage({ searchParams }: { searchParams: Promise<Query> }) {
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

  const query = await searchParams;
  const antallUkerTekst = typeof query.antallUker === 'string' ? query.antallUker : '';
  const antallUker = antallUkerTekst === '' ? null : Number(antallUkerTekst);
  const antallUkerFeil =
    Array.isArray(query.antallUker) ||
    (antallUker !== null && (!/^\d+$/.test(antallUkerTekst) || !Number.isSafeInteger(antallUker) || antallUker < 1))
      ? 'Antall uker må være et positivt heltall.'
      : undefined;
  const kunUreserverteTekst = typeof query.kunUreserverte === 'string' ? query.kunUreserverte : '';
  const kunUreserverteFeil =
    Array.isArray(query.kunUreserverte) || !['', 'true', 'false'].includes(kunUreserverteTekst)
      ? 'Velg default, kun ureserverte eller alle oppgaver.'
      : undefined;
  const kunUreserverte = kunUreserverteTekst === '' ? null : kunUreserverteTekst === 'true';
  const oppgaver =
    antallUkerFeil || kunUreserverteFeil ? null : await hentOppgaverIkkeEndret(antallUker, kunUreserverte);
  return (
    <Page>
      <PageBlock width="2xl">
        <VStack gap="space-16" marginBlock="space-32">
          <Heading size="large">Gamle oppgaver som ikke er endret</Heading>
          <BodyShort>Oppgaver som oppgavetjenesten har identifisert som gamle og ikke endret.</BodyShort>
          <form method="get" action="/drift/oppgaver-ikke-endret">
            <HStack gap="space-16" wrap align="end">
              <TextField
                label="Antall uker uten endring"
                name="antallUker"
                type="number"
                min={1}
                step={1}
                size="small"
                defaultValue={antallUkerTekst}
                placeholder="(5 uker)"
                error={antallUkerFeil}
              />
              <Select
                label="Reservering"
                name="kunUreserverte"
                size="small"
                defaultValue={kunUreserverteTekst}
                error={kunUreserverteFeil}
              >
                <option value="">Default (kun ureserverte)</option>
                <option value="true">Kun ureserverte oppgaver</option>
                <option value="false">Alle oppgaver</option>
              </Select>
              <Button type="submit" size="small">
                Hent oppgaver
              </Button>
            </HStack>
          </form>
          {oppgaver !== null &&
            (oppgaver.length === 0 ? (
              <Alert variant="info">Ingen gamle oppgaver som ikke er endret.</Alert>
            ) : (
              <OppgaverIkkeEndretDataGrid key={`${antallUker}:${kunUreserverte}`} oppgaver={oppgaver} />
            ))}
        </VStack>
      </PageBlock>
    </Page>
  );
}
