const DocumentFrame = ({ document }) => (
    <iframe
        src={document.url}
        style={{ height: 'calc(100vh - 100px)', width: '60%' }}
        title="Document Frame"
    />
);

export default DocumentFrame;
