export interface BehandlingDriftsinfoDTO {
  behandling: BehandlinginfoDTO;
  avklaringsbehov: AvklaringsbehovDTO[];
}

export interface BehandlinginfoDTO {
  referanse: string;
  type: string;
  status: string;
  vurderingsbehov: string[];
  årsakTilOpprettelse: string;
  opprettet: string;
}

export interface AvklaringsbehovDTO {
  definisjon: DefinisjonDTO;
  status: string;
  endringer: EndringDTO[];
}

export interface DefinisjonDTO {
  kode: string;
  type: string;
  løsesISteg: string;
  kreverToTrinn: boolean;
  kvalitetssikres: boolean;
  løsesAv: string[];
}

export interface EndringDTO {
  status: string;
  tidsstempel: string;
  begrunnelse: string;
  endretAv: string;
}

