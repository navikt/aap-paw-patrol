import { BodyShort, Button, TextField } from '@navikt/ds-react';
import { rekjørJobb } from 'lib/clientApi';
import { AppNavn } from 'lib/services/driftService';
import { useState } from 'react';

export const RekjørSpesifikkJobb = ({ appNavn }: { appNavn: AppNavn }) => {
  const [jobbId, setJobbId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const onClick = async (jobbId: string, appNavn: AppNavn) => {
    setIsLoading(true);
    setMessage('');

    if (!jobbId) {
      setMessage('JobbId må fylles ut');
      setIsLoading(false);
      return;
    }

    if (isNaN(parseInt(jobbId))) {
      setMessage('JobbId må være et heltall');
      setIsLoading(false);
      return;
    }

    try {
      const rekjørRes = await rekjørJobb(appNavn, parseInt(jobbId));
      if (rekjørRes.ok) {
        const message = await rekjørRes.text();
        setMessage(message);
      } else {
        const message = await rekjørRes.text();
        setMessage(message);
      }
    } catch (err) {
      console.log(err);
      setMessage('Noe gikk galt');
    }

    setIsLoading(false);
  };
  // kjørJobb
  return (
    <div>
      <TextField
        label="JobbId"
        description="Må være et heltall"
        value={jobbId}
        onChange={(e) => setJobbId(e.target.value)}
      />
      <Button variant="primary" onClick={() => onClick(jobbId, appNavn)} loading={isLoading}>
        Rekjør spesifikk jobb
      </Button>
      {message && <BodyShort>{message}</BodyShort>}
    </div>
  );
};
