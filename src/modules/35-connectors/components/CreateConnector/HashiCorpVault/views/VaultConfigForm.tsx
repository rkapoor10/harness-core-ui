import React, { useState } from 'react'
import * as Yup from 'yup'
import { Button, Formik, FormikForm, Layout, StepProps, Container, Text } from '@wings-software/uicore'
import type { VaultConnectorDTO } from 'services/cd-ng'
import { useStrings } from 'framework/strings'
import { URLValidationSchema } from '@common/utils/Validation'
import { PageSpinner } from '@common/components'
import { setupVaultFormData } from '@connectors/pages/connectors/utils/ConnectorUtils'
import type {
  StepDetailsProps,
  ConnectorDetailsProps,
  VaultConfigFormData
} from '@connectors/interfaces/ConnectorInterface'
import VaultConnectorFormFields from './VaultConnectorFormFields'

const VaultConfigForm: React.FC<StepProps<StepDetailsProps> & ConnectorDetailsProps> = ({
  prevStepData,
  previousStep,
  nextStep,
  isEditMode,
  connectorInfo,
  accountId
}) => {
  const { getString } = useStrings()

  const defaultInitialFormData: VaultConfigFormData = {
    vaultUrl: '',
    basePath: '',
    readOnly: false,
    default: false,
    accessType: 'APP_ROLE',
    appRoleId: '',
    secretId: undefined,
    authToken: undefined,
    renewalIntervalMinutes: 10
  }

  const [initialValues, setInitialValues] = useState(defaultInitialFormData)
  const [loadingFormData, setLoadingFormData] = useState(isEditMode)

  React.useEffect(() => {
    if (isEditMode && connectorInfo) {
      setupVaultFormData(connectorInfo, accountId).then(data => {
        setInitialValues(data as VaultConfigFormData)
        setLoadingFormData(false)
      })
    }
  }, [isEditMode, connectorInfo])

  return loadingFormData ? (
    <PageSpinner />
  ) : (
    <Container padding={{ top: 'medium' }} width="64%">
      <Text font={{ size: 'medium' }} padding={{ bottom: 'xlarge' }}>
        {getString('connectors.hashiCorpVault.stepTwoName')}
      </Text>
      <Formik<VaultConfigFormData>
        enableReinitialize
        initialValues={{ ...initialValues, ...prevStepData }}
        formName="vaultConfigForm"
        validationSchema={Yup.object().shape({
          vaultUrl: URLValidationSchema(),
          renewalIntervalMinutes: Yup.number()
            .positive(getString('validation.renewalNumber'))
            .required(getString('validation.renewalInterval')),
          authToken: Yup.object()
            .nullable()
            .when('accessType', {
              is: 'TOKEN',
              then: Yup.object().test('authToken', getString('validation.authToken'), function (value) {
                if ((prevStepData?.spec as VaultConnectorDTO)?.accessType === 'TOKEN') return true
                else if (value?.name?.length > 0) return true
                return false
              })
            }),
          appRoleId: Yup.string().when('accessType', {
            is: 'APP_ROLE',
            then: Yup.string().trim().required(getString('validation.appRole'))
          }),
          secretId: Yup.object().when('accessType', {
            is: 'APP_ROLE',
            then: Yup.object().test('secretId', getString('validation.secretId'), function (value) {
              if ((prevStepData?.spec as VaultConnectorDTO)?.accessType === 'APP_ROLE') return true
              else if (value?.name?.length > 0) return true
              return false
            })
          })
        })}
        onSubmit={formData => {
          nextStep?.({ ...connectorInfo, ...prevStepData, ...formData } as StepDetailsProps)
        }}
      >
        {formik => {
          return (
            <FormikForm>
              <VaultConnectorFormFields formik={formik} />
              <Layout.Horizontal spacing="medium">
                <Button text={getString('back')} onClick={() => previousStep?.(prevStepData)} />
                <Button type="submit" intent="primary" rightIcon="chevron-right" text={getString('continue')} />
              </Layout.Horizontal>
            </FormikForm>
          )
        }}
      </Formik>
    </Container>
  )
}

export default VaultConfigForm
