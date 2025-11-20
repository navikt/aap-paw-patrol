"use client";
import { useState } from 'react';
import { BodyShort, Button, Heading, Select, TextField, VStack } from '@navikt/ds-react';
import { kjørFraSteg } from '../../../lib/clientApi';

export const KjørFraSteg = () => {
  const [behandlingsreferanse, setBehandlingsreferanse] = useState('');
  const [steg, setSteg] = useState("")
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const onClick = async () => {
    setIsLoading(true);
    setMessage("");

    console.log("kjør-fra-steg", {behandlingsreferanse, steg})

    try {
      const settAktivtStegResponse = await kjørFraSteg(behandlingsreferanse, steg)
      if (settAktivtStegResponse.ok) {
        setMessage("ok 👍");
      } else {
        setMessage(await settAktivtStegResponse.text())
      }
    } catch (err) {
      console.log(err);
      setMessage('Noe gikk galt');
    }
    setIsLoading(false)
  };

  return (
    <div>
      <VStack gap='space-32'>
        <Heading size="medium">Sett aktivt steg for behandling</Heading>
        <TextField label="Behandlingsreferanse (UUID)" value={behandlingsreferanse} onChange={e => setBehandlingsreferanse(e.target.value)}/>
        <Select label="Steg" onChange={e => setSteg(e.target.value)}>
          {muligeSteg.map(s => <option value={s} key={s}>{s}</option> )}
        </Select>
        <Button onClick={onClick } loading={isLoading}>Sett aktivt steg</Button>
        {message && <BodyShort>{message}</BodyShort>}
      </VStack>
    </div>
  );
};


const muligeSteg = [
  'VURDER_RETTIGHETSPERIODE',
  'SØKNAD',
  'VURDER_ALDER',
  'VURDER_LOVVALG',
  'VURDER_MEDLEMSKAP',
  'VURDER_OPPHOLDSKRAV',
  'FASTSETT_MELDEPERIODER',
  'AVKLAR_STUDENT',
  'VURDER_BISTANDSBEHOV',
  'OVERGANG_UFORE',
  'OVERGANG_ARBEID',
  'VURDER_SYKEPENGEERSTATNING',
  'FASTSETT_SYKDOMSVILKÅRET',
  'VURDER_YRKESSKADE',
  'FRITAK_MELDEPLIKT',
  'SYKDOMSVURDERING_BREV',
  'KVALITETSSIKRING',
  'BARNETILLEGG',
  'AVKLAR_SYKDOM',
  'ARBEIDSOPPTRAPPING',
  'REFUSJON_KRAV',
  'FASTSETT_ARBEIDSEVNE',
  'FASTSETT_BEREGNINGSTIDSPUNKT',
  'FASTSETT_GRUNNLAG',
  'VIS_GRUNNLAG',
  'MANGLENDE_LIGNING',
  'SAMORDNING_UFØRE',
  'SAMORDNING_GRADERING',
  'SAMORDNING_AVSLAG',
  'SAMORDNING_ANDRE_STATLIGE_YTELSER',
  'SAMORDNING_ARBEIDSGIVER',
  'SAMORDNING_TJENESTEPENSJON_REFUSJONSKRAV',
  'IKKE_OPPFYLT_MELDEPLIKT',
  'FASTSETT_UTTAK',
  'EFFEKTUER_11_7',
  'DU_ER_ET_ANNET_STED',
  'BEREGN_TILKJENT_YTELSE',
  'SIMULERING',
  'FORESLÅ_VEDTAK',
  'FATTE_VEDTAK',
]