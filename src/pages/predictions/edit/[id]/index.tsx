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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getPredictionById, updatePredictionById } from 'apiSdk/predictions';
import { Error } from 'components/error';
import { predictionValidationSchema } from 'validationSchema/predictions';
import { PredictionInterface } from 'interfaces/prediction';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { OptionContractInterface } from 'interfaces/option-contract';
import { getOptionContracts } from 'apiSdk/option-contracts';

function PredictionEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PredictionInterface>(
    () => (id ? `/predictions/${id}` : null),
    () => getPredictionById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PredictionInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePredictionById(id, values);
      mutate(updated);
      resetForm();
      router.push('/predictions');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PredictionInterface>({
    initialValues: data,
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
            Edit Prediction
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(PredictionEditPage);
