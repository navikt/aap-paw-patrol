import { BehandlingDriftsinfoDTO } from 'lib/types/avklaringsbehov';
import { BodyShort, Process, Table } from '@navikt/ds-react';
import { formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';

export const BehandlingInfo = ({ behandling }: { behandling: BehandlingDriftsinfoDTO }) =>
  !!behandling && (
    <Table>
      <Table.Body>
        {behandling?.avklaringsbehov?.map((behov, i) => (
          <Table.Row key={`${behov.definisjon}-${i}`}>
            <Table.DataCell>{behov.definisjon.kode}</Table.DataCell>
            <Table.DataCell>{behov.definisjon.løsesISteg}</Table.DataCell>
            <Table.DataCell>{behov.status}</Table.DataCell>
            <Table.DataCell>
              <Process>
                {behov.endringer.map((endring, i) => (
                  <Process.Event
                    key={`${behov.definisjon}-${i}`}
                    title={endring.status}
                    timestamp={formaterDatoMedTidspunktSekunderForFrontend(endring.tidsstempel)}
                  >
                    <BodyShort textColor="subtle" size="small">
                      {endring.endretAv}
                    </BodyShort>
                  </Process.Event>
                ))}
              </Process>
            </Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
