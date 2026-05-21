'use client';

import { useEffect, useState } from 'react';
import {
  Alert,
  BodyShort,
  Box,
  Button,
  Heading,
  HStack,
  Label,
  Loader,
  Modal,
  Table,
  Tag,
  VStack,
} from '@navikt/ds-react';
import { PencilIcon, PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import { hentOppgavefiltre, slettOppgavefilter } from 'lib/clientApi';
import { AvklaringsbehovKodeNavn, FilterDriftsinfoDTO, FilterOversiktDTO } from 'lib/types/oppgave';
import { formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import { capitalize } from 'lib/utils/formatting';
import { OppgavefilterSkjema } from 'components/drift/oppgavefilter/OppgavefilterSkjema';

const ALLE = 'ALLE';

const EnheterVisning = ({
  label,
  enheter,
  variantAlle,
  variantEnkelt,
}: {
  label: string;
  enheter: string[];
  variantAlle: 'success' | 'warning' | 'error';
  variantEnkelt: 'info' | 'warning' | 'neutral';
}) => {
  const erAlle = enheter.length === 1 && enheter[0] === ALLE;
  const erTom = enheter.length === 0;

  return (
    <div>
      <Label size="small">{label}</Label>
      {erTom ? (
        <BodyShort textColor="subtle" size="small">
          Ingen
        </BodyShort>
      ) : erAlle ? (
        <Tag variant={variantAlle} size="small">
          Alle enheter
        </Tag>
      ) : (
        <HStack gap="space-4" wrap>
          {enheter.map((enhet) => (
            <Tag key={enhet} variant={variantEnkelt} size="small">
              {enhet}
            </Tag>
          ))}
        </HStack>
      )}
    </div>
  );
};

const FilterDetaljer = ({
  filter,
  navIdent,
  onRediger,
  onSlett,
}: {
  filter: FilterDriftsinfoDTO;
  navIdent: string;
  onRediger: () => void;
  onSlett: () => void;
}) => (
  <Box padding="space-16" background="neutral-soft" borderRadius="8">
    <HStack gap="space-32" wrap align="start">
      <VStack gap="space-8" style={{ minWidth: '16rem' }}>
        <div>
          <Label size="small">Beskrivelse</Label>
          <BodyShort size="small">{filter.beskrivelse || '–'}</BodyShort>
        </div>
        <div>
          <Label size="small">Opprettet av</Label>
          <BodyShort size="small">{filter.opprettetAv}</BodyShort>
        </div>
        <div>
          <Label size="small">Opprettet</Label>
          <BodyShort size="small">
            {formaterDatoMedTidspunktSekunderForFrontend(filter.opprettetTidspunkt)}
          </BodyShort>
        </div>
        {filter.endretAv && (
          <div>
            <Label size="small">Sist endret av</Label>
            <BodyShort size="small">{filter.endretAv}</BodyShort>
          </div>
        )}
        {filter.endretTidspunkt && (
          <div>
            <Label size="small">Sist endret</Label>
            <BodyShort size="small">
              {formaterDatoMedTidspunktSekunderForFrontend(filter.endretTidspunkt)}
            </BodyShort>
          </div>
        )}
        <HStack gap="space-4">
          <Button size="small" variant="secondary" icon={<PencilIcon />} onClick={onRediger}>
            Rediger
          </Button>
          {filter.opprettetAv.toLowerCase() === navIdent.toLowerCase() && (
            <Button size="small" variant="danger" icon={<TrashIcon />} onClick={onSlett}>
              Slett
            </Button>
          )}
        </HStack>
      </VStack>

      <VStack gap="space-8" style={{ minWidth: '14rem' }}>
        <EnheterVisning
          label="Inkluderte enheter"
          enheter={filter.inkluderteEnheter}
          variantAlle="success"
          variantEnkelt="info"
        />
        <EnheterVisning
          label="Ekskluderte enheter"
          enheter={filter.ekskluderteEnheter}
          variantAlle="error"
          variantEnkelt="warning"
        />
      </VStack>

      <VStack gap="space-8" style={{ minWidth: '14rem' }}>
        <div>
          <Label size="small">Avklaringsbehov</Label>
          {filter.avklaringsbehov.length === 0 ? (
            <BodyShort textColor="subtle" size="small">Ingen</BodyShort>
          ) : (
            <HStack gap="space-4" wrap>
              {filter.avklaringsbehov.map(({ kode, navn }) => (
                <Tag key={kode} size="small">{navn} ({kode})</Tag>
              ))}
            </HStack>
          )}
        </div>
        <div>
          <Label size="small">Behandlingstyper</Label>
          {filter.behandlingstyper.length === 0 ? (
            <BodyShort textColor="subtle" size="small">Ingen</BodyShort>
          ) : (
            <HStack gap="space-4" wrap>
              {filter.behandlingstyper.map((type) => (
                <Tag key={type} variant="neutral" size="small">{type}</Tag>
              ))}
            </HStack>
          )}
        </div>
      </VStack>
    </HStack>
  </Box>
);

const AvklaringsbehovUtenFilterBanner = ({ behov }: { behov: AvklaringsbehovKodeNavn[] }) => {
  if (behov.length === 0) return null;

  return (
    <Alert variant="warning">
      <VStack gap="space-8">
        <Heading size="small">
          {behov.length} avklaringsbehov mangler oppgavekø
        </Heading>
        <BodyShort size="small">
          Disse avklaringsbehovene finnes ikke i noen oppgavekø.
        </BodyShort>
        <details>
          <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
            <BodyShort as="span" size="small" weight="semibold">Vis avklaringsbehov</BodyShort>
          </summary>
          <Table size="small">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Kode</Table.HeaderCell>
                <Table.HeaderCell>Navn</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {behov.map(({ kode, navn }) => (
                <Table.Row key={kode}>
                  <Table.DataCell>
                    <Tag variant="warning" size="small">
                      {kode}
                    </Tag>
                  </Table.DataCell>
                  <Table.DataCell>{navn}</Table.DataCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </details>
      </VStack>
    </Alert>
  );
};

export const OppgavefilterOversikt = ({ navIdent }: { navIdent: string }) => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [filtre, setFiltre] = useState<FilterDriftsinfoDTO[]>([]);
  const [avklaringsbehovUtenFilter, setAvklaringsbehovUtenFilter] = useState<AvklaringsbehovKodeNavn[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [redigerFilter, setRedigerFilter] = useState<FilterDriftsinfoDTO | null>(null);
  const [visNyttFilterModal, setVisNyttFilterModal] = useState(false);
  const [slettFilter, setSlettFilter] = useState<FilterDriftsinfoDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const lastFiltre = () => {
    setIsLoading(true);
    hentOppgavefiltre()
      .then(async (res) => {
        if (res.ok) {
          const data: FilterOversiktDTO = await res.json();
          setFiltre(data.filtre);
          setAvklaringsbehovUtenFilter(data.avklaringsbehovUtenFilter);
        } else {
          setError(`Feil fra server: ${await res.text()}`);
        }
      })
      .catch((err) => setError(`Noe gikk galt: ${err}`))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    lastFiltre();
  }, []);

  const bekreftSlett = async () => {
    if (!slettFilter) return;
    setIsDeleting(true);
    try {
      const res = await slettOppgavefilter(slettFilter.id);
      if (res.ok || res.status === 204) {
        setSlettFilter(null);
        setExpandedId(null);
        lastFiltre();
      } else {
        setError(`Feil ved sletting: ${await res.text()}`);
        setSlettFilter(null);
      }
    } catch (err) {
      setError(`Noe gikk galt: ${err}`);
      setSlettFilter(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const alleAvklaringsbehov: AvklaringsbehovKodeNavn[] = [
    ...avklaringsbehovUtenFilter,
    ...filtre.flatMap((f) => f.avklaringsbehov),
  ]
    .filter((b, idx, arr) => arr.findIndex((x) => x.kode === b.kode) === idx)
    .sort((a, b) => a.kode.localeCompare(b.kode));

  if (isLoading) return <Loader />;

  return (
    <VStack gap="space-16">
      {error && (
        <Alert variant="error" size="small">{error}</Alert>
      )}

      <AvklaringsbehovUtenFilterBanner behov={avklaringsbehovUtenFilter} />

      <HStack justify="space-between" align="center">
        <BodyShort textColor="subtle">{filtre.length} filter(e) funnet</BodyShort>
        <Button size="small" variant="primary" icon={<PlusIcon />} onClick={() => setVisNyttFilterModal(true)}>
          Nytt filter
        </Button>
      </HStack>

      <Table size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Navn</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Inkluderte enheter</Table.HeaderCell>
            <Table.HeaderCell>Ekskluderte enheter</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filtre.map((filter) => {
            const erExpanded = expandedId === filter.id;
            const inkAlleTag = filter.inkluderteEnheter.length === 1 && filter.inkluderteEnheter[0] === ALLE;
            const ekskAlleTag = filter.ekskluderteEnheter.length === 1 && filter.ekskluderteEnheter[0] === ALLE;

            return (
              <Table.ExpandableRow
                key={filter.id}
                open={erExpanded}
                onOpenChange={(open) => setExpandedId(open ? filter.id : null)}
                content={
                  <FilterDetaljer
                    filter={filter}
                    navIdent={navIdent}
                    onRediger={() => setRedigerFilter(filter)}
                    onSlett={() => setSlettFilter(filter)}
                  />
                }
                togglePlacement="left"
              >
                <Table.DataCell>{filter.id}</Table.DataCell>
                <Table.DataCell>{filter.navn}</Table.DataCell>
                <Table.DataCell>
                  <Tag size="small">{capitalize(filter.type)}</Tag>
                </Table.DataCell>
                <Table.DataCell>
                  {inkAlleTag ? (
                    <Tag variant="success" size="small">Alle enheter</Tag>
                  ) : filter.inkluderteEnheter.length === 0 ? (
                    <BodyShort textColor="subtle" size="small">Ingen</BodyShort>
                  ) : (
                    <HStack gap="space-4" wrap>
                      {filter.inkluderteEnheter.map((e) => (
                        <Tag key={e} variant="info" size="small">{e}</Tag>
                      ))}
                    </HStack>
                  )}
                </Table.DataCell>
                <Table.DataCell>
                  {ekskAlleTag ? (
                    <Tag variant="error" size="small">Alle enheter</Tag>
                  ) : filter.ekskluderteEnheter.length === 0 ? (
                    <BodyShort textColor="subtle" size="small">Ingen</BodyShort>
                  ) : (
                    <HStack gap="space-4" wrap>
                      {filter.ekskluderteEnheter.map((e) => (
                        <Tag key={e} variant="warning" size="small">{e}</Tag>
                      ))}
                    </HStack>
                  )}
                </Table.DataCell>
              </Table.ExpandableRow>
            );
          })}
        </Table.Body>
      </Table>

      {/* Nytt filter-modal */}
      <Modal
        open={visNyttFilterModal}
        onClose={() => setVisNyttFilterModal(false)}
        header={{ heading: 'Nytt oppgavefilter' }}
        width = "medium"
      >
        <Modal.Body>
          <OppgavefilterSkjema
            alleAvklaringsbehov={alleAvklaringsbehov}
            onLagret={() => { setVisNyttFilterModal(false); lastFiltre(); }}
            onAvbryt={() => setVisNyttFilterModal(false)}
          />
        </Modal.Body>
      </Modal>

      {/* Rediger filter-modal */}
      <Modal
        open={redigerFilter !== null}
        onClose={() => setRedigerFilter(null)}
        header={{ heading: `Rediger: ${redigerFilter?.navn ?? ''}` }}
        width="medium"
      >
        <Modal.Body>
          {redigerFilter && (
            <OppgavefilterSkjema
              eksisterendeFilter={redigerFilter}
              alleAvklaringsbehov={alleAvklaringsbehov}
              onLagret={() => { setRedigerFilter(null); setExpandedId(null); lastFiltre(); }}
              onAvbryt={() => setRedigerFilter(null)}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* Slett-bekreftelsesmodal */}
      <Modal
        open={slettFilter !== null}
        onClose={() => setSlettFilter(null)}
        header={{ heading: `Slett filter: ${slettFilter?.navn ?? ''}` }}
      >
        <Modal.Body>
          <BodyShort spacing>
            Er du sikker på at du vil slette filteret <strong>{slettFilter?.navn}</strong>?
          </BodyShort>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSlettFilter(null)}>
            Avbryt
          </Button>
          <Button variant="danger" onClick={bekreftSlett} loading={isDeleting}>
            Slett
          </Button>
        </Modal.Footer>
      </Modal>
    </VStack>
  );
};
