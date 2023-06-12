import type { SectionResultDTO, SectionScore } from 'services/assessments'

export const mockSectionScores: SectionScore[] = [
  {
    sectionId: 'planning',
    sectionText: 'Planning and Requirements Process',
    sectionScore: {
      selfScore: {
        scoreType: 'SECTION_LEVEL',
        entityId: 'planning',
        score: 8.0,
        maxScore: 30
      },
      organizationScore: {
        scoreType: 'SECTION_LEVEL',
        entityId: 'planning',
        score: 8.0,
        maxScore: 30
      },
      maturityLevel: 'LEVEL_1'
    },
    numRecommendations: 3
  },
  {
    sectionId: 'testing',
    sectionText: 'Testing',
    sectionScore: {
      selfScore: {
        scoreType: 'SECTION_LEVEL',
        entityId: 'testing',
        score: 8.0,
        maxScore: 30
      },
      organizationScore: {
        scoreType: 'SECTION_LEVEL',
        entityId: 'testing',
        score: 8.0,
        maxScore: 30
      },
      maturityLevel: 'LEVEL_2'
    },
    numRecommendations: 3
  },
  {
    sectionId: 'engg',
    sectionText: 'Engineering',
    sectionScore: {
      selfScore: {
        scoreType: 'SECTION_LEVEL',
        entityId: 'engg',
        score: 8.0,
        maxScore: 30
      },
      organizationScore: {
        scoreType: 'SECTION_LEVEL',
        entityId: 'engg',
        score: 8.0,
        maxScore: 30
      },
      maturityLevel: 'LEVEL_3'
    },
    numRecommendations: 3
  }
]

export const sectionResult: SectionResultDTO = {
  assessmentId: 'sdmmAssessment1',
  companyId: 'propelo.ai',
  companyName: 'propelo.ai',
  userEmail: 'sharath3@propelo.ai',
  overallScoreOverview: {
    selfScore: {
      scoreType: 'ASSESSMENT_LEVEL',
      entityId: 'sdmmAssessment1',
      score: 77.0,
      maxScore: 100
    },
    organizationScore: {
      scoreType: 'ASSESSMENT_LEVEL',
      entityId: 'sdmmAssessment1',
      score: 66.0,
      maxScore: 100
    },
    benchmarkScore: {
      scoreType: 'ASSESSMENT_LEVEL',
      entityId: 'sdmmAssessment1',
      score: 80.0,
      maxScore: 100
    },
    maturityLevel: 'LEVEL_2'
  },
  benchmarkId: 'a8f43a2e-146c-4e5e-ab41-902227196063',
  sectionScores: [
    {
      sectionId: '1c87edc5-8925-4347-be21-b21223579f29',
      sectionText: '      Planning and Requirements Process',
      sectionScore: {
        selfScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: '1c87edc5-8925-4347-be21-b21223579f29',
          score: 5.0,
          maxScore: 6
        },
        organizationScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: '1c87edc5-8925-4347-be21-b21223579f29',
          score: 4.0,
          maxScore: 6
        },
        benchmarkScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: '1c87edc5-8925-4347-be21-b21223579f29',
          score: 4.0,
          maxScore: 4
        },
        maturityLevel: 'LEVEL_3'
      },
      numRecommendations: 2
    },
    {
      sectionId: '2b139fcf-59dd-4a11-bbae-b3fba417a6c9',
      sectionText: 'Integrated Security and Governance   ',
      sectionScore: {
        selfScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: '2b139fcf-59dd-4a11-bbae-b3fba417a6c9',
          score: 4.0,
          maxScore: 6
        },
        organizationScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: '2b139fcf-59dd-4a11-bbae-b3fba417a6c9',
          score: 2.0,
          maxScore: 6
        },
        benchmarkScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: '2b139fcf-59dd-4a11-bbae-b3fba417a6c9',
          score: 3.0,
          maxScore: 3
        },
        maturityLevel: 'LEVEL_2'
      },
      numRecommendations: 4
    },
    {
      sectionId: 'a28dfa3e-fff7-469b-893e-225519d9088d',
      sectionText: 'Build Process',
      sectionScore: {
        selfScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: 'a28dfa3e-fff7-469b-893e-225519d9088d',
          score: 10.0,
          maxScore: 12
        },
        organizationScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: 'a28dfa3e-fff7-469b-893e-225519d9088d',
          score: 8.33,
          maxScore: 12
        },
        benchmarkScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: 'a28dfa3e-fff7-469b-893e-225519d9088d',
          score: 3.0,
          maxScore: 3
        },
        maturityLevel: 'LEVEL_3'
      },
      numRecommendations: 4
    },
    {
      sectionId: 'eba7a1d3-2ff5-466c-b2be-c235d4f8cb9b',
      sectionText: 'Incident Management',
      sectionScore: {
        selfScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: 'eba7a1d3-2ff5-466c-b2be-c235d4f8cb9b',
          score: 5.0,
          maxScore: 5
        },
        organizationScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: 'eba7a1d3-2ff5-466c-b2be-c235d4f8cb9b',
          score: 4.0,
          maxScore: 5
        },
        benchmarkScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: 'eba7a1d3-2ff5-466c-b2be-c235d4f8cb9b',
          score: 4.0,
          maxScore: 4
        },
        maturityLevel: 'LEVEL_3'
      },
      numRecommendations: 2
    },
    {
      sectionId: '52dbcb38-a0f0-442c-89e5-add1283e6c2c',
      sectionText: 'Quality and Resilience Testing',
      sectionScore: {
        selfScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: '52dbcb38-a0f0-442c-89e5-add1283e6c2c',
          score: 20.0,
          maxScore: 20
        },
        organizationScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: '52dbcb38-a0f0-442c-89e5-add1283e6c2c',
          score: 16.33,
          maxScore: 20
        },
        benchmarkScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: '52dbcb38-a0f0-442c-89e5-add1283e6c2c',
          score: 2.0,
          maxScore: 2
        },
        maturityLevel: 'LEVEL_3'
      },
      numRecommendations: 8
    },
    {
      sectionId: 'd9bce794-7073-4fb7-b1f5-279a4dbf94a8',
      sectionText: 'Metrics and Insights',
      sectionScore: {
        selfScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: 'd9bce794-7073-4fb7-b1f5-279a4dbf94a8',
          score: 9.0,
          maxScore: 11
        },
        organizationScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: 'd9bce794-7073-4fb7-b1f5-279a4dbf94a8',
          score: 7.0,
          maxScore: 11
        },
        benchmarkScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: 'd9bce794-7073-4fb7-b1f5-279a4dbf94a8',
          score: 3.0,
          maxScore: 3
        },
        maturityLevel: 'LEVEL_3'
      },
      numRecommendations: 5
    },
    {
      sectionId: '926621cb-b72b-471d-a782-86c2f7e94b62',
      sectionText: 'Developer Environment Experience',
      sectionScore: {
        selfScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: '926621cb-b72b-471d-a782-86c2f7e94b62',
          score: 4.0,
          maxScore: 4
        },
        organizationScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: '926621cb-b72b-471d-a782-86c2f7e94b62',
          score: 3.33,
          maxScore: 4
        },
        benchmarkScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: '926621cb-b72b-471d-a782-86c2f7e94b62',
          score: 2.0,
          maxScore: 2
        },
        maturityLevel: 'LEVEL_3'
      },
      numRecommendations: 2
    },
    {
      sectionId: '37dcd5e8-c875-4e5c-8b1c-c919206ae5d5',
      sectionText: 'Deployment Process',
      sectionScore: {
        selfScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: '37dcd5e8-c875-4e5c-8b1c-c919206ae5d5',
          score: 16.0,
          maxScore: 24
        },
        organizationScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: '37dcd5e8-c875-4e5c-8b1c-c919206ae5d5',
          score: 14.67,
          maxScore: 24
        },
        benchmarkScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: '37dcd5e8-c875-4e5c-8b1c-c919206ae5d5',
          score: 3.0,
          maxScore: 3
        },
        maturityLevel: 'LEVEL_2'
      },
      numRecommendations: 9
    },
    {
      sectionId: 'dd184e4a-0c4c-4a9a-afcf-2ab3ceb424d8',
      sectionText: 'Discoverability and Documentation ',
      sectionScore: {
        selfScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: 'dd184e4a-0c4c-4a9a-afcf-2ab3ceb424d8',
          score: 0.0,
          maxScore: 2
        },
        organizationScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: 'dd184e4a-0c4c-4a9a-afcf-2ab3ceb424d8',
          score: 0.33,
          maxScore: 2
        },
        benchmarkScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: 'dd184e4a-0c4c-4a9a-afcf-2ab3ceb424d8',
          score: 1.0,
          maxScore: 1
        },
        maturityLevel: 'LEVEL_1'
      },
      numRecommendations: 2
    },
    {
      sectionId: 'e384f9ad-9989-41d3-bf2e-b15ba3f235ea',
      sectionText: 'Development Process',
      sectionScore: {
        selfScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: 'e384f9ad-9989-41d3-bf2e-b15ba3f235ea',
          score: 4.0,
          maxScore: 9
        },
        organizationScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: 'e384f9ad-9989-41d3-bf2e-b15ba3f235ea',
          score: 5.67,
          maxScore: 9
        },
        benchmarkScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: 'e384f9ad-9989-41d3-bf2e-b15ba3f235ea',
          score: 3.0,
          maxScore: 3
        },
        maturityLevel: 'LEVEL_2'
      },
      numRecommendations: 4
    },
    {
      sectionId: '6dfa8b13-7bff-430d-a35f-3a7de2c7509f',
      sectionText: 'Learning and Development',
      sectionScore: {
        selfScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: '6dfa8b13-7bff-430d-a35f-3a7de2c7509f',
          score: 0.0,
          maxScore: 1
        },
        organizationScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: '6dfa8b13-7bff-430d-a35f-3a7de2c7509f',
          score: 0.33,
          maxScore: 1
        },
        benchmarkScore: {
          scoreType: 'SECTION_LEVEL',
          entityId: '6dfa8b13-7bff-430d-a35f-3a7de2c7509f',
          score: 1.0,
          maxScore: 1
        },
        maturityLevel: 'LEVEL_1'
      },
      numRecommendations: 1
    }
  ]
}

export const benchmarks = [
  {
    benchmarkId: 'a8f43a2e-146c-4e5e-ab41-902227196063',
    benchmarkName: 'Benchmark 1',
    isDefault: true,
    scores: [
      {
        scoreType: 'SECTION_LEVEL',
        entityId: '1c87edc5-8925-4347-be21-b21223579f29',
        score: 4.0,
        maxScore: 4
      },
      {
        scoreType: 'QUESTION_LEVEL',
        entityId: '8d11c876-6737-41e5-8b72-57b3f57f6561',
        score: 2.8,
        maxScore: 4
      },
      {
        scoreType: 'QUESTION_LEVEL',
        entityId: 'a0653351-ebcc-41ed-905c-229f7a41ec44',
        score: 1.4,
        maxScore: 2
      },
      {
        scoreType: 'SECTION_LEVEL',
        entityId: 'dd184e4a-0c4c-4a9a-afcf-2ab3ceb424d8',
        score: 1.0,
        maxScore: 1
      },
      {
        scoreType: 'QUESTION_LEVEL',
        entityId: 'fe81f2af-3811-44fa-820a-d96463f23f19',
        score: 0.7,
        maxScore: 1
      },
      {
        scoreType: 'QUESTION_LEVEL',
        entityId: '6ac4bd2b-50c2-4cad-ba39-c14f5a91b0ff',
        score: 0.7,
        maxScore: 1
      },
      {
        scoreType: 'SECTION_LEVEL',
        entityId: '926621cb-b72b-471d-a782-86c2f7e94b62',
        score: 2.0,
        maxScore: 2
      },
      {
        scoreType: 'QUESTION_LEVEL',
        entityId: '84a29c2d-6e98-4823-9491-0f8f52087678',
        score: 1.4,
        maxScore: 2
      },
      {
        scoreType: 'QUESTION_LEVEL',
        entityId: 'bb764ab8-48a9-475d-b535-a77c1f069dbd',
        score: 1.4,
        maxScore: 2
      },
      {
        scoreType: 'SECTION_LEVEL',
        entityId: 'e384f9ad-9989-41d3-bf2e-b15ba3f235ea',
        score: 3.0,
        maxScore: 3
      },
      {
        scoreType: 'QUESTION_LEVEL',
        entityId: '3d3f44ee-c652-4a85-acdb-fbffb589ff72',
        score: 2.0999999999999996,
        maxScore: 3
      },
      {
        scoreType: 'QUESTION_LEVEL',
        entityId: '121891fb-939d-4e90-b761-c03491b7eefa',
        score: 1.4,
        maxScore: 2
      },
      {
        scoreType: 'QUESTION_LEVEL',
        entityId: '185efa6f-10ca-4de4-9130-e5b835a23dec',
        score: 1.4,
        maxScore: 2
      },
      {
        scoreType: 'QUESTION_LEVEL',
        entityId: '46635a35-b1ba-4e29-b7d4-5e1e5ec3a81b',
        score: 1.4,
        maxScore: 2
      },
      {
        scoreType: 'SECTION_LEVEL',
        entityId: 'a28dfa3e-fff7-469b-893e-225519d9088d',
        score: 3.0,
        maxScore: 3
      },
      {
        scoreType: 'QUESTION_LEVEL',
        entityId: '71febc8c-a4f5-43f7-b1c8-2370fa47f033',
        score: 2.0999999999999996,
        maxScore: 3
      },
      {
        scoreType: 'QUESTION_LEVEL',
        entityId: 'a72eb17d-4d1e-4a90-8793-8c91d9126f20',
        score: 2.0999999999999996,
        maxScore: 3
      },
      {
        scoreType: 'QUESTION_LEVEL',
        entityId: 'df723a1c-fca4-4cea-9dc1-1804b9872e8b',
        score: 1.4,
        maxScore: 2
      }
    ]
  }
]
