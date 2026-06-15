import { Periode } from 'lib/types/felles';

export type BehandlingsutfallType = 'IKKE_BEHANDLINGSGRUNNLAG' | 'UUNNGÅELIG_AVSLAG' | 'POTENSIELT_OPPFYLT';

export type RettighetsType =
  | 'BISTANDSBEHOV'
  | 'SYKEPENGEERSTATNING'
  | 'STUDENT'
  | 'ARBEIDSSØKER'
  | 'VURDERES_FOR_UFØRETRYGD';

export const rettighetsTypeHjemmel: Record<RettighetsType, string> = {
  BISTANDSBEHOV: '§ 11-6',
  SYKEPENGEERSTATNING: '§ 11-13',
  STUDENT: '§ 11-14',
  ARBEIDSSØKER: '§ 11-17',
  VURDERES_FOR_UFØRETRYGD: '§ 11-18',
};

export interface TidligereVurderingDto {
  periode: Periode;
  utfall: BehandlingsutfallType;
  rettighetstype: RettighetsType | null;
  muligRettighetstypeFraNavkontor: RettighetsType | null;
}

export interface TidligereVurderingerDto {
  tidligereVurderinger: TidligereVurderingDto[]
}
