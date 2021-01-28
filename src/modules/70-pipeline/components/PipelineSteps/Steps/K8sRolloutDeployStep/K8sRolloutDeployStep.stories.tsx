import React from 'react'
import type { Meta, Story } from '@storybook/react'
import { Card, RUNTIME_INPUT_VALUE } from '@wings-software/uicore'
import { stringify } from 'yaml'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import type { StepWidgetProps } from '@pipeline/components/AbstractSteps/StepWidget'
import { factory, TestStepWidget } from '../__tests__/StepTestUtil'
import { K8RolloutDeployStep } from './K8sRolloutDeployStep'
factory.registerStep(new K8RolloutDeployStep())

export default {
  title: 'Pipelines / Pipeline Steps / K8sRolloutDeployStep',
  // eslint-disable-next-line react/display-name
  component: TestStepWidget,
  argTypes: {
    type: { control: { disable: true } },
    stepViewType: {
      control: {
        type: 'inline-radio',
        options: Object.keys(StepViewType)
      }
    },
    onUpdate: { control: { disable: true } },
    initialValues: {
      control: {
        type: 'object'
      }
    }
  }
} as Meta

export const K8sRolloutDeployStep: Story<Omit<StepWidgetProps, 'factory'>> = args => {
  const [value, setValue] = React.useState({})
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '480px 1fr', columnGap: '20px' }}>
      <Card>
        <TestStepWidget {...args} onUpdate={setValue} />
      </Card>
      <Card>
        <pre>{stringify(value)}</pre>
      </Card>
    </div>
  )
}
K8sRolloutDeployStep.args = {
  initialValues: { identifier: 'Test_A', type: StepType.K8sRollingDeploy },
  type: StepType.K8sRollingDeploy,
  stepViewType: StepViewType.InputVariable,
  path: '',
  template: {
    identifier: 'Test_A',
    type: StepType.K8sRollingDeploy,
    spec: { skipDryRun: RUNTIME_INPUT_VALUE, timeout: RUNTIME_INPUT_VALUE }
  },
  allValues: {
    type: StepType.K8sRollingDeploy,
    name: 'Test A',
    identifier: 'Test_A',
    spec: { skipDryRun: RUNTIME_INPUT_VALUE, timeout: RUNTIME_INPUT_VALUE }
  },
  customStepProps: {
    stageIdentifier: 'qaStage',
    metadataMap: {
      'step-skip': {
        yamlProperties: {
          fqn: 'pipeline.stages.qaStage.execution.steps.rolloutDeployment.skipDryRun',
          localName: 'step.rolloutDeployment.skipDryRun'
        }
      },
      'step-timeout': {
        yamlProperties: {
          fqn: 'pipeline.stages.qaStage.execution.steps.rolloutDeployment.timeout',
          localName: 'step.rolloutDeployment.timeout'
        }
      },
      'step-name': {
        yamlProperties: {
          fqn: 'pipeline.stages.qaStage.execution.steps.rolloutDeployment.name',
          localName: 'step.rolloutDeployment.name'
        }
      }
    },
    variablesData: {
      name: 'step-name',
      identifier: 'rolloutDeployment',
      type: 'K8sRollingDeploy',
      spec: {
        timeout: 'step-timeout',
        skipDryRun: 'step-skip'
      }
    }
  }
}
