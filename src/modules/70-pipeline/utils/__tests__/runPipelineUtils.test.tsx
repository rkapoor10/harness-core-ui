/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import { MultiTypeInputType } from '@harness/uicore'
import { set } from 'lodash-es'
import type { AllNGVariables, Pipeline } from '@pipeline/utils/types'
import { FeatureIdentifier } from 'framework/featureStore/FeatureIdentifier'
import {
  clearRuntimeInput,
  getFeaturePropsForRunPipelineButton,
  mergeTemplateWithInputSetData,
  getMergedVariables,
  getAllowableTypesWithoutFixedValue,
  getAllowableTypesWithoutExpression
} from '../runPipelineUtils'
import pipelineTemplate from './mockJson/pipelineTemplate.json'
import pipelineInputSetPortion from './mockJson/pipelineInputSetPortion.json'
import { inputSetInput, inputSetOutput } from './mockJson/runPipelineUtils'

describe('mergeTemplateWithInputSetData tests', () => {
  test('mergeTemplateWithInputSetData works as expected', () => {
    const templatePipeline = {
      pipeline: {
        identifier: 'P1',
        stages: [
          {
            stage: {
              identifier: 'Stage1',
              type: 'CI',
              spec: {
                execution: {
                  steps: [
                    {
                      step: {
                        identifier: 'Step1',
                        type: 'Run',
                        description: '<+input>'
                      }
                    }
                  ]
                }
              }
            }
          }
        ],
        properties: {
          ci: {
            codebase: {
              build: '<+input>'
            }
          }
        }
      }
    } as unknown as Pipeline
    const inputSetPortion = {
      pipeline: {
        identifier: 'P1',
        stages: [
          {
            stage: {
              identifier: 'Stage1',
              type: 'CI',
              spec: {
                execution: {
                  steps: [
                    {
                      step: {
                        identifier: 'Step1',
                        type: 'Run',
                        description: 'test Desc'
                      }
                    }
                  ]
                }
              }
            }
          }
        ],
        properties: {
          ci: {
            codebase: {
              build: {
                type: 'branch',
                spec: {
                  branch: 'master'
                }
              }
            }
          }
        }
      }
    } as unknown as Pipeline
    const output = mergeTemplateWithInputSetData({
      templatePipeline,
      inputSetPortion,
      allValues: { pipeline: {} } as Pipeline,
      shouldUseDefaultValues: false
    })
    expect(output.pipeline.properties?.ci?.codebase?.build.type).toEqual('branch')
    expect(output.pipeline.stages?.length).toEqual(1)
  })

  test('mergeTemplateWithInputSetData works as expected', () => {
    const output = mergeTemplateWithInputSetData({
      templatePipeline: pipelineTemplate as any,
      inputSetPortion: pipelineInputSetPortion as any,
      allValues: { pipeline: {} } as Pipeline,
      shouldUseDefaultValues: false
    })
    expect((output.pipeline.variables?.[0] as AllNGVariables)?.value).toEqual('D2')
    expect((output.pipeline.variables?.[1] as AllNGVariables)?.value).toEqual('http')
    expect((output.pipeline.stages?.[0].stage?.variables?.[0] as AllNGVariables)?.value).toEqual('<+input>')
    expect((output.pipeline.stages?.[0].stage?.variables?.[1] as AllNGVariables)?.value).toEqual('v2_test')
    expect(output.pipeline.stages?.length).toEqual(1)
  })

  test('works without stages', () => {
    const templatePipeline = {
      pipeline: {
        identifier: 'P1',
        properties: {
          ci: {
            codebase: {
              build: '<+input>'
            }
          }
        }
      }
    }
    const inputSetPortion = {
      pipeline: {
        identifier: 'P1',
        properties: {
          ci: {
            codebase: {
              build: {
                type: 'branch',
                spec: {
                  branch: 'master'
                }
              }
            }
          }
        }
      }
    }
    const output = mergeTemplateWithInputSetData({
      templatePipeline: templatePipeline as any,
      inputSetPortion: inputSetPortion as any,
      allValues: { pipeline: {} } as Pipeline,
      shouldUseDefaultValues: false
    })
    expect('stages' in output.pipeline).toEqual(false)
  })

  describe('variables tests', () => {
    test('merges new variables', () => {
      const result = mergeTemplateWithInputSetData({
        templatePipeline: {
          pipeline: {
            variables: [
              { name: 'var1', type: 'String', value: '<+input>' },
              { name: 'var2', type: 'String', value: '<+input>' },
              { name: 'var3', type: 'String', value: '<+input>' }
            ]
          }
        } as any,
        inputSetPortion: {
          pipeline: {
            variables: [
              { name: 'var1', type: 'String', value: '1' },
              { name: 'var2', type: 'String', value: '2' },
              { name: 'var3', type: 'String', value: '3' },
              { name: 'var4', type: 'String', value: '4' }
            ]
          }
        } as any,
        allValues: { pipeline: {} } as Pipeline,
        shouldUseDefaultValues: false
      })

      expect(result).toEqual({
        pipeline: {
          variables: [
            { name: 'var1', type: 'String', value: '1' },
            { name: 'var2', type: 'String', value: '2' },
            { name: 'var3', type: 'String', value: '3' },
            { name: 'var4', type: 'String', value: '4' }
          ]
        }
      })
    })

    test('merges deleted variables', () => {
      const result = mergeTemplateWithInputSetData({
        templatePipeline: {
          pipeline: {
            variables: [
              { name: 'var1', type: 'String', value: '<+input>' },
              { name: 'var2', type: 'String', value: '<+input>' },
              { name: 'var3', type: 'String', value: '<+input>' }
            ]
          }
        } as any,
        inputSetPortion: {
          pipeline: {
            variables: [
              { name: 'var1', type: 'String', value: '1' },
              { name: 'var3', type: 'String', value: '3' }
            ]
          }
        } as any,
        allValues: { pipeline: {} } as Pipeline,
        shouldUseDefaultValues: false
      })

      expect(result).toEqual({
        pipeline: {
          variables: [
            { name: 'var1', type: 'String', value: '1' },
            { name: 'var2', type: 'String', value: '<+input>' },
            { name: 'var3', type: 'String', value: '3' }
          ]
        }
      })
    })

    test('maintains order of first object', () => {
      const result = mergeTemplateWithInputSetData({
        templatePipeline: {
          pipeline: {
            variables: [
              { name: 'var1', type: 'String', value: '<+input>' },
              { name: 'var3', type: 'String', value: '<+input>' },
              { name: 'var2', type: 'String', value: '<+input>' }
            ]
          }
        } as any,
        inputSetPortion: {
          pipeline: {
            variables: [
              { name: 'var1', type: 'String', value: '1' },
              { name: 'var2', type: 'String', value: '2' },
              { name: 'var3', type: 'String', value: '3' }
            ]
          }
        } as any,
        allValues: { pipeline: {} } as Pipeline,
        shouldUseDefaultValues: false
      })

      expect(result).toEqual({
        pipeline: {
          variables: [
            { name: 'var1', type: 'String', value: '1' },
            { name: 'var3', type: 'String', value: '3' },
            { name: 'var2', type: 'String', value: '2' }
          ]
        }
      })
    })

    test('handles type change of variables', () => {
      const result = mergeTemplateWithInputSetData({
        templatePipeline: {
          pipeline: {
            variables: [
              { name: 'var1', type: 'String', value: '<+input>' },
              { name: 'var2', type: 'Number', value: '<+input>' },
              { name: 'var3', type: 'String', value: '<+input>' }
            ]
          }
        } as any,
        inputSetPortion: {
          pipeline: {
            variables: [
              { name: 'var1', type: 'String', value: '1' },
              { name: 'var2', type: 'String', value: '2' },
              { name: 'var3', type: 'String', value: '3' }
            ]
          }
        } as any,
        allValues: { pipeline: {} } as Pipeline,
        shouldUseDefaultValues: false
      })

      expect(result).toEqual({
        pipeline: {
          variables: [
            { name: 'var1', type: 'String', value: '1' },
            { name: 'var2', type: 'Number', value: '<+input>' },
            { name: 'var3', type: 'String', value: '3' }
          ]
        }
      })
    })

    test('handles default values from allValues', () => {
      const templateVariables = [
        { name: 'var1', type: 'String' as const, value: '<+input>' },
        { name: 'var2', type: 'String' as const, value: '<+input>' },
        { name: 'var3', type: 'String' as const, value: '<+input>' }
      ]
      const result = mergeTemplateWithInputSetData({
        templatePipeline: {
          pipeline: clearRuntimeInput({
            identifier: '',
            name: '',
            variables: templateVariables
          })
        },
        inputSetPortion: {
          pipeline: clearRuntimeInput({
            identifier: '',
            name: '',
            variables: templateVariables
          })
        },
        allValues: {
          pipeline: {
            variables: [
              { name: 'var1', type: 'String', default: '1' },
              { name: 'var2', type: 'String', default: '2' },
              { name: 'var3', type: 'String', default: '3' }
            ]
          }
        } as any,
        shouldUseDefaultValues: true
      })

      expect(result).toEqual({
        pipeline: {
          identifier: '',
          name: '',
          variables: [
            { name: 'var1', type: 'String', value: '1' },
            { name: 'var2', type: 'String', value: '2' },
            { name: 'var3', type: 'String', value: '3' }
          ]
        }
      })
    })
  })
})

describe('getFeaturePropsForRunPipelineButton tests', () => {
  test('if no modules supplied, returns undefined', () => {
    const result = getFeaturePropsForRunPipelineButton({ getString: () => 'abc' })
    expect(result).toBeUndefined()
  })

  test('if empty modules supplied, returns undefined', () => {
    const result = getFeaturePropsForRunPipelineButton({ modules: [], getString: () => 'abc' })
    expect(result).toBeUndefined()
  })

  test('if only cd module supplied', () => {
    const result = getFeaturePropsForRunPipelineButton({ modules: ['cd'], getString: () => 'abc' })
    expect(result).toStrictEqual({
      featuresRequest: {
        featureNames: [FeatureIdentifier.DEPLOYMENTS_PER_MONTH]
      }
    })
  })

  test('if only ci module supplied', () => {
    const result = getFeaturePropsForRunPipelineButton({ modules: ['ci'], getString: () => 'abc' })
    expect(result).toStrictEqual({
      featuresRequest: {
        featureNames: [FeatureIdentifier.BUILDS]
      },
      warningMessage: 'abc'
    })
  })

  test('if cd and ci modules supplied', () => {
    const result = getFeaturePropsForRunPipelineButton({ modules: ['cd', 'ci'], getString: () => 'abc' })
    expect(result).toStrictEqual({
      featuresRequest: {
        featureNames: [FeatureIdentifier.DEPLOYMENTS_PER_MONTH, FeatureIdentifier.BUILDS]
      },
      warningMessage: 'abc'
    })
  })

  test('if a random module supplied', () => {
    const result = getFeaturePropsForRunPipelineButton({ modules: ['random'], getString: () => 'abc' })
    expect(result).toStrictEqual({
      featuresRequest: {
        featureNames: []
      }
    })
  })
})

describe('clearRuntimeInput tests', () => {
  test('clearRuntimeInput clears all inputs except execution ones', () => {
    expect(
      clearRuntimeInput({
        variables: [
          { name: 'var1', type: 'String', value: '<+input>' },
          { name: 'var2', type: 'String', value: '<+input>.allowedValues(1,2)' },
          { name: 'var3', type: 'String', value: '<+input>.allowedValues(1,2).executionInput()' },
          { name: 'var4', type: 'String', value: '<+input>.executionInput().allowedValues(1,2)' },
          {
            name: 'var5',
            type: 'String',
            value: '<+input>.allowedValues(jexl(${env.type} == “prod” ? aws1, aws2 : aws3, aws4))'
          },
          { name: 'var6', type: 'String', value: '<+input>.default(myDefaultValue)' },
          { name: 'var7', type: 'String', value: '<+input>' },
          { name: 'var8', type: 'String', value: '<+input>.executionInput()' },
          { name: 'var9', type: 'String', value: '<+input>' },
          { name: 'var10', type: 'String', value: '<+input>' }
        ]
      } as any)
    ).toEqual({
      variables: [
        {
          name: 'var1',
          type: 'String',
          value: ''
        },
        {
          name: 'var2',
          type: 'String',
          value: ''
        },
        {
          name: 'var3',
          type: 'String',
          value: '<+input>.allowedValues(1,2).executionInput()'
        },
        {
          name: 'var4',
          type: 'String',
          value: '<+input>.executionInput().allowedValues(1,2)'
        },
        {
          name: 'var5',
          type: 'String',
          value: ''
        },
        {
          name: 'var6',
          type: 'String',
          value: 'myDefaultValue'
        },
        {
          name: 'var7',
          type: 'String',
          value: ''
        },
        {
          name: 'var8',
          type: 'String',
          value: '<+input>.executionInput()'
        },
        {
          name: 'var9',
          type: 'String',
          value: ''
        },
        {
          name: 'var10',
          type: 'String',
          value: ''
        }
      ]
    })
  })

  test('clear runtime inputs array fields', () => {
    expect(clearRuntimeInput({ files: '<+input>', encryptedFiles: '<+input>', hostAttributes: '<+input>' })).toEqual({
      encryptedFiles: [''],
      files: [''],
      hostAttributes: ['']
    })
  })

  test('clear runtime removes specific fields', () => {
    expect(clearRuntimeInput({ when: '<+input>', failureStrategies: '<+input>', value: '<+input>' })).toEqual({
      value: ''
    })
  })
})

describe('getMergedVariables tests', () => {
  test('works with old execution when variable is added to pipeline', () => {
    const result = getMergedVariables({
      variables: [
        { name: 'var1', type: 'String', value: '' },
        { name: 'var2', type: 'String', value: '' }
      ],
      inputSetVariables: [{ name: 'var1', type: 'String', value: 'val1' }],
      allVariables: [],
      shouldUseDefaultValues: false
    })

    expect(result).toEqual([
      { name: 'var1', type: 'String', value: 'val1' },
      { name: 'var2', type: 'String', value: '' }
    ])
  })

  test('works with old execution when variable is removed from pipeline', () => {
    const result = getMergedVariables({
      variables: [{ name: 'var1', type: 'String', value: '' }],
      inputSetVariables: [
        { name: 'var1', type: 'String', value: 'val1' },
        { name: 'var2', type: 'Secret', value: 'val2' }
      ],
      allVariables: [],
      shouldUseDefaultValues: false
    })

    expect(result).toEqual([
      { name: 'var1', type: 'String', value: 'val1' },
      { name: 'var2', type: 'Secret', value: 'val2' }
    ])
  })
})

describe('getAllowableTypesWithoutFixedValue tests', () => {
  test('filters out fixed multi type input type', () => {
    expect(
      getAllowableTypesWithoutFixedValue([
        MultiTypeInputType.FIXED,
        MultiTypeInputType.RUNTIME,
        MultiTypeInputType.EXPRESSION
      ])
    ).toEqual([MultiTypeInputType.RUNTIME, MultiTypeInputType.EXPRESSION])
  })
})

describe('getAllowableTypesWithoutExpression tests', () => {
  test('filters out expression multi type input type', () => {
    expect(
      getAllowableTypesWithoutExpression([
        MultiTypeInputType.FIXED,
        MultiTypeInputType.RUNTIME,
        MultiTypeInputType.EXPRESSION
      ])
    ).toEqual([MultiTypeInputType.FIXED, MultiTypeInputType.RUNTIME])
  })
})

describe('default behaviour test', () => {
  test('default values provided as default key value pair should be filled', () => {
    expect(clearRuntimeInput(inputSetInput)).toEqual(inputSetOutput)
  })

  test('default as key value pair should not be given preference over <input>.default()', () => {
    set(
      inputSetInput,
      'pipeline.stages[0].stage.variables[0].value',
      '<+input>.default(test).allowedValues(test1,test,test2)'
    )
    set(inputSetOutput, 'pipeline.stages[0].stage.variables[0].value', 'test')
    expect(clearRuntimeInput(inputSetInput)).toEqual(inputSetOutput)
  })
})
