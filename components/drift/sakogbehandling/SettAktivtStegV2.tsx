import { Alert, Button, UNSAFE_Combobox, VStack } from '@navikt/ds-react';
import { muligeSteg } from 'components/drift/settaktivtsteg/SettAktivtSteg';
import { useState } from 'react';
import { kjørFraSteg } from 'lib/clientApi';
import { ArrowCirclepathIcon } from '@navikt/aksel-icons';

export const SettAktivtStegV2 = ({
  behandlingsreferanse,
  refresh,
}: {
  behandlingsreferanse: string;
  refresh: () => void;
}) => {
  const [steg, setSteg] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();

  const onClick = async () => {
    setMessage(undefined);

    setError(undefined);

    if (!behandlingsreferanse || !steg) {
      setError('Behandlingsreferanse og steg må fylles ut');
      return;
    }

    setIsLoading(true);
    console.log('kjør-fra-steg', { behandlingsreferanse, steg });

    try {
      await kjørFraSteg(behandlingsreferanse, steg).then(async (res) => {
        if (res.ok) setMessage('ok 👍');
        else setError(await res.text());
      });
    } catch (err) {
      console.log(err);
      setError(`Noe gikk galt: ${err}`);
    }
    setIsLoading(false);
  };

  return (
    <VStack gap="space-16" marginBlock="space-32">
      <UNSAFE_Combobox
        label="Steg"
        options={Object.entries(muligeSteg).map(([key, value]) => ({ label: value, value: key }))}
        multiple={false}
        onToggleSelected={(value) => setSteg(value)}
        shouldAutocomplete={false}
      />

      <div>
        <Button onClick={onClick} loading={isLoading}>
          Sett aktivt steg
        </Button>
      </div>

      {message && (
        <VStack gap="space-8">
          <Alert variant="info">{message}</Alert>
          <Button variant="secondary" size="small" onClick={refresh} icon={<ArrowCirclepathIcon />}>
            Last behandling på nytt
          </Button>
        </VStack>
      )}
      {error && <Alert variant="error">{error}</Alert>}
    </VStack>
  );
};
