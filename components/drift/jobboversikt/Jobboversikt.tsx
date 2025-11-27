'use client';

import { PlanlagteJobber } from 'components/drift/planlagtejobber/PlanlagteJobber';
import { FeilendeJobber } from 'components/drift/feilendejobber/FeilendeJobber';
import { RekjørFeiledeJobber } from 'components/drift/rekjørfeiledejobber/RekjørFeiledeJobber';
import { SisteKjørteJobber } from 'components/drift/sistekjørtejobber/SisteKjørteJobber';
import { AppNavn, JobbInfo } from 'lib/services/driftService';
import { RekjørSpesifikkJobb } from 'components/drift/rekjørspesifikkjobb/RekjørSpesifikkJobb';
import { VStack } from '@navikt/ds-react';

interface Props {
  appNavn: AppNavn;
  planlagteJobber: JobbInfo[];
  feilendeJobber: JobbInfo[];
  sisteKjørteJobber: JobbInfo[];
}
export const Jobboversikt = ({ appNavn, planlagteJobber, feilendeJobber, sisteKjørteJobber }: Props) => {
  return (
    <VStack gap="8">
      <RekjørFeiledeJobber appNavn={appNavn} />
      <RekjørSpesifikkJobb appNavn={appNavn} />
      <PlanlagteJobber planlagteJobber={planlagteJobber} appNavn={appNavn} />
      <FeilendeJobber appNavn={appNavn} jobber={feilendeJobber} />
      <SisteKjørteJobber sisteKjørteJobber={sisteKjørteJobber} />
    </VStack>
  );
};
