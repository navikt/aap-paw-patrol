import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import { Alert } from 'components/felles/alert/Alert.tsx';
import { Page, PageBlock } from '@navikt/ds-react/Page';
import { IngenTilgangAlert } from 'components/drift/IngenTilgangAlert';
import { JoarkAvstemmingDataGrid } from 'components/drift/postmottak/JoarkAvstemmingDataGrid';
import { harLeseTilgang, hentRollerForBruker } from 'lib/azure/azureUserService';
import { hentJoarkAvstemming } from 'lib/services/driftService';
import { formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';

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
              <JoarkAvstemmingDataGrid resultater={rapport.resultater} />
            </>
          )}
        </VStack>
      </PageBlock>
    </Page>
  );
}
