import * as yup from 'yup';

export const predictionValidationSchema = yup.object().shape({
  result: yup.string().required(),
  option_contract_id: yup.string().nullable().required(),
});
