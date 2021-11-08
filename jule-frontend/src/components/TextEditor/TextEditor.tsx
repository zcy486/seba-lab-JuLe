import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Button from "@mui/material/Button";


type TextEditorProps = {
    text: string;
    onChange: (currentText: string) => void;
  };
  

let TextEditor = (props: TextEditorProps) => {


    const [editorState, setEditorState] = useState(() =>
        EditorState.createWithContent(ContentState.createFromText(props.text))
    );

    useEffect(() => {
        console.log(editorState);
    }, [editorState]);

    let saveText = () => {
        let currentText = editorState.getCurrentContent().getPlainText();
        props.onChange(currentText);
    }

   
    return (
        <div>
            <div style={{ border: "1px solid black", padding: '2px', minHeight: '400px' }}>
                <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
                />
            </div>
            <Button variant="outlined" onClick={() => {}} >Cancel</Button>
            <Button variant="contained" onClick={saveText} >Save</Button>
        </div>
    )
}

export default TextEditor;