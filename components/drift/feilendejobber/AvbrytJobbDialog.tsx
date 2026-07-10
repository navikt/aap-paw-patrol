import { BodyShort, Button, Dialog } from '@navikt/ds-react';
import React, { useState } from 'react';
import { avbrytKjørendeJobb } from 'lib/clientApi';
import { AppNavn } from 'lib/services/driftService';

export const AvbrytJobbDialog = ({
  appNavn,
  jobbId,
  setResult,
}: {
  appNavn: AppNavn;
  jobbId: number;
  setResult: (result: { success: boolean; message: string } | undefined) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  async function onAvbrytJobbClick() {
    setResult(undefined);
    setIsLoading(true);
    await avbrytKjørendeJobb(appNavn, jobbId)
      .then(async (res) => setResult({ success: res.ok, message: await res.text() }))
      .catch((err) => setResult({ success: false, message: err.message || 'Noe gikk galt' }))
      .finally(() => setIsLoading(false));
  }

  return (
    <Dialog>
      <Dialog.Trigger>
        <Button size="small" variant="danger">
          Avbryt
        </Button>
      </Dialog.Trigger>
      <Dialog.Popup>
        <Dialog.Header>
          <Dialog.Title>Avbryt jobb (ID: {jobbId})</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <BodyShort spacing>Er du sikker på at du vil avbryte denne jobben?</BodyShort>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button type="button" variant="secondary" disabled={isLoading}>
              Nei, gå tilbake
            </Button>
          </Dialog.CloseTrigger>
          <Dialog.CloseTrigger>
            <Button type="button" variant="danger" onClick={onAvbrytJobbClick} loading={isLoading}>
              Ja, avbryt jobb
            </Button>
          </Dialog.CloseTrigger>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
