import React, { useState, useRef } from "react";

function downloadImg(filename, src) {
    var element = document.createElement("a");
    element.setAttribute("href", src);
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function GrayScale() {
    const [file, setFile] = useState(null);
    const [currentSrc, setCurrentSrc] = useState(null);

    const imgRef = useRef(null);
    const canvasRef = useRef(null);
    const cacheRef = useRef({});
    const realImgRef = useRef(null);

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFile({
                    name: file.name,
                    type: file.type,
                    src: e.target.result,
                });
                cacheRef.current.originalSrc = e.target.result;
                setCurrentSrc(cacheRef.current.originalSrc);
            };
            reader.readAsDataURL(file);
        }
    }

    function handleImgSave() {
        if (file) {
            downloadImg(file.name, realImgRef.current.src);
        }
    }

    function handleImgLoad() {
        const img = imgRef.current;
        const canvas = canvasRef.current;

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0);

        var canvasData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );

        // gray filter
        for (var x = 0; x < canvasData.width; x++) {
            for (var y = 0; y < canvasData.height; y++) {
                // Index of the pixel in the array
                var idx = (x + y * canvasData.width) * 4;
                var r = canvasData.data[idx + 0];
                var g = canvasData.data[idx + 1];
                var b = canvasData.data[idx + 2];

                // calculate gray scale value
                var gray = 0.299 * r + 0.587 * g + 0.114 * b;

                // assign gray scale value
                canvasData.data[idx + 0] = gray; // Red channel
                canvasData.data[idx + 1] = gray; // Green channel
                canvasData.data[idx + 2] = gray; // Blue channel
                canvasData.data[idx + 3] = 255; // Alpha channel
            }
        }
        context.putImageData(canvasData, 0, 0);
        cacheRef.current.grayScaleSrc = canvas.toDataURL();
    }

    return (
        <div>
            <div style={{ padding: 10 }}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <button
                    type="button"
                    style={{ marginRight: 10 }}
                    disabled={!file}
                    onClick={() => setCurrentSrc(cacheRef.current.grayScaleSrc)}
                >
                    转为灰度图片
                </button>
                <button
                    type="button"
                    style={{ marginRight: 10 }}
                    disabled={!file}
                    onClick={() => setCurrentSrc(cacheRef.current.originalSrc)}
                >
                    还原图片
                </button>
                <button
                    type="button"
                    style={{ marginRight: 10 }}
                    disabled={!file}
                    onClick={handleImgSave}
                >
                    图片另存为...
                </button>
            </div>
            {file ? (
                <div style={{ display: "none" }}>
                    <img
                        src={file.src}
                        title={file.name}
                        alt={file.name}
                        ref={imgRef}
                        onLoad={handleImgLoad}
                    />
                </div>
            ) : null}
            <div style={{ display: "none" }}>
                <canvas ref={canvasRef}></canvas>
            </div>
            {currentSrc ? (
                <div style={{ width: 800, padding: 10 }}>
                    <img
                        style={{ maxWidth: "100%" }}
                        src={currentSrc}
                        title={file.name}
                        alt={file.name}
                        ref={realImgRef}
                    />
                </div>
            ) : null}
        </div>
    );
}

export default GrayScale;
