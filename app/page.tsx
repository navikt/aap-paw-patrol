import { Heading, HGrid, VStack } from '@navikt/ds-react';
import { Page, PageBlock } from '@navikt/ds-react/Page';
import { appInfo } from 'lib/services/driftService';
import { LinkCard, LinkCardAnchor, LinkCardIcon, LinkCardTitle } from '@navikt/ds-react/LinkCard';
import {
  BackwardIcon,
  CogRotationIcon,
  EnvelopeClosedIcon,
  MagnifyingGlassIcon,
  StethoscopeIcon,
} from '@navikt/aksel-icons';

export default function Home() {
  return (
    <Page>
      <PageBlock width="md">
        <VStack gap="space-16" marginBlock="space-32">
          <Heading size={'large'} spacing>
            Jobber
          </Heading>
          {appInfo.length > 0 && (
            <HGrid columns="3" gap="space-16">
              {appInfo.map((app) => (
                <LinkCard key={app.name} size="small">
                  <LinkCardIcon>
                    <CogRotationIcon fontSize="2rem" />
                  </LinkCardIcon>
                  <LinkCardTitle>
                    <LinkCardAnchor href={`/drift/jobber/${app.name}`}>{app.displayName}</LinkCardAnchor>
                  </LinkCardTitle>
                </LinkCard>
              ))}
            </HGrid>
          )}

          <Heading size={'large'} spacing>
            Annet
          </Heading>

          <LinkCard size="small">
            <LinkCardIcon>
              <MagnifyingGlassIcon fontSize="2rem" />
            </LinkCardIcon>
            <LinkCardTitle>
              <LinkCardAnchor href={`/drift/sak`}>Hent sak</LinkCardAnchor>
            </LinkCardTitle>
          </LinkCard>

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
              <StethoscopeIcon fontSize="2rem" />
            </LinkCardIcon>
            <LinkCardTitle>
              <LinkCardAnchor href={`/drift/behandleroppslag`}>Behandleroppslag</LinkCardAnchor>
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
        </VStack>
      </PageBlock>
    </Page>
  );
}
