import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class Midiacode implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Midiacode',
        name: 'midiacode',
        icon: 'file:midiacode.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Consume Midiacode API',
        defaults: {
            name: 'Midiacode',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'midiacodeApi',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: 'https://contentcore.midiacode.pt',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Content',
                        value: 'content',
                    },
                ],
                default: 'content',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['content'],
                    },
                },
                options: [
                    {
                        name: 'List',
                        value: 'list',
                        description: 'List contents of a workspace',
                        action: 'List contents',
                    },
                ],
                default: 'list',
            },
            // Operation: List
            {
                displayName: 'Workspace ID',
                name: 'workspaceId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['list'],
                    },
                },
                description: 'The ID of the workspace',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/public/workspace/{{$parameter.workspaceId}}/content',
                    },
                },
            },
            {
                displayName: 'Status',
                name: 'status',
                type: 'options',
                options: [
                    {
                        name: 'All',
                        value: '',
                    },
                    {
                        name: 'Draft',
                        value: 'dra',
                    },
                    {
                        name: 'Published',
                        value: 'pub',
                    },
                    {
                        name: 'Archived',
                        value: 'arc',
                    },
                ],
                default: '',
                description: 'Filter by content status (leave as "All" to show all statuses)',
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['list'],
                    },
                },
                routing: {
                    send: {
                        type: 'query',
                        property: 'status',
                    },
                },
            },
            {
                displayName: 'Type',
                name: 'type',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['list'],
                    },
                },
                description: 'Filter by content type',
                routing: {
                    send: {
                        type: 'query',
                        property: 'type',
                    },
                },
            },
            {
                displayName: 'Search Term',
                name: 'searchTerm',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['list'],
                    },
                },
                description: 'Search term to filter contents',
                routing: {
                    send: {
                        type: 'query',
                        property: 'searchTerm',
                    },
                },
            },
        ],
    };
}
