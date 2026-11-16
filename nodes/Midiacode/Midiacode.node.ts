import { INodeType, INodeTypeDescription } from 'n8n-workflow';

import { prepareAssetUpload } from './AssetUpload';

// The geo API takes a calendar date (YYYY-MM-DD, workspace timezone); drop any time part.
// $value is an ISO string from the picker, but an expression may yield a Luxon DateTime
// (toISO keeps its own zone) or a JS Date (no zone, so UTC); String() would mangle a Date.
export const CALENDAR_DATE_EXPRESSION =
    "={{ $value ? (typeof $value === 'string' ? $value : $value.toISO ? $value.toISO() : $value.toISOString()).slice(0, 10) : undefined }}";

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
        usableAsTool: true,
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
                        name: 'Asset',
                        value: 'asset',
                    },
                    {
                        name: 'Content',
                        value: 'content',
                    },
                    {
                        name: 'Push Notification',
                        value: 'pushNotification',
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
                    {
                        name: 'Remove Geolocation',
                        value: 'removeGeolocation',
                        description: 'Remove the content geolocation (publish afterwards)',
                        action: 'Remove content geolocation',
                        routing: {
                            request: {
                                method: 'DELETE',
                                url: '=/public/content/{{$parameter.contentId}}/geo/',
                            },
                        },
                    },
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
                        name: 'Set Cover',
                        value: 'setCover',
                        description:
                            'Set the content cover from a public image URL (resized to 730x354; publish afterwards)',
                        action: 'Set content cover',
                        routing: {
                            request: {
                                method: 'PUT',
                                url: '=/public/content/{{$parameter.contentId}}/cover/',
                            },
                        },
                    },
                    {
                        name: 'Set Geolocation',
                        value: 'setGeolocation',
                        description:
                            'Publish the content only around a location, optionally between two dates (publish afterwards)',
                        action: 'Set content geolocation',
                        routing: {
                            request: {
                                method: 'PUT',
                                url: '=/public/content/{{$parameter.contentId}}/geo/',
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
                ],
                default: 'create',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['pushNotification'],
                    },
                },
                options: [
                    {
                        name: 'Send',
                        value: 'send',
                        description: 'Send a push notification',
                        action: 'Send push notification',
                        routing: {
                            request: {
                                method: 'POST',
                                baseURL: 'https://account.midiacode.pt',
                                url: '/public/push-notification/',
                            },
                        },
                    },
                ],
                default: 'send',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['asset'],
                    },
                },
                options: [
                    {
                        name: 'Upload',
                        value: 'upload',
                        description: 'Upload an image (JPEG, PNG or WebP up to 5 MB) and get its public URL',
                        action: 'Upload an image asset',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/public/asset/',
                            },
                            send: {
                                preSend: [prepareAssetUpload],
                            },
                        },
                    },
                ],
                default: 'upload',
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
                default: 'pub',
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
            {
                displayName: 'Title',
                name: 'title',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['create', 'update'],
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
                    { name: 'Web Based', value: 'web-based' },
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
                        operation: [
                            'create',
                            'publish',
                            'setCover',
                            'setGeolocation',
                            'update',
                            'updateLink',
                        ],
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
                displayName: 'Workspace ID',
                name: 'workspaceIdQuery',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['getLink', 'get', 'removeGeolocation'],
                    },
                },
                description: 'The ID of the workspace',
                routing: {
                    send: {
                        type: 'query',
                        property: 'workspace_id',
                    },
                },
            },
            {
                displayName: 'Priority',
                name: 'priority',
                type: 'number',
                default: 1,
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['create', 'update'],
                    },
                },
                routing: {
                    send: {
                        type: 'body',
                        property: 'priority',
                    },
                },
            },
            {
                displayName: 'GS1 QR Code Enabled',
                name: 'gs1QrCodeEnabled',
                type: 'boolean',
                default: false,
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['create', 'update'],
                    },
                },
                routing: {
                    send: {
                        type: 'body',
                        property: 'gs1_qr_code_enabled',
                    },
                },
            },
            {
                displayName: 'GS1 AI',
                name: 'gs1Ai',
                type: 'string',
                default: '01',
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['create', 'update'],
                    },
                },
                routing: {
                    send: {
                        type: 'body',
                        property: 'gs1_ai',
                    },
                },
            },
            {
                displayName: 'Product EAN13',
                name: 'productEan13',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['create', 'update'],
                    },
                },
                routing: {
                    send: {
                        type: 'body',
                        property: 'product_ean13',
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
                displayName: 'Product Variant',
                name: 'productVariant',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['create', 'update'],
                    },
                },
                routing: {
                    send: {
                        type: 'body',
                        property: 'product_variant',
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
                        operation: [
                            'get',
                            'update',
                            'getLink',
                            'updateLink',
                            'setCover',
                            'setGeolocation',
                            'removeGeolocation',
                        ],
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
                        property: 'link',
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
            {
                displayName: 'Collectible',
                name: 'collectible',
                type: 'boolean',
                default: true,
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['updateLink'],
                    },
                },
                routing: {
                    send: {
                        type: 'body',
                        property: 'collectible',
                    },
                },
            },
            {
                displayName: 'Embedded on App',
                name: 'embeddedOnMobileApp',
                type: 'boolean',
                default: false,
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['updateLink'],
                    },
                },
                routing: {
                    send: {
                        type: 'body',
                        property: 'embedded_on_mobile_app',
                    },
                },
            },
            {
                displayName: 'Private',
                name: 'private',
                type: 'boolean',
                default: false,
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['updateLink'],
                    },
                },
                routing: {
                    send: {
                        type: 'body',
                        property: 'private',
                    },
                },
            },
            {
                displayName: 'Recommended',
                name: 'recommended',
                type: 'boolean',
                default: false,
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['updateLink'],
                    },
                },
                routing: {
                    send: {
                        type: 'body',
                        property: 'recommended',
                    },
                },
            },
            {
                displayName: 'Shareable',
                name: 'shareable',
                type: 'boolean',
                default: true,
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['updateLink'],
                    },
                },
                routing: {
                    send: {
                        type: 'body',
                        property: 'shareable',
                    },
                },
            },
            {
                displayName: 'Skip Content Cover',
                name: 'skipContentCover',
                type: 'boolean',
                default: false,
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['updateLink'],
                    },
                },
                routing: {
                    send: {
                        type: 'body',
                        property: 'skip_content_cover',
                    },
                },
            },
            {
                displayName: 'Version',
                name: 'version',
                type: 'string',
                default: '1.0',
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['updateLink'],
                    },
                },
                routing: {
                    send: {
                        type: 'body',
                        property: 'version',
                    },
                },
            },
            // ----------------------------------
            // Operation: Set Cover
            // ----------------------------------
            {
                displayName: 'Cover URL',
                name: 'coverUrl',
                type: 'string',
                default: '',
                required: true,
                placeholder: 'https://example.com/cover.jpg',
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['setCover'],
                    },
                },
                description:
                    'Public https URL of a JPEG, PNG or WebP image (up to 5 MB). Use the URL returned by Asset > Upload to send a file.',
                routing: {
                    send: {
                        type: 'body',
                        property: 'cover_url',
                    },
                },
            },
            // ----------------------------------
            // Operation: Set Geolocation
            // ----------------------------------
            {
                displayName: 'Latitude',
                name: 'latitude',
                type: 'number',
                default: '',
                required: true,
                typeOptions: { minValue: -90, maxValue: 90, numberPrecision: 7 },
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['setGeolocation'],
                    },
                },
                description: 'Latitude of the center, between -90 and 90 (not 0)',
                routing: {
                    send: {
                        type: 'body',
                        property: 'lat',
                    },
                },
            },
            {
                displayName: 'Longitude',
                name: 'longitude',
                type: 'number',
                default: '',
                required: true,
                typeOptions: { minValue: -180, maxValue: 180, numberPrecision: 7 },
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['setGeolocation'],
                    },
                },
                description: 'Longitude of the center, between -180 and 180 (not 0)',
                routing: {
                    send: {
                        type: 'body',
                        property: 'lng',
                    },
                },
            },
            {
                displayName: 'Distance in Meters',
                name: 'distance',
                type: 'number',
                default: 200,
                required: true,
                typeOptions: { minValue: 10, maxValue: 1000 },
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['setGeolocation'],
                    },
                },
                description: 'Radius in meters around the center where the content is available',
                routing: {
                    send: {
                        type: 'body',
                        property: 'distance',
                    },
                },
            },
            {
                displayName: 'Start Date',
                name: 'startDate',
                type: 'dateTime',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['setGeolocation'],
                    },
                },
                description: 'First day the content is available at the location. Leave empty to start on publish.',
                routing: {
                    send: {
                        type: 'body',
                        property: 'start_date',
                        value: CALENDAR_DATE_EXPRESSION,
                    },
                },
            },
            {
                displayName: 'End Date',
                name: 'endDate',
                type: 'dateTime',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['content'],
                        operation: ['setGeolocation'],
                    },
                },
                description: 'Last day the content is available at the location. Leave empty for no end.',
                routing: {
                    send: {
                        type: 'body',
                        property: 'end_date',
                        value: CALENDAR_DATE_EXPRESSION,
                    },
                },
            },
            // ----------------------------------
            // Asset: Upload
            // ----------------------------------
            {
                displayName: 'Workspace ID',
                name: 'workspaceIdAsset',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['asset'],
                        operation: ['upload'],
                    },
                },
                description: 'The ID of the workspace',
            },
            {
                displayName: 'Input Binary Field',
                name: 'binaryPropertyName',
                type: 'string',
                default: 'data',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['asset'],
                        operation: ['upload'],
                    },
                },
                hint: 'The name of the input binary field containing the image to upload',
            },
            {
                displayName: 'Title',
                name: 'assetTitle',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['asset'],
                        operation: ['upload'],
                    },
                },
                description: 'Asset title. Defaults to the file name.',
            },
            // ----------------------------------
            // Push Notification: Send
            // ----------------------------------
            {
                displayName: 'Title',
                name: 'notificationTitle',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['pushNotification'],
                        operation: ['send'],
                    },
                },
                description: 'Push notification title',
                routing: {
                    send: {
                        type: 'body',
                        property: 'title',
                    },
                },
            },
            {
                displayName: 'Body',
                name: 'notificationBody',
                type: 'string',
                typeOptions: {
                    rows: 4,
                },
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['pushNotification'],
                        operation: ['send'],
                    },
                },
                description: 'Push notification body message',
                routing: {
                    send: {
                        type: 'body',
                        property: 'body',
                    },
                },
            },
            {
                displayName: 'Short Code',
                name: 'shortCode',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['pushNotification'],
                        operation: ['send'],
                    },
                },
                description: 'Content short code',
                routing: {
                    send: {
                        type: 'body',
                        property: 'short_code',
                    },
                },
            },
            {
                displayName: 'Destination Type',
                name: 'destinationType',
                type: 'options',
                options: [
                    {
                        name: 'Users Email',
                        value: 'users-email',
                    },
                ],
                default: 'users-email',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['pushNotification'],
                        operation: ['send'],
                    },
                },
                description: 'Type of destination for the notification',
                routing: {
                    send: {
                        type: 'body',
                        property: 'destination_type',
                    },
                },
            },
            {
                displayName: 'Users',
                name: 'users',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['pushNotification'],
                        operation: ['send'],
                    },
                },
                description: 'Comma-separated list of email addresses (e.g., email1@example.com,email2@example.com). Leave empty to send to all users.',
                routing: {
                    send: {
                        type: 'body',
                        property: 'users',
                        value: '={{ $value ? $value.split(",").map(email => email.trim()) : [] }}',
                    },
                },
            },
        ],
    };
}
