import { Periode } from 'lib/types/felles';

export interface VilkårDriftsinfoDTO {
  type: string;
  perioder: ForenkletVilkårsperiode[];
  vurdertTidspunkt?: string; // ISO date string, nullable
}

export interface ForenkletVilkårsperiode {
  periode: Periode;
  utfall: string;
  manuellVurdering: boolean;
  avslagsårsak?: string;
  innvilgelsesårsak?: string;
}
