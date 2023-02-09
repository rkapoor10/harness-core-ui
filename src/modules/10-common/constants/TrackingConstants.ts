/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

export enum PageNames {
  Purpose = 'Purpose page',
  TrialInProgress = 'Trial in progress page',
  TrialSetupPipelineModal = 'Trial setup pipeline modal'
}

export enum PurposeActions {
  ModuleContinue = 'Purpose Continue click',
  CDModuleContinue = 'CD Welcome Page Continue Clicked',
  CDCGModuleSelected = 'CD Current Gen Continue Clicked'
}

export enum TrialActions {
  StartTrialClick = 'Start a trial click',
  TrialModalPipelineSetupSubmit = 'Trial modal pipeline setup submit',
  TrialModalPipelineSetupCancel = 'Trial modal pipeline setup cancel'
}

export enum PlanActions {
  StartFreeClick = 'Start a free plan click'
}

export enum StageActions {
  SelectStage = 'Select a Stage',
  SetupStage = 'Setup Stage',
  DeleteStage = 'Delete Stage',
  LoadSelectStageTypeView = 'Load Select Stage Type View',
  LoadEditStageView = 'Load Edit Stage View',
  LoadCreateOrSelectConnectorView = 'Load Create or Select a Connector View',
  ApplySelectedConnector = 'Apply Selected Connector',
  CancelSelectConnector = 'Cancel Select Connector',
  LoadSelectConnectorTypeView = 'Load Select Connector Type View',
  SelectConnectorType = 'Select Connector Type'
}

export enum SecretActions {
  StartCreateSecret = 'Start Create Secret',
  SaveCreateSecret = 'Save Create Secret'
}

export enum ConnectorActions {
  StartCreateConnector = 'Create Connector Started',
  SaveCreateConnector = 'Create Connector Saved',
  ConnectorDetailsStepLoad = 'Connector Details Step Loaded',
  ConnectorDetailsStepSubmit = 'Connector Details Step Submitted',
  AuthenticationStepLoad = 'Connector Authentication Step Loaded',
  AuthenticationStepSubmit = 'Connector Authentication Step Submitted',
  DetailsStepLoad = 'Details Step Loaded',
  DetailsStepSubmit = 'Details Step Submitted',
  ConfigLoad = 'Connector Config Loaded',
  ConfigSubmit = 'Connector Config Submitted',
  CreateConnectorLoad = 'Connector Loaded',
  CreateConnectorSubmit = 'Connector Submitted',
  DelegateSelectorStepLoad = 'Delegate Selector Step Loaded',
  DelegateSelectorStepSubmit = 'Delegate Selector Step Submitted',
  ConnectivityModeStepLoad = 'Connectivity Mode Step Loaded',
  ConnectivityModeStepSubmit = 'Connectivity Mode Step Submitted',
  SetupEngineLoad = 'Setup Engine Loaded',
  SetupEngineSubmit = 'Setup Engine Submitted',
  AzureKeyValueFormLoad = 'Azure Key Value Form Loaded',
  AzureKeyValueFormSubmit = 'Azure Key Value Form Submitted',
  SetupVaultLoad = 'Setup Vault Loaded',
  SetupVaultSubmit = 'Setup Vault Submitted',
  OverviewLoad = 'Connector Overview Loaded',
  OverviewSubmit = 'Connector Overview Submitted',
  AzureConnectorBillingLoad = 'Azure Connector Billing Loaded',
  AzureConnectorBillingSubmit = 'Azure Connector Billing Submitted',
  CEGcpConnectorBillingExportLoad = 'CCM Gcp Connector Billing Export Loaded',
  CEGcpConnectorBillingExportSubmit = 'CCM Gcp Connector Billing Export Submitted',
  ChooseRequirementsLoad = 'Choose Requirements Loaded',
  ChooseRequirementsSubmit = 'Choose Requirements Submitted',
  ProvidePermissionsLoad = 'Provide Permissions Loaded',
  ProvidePermissionsSubmit = 'Provide Permissions Submitted',
  CustomHealthHeadersAndParamsLoad = 'Custom Health Headers And Param Loaded',
  CustomHealthHeadersAndParamsSubmit = 'Custom Health Headers And Param Submitted',
  CustomHealthValidationPathLoad = 'Custom Health Validation Path Loaded',
  CustomHealthValidationPathSubmit = 'Custom Health Validation Path Submitted',
  CreateServicePrincipalLoad = 'Create Service Principal Loaded',
  CreateServicePrincipalSubmit = 'Create Service Principal Submitted',
  FeatureSelectionStepLoad = 'Feature Selection Step Loaded',
  FeatureSelectionStepSubmit = 'Feature Selection Step Submitted',
  SecretCreationStepLoad = 'Secret Creation Step Loaded',
  SecretCreationStepSubmit = 'Secret Creation Step Submitted',
  CENGAwsConnectorCostUsageReportLoad = 'CCM NG AWS Connector Cost Usage Report Loaded',
  CENGAwsConnectorCostUsageReportSubmit = 'CCM NG AWS Connector Cost Usage Report Submitted',
  CENGAwsConnectorCrossAccountRoleStep1Load = 'CCM NG AWS Connector Cross Account Role Step1 Loaded',
  CENGAwsConnectorCrossAccountRoleStep1Submit = 'CCM NG AWS Connector Cross Account Role Step1 Submitted',
  CENGAwsConnectorCrossAccountRoleStep2Load = 'CCM NG AWS Connector Cross Account Role Step2 Loaded',
  CENGAwsConnectorCrossAccountRoleStep2Submit = 'CCM NG AWS Connector Cross Account Role Step2 Submitted'
}

export enum ConnectorTypes {
  Helm = 'Helm',
  Docker = 'Docker',
  CEGcp = 'CEGcp'
}

export enum DelegateActions {
  StartCreateDelegate = 'Start Create Delegate',
  SaveCreateDelegate = 'Save Create Delegate',
  SelectDelegateType = 'Select Delegate Type',
  SetupDelegate = 'Set up Delegate',
  SetupDelegateBack = 'Set up Delegate Back',
  VerificationBack = 'Verification Back',
  DownloadYAML = 'Download YAML File',
  LoadCreateTokenModal = 'Load Create Token Modal',
  SaveCreateToken = 'Save Create Token',
  CloseCreateToken = 'Close Create Token',
  ReviewScriptContinue = 'Review Script Continue',
  ReviewScriptBack = 'Review Script Back',
  DelegateCommandLineKubernetes = 'Delegate Command Line Kubernetes',
  DelegateCommandLineKubernetesManifest = 'Delegate Command Line Kubernetes Manifest',
  DelegateCommandLineKubernetesManifestCommandCopy1 = 'Delegate Command Line Kubernetes Manifest curl -LO https://raw.githubusercontent.com/harness/delegate-kubernetes-manifest/main/harness-delegate.yaml copy',

  DelegateCommandLineKubernetesManifestCommandCopy2 = 'Delegate Command Line Kubernetes Manifest command from backend copy',
  DelegateCommandLineHelm = 'Delegate Command Line Helm',
  DelegateCommandLineHelmCommandCopy1 = 'Delegate Command Line Helm first command helm repo add harness-delegate https://app.harness.io/storage/harness-download/delegate-helm-chart/',
  DelegateCommandLineTroubleShoot = 'Delegate Command Line TroubleShoot',
  DelegateCommandLineTroubleShootRetryConnection = 'Delegate Command Line TroubleShoot retry connection',
  DelegateCommandLineDone = 'Delegate Command Line Done',
  DelegateCommandLineHelmCommandCopy2 = 'Delegate Command Line Helm second command helm repo update',
  DelegateCommandLineHelmCommandCopy3 = 'Delegate Command Line Helm third command copy',

  DelegateCommandLineHelmCommandCopy4 = 'Delegate Command Line Helm command from backend  copy',
  DelegateCommandLineTerraform = 'Delegate Command Line Terraform',
  DelegateCommandLineTerraformCommandCopy1 = 'Delegate Command Line Terraform terraform apply copy',
  DelegateCommandLineTerraformCommandCopy2 = 'Delegate Command Line Terraform terraform init copy',
  DelegateCommandLineTerraformCommandCopy3 = 'Delegate Command Line Terraform command from backend  copy',
  DelegateCommandLineTerraformDownloadCommand3 = 'Delegate Command Line Terraform command from backend download',
  DelegateCommandLineTroubleShootProblemSolved = 'Delegate CommandLine TroubleShoot Problem Solved',
  DelegateCommandLineTroubleShootProblemNotSolved = 'Delegate CommandLine TroubleShoot Problem Not Solved',
  DelegateCommandLineTroubleShootProblemFeedBackSaved = 'Delegate CommandLine TroubleShoot FeedBack Saved',

  DelegateCommandLineDocker = 'Delegate Command Line Docker',
  DelegateCommandLineDockerCommandCopy = 'Delegate Command Line Docker Command Copy',
  DelegateCommandLineTroubleShootCopyCommonCommand1 = 'Delegate CommandLine TroubleShoot Copy Common Command kubectl describe pods -n <namespace>',
  DelegateCommandLineTroubleShootCopyCommonCommand2 = 'Delegate CommandLine TroubleShoot Copy Common Command kubectl logs -f <harnessDelegateName> -n <namespace>',
  DelegateCommandLineTroubleShootCopyCommonCommand3 = 'Delegate CommandLine TroubleShoot Copy Common Command kubectl describe <pod_name> -n <namespace>',
  DelegateCommandLineTroubleShootDockerCopyCommonCommand1 = 'Delegate CommandLine TroubleShoot Docker Copy Common Command docker container ls -a',
  DelegateCommandLineTroubleShootDockerCopyCommonCommand2 = 'Delegate CommandLine TroubleShoot Docker Copy Common Command docker container logs <delegatename> -f',
  DelegateCommandLineTroubleShootDockerCopyCommonCommand3 = 'Delegate CommandLine TroubleShoot Docker Copy Common Command docker container stop <delegatename>',
  DelegateCommandLineTroubleShootDockerCopyCommonCommand4 = 'Delegate CommandLine TroubleShoot Docker Copy Common Command docker container start <delegatename>',
  DelegateCommandLineTroubleShootDockerCopyCommonCommand5 = 'Delegate CommandLine TroubleShoot Docker Copy Common Command docker container rm [container id]',
  DelegateCommandLineTroubleShootHelmCopyCommonCommand1 = 'Delegate CommandLine TroubleShoot Helm Copy Common Command helm',
  DelegateCommandLineTroubleShootHelmCopyCommonCommand2 = 'Delegate CommandLine TroubleShoot Helm Copy Common Command helm version',
  DelegateCommandLineTroubleShootTerraformCopyCommonCommand1 = 'Delegate CommandLine TroubleShoot Terraform Copy Common Command terraform -version',
  SwitchedToOldDelegateCreationModal = 'switchedToOldDelegateCreationModal',
  DelegateCommandLineCreationOpened = 'Delegate CommandLine Creation Opened',
  DelegateCommandLineCreationClosed = 'Delegate CommandLine Creation Closed'
}

export enum StepActions {
  SelectStep = 'Select a Step',
  AddEditStep = 'Add/Edit Step',
  AddEditStepGroup = 'Add/Edit Step Group',
  DeleteStep = 'Delete Step',
  AddEditFailureStrategy = 'Add/Edit Failure strategy'
}

export enum PipelineActions {
  StartedExecution = 'Started Pipeline Execution',
  // CompletedExecution = 'Completed Pipeline Execution', // this is done from BE
  StartedPipelineCreation = 'Started Pipeline Creation',
  PipelineCreatedViaVisual = 'Save a pipeline using Visual Mode',
  PipelineCreatedViaYAML = 'Save a pipeline using YAML editor',
  PipelineUpdatedViaVisual = 'Update a pipeline using Visual Mode',
  PipelineUpdatedViaYAML = 'Update a pipeline using YAML editor',
  SetupLater = 'Click Setup later',
  LoadCreateNewPipeline = 'Load Create new Pipeline',
  CancelCreateNewPipeline = 'Cancel Create new Pipeline',
  LoadSelectOrCreatePipeline = 'Load Select or Create Pipeline',
  SelectAPipeline = 'Select a Pipeline',
  CreateAPipeline = 'Create a Pipeline'
}

export enum NavigatedToPage {
  DeploymentsPage = 'Navigates to Deployments/Builds page',
  PipelinesPage = 'Navigates to Pipelines page',
  PipelineStudio = 'Navigates to Pipline Studio',
  PipelineInputSet = 'Navigates to Pipline Input Set',
  PipelineTriggers = 'Navigates to Pipline Triggers',
  PipelineExecutionHistory = 'Navigates to Pipline Execution History'
}

export enum Category {
  SIGNUP = 'Signup',
  PROJECT = 'Project',
  PIPELINE = 'Pipeline',
  STAGE = 'Stage',
  SECRET = 'Secret',
  CONNECTOR = 'Connector',
  DELEGATE = 'Delegate',
  ENVIRONMENT = 'Environment',
  CONTACT_SALES = 'ContactSales',
  LICENSE = 'License',
  FEEDBACK = 'Feedback',
  ENFORCEMENT = 'Enforcement',
  FEATUREFLAG = 'Featureflag'
}

export enum ManifestActions {
  SaveManifestOnPipelinePage = 'Save Manifest on Pipeline Page',
  UpdateManifestOnPipelinePage = 'Update Manifest on Pipeline Page'
}

export enum ServiceConfigActions {
  SaveConnectionStringOnPipelinePage = 'Save Connection String on Pipeline Page',
  SaveApplicationSettingOnPipelinePage = 'Save Application Setting on Pipeline Page'
}

export enum StartupScriptActions {
  SaveStartupScriptOnPipelinePage = 'Save Startup Script on Pipeline Page'
}

export enum ArtifactActions {
  SavePrimaryArtifactOnPipelinePage = 'Save Primary Artifact on Pipeline Page',
  UpdatePrimaryArtifactOnPipelinePage = 'Update Primary Artifact on Pipeline Page',
  SaveSidecarArtifactOnPipelinePage = 'Save Sidecar Artifact on Pipeline Page',
  UpdateSidecarArtifactOnPipelinePage = 'Update Sidecar Artifact on Pipeline Page'
}

export enum ProjectActions {
  OpenCreateProjectModal = 'Open Create Project modal',
  SaveCreateProject = 'Save Create project',
  LoadInviteCollaborators = 'Load Invite Collaborators',
  SaveInviteCollaborators = 'Save Invite Collaborators',
  ClickBackToProject = 'Click Back to Project',
  LoadSelectOrCreateProjectModal = 'Load Select Or Create Project Modal',
  ClickSelectProject = 'Select Project from Project Selector'
}

export enum ExitModalActions {
  ExitByCancel = 'ExitByCancel',
  ExitByClose = 'ExitByClose',
  ExitByClick = 'ExitByClick'
}

export enum EnvironmentActions {
  StartCreateEnvironment = 'Start Create Environment',
  SaveCreateEnvironment = 'Save Create Environment'
}

export enum ContactSalesActions {
  LoadContactSales = 'Load Contact Sales',
  SubmitContactSales = 'Submit Contact Sales'
}

export enum FeedbackActions {
  LoadFeedback = 'Load Feedback',
  SubmitFeedback = 'Submit Feedback'
}

export enum LicenseActions {
  ExtendTrial = 'Extend Trial',
  LoadExtendedTrial = 'Load Extended Trial'
}

export enum FeatureActions {
  DismissFeatureBanner = 'Feature Banner Dismissed',
  AddNewFeatureFlag = 'Add New FeatureFlag Clicked',
  SelectFeatureFlagType = 'Select FeatureFlag Type Loaded',
  AboutTheFlag = 'About the Flag Loaded',
  AboutTheFlagNext = 'About the Flag Next Clicked',
  BackToSelectFeatureFlagType = 'Back to FeatureFlag Type Select Clicked',
  VariationSettings = 'Variation Settings Loaded',
  CreateFeatureFlagSubmit = 'Create FeatureFlag Submitted',
  AddFlagPipeline = 'Add New Flag Pipeline Button Clicked',
  SavedFlagPipeline = 'Flag Pipeline Saved',
  EditFlagPipeline = 'Edit Flag Pipeline Button Clicked',
  DeletedFlagPipeline = 'Flag Pipeline Deleted',
  GitExperience = 'Set Up with Existing Repository Loaded',
  GitExperienceSubmit = 'Set Up with Existing Repository Submitted',
  GitExperienceBack = 'Set Up with Existing Repository Back Clicked',
  GetStartedClick = 'Get Started Clicked',
  CreateAFlagView = 'Create a Flag View Loaded',
  SetUpYourApplicationView = 'Set Up Your Application View Loaded',
  SetUpYourApplicationVerify = 'Set Up Your Application Verify Clicked',
  SetUpYourCodeView = 'Set Up Your Code View Clicked',
  TestYourFlagBack = 'Test Your Flag Back to Quick Start Guide Clicked',
  GetStartedPrevious = 'Get Started Previous Clicked',
  GetStartedNext = 'Get Started Next Clicked',
  LanguageSelect = 'Language Selected',
  EnvSelect = 'Environment Selected',
  CreateEnvClick = 'Create an Environment Clicked',
  CreateEnvSubmit = 'Create an Environment Submitted',
  CreateEnvCancel = 'Create an Environment Cancel Clicked',
  CreateSDKKeyClick = 'Create SDK Key Clicked',
  CreateSDKKeySubmit = 'Create SDK Key Submitted',
  CreateSDKKeyCancel = 'Create SDK Key Cancel Clicked'
}

export enum CCMActions {
  CCMStartPlanModal = 'CCM Start Plan Modal Loaded',
  CCMStartPlanContinue = 'CCM Start Plan Modal Continue Clicked'
}

export enum CIOnboardingActions {
  SelectGitProvider = 'Git Provider Selected',
  GetStartedClicked = 'Clicked on Get Started for CI',
  ConfigurePipelineClicked = 'Clicked on Configure Pipeline',
  CreatePipelineClicked = 'Clicked on Create Pipeline'
}

export enum CDOnboardingActions {
  GetStartedClicked = 'Clicked on Get Started for CD',
  ExitCDOnboarding = 'Exited CD Get Started',
  StartOnboardingDelegateCreation = 'Start onboarding Delegate creation',
  SetupOnboardingDelegate = 'Setup onboarding Delegate',
  SaveCreateOnboardingDelegate = 'Save create onboarding Delegate',
  DownloadOnboardingYAML = 'Download onboarding YAML File',
  PreviewHelpAndTroubleshooting = 'Preview Help and Troubleshoot for K8s',
  HeartbeatVerifiedOnboardingYAML = 'Heartbeat verified onboarding YAML',
  HeartbeatFailedOnboardingYAML = 'Heartbeat failed onboarding YAML',
  EnvironmentEntitiesCreation = 'Harness environment entities created',
  SelectManifestType = 'Manifest type selection',
  SelectManifestStore = 'Manifest store selection',
  SelectArtifactType = 'Select artifact type',
  MovetoConfigureEnvironment = 'Move to Configure Environment Step',
  SelectDeploymentType = 'Select deployment type',
  MoveToServiceSelection = 'Move to Service Selection Step',
  MoveToDeploymentSelection = 'Move to Deployment type',
  MoveToPipelineSummary = 'Move to Pipeline summary page '
}

export enum CFOverviewActions {
  OverviewStartFreePlan = 'FF Overview - Start a free plan',
  InviteCollaboratorsClick = 'Clicked Invite Collaborators'
}
