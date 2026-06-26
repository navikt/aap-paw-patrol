import { useEffect, useState } from 'react';
import { hentMeldekortDriftsinfo } from 'lib/clientApi';
import { MeldekortDriftsinfoDto } from 'lib/types/meldekort';
import { Alert, Box, Loader } from '@navikt/ds-react';
import { MeldekortVarsler } from 'components/drift/sakogbehandling/meldekort/MeldekortVarsler';
import { MeldekortUtfyllinger } from 'components/drift/sakogbehandling/meldekort/MeldekortUtfyllinger';
import { MeldekortAktuelleMeldeperioder } from 'components/drift/sakogbehandling/meldekort/MeldekortAktuelleMeldeperioder';
import { MeldekortHistoriskeMeldeperioder } from 'components/drift/sakogbehandling/meldekort/MeldekortHistoriskeMeldeperioder';

export const Meldekort = ({ saksnummer }: { saksnummer: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<MeldekortDriftsinfoDto>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (saksnummer) {
        await hentMeldekortDriftsinfo(saksnummer)
          .then(async (res) => {
            if (res.ok) return await res.json();
            else throw Error(await res.text());
          })
          .then((result: MeldekortDriftsinfoDto) => {
            setData(result);
          })
          .catch((err) => setError(`Noe gikk galt: ${err}`))
          .finally(() => setIsLoading(false));
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [saksnummer]);

  if (isLoading) return <Loader />;

  return (
    <Box padding="space-16">
      {error && <Alert variant="error">{error}</Alert>}

      <MeldekortAktuelleMeldeperioder aktuelleMeldeperioder={data?.aktuelleMeldeperioder || []} />

      <MeldekortHistoriskeMeldeperioder historiskeMeldeperioder={data?.historiskeMeldeperioder || []} />

      <MeldekortUtfyllinger utfyllinger={data?.utfyllinger || []} />

      <MeldekortVarsler varsler={data?.varsler || []} />
    </Box>
  );
};
