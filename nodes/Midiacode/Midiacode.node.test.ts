/* eslint-disable @typescript-eslint/no-explicit-any */
import { Midiacode } from './Midiacode.node';
import { INodeProperties } from 'n8n-workflow';

describe('Midiacode Node', () => {
    let midiacodeNode: Midiacode;

    beforeEach(() => {
        midiacodeNode = new Midiacode();
    });

    describe('Node Properties', () => {
        it('should have correct node metadata', () => {
            expect(midiacodeNode.description.displayName).toBe('Midiacode');
            expect(midiacodeNode.description.name).toBe('midiacode');
            expect(midiacodeNode.description.icon).toBe('file:midiacode.svg');
            expect(midiacodeNode.description.group).toContain('transform');
            expect(midiacodeNode.description.version).toBe(1);
        });

        it('should have correct credential requirements', () => {
            expect(midiacodeNode.description.credentials).toHaveLength(1);
            expect(midiacodeNode.description.credentials?.[0].name).toBe('midiacodeApi');
            expect(midiacodeNode.description.credentials?.[0].required).toBe(true);
        });

        it('should have correct base URL', () => {
            expect(midiacodeNode.description.requestDefaults?.baseURL).toBe(
                'https://contentcore.midiacode.pt',
            );
        });

        it('should have content resource defined', () => {
            const resourceProperty = midiacodeNode.description.properties.find(
                (p: INodeProperties) => p.name === 'resource',
            );
            expect(resourceProperty).toBeDefined();
            expect(resourceProperty?.options).toHaveLength(1);
            expect((resourceProperty?.options?.[0] as any)?.value).toBe('content');
        });
    });

    describe('Operations Configuration', () => {
        let operationProperty: INodeProperties | undefined;

        beforeEach(() => {
            operationProperty = midiacodeNode.description.properties.find(
                (p: INodeProperties) => p.name === 'operation',
            );
        });

        it('should have 7 operations defined', () => {
            expect(operationProperty?.options).toHaveLength(7);
        });

        it('should have search operation configured correctly', () => {
            const searchOp = operationProperty?.options?.find((o: any) => o.value === 'search') as any;
            expect(searchOp).toBeDefined();
            expect(searchOp?.name).toBe('Search');
            expect(searchOp?.routing?.request?.method).toBe('GET');
            expect(searchOp?.routing?.request?.url).toContain('/public/workspace/');
        });

        it('should have create operation configured correctly', () => {
            const createOp = operationProperty?.options?.find((o: any) => o.value === 'create') as any;
            expect(createOp).toBeDefined();
            expect(createOp?.name).toBe('Create');
            expect(createOp?.routing?.request?.method).toBe('POST');
            expect(createOp?.routing?.request?.url).toBe('/public/content/');
        });

        it('should have get operation configured correctly', () => {
            const getOp = operationProperty?.options?.find((o: any) => o.value === 'get') as any;
            expect(getOp).toBeDefined();
            expect(getOp?.name).toBe('Get');
            expect(getOp?.routing?.request?.method).toBe('GET');
            expect(getOp?.routing?.request?.url).toContain('/public/content/');
        });

        it('should have update operation configured correctly', () => {
            const updateOp = operationProperty?.options?.find((o: any) => o.value === 'update') as any;
            expect(updateOp).toBeDefined();
            expect(updateOp?.name).toBe('Update');
            expect(updateOp?.routing?.request?.method).toBe('PATCH');
            expect(updateOp?.routing?.request?.url).toContain('/public/content/');
        });

        it('should have getLink operation configured correctly', () => {
            const getLinkOp = operationProperty?.options?.find((o: any) => o.value === 'getLink') as any;
            expect(getLinkOp).toBeDefined();
            expect(getLinkOp?.name).toBe('Get Link');
            expect(getLinkOp?.routing?.request?.method).toBe('GET');
            expect(getLinkOp?.routing?.request?.url).toContain('/link/');
        });

        it('should have updateLink operation configured correctly', () => {
            const updateLinkOp = operationProperty?.options?.find((o: any) => o.value === 'updateLink') as any;
            expect(updateLinkOp).toBeDefined();
            expect(updateLinkOp?.name).toBe('Update Link');
            expect(updateLinkOp?.routing?.request?.method).toBe('PATCH');
            expect(updateLinkOp?.routing?.request?.url).toContain('/link/');
        });

        it('should have publish operation configured correctly', () => {
            const publishOp = operationProperty?.options?.find((o: any) => o.value === 'publish') as any;
            expect(publishOp).toBeDefined();
            expect(publishOp?.name).toBe('Publish');
            expect(publishOp?.routing?.request?.method).toBe('POST');
            expect(publishOp?.routing?.request?.url).toBe('/public/content/publish/');
        });
    });

    describe('Search Operation Parameters', () => {
        it('should have workspaceId parameter for search', () => {
            const workspaceIdParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) =>
                    p.name === 'workspaceId' &&
                    p.displayOptions?.show?.operation?.includes('search'),
            );
            expect(workspaceIdParam).toBeDefined();
            expect(workspaceIdParam?.required).toBe(true);
        });

        it('should have status filter with correct options', () => {
            const statusParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) =>
                    p.name === 'status' &&
                    p.displayOptions?.show?.operation?.includes('search'),
            );
            expect(statusParam).toBeDefined();
            expect(statusParam?.options).toHaveLength(4);
            expect(statusParam?.default).toBe('pub');
        });

        it('should route search parameters as query params', () => {
            const typeParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) => p.name === 'type',
            );
            expect(typeParam?.routing?.send?.type).toBe('query');

            const searchTermParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) => p.name === 'searchTerm',
            );
            expect(searchTermParam?.routing?.send?.type).toBe('query');
        });

        it('should have pagination parameters', () => {
            const pageSizeParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) => p.name === 'pageSize',
            );
            expect(pageSizeParam).toBeDefined();
            expect(pageSizeParam?.default).toBe(25);
            expect(pageSizeParam?.routing?.send?.property).toBe('page_size');

            const pageParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) => p.name === 'page',
            );
            expect(pageParam).toBeDefined();
            expect(pageParam?.default).toBe(1);
        });
    });

    describe('Create Operation Parameters', () => {
        it('should have title as required parameter', () => {
            const titleParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) =>
                    p.name === 'title' &&
                    p.displayOptions?.show?.operation?.includes('create'),
            );
            expect(titleParam).toBeDefined();
            expect(titleParam?.required).toBe(true);
            expect(titleParam?.routing?.send?.type).toBe('body');
        });

        it('should have contentTypeSlug with correct options', () => {
            const contentTypeParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) => p.name === 'contentTypeSlug',
            );
            expect(contentTypeParam).toBeDefined();
            expect(contentTypeParam?.required).toBe(true);
            expect(contentTypeParam?.options?.length).toBeGreaterThan(0);
            expect(contentTypeParam?.default).toBe('url');
            expect(contentTypeParam?.routing?.send?.property).toBe('content_type_slug');
        });

        it('should have workspaceIdBody for create operation', () => {
            const workspaceIdParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) =>
                    p.name === 'workspaceIdBody' &&
                    p.displayOptions?.show?.operation?.includes('create'),
            );
            expect(workspaceIdParam).toBeDefined();
            expect(workspaceIdParam?.required).toBe(true);
            expect(workspaceIdParam?.routing?.send?.property).toBe('workspace_id');
        });

        it('should have GS1 QR code parameters', () => {
            const gs1EnabledParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) => p.name === 'gs1QrCodeEnabled',
            );
            expect(gs1EnabledParam).toBeDefined();
            expect(gs1EnabledParam?.default).toBe(false);
            expect(gs1EnabledParam?.routing?.send?.property).toBe('gs1_qr_code_enabled');

            const gs1AiParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) => p.name === 'gs1Ai',
            );
            expect(gs1AiParam).toBeDefined();
            expect(gs1AiParam?.default).toBe('01');
        });

        it('should have product parameters', () => {
            const ean13Param = midiacodeNode.description.properties.find(
                (p: INodeProperties) => p.name === 'productEan13',
            );
            expect(ean13Param).toBeDefined();
            expect(ean13Param?.routing?.send?.property).toBe('product_ean13');

            const variantParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) => p.name === 'productVariant',
            );
            expect(variantParam).toBeDefined();
            expect(variantParam?.routing?.send?.property).toBe('product_variant');
        });
    });

    describe('Update Operation Parameters', () => {
        it('should have contentId parameter', () => {
            const contentIdParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) =>
                    p.name === 'contentId' &&
                    p.displayOptions?.show?.operation?.includes('update'),
            );
            expect(contentIdParam).toBeDefined();
            expect(contentIdParam?.required).toBe(true);
        });

        it('should share common parameters with create operation', () => {
            const titleParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) =>
                    p.name === 'title' &&
                    p.displayOptions?.show?.operation?.includes('update'),
            );
            expect(titleParam).toBeDefined();

            const priorityParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) =>
                    p.name === 'priority' &&
                    p.displayOptions?.show?.operation?.includes('update'),
            );
            expect(priorityParam).toBeDefined();
        });
    });

    describe('Get and GetLink Operations', () => {
        it('should have contentId for get operation', () => {
            const contentIdParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) =>
                    p.name === 'contentId' &&
                    p.displayOptions?.show?.operation?.includes('get'),
            );
            expect(contentIdParam).toBeDefined();
            expect(contentIdParam?.required).toBe(true);
        });

        it('should have workspaceIdQuery for get operation', () => {
            const workspaceIdParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) =>
                    p.name === 'workspaceIdQuery' &&
                    p.displayOptions?.show?.operation?.includes('get'),
            );
            expect(workspaceIdParam).toBeDefined();
            expect(workspaceIdParam?.routing?.send?.type).toBe('query');
            expect(workspaceIdParam?.routing?.send?.property).toBe('workspace_id');
        });

        it('should have getLink operation parameters', () => {
            const contentIdParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) =>
                    p.name === 'contentId' &&
                    p.displayOptions?.show?.operation?.includes('getLink'),
            );
            expect(contentIdParam).toBeDefined();

            const workspaceIdParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) =>
                    p.name === 'workspaceIdQuery' &&
                    p.displayOptions?.show?.operation?.includes('getLink'),
            );
            expect(workspaceIdParam).toBeDefined();
        });
    });

    describe('UpdateLink Operation Parameters', () => {
        it('should have url parameter', () => {
            const urlParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) => p.name === 'url',
            );
            expect(urlParam).toBeDefined();
            expect(urlParam?.routing?.send?.property).toBe('link');
        });

        it('should have description parameter', () => {
            const descParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) => p.name === 'description',
            );
            expect(descParam).toBeDefined();
            expect(descParam?.routing?.send?.type).toBe('body');
        });

        it('should have boolean flag parameters with correct defaults', () => {
            const collectibleParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) => p.name === 'collectible',
            );
            expect(collectibleParam?.default).toBe(true);

            const privateParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) => p.name === 'private',
            );
            expect(privateParam?.default).toBe(false);

            const shareableParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) => p.name === 'shareable',
            );
            expect(shareableParam?.default).toBe(true);

            const recommendedParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) => p.name === 'recommended',
            );
            expect(recommendedParam?.default).toBe(false);

            const embeddedParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) => p.name === 'embeddedOnMobileApp',
            );
            expect(embeddedParam?.default).toBe(false);
            expect(embeddedParam?.routing?.send?.property).toBe('embedded_on_mobile_app');

            const skipCoverParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) => p.name === 'skipContentCover',
            );
            expect(skipCoverParam?.default).toBe(false);
            expect(skipCoverParam?.routing?.send?.property).toBe('skip_content_cover');
        });

        it('should have version parameter', () => {
            const versionParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) => p.name === 'version',
            );
            expect(versionParam).toBeDefined();
            expect(versionParam?.default).toBe('1.0');
        });
    });

    describe('Publish Operation Parameters', () => {
        it('should have contentIdPublish parameter', () => {
            const contentIdParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) => p.name === 'contentIdPublish',
            );
            expect(contentIdParam).toBeDefined();
            expect(contentIdParam?.required).toBe(true);
            expect(contentIdParam?.routing?.send?.property).toBe('content_id');
        });

        it('should have separate status parameter for publish', () => {
            const statusParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) =>
                    p.name === 'statusPublish' &&
                    p.displayOptions?.show?.operation?.includes('publish'),
            );
            expect(statusParam).toBeDefined();
            expect(statusParam?.required).toBe(true);
            expect(statusParam?.default).toBe('pub');
            expect(statusParam?.options).toHaveLength(3);
            expect(statusParam?.routing?.send?.property).toBe('status');
        });

        it('should have notification parameter', () => {
            const notificationParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) => p.name === 'notification',
            );
            expect(notificationParam).toBeDefined();
            expect(notificationParam?.default).toBe(true);
        });

        it('should have changeMessage parameter', () => {
            const changeMessageParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) => p.name === 'changeMessage',
            );
            expect(changeMessageParam).toBeDefined();
            expect(changeMessageParam?.routing?.send?.property).toBe('change_message');
        });

        it('should have workspaceIdBody for publish operation', () => {
            const workspaceIdParam = midiacodeNode.description.properties.find(
                (p: INodeProperties) =>
                    p.name === 'workspaceIdBody' &&
                    p.displayOptions?.show?.operation?.includes('publish'),
            );
            expect(workspaceIdParam).toBeDefined();
            expect(workspaceIdParam?.required).toBe(true);
        });
    });

    describe('Parameter Routing', () => {
        it('should route body parameters correctly', () => {
            const bodyParams = ['title', 'workspaceIdBody', 'contentIdPublish'];
            bodyParams.forEach((paramName) => {
                const param = midiacodeNode.description.properties.find(
                    (p: INodeProperties) => p.name === paramName,
                );
                if (param?.routing) {
                    expect(param.routing.send?.type).toBe('body');
                }
            });
        });

        it('should route query parameters correctly', () => {
            const queryParams = ['status', 'type', 'searchTerm', 'pageSize', 'page', 'workspaceIdQuery'];
            queryParams.forEach((paramName) => {
                const param = midiacodeNode.description.properties.find(
                    (p: INodeProperties) => p.name === paramName,
                );
                if (param?.routing) {
                    expect(param.routing.send?.type).toBe('query');
                }
            });
        });

        it('should map snake_case properties correctly', () => {
            const mappings = [
                { name: 'contentTypeSlug', apiProperty: 'content_type_slug' },
                { name: 'workspaceIdBody', apiProperty: 'workspace_id' },
                { name: 'gs1QrCodeEnabled', apiProperty: 'gs1_qr_code_enabled' },
                { name: 'productEan13', apiProperty: 'product_ean13' },
                { name: 'productVariant', apiProperty: 'product_variant' },
                { name: 'embeddedOnMobileApp', apiProperty: 'embedded_on_mobile_app' },
                { name: 'skipContentCover', apiProperty: 'skip_content_cover' },
            ];

            mappings.forEach(({ name, apiProperty }) => {
                const param = midiacodeNode.description.properties.find(
                    (p: INodeProperties) => p.name === name,
                );
                expect(param?.routing?.send?.property).toBe(apiProperty);
            });
        });
    });

    describe('Display Options', () => {
        it('should show correct parameters for search operation', () => {
            const searchParams = ['workspaceId', 'status', 'type', 'searchTerm', 'pageSize', 'page'];
            searchParams.forEach((paramName) => {
                const param = midiacodeNode.description.properties.find(
                    (p: INodeProperties) =>
                        p.name === paramName &&
                        p.displayOptions?.show?.operation?.includes('search'),
                );
                expect(param).toBeDefined();
            });
        });

        it('should show correct parameters for create operation', () => {
            const createParams = ['title', 'contentTypeSlug', 'workspaceIdBody', 'priority'];
            createParams.forEach((paramName) => {
                const param = midiacodeNode.description.properties.find(
                    (p: INodeProperties) =>
                        p.name === paramName &&
                        p.displayOptions?.show?.operation?.includes('create'),
                );
                expect(param).toBeDefined();
            });
        });

        it('should show correct parameters for updateLink operation', () => {
            const updateLinkParams = [
                'contentId',
                'workspaceIdBody',
                'url',
                'description',
                'collectible',
                'shareable',
            ];
            updateLinkParams.forEach((paramName) => {
                const param = midiacodeNode.description.properties.find(
                    (p: INodeProperties) =>
                        p.name === paramName &&
                        p.displayOptions?.show?.operation?.includes('updateLink'),
                );
                expect(param).toBeDefined();
            });
        });

        it('should show correct parameters for publish operation', () => {
            const publishParams = ['contentIdPublish', 'statusPublish', 'notification', 'changeMessage', 'workspaceIdBody'];
            publishParams.forEach((paramName) => {
                const param = midiacodeNode.description.properties.find(
                    (p: INodeProperties) =>
                        p.name === paramName &&
                        p.displayOptions?.show?.operation?.includes('publish'),
                );
                expect(param).toBeDefined();
            });
        });
    });
});
