import { BodyShort, CopyButton, HelpText, Table, Tag } from '@navikt/ds-react';
import { formaterDatoForFrontend, formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import { capitalize, formaterBehandlingType } from 'lib/utils/formatting';
import { BehandlingDriftsinfo } from 'components/drift/sakogbehandling/behandlinger/BehandlingOversikt.tsx';

export const BehandlingTableRow = ({
  behandling,
  oppdaterValgtBehandling,
  erValgtBehandling,
  opplysningerFlettetInnIDenneBehandlingen,
}: {
  behandling: BehandlingDriftsinfo;
  oppdaterValgtBehandling: (behandling?: BehandlingDriftsinfo) => void;
  erValgtBehandling: boolean;
  opplysningerFlettetInnIDenneBehandlingen: boolean;
}) => (
  <Table.Row
    key={behandling.referanse}
    onClick={() => oppdaterValgtBehandling(behandling)}
    style={{
      background: erValgtBehandling ? 'var(--ax-bg-success-softA)' : 'inherit',
      cursor: 'pointer',
    }}
  >
    <Table.DataCell>{formaterBehandlingType(behandling.type)}</Table.DataCell>
    <Table.DataCell>
      <CopyButton
        size="xsmall"
        iconPosition="right"
        copyText={behandling.referanse}
        text={behandling.referanse}
        onClick={(event) => event.stopPropagation()}
        style={{ whiteSpace: 'nowrap', fontSize: 'var(--ax-font-size-small)' }}
      />
    </Table.DataCell>
    <Table.DataCell>
      <Tag variant="info" size="small" data-color={behandling.status === 'UTREDES' ? 'success' : undefined}>
        {capitalize(behandling.status)}
      </Tag>
    </Table.DataCell>
    <Table.DataCell>{behandling.vurderingsbehov.map((v) => capitalize(v)).join(', ')}</Table.DataCell>
    <Table.DataCell>{behandling.årsakTilOpprettelse ? capitalize(behandling.årsakTilOpprettelse) : '-'}</Table.DataCell>
    <Table.DataCell>
      <BodyShort style={{ whiteSpace: 'nowrap' }}>
        {formaterDatoMedTidspunktSekunderForFrontend(behandling.opprettet)}
      </BodyShort>
    </Table.DataCell>
    <Table.DataCell>
      {opplysningerFlettetInnIDenneBehandlingen && (
        <HelpText title="Flettet">
          Det finnes behandlinger opprettet etter denne vedtatt før denne, som betyr at opplysninger har blitt flettet
          inn i denne behandlingen.
        </HelpText>
      )}
    </Table.DataCell>
    <Table.DataCell>
      <BodyShort
        style={{ whiteSpace: 'nowrap' }}
        title={behandling.vedtatt ? formaterDatoMedTidspunktSekunderForFrontend(behandling.vedtatt) : undefined}
      >
        {behandling.vedtatt && formaterDatoForFrontend(behandling.vedtatt)}
        {behandling.vedtatt && behandling.vedtakId && ' / '}
        {behandling.vedtakId}
      </BodyShort>
    </Table.DataCell>
    <Table.DataCell>{erValgtBehandling && <CheckmarkCircleFillIcon style={{ color: 'green' }} />}</Table.DataCell>
  </Table.Row>
);
