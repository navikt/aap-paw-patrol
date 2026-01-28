export interface BehandlingDriftsinfoDTO {
  behandling: BehandlinginfoDTO;
  avklaringsbehov: ForenkletAvklaringsbehov[];
}

export interface BehandlinginfoDTO {
  referanse: string;
  type: string;
  status: string;
  vurderingsbehov: string[];
  årsakTilOpprettelse: string;
  opprettet: string;
}

export interface ForenkletAvklaringsbehov {
  definisjon: Definisjon;
  status: AvklaringsbehovStatus;
  tidsstempel: string;
  endretAv: string;
}

export interface Definisjon {
  kode: string;
  type: string;
  løsesISteg: string;
  kreverToTrinn: boolean;
  kvalitetssikres: boolean;
  løsesAv: string[];
}

export enum AvklaringsbehovStatus {
  OPPRETTET = 'OPPRETTET',
  AVSLUTTET = 'AVSLUTTET',
  TOTRINNS_VURDERT = 'TOTRINNS_VURDERT',
  SENDT_TILBAKE_FRA_BESLUTTER = 'SENDT_TILBAKE_FRA_BESLUTTER',
  KVALITETSSIKRET = 'KVALITETSSIKRET',
  SENDT_TILBAKE_FRA_KVALITETSSIKRER = 'SENDT_TILBAKE_FRA_KVALITETSSIKRER',
  AVBRUTT = 'AVBRUTT',
}

// ------

export interface SakDriftsinfoDTO {
  saksnummer: string;
  status: SakStatus;
  rettighetsperiode: Periode;
  opprettetTidspunkt: string;
  behandlinger: BehandlingDriftsinfo[];
}

export enum SakStatus {
  OPPRETTET = 'OPPRETTET',
  UTREDES = 'UTREDES',
  LØPENDE = 'LØPENDE',
  AVSLUTTET = 'AVSLUTTET',
}

export interface BehandlingDriftsinfo {
  referanse: string;
  type: string;
  status: BehandlingStatus;
  vurderingsbehov: string[];
  årsakTilOpprettelse?: string;
  opprettet: string;
  avklaringsbehov: ForenkletAvklaringsbehov[];
}

export enum BehandlingStatus {
  OPPRETTET = 'OPPRETTET',
  UTREDES = 'UTREDES',
  IVERKSETTES = 'IVERKSETTES',
  AVSLUTTET = 'AVSLUTTET',
}

export interface Periode {
  fom: string;
  tom: string;
}
