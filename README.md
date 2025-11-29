# n8n-nodes-midiacode

This is an n8n community node. It lets you consume the Midiacode API in your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

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

## Compatibility

Compatible with n8n@1.0.0 or later.

## Resources

*   [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
