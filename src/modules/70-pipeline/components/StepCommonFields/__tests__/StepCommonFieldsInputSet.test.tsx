import React from 'react'
import { getByPlaceholderText, render } from '@testing-library/react'
import { Formik, FormikForm, MultiTypeInputType, RUNTIME_INPUT_VALUE } from '@wings-software/uicore'

import { TestWrapper } from '@common/utils/testUtils'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import StepCommonFieldsInputSet from '../StepCommonFieldsInputSet'

interface TestProps {
  template?: any
  readonly?: boolean
}

const TestComponent = ({ template, readonly }: TestProps): React.ReactElement => (
  <TestWrapper>
    {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
    <Formik initialValues={{}} onSubmit={() => {}} formName="stepCommonFiledsInputSetTestForm">
      <FormikForm>
        <StepCommonFieldsInputSet
          template={template}
          readonly={!!readonly}
          allowableTypes={[MultiTypeInputType.FIXED]}
          stepViewType={StepViewType.Template}
        />
      </FormikForm>
    </Formik>
  </TestWrapper>
)

const template = {
  timeout: RUNTIME_INPUT_VALUE,
  spec: {
    resources: {
      limits: {
        memory: RUNTIME_INPUT_VALUE,
        cpu: RUNTIME_INPUT_VALUE
      }
    }
  }
}

describe('<StepCommonFieldsInputSet /> tests', () => {
  test('Should render properly', () => {
    const { container } = render(<TestComponent template={template} />)
    expect(container).toMatchSnapshot()
  })
  test('Readonly mode works', () => {
    const { container } = render(<TestComponent template={template} readonly />)
    expect((getByPlaceholderText(container, 'Enter w/d/h/m/s/ms') as HTMLInputElement).disabled).toBeTruthy()
    expect(container).toMatchSnapshot()
  })
})
