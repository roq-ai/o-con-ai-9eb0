import * as yup from 'yup';

export const optionContractValidationSchema = yup.object().shape({
  details: yup.string().required(),
  company_id: yup.string().nullable().required(),
});
