'use client';

import { BodyShort, Loader } from '@navikt/ds-react';
import { type FetchJsonBody, hentPostmottakVurderinger } from 'lib/clientApi';
import { useEffect, useState } from 'react';

import { Vurderinger } from './Vurderinger';

export const VurderingerPanel = ({ journapostId }: { journapostId: string }) => {
  const [vurderinger, setVurderinger] = useState<FetchJsonBody<ReturnType<typeof hentPostmottakVurderinger>> | null>();
  const [melding, setMelding] = useState<string>();

  useEffect(() => {
    const hent = async () => {
      try {
        const response = await hentPostmottakVurderinger(journapostId);
        if (!response.ok) throw new Error('Kunne ikke hente vurderingene.');
        setVurderinger(await response.json());
      } catch {
        setMelding('Kunne ikke hente vurderingene.');
      }
    };

    void hent();
  }, [journapostId]);

  if (melding) return <BodyShort role="status">{melding}</BodyShort>;
  if (vurderinger === undefined) return <Loader title="Henter vurderinger" />;
  return <Vurderinger vurderinger={vurderinger} />;
};
