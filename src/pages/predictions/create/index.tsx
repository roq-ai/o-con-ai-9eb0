import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createPrediction } from 'apiSdk/predictions';
import { Error } from 'components/error';
import { predictionValidationSchema } from 'validationSchema/predictions';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { OptionContractInterface } from 'interfaces/option-contract';
import { getOptionContracts } from 'apiSdk/option-contracts';
import { PredictionInterface } from 'interfaces/prediction';

function PredictionCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PredictionInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPrediction(values);
      resetForm();
      router.push('/predictions');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PredictionInterface>({
    initialValues: {
      result: '',
      option_contract_id: (router.query.option_contract_id as string) ?? null,
    },
    validationSchema: predictionValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Prediction
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="result" mb="4" isInvalid={!!formik.errors?.result}>
            <FormLabel>Result</FormLabel>
            <Input type="text" name="result" value={formik.values?.result} onChange={formik.handleChange} />
            {formik.errors.result && <FormErrorMessage>{formik.errors?.result}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<OptionContractInterface>
            formik={formik}
            name={'option_contract_id'}
            label={'Select Option Contract'}
            placeholder={'Select Option Contract'}
            fetcher={getOptionContracts}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.details}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'prediction',
    operation: AccessOperationEnum.CREATE,
  }),
)(PredictionCreatePage);
