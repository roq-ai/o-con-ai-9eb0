import axios from 'axios';
import queryString from 'query-string';
import { OptionContractInterface, OptionContractGetQueryInterface } from 'interfaces/option-contract';
import { GetQueryInterface } from '../../interfaces';

export const getOptionContracts = async (query?: OptionContractGetQueryInterface) => {
  const response = await axios.get(`/api/option-contracts${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createOptionContract = async (optionContract: OptionContractInterface) => {
  const response = await axios.post('/api/option-contracts', optionContract);
  return response.data;
};

export const updateOptionContractById = async (id: string, optionContract: OptionContractInterface) => {
  const response = await axios.put(`/api/option-contracts/${id}`, optionContract);
  return response.data;
};

export const getOptionContractById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/option-contracts/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteOptionContractById = async (id: string) => {
  const response = await axios.delete(`/api/option-contracts/${id}`);
  return response.data;
};
