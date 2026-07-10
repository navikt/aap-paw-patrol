import { Button, Dialog } from '@navikt/ds-react';
import { OppdaterPersonIdenter } from 'components/drift/person-identer/OppdaterPersonIdenter';
import { ArrowCirclepathIcon } from '@navikt/aksel-icons';

export const OppdaterIdenterModal = ({ saksnummer }: { saksnummer: string }) => {
  return (
    <Dialog>
      <Dialog.Trigger>
        <Button size="xsmall" variant="secondary" icon={<ArrowCirclepathIcon />}>
          Oppdater
        </Button>
      </Dialog.Trigger>

      <Dialog.Popup>
        <Dialog.Header>
          <Dialog.Title>Oppdater identer for sak ${saksnummer}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <OppdaterPersonIdenter overstyrtSaksnummer={saksnummer} />
        </Dialog.Body>
      </Dialog.Popup>
    </Dialog>
  );
};
