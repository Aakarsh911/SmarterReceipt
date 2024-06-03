// src/components/ImageCapture/ImageCapture.tsx
import React from "react"
import { CaptureVisionRouter } from "dynamsoft-capture-vision-router"
import "./cvr"
import "../css/ImageCapture.css"

class ImageCapture extends React.Component {
    pInit = null
    pDestroy = null

    async init() {
        const cvRouter = await CaptureVisionRouter.createInstance()
        return cvRouter
    }

    async destroy() {
        if (this.pInit) {
            const cvRouter = await this.pInit
            cvRouter.dispose()
        }
    }

    decodeImg = async e => {
        try {

            const cvRouter = await this.pInit
            const result = await cvRouter.capture(
                e.target.files[0],
                "ReadBarcodes_SpeedFirst"
            )
            let texts = ""
            for (let item of result.items) {
                console.log(item.text)
                texts += item.text + "\n"
            }
            if (texts !== "") alert(texts)
            if (!result.items.length) alert("No barcode found")
        } catch (ex) {
            let errMsg = ex.message || ex
            console.error(errMsg)
            alert(errMsg)
        }
        e.target.value = ""
    }

    async componentDidMount() {
        if (this.pDestroy) {
            await this.pDestroy
            this.pInit = this.init()
        } else {
            this.pInit = this.init()
        }
    }

    async componentWillUnmount() {
        await (this.pDestroy = this.destroy())
        console.log("ImageCapture Component Unmount")
    }

    render() {
        return (
            <div className="div-image-capture">
            </div>
        )
    }
}

export default ImageCapture

