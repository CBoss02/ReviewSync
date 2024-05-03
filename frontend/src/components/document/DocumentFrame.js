import React, { useMemo } from 'react';
import DocViewer, {DocViewerRenderers} from "@cyntler/react-doc-viewer";

const DocumentFrame = React.memo(({ document }) => {
    return (
        <DocViewer
            documents={[{ uri: document.url, fileType: document.contentType }]}
            pluginRenderers={DocViewerRenderers}
            config={{ header: { disableHeader: true } }}
        />
    );
});

export default DocumentFrame;