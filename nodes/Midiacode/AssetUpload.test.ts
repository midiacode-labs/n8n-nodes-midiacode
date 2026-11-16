/* eslint-disable @typescript-eslint/no-explicit-any */
import { INodeProperties } from 'n8n-workflow';

import { buildMultipartBody, prepareAssetUpload } from './AssetUpload';
import { Midiacode } from './Midiacode.node';

const findProperty = (name: string, operation: string): INodeProperties | undefined =>
    new Midiacode().description.properties.find(
        (p: INodeProperties) =>
            p.name === name &&
            (p.displayOptions?.show?.operation as string[] | undefined)?.includes(operation),
    );

describe('Set Cover parameters', () => {
    it('sends cover_url in the body and requires it', () => {
        const coverUrl = findProperty('coverUrl', 'setCover');
        expect(coverUrl?.required).toBe(true);
        expect(coverUrl?.routing?.send?.type).toBe('body');
        expect(coverUrl?.routing?.send?.property).toBe('cover_url');
    });

    it('reuses content id (path) and workspace id (body)', () => {
        expect(findProperty('contentId', 'setCover')).toBeDefined();
        expect(findProperty('workspaceIdBody', 'setCover')?.routing?.send?.property).toBe(
            'workspace_id',
        );
    });
});

describe('Asset resource', () => {
    const assetOperation = new Midiacode().description.properties.find(
        (p: INodeProperties) =>
            p.name === 'operation' &&
            (p.displayOptions?.show?.resource as string[] | undefined)?.includes('asset'),
    );

    it('has an upload operation posting to /public/asset/ with a preSend hook', () => {
        const upload = assetOperation?.options?.find((o: any) => o.value === 'upload') as any;
        expect(upload?.routing?.request?.method).toBe('POST');
        expect(upload?.routing?.request?.url).toBe('/public/asset/');
        expect(upload?.routing?.send?.preSend).toEqual([prepareAssetUpload]);
    });

    it('has workspace id, binary field (default data) and optional title', () => {
        expect(findProperty('workspaceIdAsset', 'upload')?.required).toBe(true);
        expect(findProperty('binaryPropertyName', 'upload')?.default).toBe('data');
        expect(findProperty('assetTitle', 'upload')?.required).toBeFalsy();
    });
});

describe('buildMultipartBody', () => {
    it('builds fields and file parts with the given boundary', () => {
        const { body, contentType } = buildMultipartBody(
            { workspace_id: 'ws-1', title: 'Hero' },
            { fileName: 'a.png', mimeType: 'image/png', data: Buffer.from([1, 2, 3]) },
            'B',
        );

        expect(contentType).toBe('multipart/form-data; boundary=B');
        const expected = Buffer.concat([
            Buffer.from(
                '--B\r\nContent-Disposition: form-data; name="workspace_id"\r\n\r\nws-1\r\n' +
                    '--B\r\nContent-Disposition: form-data; name="title"\r\n\r\nHero\r\n' +
                    '--B\r\nContent-Disposition: form-data; name="file"; filename="a.png"\r\n' +
                    'Content-Type: image/png\r\n\r\n',
            ),
            Buffer.from([1, 2, 3]),
            Buffer.from('\r\n--B--\r\n'),
        ]);
        expect(body.equals(expected)).toBe(true);
    });

    it('neutralises quotes and line breaks in the file name', () => {
        const { body } = buildMultipartBody(
            {},
            { fileName: 'a"\r\nb.png', mimeType: 'image/png', data: Buffer.alloc(0) },
            'B',
        );
        expect(body.toString()).toContain('filename="a___b.png"');
    });
});

describe('prepareAssetUpload', () => {
    const makeContext = (params: Record<string, string>, mimeType = 'image/jpeg') =>
        ({
            getNodeParameter: jest.fn((name: string, fallback?: string) => params[name] ?? fallback),
            helpers: {
                assertBinaryData: jest.fn(() => ({ fileName: 'photo.jpg', mimeType })),
                getBinaryDataBuffer: jest.fn(async () => Buffer.from('img')),
            },
        }) as any;

    it('replaces the JSON body and content type with multipart', async () => {
        const context = makeContext({
            binaryPropertyName: 'data',
            workspaceIdAsset: 'ws-1',
            assetTitle: '',
        });

        const options = await prepareAssetUpload.call(context, {
            url: '/public/asset/',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: {},
        });

        expect(context.helpers.assertBinaryData).toHaveBeenCalledWith('data');
        expect(options.headers?.['Content-Type']).toMatch(/^multipart\/form-data; boundary=/);
        expect(options.headers?.Accept).toBe('application/json');
        const text = (options.body as Buffer).toString();
        expect(text).toContain('name="workspace_id"\r\n\r\nws-1');
        expect(text).not.toContain('name="title"');
        expect(text).toContain('filename="photo.jpg"');
        expect(text).toContain('Content-Type: image/jpeg');
    });

    it('falls back to application/octet-stream when the binary has no mime type', async () => {
        const context = makeContext({ binaryPropertyName: 'data', workspaceIdAsset: 'ws-1' }, '');

        const options = await prepareAssetUpload.call(context, { url: '/public/asset/' });

        expect((options.body as Buffer).toString()).toContain(
            'Content-Type: application/octet-stream\r\n',
        );
    });
});
