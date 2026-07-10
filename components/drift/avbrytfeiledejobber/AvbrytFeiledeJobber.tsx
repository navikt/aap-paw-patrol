'use client';

import { BodyLong, BodyShort, Button, Dialog } from '@navikt/ds-react';
import { avbrytAlleFeiledeJobber } from 'lib/clientApi';
import { AppNavn } from 'lib/services/driftService';
import React, { useState } from 'react';

export const AvbrytFeiledeJobber = ({ appNavn }: { appNavn: AppNavn }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  async function onAvbrytAlleJobberClick() {
    setIsLoading(true);
    try {
      const avbrytRes = await avbrytAlleFeiledeJobber(appNavn);
      if (avbrytRes.ok) {
        const message = await avbrytRes.text();
        setMessage(message);
      } else {
        const message = await avbrytRes.text();
        setMessage(message);
      }
    } catch (err) {
      console.log(err);
      setMessage(`Noe gikk galt: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Dialog>
        <Dialog.Trigger>
          <Button variant="danger">Avbryt alle feilende jobber</Button>
        </Dialog.Trigger>

        <Dialog.Popup role="alertdialog" closeOnOutsideClick={false}>
          <Dialog.Header withClosebutton={false}>
            <Dialog.Title>Avbryt alle jobber</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <BodyLong>Er du sikker på at du vil avbryte ALLE feilede jobber for denne applikasjonen?</BodyLong>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.CloseTrigger>
              <Button variant="secondary" data-color="neutral" disabled={isLoading}>
                Nei, gå tilbake
              </Button>
            </Dialog.CloseTrigger>
            <Dialog.CloseTrigger>
              <Button variant="danger" onClick={onAvbrytAlleJobberClick} loading={isLoading}>
                Ja, avbryt alle
              </Button>
            </Dialog.CloseTrigger>
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog>

      {message && <BodyShort>{message}</BodyShort>}
    </div>
  );
};
