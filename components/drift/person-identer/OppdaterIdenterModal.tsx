import { Button, Modal } from '@navikt/ds-react';
import { useState } from 'react';
import { OppdaterPersonIdenter } from 'components/drift/person-identer/OppdaterPersonIdenter';
import { ArrowCirclepathIcon } from '@navikt/aksel-icons';

export const OppdaterIdenterModal = ({ saksnummer }: { saksnummer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="xsmall" onClick={() => setIsOpen(true)} variant="secondary" icon={<ArrowCirclepathIcon />}>
        Oppdater
      </Button>

      <Modal
        onClose={() => setIsOpen(false)}
        open={isOpen}
        size="medium"
        header={{ heading: `Oppdater identer for sak ${saksnummer}` }}
      >
        <Modal.Body>
          <OppdaterPersonIdenter overstyrtSaksnummer={saksnummer} />
        </Modal.Body>
      </Modal>
    </>
  );
};
