'use client';

import { PlanlagteJobber } from 'components/drift/planlagtejobber/PlanlagteJobber';
import { FeilendeJobber } from 'components/drift/feilendejobber/FeilendeJobber';
import { RekjørFeiledeJobber } from 'components/drift/rekjørfeiledejobber/RekjørFeiledeJobber';
import { SisteKjørteJobber } from 'components/drift/sistekjørtejobber/SisteKjørteJobber';
import { AppNavn, JobbInfo } from 'lib/services/driftService';
import { RekjørSpesifikkJobb } from 'components/drift/rekjørspesifikkjobb/RekjørSpesifikkJobb';
import { VStack } from '@navikt/ds-react';
import { isDev, isLocal } from '@navikt/aap-felles-utils';
import { AvbrytFeiledeJobber } from 'components/drift/avbrytfeiledejobber/AvbrytFeiledeJobber';

interface Props {
  appNavn: AppNavn;
  planlagteJobber: JobbInfo[];
  feilendeJobber: JobbInfo[];
  sisteKjørteJobber: JobbInfo[];
  navIdent: string;
}

export const Jobboversikt = ({ appNavn, planlagteJobber, feilendeJobber, sisteKjørteJobber, navIdent }: Props) => {
  return (
    <VStack gap="space-32">
      <RekjørFeiledeJobber appNavn={appNavn} />
      {(isLocal() || isDev()) && <AvbrytFeiledeJobber appNavn={appNavn} />}
      <RekjørSpesifikkJobb appNavn={appNavn} />
      <PlanlagteJobber planlagteJobber={planlagteJobber} appNavn={appNavn} />
      <FeilendeJobber appNavn={appNavn} jobber={feilendeJobber} navIdent={navIdent} />
      <SisteKjørteJobber sisteKjørteJobber={sisteKjørteJobber} />
    </VStack>
  );
};
