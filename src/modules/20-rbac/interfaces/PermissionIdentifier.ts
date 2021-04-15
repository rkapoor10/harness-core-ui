export enum PermissionIdentifier {
  CREATE_PROJECT = 'core_project_create',
  UPDATE_PROJECT = 'core_project_edit',
  DELETE_PROJECT = 'core_project_delete',
  VIEW_PROJECT = 'core_project_view',
  UPDATE_SECRET = 'core_secret_edit',
  DELETE_SECRET = 'core_secret_delete',
  VIEW_SECRET = 'core_secret_view',
  ACCESS_SECRET = 'core_secret_access',
  CREATE_ORG = 'core_organization_create',
  UPDATE_ORG = 'core_organization_edit',
  DELETE_ORG = 'core_organization_delete',
  VIEW_ORG = 'core_organization_view',
  UPDATE_CONNECTOR = 'core_connector_edit',
  DELETE_CONNECTOR = 'core_connector_delete',
  VIEW_CONNECTOR = 'core_connector_view',
  ACCESS_CONNECTOR = 'core_connector_access',
  VIEW_PIPELINE = 'core_pipeline_view',
  EDIT_PIPELINE = 'core_pipeline_edit',
  DELETE_PIPELINE = 'core_pipeline_delete',
  EXECUTE_PIPELINE = 'core_pipeline_execute',
  VIEW_SERVICE = 'core_service_view',
  EDIT_SERVICE = 'core_service_edit',
  DELETE_SERVICE = 'core_service_delete',
  RUNTIMEACCESS_SERVICE = 'core_service_runtimeAccess',
  VIEW_ENVIRONMENT = 'core_environment_view',
  EDIT_ENVIRONMENT = 'core_environment_edit',
  DELETE_ENVIRONMENT = 'core_environment_delete',
  RUNTIMEACCESS_ENVIRONMENT = 'core_environment_runtimeAccess'
}
