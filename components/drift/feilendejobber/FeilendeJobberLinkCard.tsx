import { AppInfo, hentAntallFeilendeJobber } from 'lib/services/driftService';
import { LinkCard, LinkCardAnchor, LinkCardFooter, LinkCardIcon, LinkCardTitle } from '@navikt/ds-react/LinkCard';
import { CogRotationIcon } from '@navikt/aksel-icons';
import { Tag } from '@navikt/ds-react';

export const FeilendeJobberLinkCard = async ({ app }: { app: AppInfo }) => {
  const antallFeilendeJobber = await hentAntallFeilendeJobber(app.name);

  return (
    <LinkCard size="small">
      <LinkCardIcon>
        <CogRotationIcon fontSize="2rem" />
      </LinkCardIcon>
      <LinkCardTitle>
        <LinkCardAnchor href={`/drift/jobber/${app.name}`}>{app.displayName}</LinkCardAnchor>
      </LinkCardTitle>
      <LinkCardFooter>{tag(antallFeilendeJobber)}</LinkCardFooter>
    </LinkCard>
  );
};

const tag = (antallFeilendeJobber: number) => {
  if (antallFeilendeJobber === 0) {
    return null;
  } else if (antallFeilendeJobber > 0) {
    return (
      <Tag size="small" variant="warning">
        {antallFeilendeJobber} feilende jobb{antallFeilendeJobber > 1 && 'er'}
      </Tag>
    );
  }

  return (
    <Tag size="small" variant="error">
      Kunne ikke hente antall
    </Tag>
  );
};
