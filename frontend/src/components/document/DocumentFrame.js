import DocViewer, {DocViewerRenderers} from "@cyntler/react-doc-viewer";
import React from "react";

const DocumentFrame = ({ document }) => (
    <DocViewer documents={[{ uri: document.url, fileType: document.contentType }]}
               pluginRenderers={DocViewerRenderers}
               config={{ header: { disableHeader: true } }}
    />
);

export default DocumentFrame;
