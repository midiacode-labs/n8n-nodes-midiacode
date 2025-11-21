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
                options: [
                    {
                        name: 'Search',
                        value: 'search',
                        description: 'Search contents of a workspace',
                        action: 'Search contents',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/public/workspace/{{$parameter.workspaceId}}/content',
                            },
                        },
                    },
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'Create a new content item',
                        action: 'Create content',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/public/content/',
                            },
                        },
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Get a specific content item',
                        action: 'Get content',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/public/content/{{$parameter.contentId}}/',
                            },
                        },
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        description: 'Update an existing content item',
                        action: 'Update content',
                        routing: {
                            request: {
                                method: 'PATCH',
                                url: '=/public/content/{{$parameter.contentId}}/',
                            },
                        },
                    },
                    {
                        name: 'Get Link',
                        value: 'getLink',
                        description: 'Get content link data',
                        action: 'Get content link',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/public/content/{{$parameter.contentId}}/link/',
                            },
                        },
                    },
                    {
                        name: 'Update Link',
                        value: 'updateLink',
                        description: 'Update content link data',
                        action: 'Update content link',
                        routing: {
                            request: {
                                method: 'PATCH',
                                url: '=/public/content/{{$parameter.contentId}}/link/',
                            },
                        },
                    },
                    {
                        name: 'Publish',
                        value: 'publish',
                        description: 'Publish content',
                        action: 'Publish content',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/public/content/publish/',
                            },
                        },
                    },
                ],
                default: 'search',
            },
            // ----------------------------------
            // Operation: Search
            // ----------------------------------
            {
                displayName: 'Workspace ID',
                name: 'workspaceId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['search'],
                    },
                },
                description: 'The ID of the workspace',
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
                        operation: ['search'],
                    },
                },
                routing: {
                    send: {
                        type: 'query',
                        property: 'status',
                        value: '={{$value}}',
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
                        operation: ['search'],
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
                        operation: ['search'],
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
            {
                displayName: 'Page Size',
                name: 'pageSize',
                type: 'number',
                default: 25,
                typeOptions: {
                    minValue: 1,
                    maxValue: 500,
                },
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['search'],
                    },
                },
                description: 'Number of items per page (1-500)',
                routing: {
                    send: {
                        type: 'query',
                        property: 'page_size',
                    },
                },
            },
            {
                displayName: 'Page',
                name: 'page',
                type: 'number',
                default: 1,
                typeOptions: {
                    minValue: 1,
                },
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['search'],
                    },
                },
                description: 'Page number to retrieve',
                routing: {
                    send: {
                        type: 'query',
                        property: 'page',
                    },
                },
            },

            // ----------------------------------
            // Operation: Create
            // ----------------------------------
            {
                displayName: 'Title',
                name: 'title',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['create'],
                    },
                },
                routing: {
                    send: {
                        type: 'body',
                        property: 'title',
                    },
                },
            },
            {
                displayName: 'Content Type Slug',
                name: 'contentTypeSlug',
                type: 'options',
                options: [
                    { name: 'Facebook', value: 'facebook' },
                    { name: 'Instagram', value: 'instagram' },
                    { name: 'LinkedIn', value: 'linkedin' },
                    { name: 'MP3', value: 'mp3' },
                    { name: 'Pinterest', value: 'pinterest' },
                    { name: 'Podcast', value: 'podcast' },
                    { name: 'Seppo', value: 'seppo' },
                    { name: 'TikTok', value: 'tiktok' },
                    { name: 'Twitter', value: 'twitter' },
                    { name: 'URL', value: 'url' },
                    { name: 'Video', value: 'video' },
                    { name: 'WhatsApp', value: 'whatsapp' },
                    { name: 'Xplabo', value: 'xplabo' },
                    { name: 'YouTube', value: 'youtube' },
                ],
                default: 'url',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['create'],
                    },
                },
                routing: {
                    send: {
                        type: 'body',
                        property: 'content_type_slug',
                    },
                },
            },
            {
                displayName: 'Workspace ID',
                name: 'workspaceIdBody',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['create'],
                    },
                },
                description: 'The ID of the workspace',
                routing: {
                    send: {
                        type: 'body',
                        property: 'workspace_id',
                    },
                },
            },

            // ----------------------------------
            // Operation: Get, Update, Get Link, Update Link
            // ----------------------------------
            {
                displayName: 'Content ID',
                name: 'contentId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['get', 'update', 'getLink', 'updateLink'],
                    },
                },
                description: 'The ID of the content',
            },

            // ----------------------------------
            // Operation: Publish
            // ----------------------------------
            {
                displayName: 'Content ID',
                name: 'contentIdPublish',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['publish'],
                    },
                },
                description: 'The ID of the content to publish',
                routing: {
                    send: {
                        type: 'body',
                        property: 'content_id',
                    },
                },
            },
            {
                displayName: 'Workspace ID',
                name: 'workspaceIdBody',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['publish'],
                    },
                },
                description: 'The ID of the workspace',
                routing: {
                    send: {
                        type: 'body',
                        property: 'workspace_id',
                    },
                },
            },
            {
                displayName: 'Status',
                name: 'statusPublish',
                type: 'options',
                options: [
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
                default: 'pub',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['publish'],
                    },
                },
                routing: {
                    send: {
                        type: 'body',
                        property: 'status',
                    },
                },
            },
            {
                displayName: 'Notification',
                name: 'notification',
                type: 'boolean',
                default: true,
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['publish'],
                    },
                },
                routing: {
                    send: {
                        type: 'body',
                        property: 'notification',
                    },
                },
            },
            {
                displayName: 'Change Message',
                name: 'changeMessage',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['publish'],
                    },
                },
                routing: {
                    send: {
                        type: 'body',
                        property: 'change_message',
                    },
                },
            },

            // ----------------------------------
            // Operation: Update
            // ----------------------------------
            {
                displayName: 'Title',
                name: 'titleUpdate',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['update'],
                    },
                },
                routing: {
                    send: {
                        type: 'body',
                        property: 'title',
                    },
                },
            },
            {
                displayName: 'Content Type Slug',
                name: 'contentTypeSlugUpdate',
                type: 'options',
                options: [
                    { name: 'Facebook', value: 'facebook' },
                    { name: 'Instagram', value: 'instagram' },
                    { name: 'LinkedIn', value: 'linkedin' },
                    { name: 'MP3', value: 'mp3' },
                    { name: 'Pinterest', value: 'pinterest' },
                    { name: 'Podcast', value: 'podcast' },
                    { name: 'Seppo', value: 'seppo' },
                    { name: 'TikTok', value: 'tiktok' },
                    { name: 'Twitter', value: 'twitter' },
                    { name: 'URL', value: 'url' },
                    { name: 'Video', value: 'video' },
                    { name: 'WhatsApp', value: 'whatsapp' },
                    { name: 'Xplabo', value: 'xplabo' },
                    { name: 'YouTube', value: 'youtube' },
                ],
                default: 'url',
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['update'],
                    },
                },
                routing: {
                    send: {
                        type: 'body',
                        property: 'content_type_slug',
                    },
                },
            },

            // ----------------------------------
            // Operation: Update Link
            // ----------------------------------
            {
                displayName: 'URL',
                name: 'url',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['updateLink'],
                    },
                },
                routing: {
                    send: {
                        type: 'body',
                        property: 'url',
                    },
                },
            },
            {
                displayName: 'Title',
                name: 'titleUpdateLink',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['updateLink'],
                    },
                },
                routing: {
                    send: {
                        type: 'body',
                        property: 'title',
                    },
                },
            },
            {
                displayName: 'Description',
                name: 'description',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['updateLink'],
                    },
                },
                routing: {
                    send: {
                        type: 'body',
                        property: 'description',
                    },
                },
            },
        ],
    };
}
