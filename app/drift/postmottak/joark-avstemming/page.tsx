import { Alert, BodyShort, Heading, Link, VStack } from '@navikt/ds-react';
import { Page, PageBlock } from '@navikt/ds-react/Page';
import { Table, TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table';
import { IngenTilgangAlert } from 'components/drift/IngenTilgangAlert';
import { harLeseTilgang, hentRollerForBruker } from 'lib/azure/azureUserService';
import { hentJoarkAvstemming } from 'lib/services/driftService';
import { formaterDatoForFrontend, formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';

export default async function JoarkAvstemmingPage() {
  const roller = await hentRollerForBruker();

  if (!harLeseTilgang(roller)) {
    return (
      <Page>
        <PageBlock width="lg">
          <IngenTilgangAlert krevesLeseTilgang handling="oppslag i Joark-avstemming" />
        </PageBlock>
      </Page>
    );
  }

  const rapport = await hentJoarkAvstemming();

  return (
    <Page>
      <PageBlock width="lg">
        <VStack gap="space-16" marginBlock="space-32">
          <Heading size="large">Joark-avstemming</Heading>
          <BodyShort>Siste avstemmingsrapport fra postmottak.</BodyShort>
          <BodyShort>
            Startet:{' '}
            {rapport.startetTidspunkt
              ? formaterDatoMedTidspunktSekunderForFrontend(rapport.startetTidspunkt)
              : 'Ikke startet'}
          </BodyShort>
          <BodyShort>
            Fullført:{' '}
            {rapport.fullfortTidspunkt
              ? formaterDatoMedTidspunktSekunderForFrontend(rapport.fullfortTidspunkt)
              : 'Ikke fullført'}
          </BodyShort>
          {rapport.resultater.length === 0 ? (
            <Alert variant="info">
              {rapport.startetTidspunkt
                ? 'Ingen journalposter i avstemmingsrapporten.'
                : 'Ingen avstemmingsrapport tilgjengelig ennå.'}
            </Alert>
          ) : (
            <>
              <BodyShort>Antall journalposter: {rapport.resultater.length}</BodyShort>
              <Table size="small">
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>Journalpost-ID</TableHeaderCell>
                    <TableHeaderCell>Utfall</TableHeaderCell>
                    <TableHeaderCell>Kanal</TableHeaderCell>
                    <TableHeaderCell>Dato opprettet</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rapport.resultater.map((resultat) => (
                    <TableRow key={resultat.journalpostId}>
                      <TableDataCell>
                        <Link href={`/drift/postmottak/${resultat.journalpostId}`}>{resultat.journalpostId}</Link>
                      </TableDataCell>
                      <TableDataCell>{resultat.utfall}</TableDataCell>
                      <TableDataCell>{resultat.kanal ?? '-'}</TableDataCell>
                      <TableDataCell>
                        {resultat.datoOpprettet ? formaterDatoForFrontend(resultat.datoOpprettet) : '-'}
                      </TableDataCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </VStack>
      </PageBlock>
    </Page>
  );
}
