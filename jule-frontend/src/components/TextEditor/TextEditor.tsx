import React, {useEffect, useState} from "react";
import {Editor} from "react-draft-wysiwyg";
import {EditorState, ContentState} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

type TextEditorProps = {
    text: string;
    setText: (currentText: string) => void;
};

let TextEditor = (props: TextEditorProps) => {

    const [editorState, setEditorState] = useState(() =>
        EditorState.createWithContent(ContentState.createFromText(props.text))
    );

    useEffect(() => {
        let currentText = editorState.getCurrentContent().getPlainText();
        props.setText(currentText);
    }, [editorState]);

    return (
        <div>
            <div style={{border: "1px solid black", padding: '2px', minHeight: '400px'}}>
                <Editor
                    editorState={editorState}
                    onEditorStateChange={setEditorState}
                />
            </div>
        </div>
    )
}

export default TextEditor;