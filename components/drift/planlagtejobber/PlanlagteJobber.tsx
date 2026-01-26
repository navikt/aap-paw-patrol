'use client';

import { Heading } from '@navikt/ds-react';
import { JobbTabell } from 'components/drift/jobbtabell/JobbTabell';
import { AppNavn, JobbInfo } from 'lib/services/driftService';

interface Props {
  appNavn: AppNavn;
  planlagteJobber: JobbInfo[];
}

export const PlanlagteJobber = ({ planlagteJobber, appNavn }: Props) => {
  return (
    <div>
      <Heading size={'small'} level="2">
        Planlagte jobber
      </Heading>
      <JobbTabell jobber={planlagteJobber} appNavn={appNavn} />
    </div>
  );
};
