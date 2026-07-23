import { Alert, Chips, Heading, VStack } from '@navikt/ds-react';
import { AppNavn, JobbInfo } from 'lib/services/driftService';
import { FeilendeJobbPanel } from 'components/drift/feilendejobber/FeilendeJobbPanel';
import { useState } from 'react';

interface Props {
  appNavn: AppNavn;
  jobber: JobbInfo[];
}

export const FeilendeJobber = ({ jobber, appNavn }: Props) => {
  const [valgtType, setValgtType] = useState<string | null>(null);

  const typerMedAntall = jobber.reduce<Record<string, number>>((acc, jobb) => {
    acc[jobb.type] = (acc[jobb.type] ?? 0) + 1;
    return acc;
  }, {});

  const synligeJobber = valgtType ? jobber.filter((jobb) => jobb.type === valgtType) : jobber;

  return (
    <VStack gap="space-16" marginBlock="space-32">
      <Heading size={'small'} level={'3'}>
        Feilende jobber
      </Heading>

      {jobber.length > 0 ? (
        <>
          <Alert variant={'error'}>Det finnes {jobber.length} feilede jobb(er)</Alert>

          <Chips>
            {Object.entries(typerMedAntall).map(([type, antall]) => (
              <Chips.Toggle
                key={type}
                selected={valgtType === type}
                onClick={() => setValgtType(valgtType === type ? null : type)}
              >
                {`${type} (${antall})`}
              </Chips.Toggle>
            ))}
          </Chips>

          <VStack gap="space-16">
            {synligeJobber.map((jobb) => (
              <FeilendeJobbPanel jobb={jobb} appNavn={appNavn} key={`feilet-jobb-${jobb.id}`} />
            ))}
          </VStack>
        </>
      ) : (
        <Alert variant={'success'}>Det finnes ingen feilende jobber</Alert>
      )}
    </VStack>
  );
};
