import React, { useState, useRef } from "react";
import fileLanguage from "file-language";

import Editor from "@monaco-editor/react";

function download(filename, type = "text/plain", text) {
    var element = document.createElement("a");
    element.setAttribute(
        "href",
        `data:${type};charset=utf-8,${encodeURIComponent(text)}`
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function EditorDemo() {
    const [file, setFile] = useState(null);

    const editorRef = useRef(null);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFile({
                    name: file.name,
                    type: file.type,
                    language: fileLanguage(file.name),
                    value: e.target.result,
                });
            };
            reader.readAsText(file);
        }
    }

    function handleFileSave() {
        if (file) {
            download(file.name, file.type, editorRef.current.getValue());
        }
    }

    return (
        <div>
            <div style={{padding: 10}}>
                <input type="file" onChange={handleFileChange} />
                <button type="button" disabled={!file} onClick={handleFileSave}>
                    文件另存为...
                </button>
            </div>
            {file ? (
                <Editor
                    height="90vh"
                    path={file.name}
                    defaultLanguage={file.language}
                    defaultValue={file.value}
                    onMount={handleEditorDidMount}
                />
            ) : null}
        </div>
    );
}

export default EditorDemo;
