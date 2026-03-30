'use client';

import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { avbrytAlleFeiledeJobber } from 'lib/clientApi';
import { AppNavn } from 'lib/services/driftService';
import React, { useState } from 'react';
import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';

interface Props {
  appNavn: AppNavn;
}

export const AvbrytFeiledeJobber = ({ appNavn }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [visAvbrytModal, setVisAvbrytModal] = useState<boolean>(false);

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
      setMessage('Noe gikk galt');
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  return (
    <div>
      <Button variant="danger" onClick={() => setVisAvbrytModal(true)} loading={isLoading}>
        Avbryt alle feilede jobber
      </Button>
      {message && <BodyShort>{message}</BodyShort>}

      <Modal
        open={visAvbrytModal}
        header={{
          heading: `Avbryt alle jobber`,
          icon: <ExclamationmarkTriangleIcon fontSize={'inherit'} />,
        }}
        onClose={() => {
          setVisAvbrytModal(false);
        }}
        onBeforeClose={() => {
          setVisAvbrytModal(false);
          return true;
        }}
      >
        <Modal.Body>
          <BodyShort spacing>Er du sikker på at du vil avbryte ALLE feilede jobber for denne applikasjonen?</BodyShort>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={() => setVisAvbrytModal(false)}>
            Nei, gå tilbake
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={async () => {
              await onAvbrytAlleJobberClick();

              setVisAvbrytModal(false);
            }}
          >
            Ja, avbryt alle feilede jobber
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
