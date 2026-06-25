import { BodyShort, Label, List, VStack } from '@navikt/ds-react';
import { SakDriftsinfoDTO } from 'lib/types/avklaringsbehov';
import { formaterDatoForFrontend, formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import Link from 'next/link';

export const SakInfoPanel = ({ sak }: { sak: SakDriftsinfoDTO }) => (
  <VStack gap="space-32" marginBlock="space-0 space-32">
    <div>
      <Label>Rettighetsperiode</Label>
      <BodyShort>
        {formaterDatoForFrontend(sak.rettighetsperiode.fom)} - {formaterDatoForFrontend(sak.rettighetsperiode.tom)}
      </BodyShort>
    </div>
    <div>
      <Label>Opprettet</Label>
      <BodyShort>{formaterDatoMedTidspunktSekunderForFrontend(sak.opprettetTidspunkt)}</BodyShort>
    </div>
    <div>
      <Label>Behandlinger</Label>
      <BodyShort>
        {sak.behandlinger.length} ({sak.behandlinger.filter((b) => b.årsakTilOpprettelse === 'MELDEKORT').length}{' '}
        meldekort)
      </BodyShort>
    </div>
    <div>
      <Label>PersonId</Label>
      <BodyShort>{sak.person.personId}</BodyShort>
    </div>
    <div>
      <Label>Antall identer (fnr, dnr)</Label>
      <BodyShort>{sak.person.antallIdenter}</BodyShort>
    </div>
    <div>
      <Label>Andre saker på bruker</Label>
      <BodyShort>
        {!sak.andreSakerPåBruker?.length ? (
          'Ingen'
        ) : (
          <List>
            {sak.andreSakerPåBruker.map((saksnummer) => (
              <List.Item key={`rel-sak-${saksnummer}`}>
                <Link href={`/drift/sak/${saksnummer}`}>{saksnummer}</Link>
              </List.Item>
            ))}
          </List>
        )}
      </BodyShort>
    </div>
  </VStack>
);
