import React, { useRef, useEffect, useState } from "react";
import { CameraEnhancer, CameraView } from "dynamsoft-camera-enhancer";
import { CapturedResultReceiver, CaptureVisionRouter } from "dynamsoft-capture-vision-router";
import { MultiFrameResultCrossFilter } from "dynamsoft-utility";
import "../css/VideoCapture.css";

const VideoCapture = ({ onBarcodeDetected }) => {
    const uiContainer = useRef(null);
    const resultsContainer = useRef(null);

    useEffect(() => {
        let pInit = null;

        const init = async () => {
            try {
                const cameraView = await CameraView.createInstance();
                const cameraEnhancer = await CameraEnhancer.createInstance(cameraView);

                if (uiContainer.current) {
                    uiContainer.current.innerText = "";
                    const cameraViewUI = cameraView.getUIElement();
                    cameraViewUI.className = 'dce-video-container';
                    uiContainer.current.append(cameraViewUI);
                } else {
                    throw new Error("UI container is not available");
                }

                const cvRouter = await CaptureVisionRouter.createInstance();
                cvRouter.setInput(cameraEnhancer);

                const resultReceiver = new CapturedResultReceiver();
                resultReceiver.onDecodedBarcodesReceived = result => {
                    if (!result.barcodeResultItems.length) return;
                
                    if (resultsContainer.current) { // Check if the ref is not null
                        resultsContainer.current.textContent = ""; // Clear previous results
                        result.barcodeResultItems.forEach(item => {
                            onBarcodeDetected(item.text); // Pass the barcode to the parent component
                            const textNode = document.createTextNode(`${item.formatString}: ${item.text}`);
                            const breakNode = document.createElement("br");
                            const hrNode = document.createElement("hr");
                            resultsContainer.current.appendChild(textNode);
                            resultsContainer.current.appendChild(breakNode);
                            resultsContainer.current.appendChild(hrNode);
                        });
                    } else {
                        console.error('Results container is not available');
                    }
                };
                cvRouter.addResultReceiver(resultReceiver);

                const filter = new MultiFrameResultCrossFilter();
                filter.enableResultCrossVerification("barcode", true);
                filter.enableResultDeduplication("barcode", true);
                filter.setDuplicateForgetTime("barcode", 3000);
                await cvRouter.addResultFilter(filter);

                await cameraEnhancer.open();
                await cvRouter.startCapturing("ReadSingleBarcode");

                pInit = {
                    cameraView,
                    cameraEnhancer,
                    cvRouter
                };
            } catch (ex) {
                let errMsg = ex.message || ex;
                console.error(errMsg);
                alert(errMsg);
                throw ex;
            }
        };

        const destroy = async () => {
            if (pInit) {
                const { cameraView, cameraEnhancer, cvRouter } = pInit;
                cvRouter.dispose();
                cameraEnhancer.dispose();
                cameraView.dispose();
            }
        };

        init();

        return () => {
            destroy();
            console.log("VideoCapture Component Unmount");
        };
    }, [onBarcodeDetected]);

    return (
        <div>
            <div ref={uiContainer} className="dce-video-container"></div>
            <br />
            <div ref={resultsContainer} className="div-results-container"></div>
        </div>
    );
};

export default VideoCapture;

