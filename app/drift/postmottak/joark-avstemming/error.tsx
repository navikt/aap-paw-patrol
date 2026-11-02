'use client';

import { Alert, Button, VStack } from '@navikt/ds-react';

export default function JoarkAvstemmingError({ reset }: { reset: () => void }) {
  return (
    <VStack gap="space-16" marginBlock="space-32">
      <Alert variant="error">Kunne ikke hente avstemmingsrapporten fra postmottak.</Alert>
      <div>
        <Button onClick={reset}>Prøv igjen</Button>
      </div>
    </VStack>
  );
}
