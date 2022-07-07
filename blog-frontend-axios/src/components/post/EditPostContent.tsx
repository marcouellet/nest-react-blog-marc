import React, { useRef } from "react";
import JoditEditor from "jodit-react";

type EditPostContentProps = React.HTMLProps<HTMLElement> & {
    content: string,
    onSaveContent: onSaveContent,
    onCancelEditing?: onCancelEditing,
    onChangeContent?: onChangeContent,
  }

export type onChangeContent = (content: string) => void;
export type onCancelEditing = () => void;
export type onSaveContent = (content: string) => void;

const EditPostContent: React.FC<EditPostContentProps> = ({className, content, onCancelEditing, onSaveContent, onChangeContent}) => {

    const editor = useRef(null);
    const config = {
        readonly: false,
        height: 400
    };

    let editedContent: string = '' + content;

    const handleSaveContent = () => {
        onSaveContent(editedContent);
    };

    const handleCancelEditing = () => {
        if (onCancelEditing) {
            onCancelEditing();
        }
    };

    const handleChangeContent = (value: string) => {
        editedContent = value;
        if (onChangeContent) {
            onChangeContent(editedContent);
        }
    };

    return (
        <div>
           <div>
                <button className="btn btn-secondary" onClick={() => handleSaveContent()} >
                    Save 
                </button>                 
                <button className="btn btn-secondary" onClick={() => handleCancelEditing()} >
                    Cancel
                </button> 
           </div>
            <div>
                <JoditEditor
                    ref={editor}
                    value={editedContent}
                    config={config}
                    onChange={handleChangeContent}
                />
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
     );
}

export default EditPostContent;