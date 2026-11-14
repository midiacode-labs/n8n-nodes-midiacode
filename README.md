# n8n-nodes-midiacode

This is an n8n community node. It lets you consume the Midiacode API in your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

## Requirements

This project requires **Node.js 22** or later.

### Setting up Node.js version

If you're using [nvm](https://github.com/nvm-sh/nvm), the project includes a `.nvmrc` file that specifies the recommended Node.js version:

```bash
# Install and use the recommended Node.js version
nvm install
nvm use
```

Or manually specify the version:

```bash
nvm install 22
nvm use 22
```

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Credentials

You need to set up the `midiacodeApi` credential.

1.  Obtain your API Key from the Midiacode platform.
2.  In n8n, create a new credential for **Midiacode API**.
3.  Enter your API Key.

## Operations

### Content

*   **Search**: Search contents of a workspace.
*   **Create**: Create a new content item.
*   **Get**: Get a specific content item.
*   **Update**: Update an existing content item.
*   **Get Link**: Get content link data.
*   **Update Link**: Update content link data.
*   **Publish**: Publish content.
*   **Set Cover**: Set the content cover from a public image URL. The image is resized to 730x354 and the content is left pending publication — run **Publish** afterwards.

### Asset

*   **Upload**: Upload an image (JPEG, PNG or WebP, up to 5 MB) from an input binary field and get its public URL.

## Parameters

### Common Parameters

*   **Workspace ID**: The ID of the workspace.
*   **Content ID**: The ID of the content.

### Create Content

*   **Title**: The title of the content.
*   **Content Type Slug**: The type of content (e.g., `url`, `video`, `pdf`).
*   **Priority**: Priority of the content (default: `1`).
*   **GS1 QR Code Enabled**: Enable GS1 QR Code (default: `false`).
*   **GS1 AI**: GS1 Application Identifier (default: `01`).
*   **Product EAN13**: EAN13 product code.
*   **Product Variant**: Product variant.

### Update Link

*   **URL**: The URL for the content link.
*   **Title**: Title for the link.
*   **Description**: Description for the link.
*   **Collectible**: Whether the content is collectible (default: `true`).
*   **Embedded on App**: Whether the content is embedded on the mobile app (default: `false`).
*   **Private**: Whether the content is private (default: `false`).
*   **Recommended**: Whether the content is recommended (default: `false`).
*   **Shareable**: Whether the content is shareable (default: `true`).
*   **Skip Content Cover**: Skip content cover on web (default: `false`).
*   **Version**: Content version (default: `1.0`).

### Publish Content

*   **Status**: Status to publish (`Draft`, `Published`, `Archived`).
*   **Notification**: Send notification (default: `true`).
*   **Change Message**: Message describing the change.

### Set Cover

*   **Cover URL**: Public `https` URL of a JPEG, PNG or WebP image (up to 5 MB). The image is downloaded, resized to 730x354 (top kept on tall images, sides cropped on wide ones) and stored by Midiacode. Business card contents are not supported (their cover comes from the profile).

Errors: `413` image too large, `415` unsupported format, `422` URL unreachable, not `https` or not public.

### Upload Asset

*   **Workspace ID**: The ID of the workspace.
*   **Input Binary Field**: Name of the input binary field with the image (default: `data`).
*   **Title**: Asset title (defaults to the file name).

Returns `id`, `title`, `url`, `content_type`, `size` and `created_at`. The original image is kept (no resize).

### Example: set a cover from a file

`HTTP Request / Google Drive (binary)` → **Midiacode › Asset › Upload** → **Midiacode › Content › Set Cover** with Cover URL `{{ $json.url }}` → **Midiacode › Content › Publish**.

## Compatibility

Compatible with n8n@1.0.0 or later.

## Testing

This package includes comprehensive unit tests to ensure all operations work correctly.

### Running Tests

To run the test suite:

```bash
npm test
```

To run tests with coverage:

```bash
npm run test:coverage
```

## Resources

*   [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
