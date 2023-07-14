import { OptionContractInterface } from 'interfaces/option-contract';
import { GetQueryInterface } from 'interfaces';

export interface PredictionInterface {
  id?: string;
  result: string;
  option_contract_id: string;
  created_at?: any;
  updated_at?: any;

  option_contract?: OptionContractInterface;
  _count?: {};
}

export interface PredictionGetQueryInterface extends GetQueryInterface {
  id?: string;
  result?: string;
  option_contract_id?: string;
}
