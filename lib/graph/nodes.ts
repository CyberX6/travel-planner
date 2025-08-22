import { BaseNode, Position } from "./core";

export type CountryData = {
  code: string;
  name: string;
  flag: string;
  region?: string;
};
export class CountryNode extends BaseNode<CountryData> {
  constructor(args: {
    id: string;
    position: Position;
    data: CountryData;
    color?: string;
    notes?: string;
  }) {
    super({ ...args, type: "country" });
  }
}
