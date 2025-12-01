import { Alert, Heading, VStack } from '@navikt/ds-react';
import { AppNavn, JobbInfo } from 'lib/services/driftService';
import { FeilendeJobbPanel } from 'components/drift/feilendejobber/FeilendeJobbPanel';

interface Props {
  appNavn: AppNavn;
  jobber: JobbInfo[];
}

export const FeilendeJobber = ({ jobber, appNavn }: Props) => {
  return (
    <VStack gap="4" marginBlock="8">
      <Heading size={'small'} level={'3'}>
        Feilende jobber
      </Heading>

      {jobber.length > 0 ? (
        <>
          <Alert variant={'error'}>Det finnes {jobber.length} feilede jobb(er)</Alert>

          <VStack gap="4">
            {jobber.map((jobb, index) => (
              <FeilendeJobbPanel jobb={jobb} appNavn={appNavn} key={index} />
            ))}
          </VStack>
        </>
      ) : (
        <Alert variant={'success'}>Det finnes ingen feilende jobber</Alert>
      )}
    </VStack>
  );
};
