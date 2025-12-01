import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MidiacodeApi implements ICredentialType {
	name = 'midiacodeApi';
	displayName = 'Midiacode API';
	documentationUrl = 'https://contentcore.midiacode.pt/docs/';
	icon = 'file:midiacode.svg' as const;
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
		{
			displayName: 'Workspace ID',
			name: 'workspaceId',
			type: 'string',
			default: '',
			required: true,
			description: 'The ID of your workspace (required for API key validation)',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://contentcore.midiacode.pt',
			url: '=/public/check-api-key/?workspace_id={{$credentials.workspaceId}}',
			method: 'GET',
		},
	};
}
