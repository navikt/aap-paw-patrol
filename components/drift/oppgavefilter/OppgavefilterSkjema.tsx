'use client';

import { useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  CheckboxGroup,
  HStack,
  Select,
  Tag,
  TextField,
  VStack,
} from '@navikt/ds-react';
import { PlusIcon, XMarkIcon } from '@navikt/aksel-icons';
import { lagreOppgavefilter } from 'lib/clientApi';
import {
  AvklaringsbehovKodeNavn,
  BEHANDLINGSTYPER,
  EnhetDriftRequest,
  FilterDriftRequest,
  FilterDriftsinfoDTO,
  Filtermodus,
  FilterType,
} from 'lib/types/oppgave';

interface Props {
  eksisterendeFilter?: FilterDriftsinfoDTO;
  alleAvklaringsbehov: AvklaringsbehovKodeNavn[];
  onLagret: () => void;
  onAvbryt: () => void;
}

function mapTilEnheter(
  inkluderte: string[],
  ekskluderte: string[]
): EnhetDriftRequest[] {
  return [
    ...inkluderte.map((enhet) => ({ enhet, filtermodus: Filtermodus.INKLUDERT })),
    ...ekskluderte.map((enhet) => ({ enhet, filtermodus: Filtermodus.EKSKLUDERT })),
  ];
}

export const OppgavefilterSkjema = ({
  eksisterendeFilter,
  alleAvklaringsbehov,
  onLagret,
  onAvbryt,
}: Props) => {
  const [navn, setNavn] = useState(eksisterendeFilter?.navn ?? '');
  const [beskrivelse, setBeskrivelse] = useState(eksisterendeFilter?.beskrivelse ?? '');
  const [type, setType] = useState<FilterType>(eksisterendeFilter?.type ?? FilterType.GENERELL);
  const [valgteAvklaringsbehov, setValgteAvklaringsbehov] = useState<string[]>(
    eksisterendeFilter?.avklaringsbehov.map((a) => a.kode) ?? []
  );
  const [valgteBehandlingstyper, setValgteBehandlingstyper] = useState<string[]>(
    eksisterendeFilter?.behandlingstyper ?? []
  );
  const [inkluderteEnheter, setInkluderteEnheter] = useState<string[]>(
    eksisterendeFilter?.inkluderteEnheter ?? []
  );
  const [ekskluderteEnheter, setEkskluderteEnheter] = useState<string[]>(
    eksisterendeFilter?.ekskluderteEnheter ?? []
  );
  const [nyInkludertEnhet, setNyInkludertEnhet] = useState('');
  const [nyEkskludertEnhet, setNyEkskludertEnhet] = useState('');
  const [avklaringsbehovSøk, setAvklaringsbehovSøk] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>();

  const leggTilInkludert = () => {
    const val = nyInkludertEnhet.trim().toUpperCase();
    if (val && !inkluderteEnheter.includes(val)) {
      setInkluderteEnheter((prev) => [...prev, val]);
    }
    setNyInkludertEnhet('');
  };

  const leggTilEkskludert = () => {
    const val = nyEkskludertEnhet.trim().toUpperCase();
    if (val && !ekskluderteEnheter.includes(val)) {
      setEkskluderteEnheter((prev) => [...prev, val]);
    }
    setNyEkskludertEnhet('');
  };

  const toggleAvklaringsbehov = (kode: string) => {
    setValgteAvklaringsbehov((prev) =>
      prev.includes(kode) ? prev.filter((k) => k !== kode) : [...prev, kode]
    );
  };

  const handleSubmit = async () => {
    setError(undefined);
    setIsSaving(true);
    const request: FilterDriftRequest = {
      id: eksisterendeFilter?.id,
      navn,
      beskrivelse,
      type,
      avklaringsbehovKoder: valgteAvklaringsbehov,
      behandlingstyper: valgteBehandlingstyper,
      enheter: mapTilEnheter(inkluderteEnheter, ekskluderteEnheter),
    };
    try {
      const res = await lagreOppgavefilter(request);
      if (res.ok) {
        onLagret();
      } else {
        setError(`Feil fra server: ${await res.text()}`);
      }
    } catch (err) {
      setError(`Noe gikk galt: ${err}`);
    } finally {
      setIsSaving(false);
    }
  };

  const filtrerteBehov = alleAvklaringsbehov.filter(
    (b) =>
      avklaringsbehovSøk === '' ||
      b.kode.includes(avklaringsbehovSøk) ||
      b.navn.toLowerCase().includes(avklaringsbehovSøk.toLowerCase())
  );

  return (
    <VStack gap="space-16">
      {error && (
        <Alert variant="error" size="small">
          {error}
        </Alert>
      )}

      <TextField
        label="Navn"
        size="small"
        value={navn}
        onChange={(e) => setNavn(e.target.value)}
      />

      <TextField
        label="Beskrivelse"
        size="small"
        value={beskrivelse}
        onChange={(e) => setBeskrivelse(e.target.value)}
      />

      <Select
        label="Type"
        size="small"
        value={type}
        onChange={(e) => setType(e.target.value as FilterType)}
      >
        {Object.values(FilterType).map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </Select>

      {/* Behandlingstyper */}
      <CheckboxGroup
        legend="Behandlingstyper"
        size="small"
        value={valgteBehandlingstyper}
        onChange={setValgteBehandlingstyper}
      >
        {BEHANDLINGSTYPER.map((bt) => (
          <Checkbox key={bt} value={bt}>
            {bt}
          </Checkbox>
        ))}
      </CheckboxGroup>

      {/* Avklaringsbehov */}
      <VStack gap="space-4">
        <TextField
          label={`Avklaringsbehov (${valgteAvklaringsbehov.length} valgt)`}
          description="Søk på kode eller navn"
          size="small"
          value={avklaringsbehovSøk}
          onChange={(e) => setAvklaringsbehovSøk(e.target.value)}
        />
        <HStack gap="space-4" wrap>
          {valgteAvklaringsbehov.map((kode) => {
            const behov = alleAvklaringsbehov.find((b) => b.kode === kode);
            return (
              <Tag
                key={kode}
                variant="info"
                size="small"
                onClick={() => toggleAvklaringsbehov(kode)}
                style={{ cursor: 'pointer' }}
              >
                {behov ? `${behov.navn} (${kode})` : kode} ✕
              </Tag>
            );
          })}
        </HStack>
        <VStack gap="space-2" style={{ maxHeight: '16rem', overflowY: 'auto', border: '1px solid var(--ax-border-neutral-subtle)', borderRadius: 4, padding: '0.5rem' }}>
          {filtrerteBehov.map((b) => {
            const erValgt = valgteAvklaringsbehov.includes(b.kode);
            return (
              <Checkbox
                key={b.kode}
                size="small"
                checked={erValgt}
                onChange={() => toggleAvklaringsbehov(b.kode)}
              >
                {b.navn} ({b.kode})
              </Checkbox>
            );
          })}
        </VStack>
      </VStack>

      {/* Inkluderte enheter */}
      <VStack gap="space-4">
        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Inkluderte enheter</div>
        <HStack gap="space-4" wrap>
          {inkluderteEnheter.map((e) => (
            <Tag
              key={e}
              variant="success"
              size="small"
              style={{ cursor: 'pointer' }}
              onClick={() => setInkluderteEnheter((prev) => prev.filter((x) => x !== e))}
            >
              {e} <XMarkIcon />
            </Tag>
          ))}
        </HStack>
        <HStack gap="space-4" align="end">
          <TextField
            label="Legg til enhet (eller ALLE)"
            hideLabel
            placeholder="Enhetskode eller ALLE"
            size="small"
            value={nyInkludertEnhet}
            onChange={(e) => setNyInkludertEnhet(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && leggTilInkludert()}
          />
          <Button size="small" variant="secondary" icon={<PlusIcon />} onClick={leggTilInkludert}>
            Legg til
          </Button>
        </HStack>
      </VStack>

      {/* Ekskluderte enheter */}
      <VStack gap="space-4">
        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Ekskluderte enheter</div>
        <HStack gap="space-4" wrap>
          {ekskluderteEnheter.map((e) => (
            <Tag
              key={e}
              variant="warning"
              size="small"
              style={{ cursor: 'pointer' }}
              onClick={() => setEkskluderteEnheter((prev) => prev.filter((x) => x !== e))}
            >
              {e} <XMarkIcon />
            </Tag>
          ))}
        </HStack>
        <HStack gap="space-4" align="end">
          <TextField
            label="Legg til enhet (eller ALLE)"
            hideLabel
            placeholder="Enhetskode eller ALLE"
            size="small"
            value={nyEkskludertEnhet}
            onChange={(e) => setNyEkskludertEnhet(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && leggTilEkskludert()}
          />
          <Button size="small" variant="secondary" icon={<PlusIcon />} onClick={leggTilEkskludert}>
            Legg til
          </Button>
        </HStack>
      </VStack>

      <HStack gap="space-8">
        <Button size="small" variant="secondary" onClick={onAvbryt}>
          Avbryt
        </Button>
        <Button size="small" onClick={handleSubmit} loading={isSaving}>
          {eksisterendeFilter ? 'Lagre endringer' : 'Opprett filter'}
        </Button>
      </HStack>
    </VStack>
  );
};

