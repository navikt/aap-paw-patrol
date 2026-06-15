'use client';
import { useState } from 'react';
import { Alert, Button, HStack, Table, Tag, UNSAFE_Combobox, VStack } from '@navikt/ds-react';
import { hentTidligereVurderinger } from 'lib/clientApi';
import {
  BehandlingsutfallType,
  RettighetsType,
  rettighetsTypeHjemmel,
  TidligereVurderingerDto,
} from 'lib/types/tidligereVurderinger';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { revurderingSteg } from 'components/drift/settaktivtsteg/SettAktivtSteg';

const stegOptions = Object.entries(revurderingSteg).map(([key, value]) => ({ label: value, value: key }));

export const TidligereVurderinger = ({ behandlingsreferanse }: { behandlingsreferanse: string }) => {
  const [førSteg, setFørSteg] = useState<string>();
  const [etterSteg, setEtterSteg] = useState<string>();
  const [vurderinger, setVurderinger] = useState<TidligereVurderingerDto>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const hent = async () => {
    setError(undefined);
    setVurderinger(undefined);
    setIsLoading(true);
    try {
      const res = await hentTidligereVurderinger(behandlingsreferanse, førSteg, etterSteg);
      if (res.ok) {
        setVurderinger(await res.json());
      } else {
        setError(await res.text());
      }
    } catch (err) {
      setError(`Noe gikk galt: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const tidligereVurderinger = vurderinger?.tidligereVurderinger ?? [];

  return (
    <VStack gap="space-16" paddingBlock="space-32" paddingInline="space-16">
      <HStack gap="space-16" align="end">
        <UNSAFE_Combobox
          label="Etter steg"
          options={stegOptions}
          defaultValue={revurderingSteg['VURDER_ALDER']}
          multiple={false}
          onToggleSelected={(value, isSelected) => setEtterSteg(isSelected ? value : undefined)}
          shouldAutocomplete
          clearButton
        />
        <UNSAFE_Combobox
          label="Frem til steg"
          options={stegOptions}
          defaultValue={revurderingSteg['VURDER_SYKEPENGEERSTATNING']}
          multiple={false}
          onToggleSelected={(value, isSelected) => setFørSteg(isSelected ? value : undefined)}
          shouldAutocomplete
          clearButton
        />
        <Button onClick={hent} loading={isLoading}>
          Hent
        </Button>
      </HStack>
      {error && <Alert variant="error">{error}</Alert>}
      {vurderinger && tidligereVurderinger.length === 0 && (
        <Alert variant="info">Ingen tidligere vurderinger funnet</Alert>
      )}
      {tidligereVurderinger.length > 0 && (
        <Table size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{ width: '15rem' }}>Periode</Table.HeaderCell>
              <Table.HeaderCell>Utfall</Table.HeaderCell>
              <Table.HeaderCell>Rettighetstype</Table.HeaderCell>
              <Table.HeaderCell>Mulig rettighetstype (NAV-kontor)</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tidligereVurderinger.map((v, i) => (
              <Table.Row key={i}>
                <Table.DataCell>
                  {formaterDatoForFrontend(v.periode.fom)} – {formaterDatoForFrontend(v.periode.tom)}
                </Table.DataCell>
                <Table.DataCell>{utfallTag(v.utfall)}</Table.DataCell>
                <Table.DataCell>{formaterRettighetstype(v.rettighetstype)}</Table.DataCell>
                <Table.DataCell>{formaterRettighetstype(v.muligRettighetstypeFraNavkontor)}</Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </VStack>
  );
};

const utfallTag = (utfall: BehandlingsutfallType) => {
  switch (utfall) {
    case 'POTENSIELT_OPPFYLT':
      return (
        <Tag size="small" variant="success">
          {utfall}
        </Tag>
      );
    case 'UUNNGÅELIG_AVSLAG':
      return (
        <Tag size="small" variant="error">
          {utfall}
        </Tag>
      );
    default:
      return (
        <Tag size="small" variant="neutral">
          {utfall}
        </Tag>
      );
  }
};

const formaterRettighetstype = (type: RettighetsType | null) => {
  if (!type) return '–';
  return `${type} (${rettighetsTypeHjemmel[type]})`;
};
