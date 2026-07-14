import { Box, Heading, HGrid, VStack } from '@navikt/ds-react';
import { Page, PageBlock } from '@navikt/ds-react/Page';
import { appInfo } from 'lib/services/driftService';
import { LinkCard, LinkCardAnchor, LinkCardIcon, LinkCardTitle } from '@navikt/ds-react/LinkCard';
import {
  BackwardIcon,
  ClockIcon,
  EnvelopeClosedIcon,
  FileJsonIcon,
  FilterIcon,
  MagnifyingGlassIcon,
  PersonIcon,
  StethoscopeIcon,
} from '@navikt/aksel-icons';
import { FeilendeJobberLinkCard } from 'components/drift/feilendejobber/FeilendeJobberLinkCard';
import { isDev, isLocal } from '@navikt/aap-felles-utils';

export default function Home() {
  return (
    <Page>
      <PageBlock width="xl">
        <VStack gap="space-24" marginBlock="space-32">
          <Box background="neutral-soft" padding="space-20" borderRadius="16">
            <Heading size="medium" spacing>
              Jobber
            </Heading>
            <HGrid columns={{ xs: 1, sm: 2, md: 3 }} gap="space-16">
              {appInfo.map((app) => (
                <FeilendeJobberLinkCard key={app.name} app={app} />
              ))}
            </HGrid>
          </Box>

          <Box background="neutral-soft" padding="space-20" borderRadius="16">
            <Heading size="medium" spacing>
              Oppslag
            </Heading>
            <HGrid columns={{ xs: 1, md: 2 }} gap="space-12">
              <LinkCard size="small">
                <LinkCardIcon>
                  <MagnifyingGlassIcon fontSize="2rem" />
                </LinkCardIcon>
                <LinkCardTitle>
                  <LinkCardAnchor href={`/sok/sak`}>Hent sak</LinkCardAnchor>
                </LinkCardTitle>
              </LinkCard>

              <LinkCard size="small">
                <LinkCardIcon>
                  <MagnifyingGlassIcon fontSize="2rem" />
                </LinkCardIcon>
                <LinkCardTitle>
                  <LinkCardAnchor href={`/sok/journalpost`}>Hent journalpost</LinkCardAnchor>
                </LinkCardTitle>
              </LinkCard>

              <LinkCard size="small">
                <LinkCardIcon>
                  <PersonIcon fontSize="2rem" />
                </LinkCardIcon>
                <LinkCardTitle>
                  <LinkCardAnchor href={`/sok/person`}>Hent persondata</LinkCardAnchor>
                </LinkCardTitle>
              </LinkCard>

              <LinkCard size="small">
                <LinkCardIcon>
                  <StethoscopeIcon fontSize="2rem" />
                </LinkCardIcon>
                <LinkCardTitle>
                  <LinkCardAnchor href={`/drift/behandleroppslag`}>Hent behandler</LinkCardAnchor>
                </LinkCardTitle>
              </LinkCard>

              {(isDev() || isLocal()) && (
                <LinkCard size="small">
                  <LinkCardIcon>
                    <FileJsonIcon fontSize="2rem" />
                  </LinkCardIcon>
                  <LinkCardTitle>
                    <LinkCardAnchor href={`/drift/api-intern`}>Oppslag mot API-intern</LinkCardAnchor>
                  </LinkCardTitle>
                </LinkCard>
              )}
            </HGrid>
          </Box>

          <Box background="neutral-soft" padding="space-20" borderRadius="16">
            <Heading size="medium" spacing>
              Utbetaling
            </Heading>
            <HGrid columns={{ xs: 1, md: 2 }} gap="space-12">
              <LinkCard size="small">
                <LinkCardIcon>
                  <MagnifyingGlassIcon fontSize="2rem" />
                </LinkCardIcon>
                <LinkCardTitle>
                  <LinkCardAnchor href={`/drift/utbetaling`}>Sjekk status på utbetalinger</LinkCardAnchor>
                </LinkCardTitle>
              </LinkCard>

              <LinkCard size="small">
                <LinkCardIcon>
                  <MagnifyingGlassIcon fontSize="2rem" />
                </LinkCardIcon>
                <LinkCardTitle>
                  <LinkCardAnchor href={`/drift/utbetaling/migrering`}>Sjekk migreringsstatus</LinkCardAnchor>
                </LinkCardTitle>
              </LinkCard>

              <LinkCard size="small">
                <LinkCardIcon>
                  <MagnifyingGlassIcon fontSize="2rem" />
                </LinkCardIcon>
                <LinkCardTitle>
                  <LinkCardAnchor href={`/drift/utbetaling/tidslinje`}>Utbetalinger for sak</LinkCardAnchor>
                </LinkCardTitle>
              </LinkCard>
            </HGrid>
          </Box>

          <Box background="neutral-soft" padding="space-20" borderRadius="16">
            <Heading size="medium" spacing>
              Annet
            </Heading>
            <HGrid columns={{ xs: 1, md: 2 }} gap="space-12">
              <LinkCard size="small">
                <LinkCardIcon>
                  <BackwardIcon fontSize="2rem" />
                </LinkCardIcon>
                <LinkCardTitle>
                  <LinkCardAnchor href={`/drift/behandlingsflyt`}>Sett aktivt steg for behandling</LinkCardAnchor>
                </LinkCardTitle>
              </LinkCard>

              <LinkCard size="small">
                <LinkCardIcon>
                  <EnvelopeClosedIcon fontSize="2rem" />
                </LinkCardIcon>
                <LinkCardTitle>
                  <LinkCardAnchor href={`/drift/postmottak`}>Trigg prosesser behandling i postmottak</LinkCardAnchor>
                </LinkCardTitle>
              </LinkCard>

              <LinkCard size="small">
                <LinkCardIcon>
                  <EnvelopeClosedIcon fontSize="2rem" />
                </LinkCardIcon>
                <LinkCardTitle>
                  <LinkCardAnchor href={`/drift/brev/avbryt`}>Avbryt brev i behandlingsflyt</LinkCardAnchor>
                </LinkCardTitle>
              </LinkCard>

              <LinkCard size="small">
                <LinkCardIcon>
                  <ClockIcon fontSize="2rem" />
                </LinkCardIcon>
                <LinkCardTitle>
                  <LinkCardAnchor href={`/drift/rettighetsperiode`}>
                    Utvid rettighetsperiode til Tid.Maks
                  </LinkCardAnchor>
                </LinkCardTitle>
              </LinkCard>

              <LinkCard size="small">
                <LinkCardIcon>
                  <PersonIcon fontSize="2rem" />
                </LinkCardIcon>
                <LinkCardTitle>
                  <LinkCardAnchor href={`/drift/person-identer/oppdater`}>Oppdater identer for sak</LinkCardAnchor>
                </LinkCardTitle>
              </LinkCard>

              <LinkCard size="small">
                <LinkCardIcon>
                  <FilterIcon fontSize="2rem" />
                </LinkCardIcon>
                <LinkCardTitle>
                  <LinkCardAnchor href={`/drift/oppgavefilter`}>Oppgavefiltre (køer)</LinkCardAnchor>
                </LinkCardTitle>
              </LinkCard>
            </HGrid>
          </Box>
        </VStack>
      </PageBlock>
    </Page>
  );
}
