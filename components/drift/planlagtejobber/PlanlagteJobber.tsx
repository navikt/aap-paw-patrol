'use client';

import { Heading } from '@navikt/ds-react';
import { JobbTabell } from 'components/drift/jobbtabell/JobbTabell';
import { JobbInfo } from 'lib/services/driftService';

interface Props {
  planlagteJobber: JobbInfo[];
}

export const PlanlagteJobber = ({ planlagteJobber }: Props) => {
  return (
    <div>
      <Heading size={'small'} level={'2'}>
        Planlagte jobber
      </Heading>
      <JobbTabell jobber={planlagteJobber} />
    </div>
  );
};
