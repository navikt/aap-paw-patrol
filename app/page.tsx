import { Heading, HGrid, VStack } from '@navikt/ds-react';
import { Page, PageBlock } from '@navikt/ds-react/Page';
import { appInfo } from 'lib/services/driftService';
import { LinkCard, LinkCardAnchor, LinkCardIcon, LinkCardTitle } from '@navikt/ds-react/LinkCard';
import {
  BackwardIcon,
  ClockIcon,
  EnvelopeClosedIcon,
  FileJsonIcon,
  MagnifyingGlassIcon,
  StethoscopeIcon,
  PersonIcon,
} from '@navikt/aksel-icons';
import { FeilendeJobberLinkCard } from 'components/drift/feilendejobber/FeilendeJobberLinkCard';
import { isDev, isLocal } from '@navikt/aap-felles-utils';

export default function Home() {
  return (
    <Page>
      <PageBlock width="md">
        <VStack gap="space-16" marginBlock="space-32">
          <Heading size={'large'} spacing>
            Jobber
          </Heading>

          <HGrid columns="3" gap="space-16">
            {appInfo.map((app) => (
              <FeilendeJobberLinkCard key={app.name} app={app} />
            ))}
          </HGrid>

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

          <LinkCard size="small">
            <LinkCardIcon>
              <ClockIcon fontSize="2rem" />
            </LinkCardIcon>
            <LinkCardTitle>
              <LinkCardAnchor href={`/drift/rettighetsperiode`}>Utvid rettighetsperiode til Tid.Maks</LinkCardAnchor>
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

          {(isDev() || isLocal()) ? (
            <LinkCard size="small">
              <LinkCardIcon>
                <FileJsonIcon fontSize="2rem" />
              </LinkCardIcon>
              <LinkCardTitle>
                <LinkCardAnchor href={`/drift/api-intern`}>Oppslag mot API-intern</LinkCardAnchor>
              </LinkCardTitle>
            </LinkCard>
          ) : null}
        </VStack>
      </PageBlock>
    </Page>
  );
}
