import { PredictionInterface } from 'interfaces/prediction';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface OptionContractInterface {
  id?: string;
  details: string;
  company_id: string;
  created_at?: any;
  updated_at?: any;
  prediction?: PredictionInterface[];
  company?: CompanyInterface;
  _count?: {
    prediction?: number;
  };
}

export interface OptionContractGetQueryInterface extends GetQueryInterface {
  id?: string;
  details?: string;
  company_id?: string;
}
