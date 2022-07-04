import React, { useRef } from "react";
import JoditEditor from "jodit-react";

type ViewPostContentProps = React.HTMLProps<HTMLElement> & {
    content: string,
    onSavePostContent: onSavePostContent,
  }

export type onSavePostContent = (content: string) => void;

const EditPostContent: React.FC<ViewPostContentProps> = ({className, content, onSavePostContent}) => {

    const editor = useRef(null);
    const config = {
        readonly: false,
        height: 400
    };

    const handleUpdate = (value: string) => {
        onSavePostContent(value);
    };

    return (
        <div className="App">
        <h1>React Editors</h1>
        <h2>Start editing to see some magic happen!</h2>
        <JoditEditor
            ref={editor}
            value={content}
            config={config}
            onChange={handleUpdate}
        />
        <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
}

export default EditPostContent;