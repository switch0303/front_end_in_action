import React, { useState, useRef, useEffect } from "react";
import fileLanguage from "file-language";

import Editor from "@monaco-editor/react";

function EditorWithPreview() {
    const [file, setFile] = useState(null);
    const [currentFileName, setCurrentFileName] = useState(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const editorRef = useRef(null);
    const iframeRef = useRef(null);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    function getFile(path, fileName) {
        if (path && fileName) {
            fetch("./api/" + path)
                .then((response) => {
                    return response.text();
                })
                .then((data) => {
                    setFile({
                        name: fileName,
                        language: fileLanguage(fileName),
                        value: data,
                    });
                });
        }
    }

    function saveFile(path, value) {
        setLoading(true);
        fetch("./api/files/save", {
            method: "PUT",
            body: JSON.stringify({
                path,
                value,
            }),
            headers: new Headers({
                "Content-Type": "application/json",
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setLoading(false);
                if (data && data.success) {
                    iframeRef.current.contentWindow.location.reload();
                }
            });
    }

    function handleFileSave() {
        if (file) {
            saveFile(`src/${file.name}`, editorRef.current.getValue());
        }
    }

    useEffect(() => {
        fetch("./api/files/src")
            .then(function (response) {
                return response.json();
            })
            .then((files) => {
                if (files.length) {
                    setFiles(files);
                    setCurrentFileName(files[0]);
                }
            });
    }, []);

    useEffect(() => {
        getFile(`src/${currentFileName}`, currentFileName);
    }, [currentFileName]);

    return (
        <div style={{ height: "100vh" }}>
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        width: 200,
                        marginRight: 2,
                        height: "100%",
                        flex: "none",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div
                        style={{
                            padding: "6px 2px",
                            lineHeight: "23px",
                            backgroundColor: "#efefef",
                            flex: "none",
                        }}
                    >
                        FILES
                    </div>
                    <div
                        style={{
                            flex: 1,
                        }}
                    >
                        {(files || []).map((item) => {
                            return (
                                <div
                                    key={item}
                                    style={{
                                        padding: "4px 2px",
                                        cursor: "pointer",
                                        backgroundColor:
                                            currentFileName === item
                                                ? "#dedede"
                                                : "#fff",
                                    }}
                                    onClick={() => {
                                        setCurrentFileName(item);
                                    }}
                                >
                                    {item}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div
                    style={{
                        flex: 1,
                        height: "100%",
                        marginRight: 2,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div
                        style={{
                            padding: "6px 2px",
                            lineHeight: "23px",
                            backgroundColor: "#efefef",
                            flex: "none",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <span>EDITOR</span>
                        <button
                            type="button"
                            disabled={loading}
                            style={{
                                marginLeft: "auto",
                                marginRight: 20,
                                cursor: "pointer",
                            }}
                            onClick={handleFileSave}
                        >
                            保存
                        </button>
                    </div>
                    <div style={{ flex: 1, marginTop: 8 }}>
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
                </div>
                <div
                    style={{
                        flex: 1,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div
                        style={{
                            padding: "6px 2px",
                            lineHeight: "23px",
                            backgroundColor: "#efefef",
                            flex: "none",
                        }}
                    >
                        PREVIEW
                    </div>
                    <div style={{ flex: 1 }}>
                        <iframe
                            ref={iframeRef}
                            src="./api/preview"
                            frameBorder="0"
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditorWithPreview;
