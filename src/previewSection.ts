import { Renderer, RendererParams } from "./renderer";

export const enum RenderQuality {
    Low = 0,
    Medium = 1,
    High = 2,
    Max = 3,
}

export class PreviewSection {
    readonly renderer = new Renderer(320, 240);
    private readonly cameraYRotSlider = $(`<input type="range" min="0.0" max="1.0" step="0.00001" value="0.0">`).on("input", () => this.preview());

    readonly element = $(`<section>`).append(
        $(`<h2>`).text("【STEP.1】 各種設定を行ってください"),
        $(`<div class="preview-container">`).append(
            $(this.renderer.webGlCanvas.canvas).on("click", () => {
                console.log(JSON.stringify(this.getRenderParams(RenderQuality.Low)));
            }),
            $(`<div class="params">`).append(
                $(`<div>`).text("カメラ回り込み："), this.cameraYRotSlider,
            ),
        ),
    );

    constructor() {
        this.preview();
    }

    getRenderParams(quality: RenderQuality): RendererParams {
        let cloudMaxSteps = 0;
        let fbmMaxSteps = 0;
        let fbmMinSteps = 0;

        switch (quality) {
            case RenderQuality.Low:
                cloudMaxSteps = 60;
                fbmMaxSteps = 3;
                fbmMinSteps = 2;
                break;
            default:
            case RenderQuality.Medium:
                cloudMaxSteps = 200;
                fbmMaxSteps = 3;
                fbmMinSteps = 2;
                break;
            case RenderQuality.High:
                cloudMaxSteps = 300;
                fbmMaxSteps = 6;
                fbmMinSteps = 4;
                break;
            case RenderQuality.Max:
                cloudMaxSteps = 500;
                fbmMaxSteps = 12;
                fbmMinSteps = 8;
                break;
        }

        return {
            cameraYRot: parseFloat(this.cameraYRotSlider.val() + "") * Math.PI * 2,
            /*targetY: parseFloat(this.targetYSlider.val() + ""),
            cameraZ: parseFloat(this.cameraZSlider.val() + ""),
            cameraX: parseFloat(this.cameraXSlider.val() + ""),
            cloudMinY: parseFloat(this.minYSlider.val() + ""),
            cloudThickness: parseFloat(this.thicknessSlider.val() + ""),
            cloudAlphaScale: parseFloat(this.alphaScaleSlider.val() + ""),
            fbmScale: parseFloat(this.fbmScaleSlider.val() + ""),
            fbmDepth: parseFloat(this.fbmDepthSlider.val() + ""),
            fbmThreshold: parseFloat(this.fbmThresholdSlider.val() + ""),
            skyColorFader: parseFloat(this.skyColorFaderSlider.val() + ""),
*/
            cloudMaxSteps,
            fbmMaxSteps,
            fbmMinSteps,
        }
    }

    preview() {
        this.renderer.render(this.getRenderParams(RenderQuality.Low));
    }
}