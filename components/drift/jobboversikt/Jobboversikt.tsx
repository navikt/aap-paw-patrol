'use client';

import { PlanlagteJobber } from 'components/drift/planlagtejobber/PlanlagteJobber';
import { FeilendeJobber } from 'components/drift/feilendejobber/FeilendeJobber';
import { RekjørFeiledeJobber } from 'components/drift/rekjørfeiledejobber/RekjørFeiledeJobber';
import { SisteKjørteJobber } from 'components/drift/sistekjørtejobber/SisteKjørteJobber';
import { AppNavn, JobbInfo } from 'lib/services/driftService';

interface Props {
  appNavn: AppNavn;
  planlagteJobber: JobbInfo[];
  feilendeJobber: JobbInfo[];
  sisteKjørteJobber: JobbInfo[];
}
export const Jobboversikt = ({ appNavn, planlagteJobber, feilendeJobber, sisteKjørteJobber }: Props) => {
  return (
    <div className={'flex-column'}>
      <RekjørFeiledeJobber appNavn={appNavn} />
      <PlanlagteJobber planlagteJobber={planlagteJobber} appNavn={appNavn} />
      <FeilendeJobber appNavn={appNavn} jobber={feilendeJobber} />
      <SisteKjørteJobber sisteKjørteJobber={sisteKjørteJobber} />
    </div>
  );
};
