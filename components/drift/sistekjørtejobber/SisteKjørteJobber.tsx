import React from 'react';
import { Heading, VStack } from '@navikt/ds-react';
import { JobbTabell } from 'components/drift/jobbtabell/JobbTabell';
import { JobbInfo } from 'lib/services/driftService';

interface Props {
  sisteKjørteJobber: JobbInfo[];
}

export const SisteKjørteJobber = ({ sisteKjørteJobber }: Props) => {
  return (
    <VStack>
      <Heading size={'small'} level={'3'} spacing>
        Siste kjørte jobber
      </Heading>
      <JobbTabell jobber={sisteKjørteJobber} />
    </VStack>
  );
};
