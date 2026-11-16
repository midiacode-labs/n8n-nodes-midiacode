import type { IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';

export interface MultipartFile {
    fileName: string;
    mimeType: string;
    data: Buffer;
}

/**
 * Build a multipart/form-data body by hand: no runtime dependency, and the
 * request engine sends a Buffer as-is whatever FormData implementation n8n uses.
 */
export function buildMultipartBody(
    fields: Record<string, string>,
    file: MultipartFile,
    boundary = `----MidiacodeBoundary${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`,
): { body: Buffer; contentType: string } {
    const parts: Buffer[] = [];
    for (const [name, value] of Object.entries(fields)) {
        parts.push(
            Buffer.from(
                `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`,
            ),
        );
    }
    const safeFileName = file.fileName.replace(/["\r\n]/g, '_');
    parts.push(
        Buffer.from(
            `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${safeFileName}"\r\n` +
                `Content-Type: ${file.mimeType}\r\n\r\n`,
        ),
        file.data,
        Buffer.from(`\r\n--${boundary}--\r\n`),
    );
    return { body: Buffer.concat(parts), contentType: `multipart/form-data; boundary=${boundary}` };
}

/** preSend hook for Asset > Upload: turns the input item's binary into the multipart body. */
export async function prepareAssetUpload(
    this: IExecuteSingleFunctions,
    requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
    const binaryPropertyName = this.getNodeParameter('binaryPropertyName') as string;
    const workspaceId = this.getNodeParameter('workspaceIdAsset') as string;
    const title = this.getNodeParameter('assetTitle', '') as string;

    const binaryData = this.helpers.assertBinaryData(binaryPropertyName);
    const data = await this.helpers.getBinaryDataBuffer(binaryPropertyName);

    const fields: Record<string, string> = { workspace_id: workspaceId };
    if (title) {
        fields.title = title;
    }
    const { body, contentType } = buildMultipartBody(fields, {
        fileName: binaryData.fileName ?? 'image',
        // An empty mimeType would emit a malformed "Content-Type: " part header.
        mimeType: binaryData.mimeType || 'application/octet-stream',
        data,
    });

    requestOptions.body = body;
    // requestDefaults sets application/json; the multipart boundary must replace it.
    requestOptions.headers = { ...requestOptions.headers, 'Content-Type': contentType };
    return requestOptions;
}
