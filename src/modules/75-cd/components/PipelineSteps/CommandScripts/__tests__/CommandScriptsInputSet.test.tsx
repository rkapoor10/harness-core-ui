/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { render, RenderResult, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Formik, MultiTypeInputType } from '@harness/uicore'
import { queryByNameAttribute, TestWrapper } from '@common/utils/testUtils'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { CommandScriptsInputSet } from '../CommandScriptsInputSet'
import type { CommandScriptsData, CommandScriptsFormData } from '../CommandScriptsTypes'

jest.mock('@common/components/YAMLBuilder/YamlBuilder')

const template = {
  identifier: 'commandstep',
  type: 'Command',
  spec: {
    environmentVariables: [
      {
        name: 'iv',
        type: 'String',
        value: '<+input>'
      }
    ],
    commandUnits: [
      {
        commandUnit: {
          identifier: 'Copy_Cmd_Runtime',
          type: 'Copy',
          spec: {
            destinationPath: '<+input>'
          }
        }
      },
      {
        commandUnit: {
          identifier: 'Script_Cmd_Runtime',
          type: 'Script',
          spec: {
            workingDirectory: '<+input>',
            source: {
              type: 'Inline',
              spec: {
                script: '<+input>'
              }
            }
          }
        }
      }
    ],
    outputVariables: [
      {
        name: 'ov',
        type: 'String',
        value: '<+input>'
      }
    ]
  },
  timeout: '<+input>'
}

describe('test Command Scripts input set', () => {
  let renderResult: RenderResult

  beforeEach(() => {
    renderResult = render(
      <TestWrapper>
        <Formik initialValues={{}} onSubmit={jest.fn()} formName="testForm">
          <CommandScriptsInputSet
            allowableTypes={[MultiTypeInputType.FIXED, MultiTypeInputType.EXPRESSION]}
            initialValues={
              {
                identifier: 'commandstep',
                type: 'Command',
                spec: {
                  environmentVariables: [
                    {
                      name: 'iv',
                      type: 'String',
                      value: '',
                      id: '1f964a4f-a0bc-49b5-a8f2-9d23dde58b82'
                    }
                  ],
                  commandUnits: [
                    {
                      commandUnit: {
                        identifier: 'Copy_Cmd_Runtime',
                        type: 'Copy',
                        spec: {
                          destinationPath: ''
                        }
                      }
                    },
                    {
                      commandUnit: {
                        identifier: 'Script_Cmd_Runtime',
                        type: 'Script',
                        spec: {
                          workingDirectory: '',
                          source: {
                            type: 'Inline',
                            spec: {
                              script: ''
                            }
                          }
                        }
                      }
                    }
                  ],
                  outputVariables: [
                    {
                      name: 'ov',
                      type: 'String',
                      value: '',
                      id: 'b9b49383-2d63-4f58-b827-e1a96c97906d'
                    }
                  ]
                },
                timeout: ''
              } as CommandScriptsFormData
            }
            inputSetData={{
              template: template as CommandScriptsData,
              readonly: false
            }}
            stepViewType={StepViewType.InputSet}
          />
        </Formik>
      </TestWrapper>
    )
  })

  test('should render timeout field, update timeout', async () => {
    const { getByPlaceholderText } = renderResult
    const timeoutInput = getByPlaceholderText('Enter w/d/h/m/s/ms')

    expect(timeoutInput).toBeInTheDocument()

    userEvent.type(timeoutInput, '10m')

    await waitFor(() => expect(timeoutInput).toHaveDisplayValue('10m'))
  })

  test('should render runtime inputs in commandUnits', async () => {
    const { container, getByText } = renderResult

    template.spec.commandUnits.forEach(commandUnit => {
      expect(getByText(commandUnit.commandUnit.identifier)).toBeInTheDocument()
    })

    expect(queryByNameAttribute('spec.commandUnits[0].commandUnit.spec.destinationPath', container)).toBeInTheDocument()
    expect(
      queryByNameAttribute('spec.commandUnits[1].commandUnit.spec.workingDirectory', container)
    ).toBeInTheDocument()
    expect(
      queryByNameAttribute('spec.commandUnits[1].commandUnit.spec.source.spec.script', container)
    ).toBeInTheDocument()
  })

  describe.each([
    ['environment variables', 'spec.environmentVariables', template.spec.environmentVariables],
    ['output variables', 'spec.outputVariables', template.spec.outputVariables]
  ])('test %s', (testName, fieldName, variables) => {
    test(`should render runtime inputs in ${testName}`, () => {
      const { container } = renderResult

      variables.forEach((variable, index) => {
        Object.entries(variable).forEach(([key, _value]) => {
          const field = queryByNameAttribute(`${fieldName}[${index}].${key}`, container)
          expect(field).toBeInTheDocument()
        })
      })
    })
  })
})
