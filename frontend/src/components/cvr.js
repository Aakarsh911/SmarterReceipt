import { CoreModule } from 'dynamsoft-core';
import { LicenseManager } from 'dynamsoft-license';
import 'dynamsoft-barcode-reader';

// Initialize the Dynamsoft License Manager with your license key
LicenseManager.initLicense('DLS2eyJoYW5kc2hha2VDb2RlIjoiMTAyODg3MjAxLVRYbFhaV0pRY205cSIsIm1haW5TZXJ2ZXJVUkwiOiJodHRwczovL21kbHMuZHluYW1zb2Z0b25saW5lLmNvbSIsIm9yZ2FuaXphdGlvbklEIjoiMTAyODg3MjAxIiwic3RhbmRieVNlcnZlclVSTCI6Imh0dHBzOi8vc2Rscy5keW5hbXNvZnRvbmxpbmUuY29tIiwiY2hlY2tDb2RlIjotMTE2ODgyNzkyNH0=');
// src/cvr.ts




CoreModule.engineResourcePaths = {
    std: "https://cdn.jsdelivr.net/npm/dynamsoft-capture-vision-std@1.2.10/dist/",
    dip: "https://cdn.jsdelivr.net/npm/dynamsoft-image-processing@2.2.30/dist/",
    core: "https://cdn.jsdelivr.net/npm/dynamsoft-core@3.2.30/dist/",
    license: "https://cdn.jsdelivr.net/npm/dynamsoft-license@3.2.21/dist/",
    cvr:
        "https://cdn.jsdelivr.net/npm/dynamsoft-capture-vision-router@2.2.30/dist/",
    dbr: "https://cdn.jsdelivr.net/npm/dynamsoft-barcode-reader@10.2.10/dist/",
    dce: "https://cdn.jsdelivr.net/npm/dynamsoft-camera-enhancer@4.0.3/dist/"
}

CoreModule.loadWasm(["DBR"])

// Configure paths for Dynamsoft modules
CoreModule.engineResourcePaths = {
    std: "https://cdn.jsdelivr.net/npm/dynamsoft-capture-vision-std@1.2.10/dist/",
    dip: "https://cdn.jsdelivr.net/npm/dynamsoft-image-processing@2.2.30/dist/",
    core: "https://cdn.jsdelivr.net/npm/dynamsoft-core@3.2.30/dist/",
    cvr: "https://cdn.jsdelivr.net/npm/dynamsoft-capture-vision-router@2.2.30/dist/",
    dbr: "https://cdn.jsdelivr.net/npm/dynamsoft-barcode-reader@10.2.10/dist/",
    dce: "https://cdn.jsdelivr.net/npm/dynamsoft-camera-enhancer@4.0.3/dist/"
};

// Load necessary WebAssembly modules
CoreModule.loadWasm(['DBR']);

