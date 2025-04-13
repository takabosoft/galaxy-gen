import { WebGLCanvas } from "./common/webGLCanvas";
import { buildFragmentShader } from "./shader/build";

export interface RendererParams {
    readonly cameraYRot: number;
    readonly cloudMaxSteps: number;
    readonly fbmMaxSteps: number;
    readonly fbmMinSteps: number;
}

export class Renderer {
    readonly webGlCanvas: WebGLCanvas;
    private cameraYRotUniformLocation!: WebGLUniformLocation | null;
    private cloudMaxStepsUniformLocation!: WebGLUniformLocation | null;
    private fbmMaxStepsUniformLocation!: WebGLUniformLocation | null;
    private fbmMinStepsUniformLocation!: WebGLUniformLocation | null;

    constructor(
        width: number, 
        height: number,
    ) {
        this.webGlCanvas = new WebGLCanvas(width, height, buildFragmentShader());
        this.setupUniformLocations();
    }

    private setupUniformLocations() {
        this.cameraYRotUniformLocation = this.webGlCanvas.getUniformLocation("u_cameraYRot");
        this.cloudMaxStepsUniformLocation = this.webGlCanvas.getUniformLocation("u_cloudMaxSteps");
        this.fbmMaxStepsUniformLocation = this.webGlCanvas.getUniformLocation("u_fbmMaxSteps");
        this.fbmMinStepsUniformLocation = this.webGlCanvas.getUniformLocation("u_fbmMinSteps");
    }

    render(params: RendererParams, renderYOffset = 0): void {
        if (this.webGlCanvas.isContextLost) {
            this.webGlCanvas.setupWebGL();
            this.setupUniformLocations();
        }

        this.webGlCanvas.uniform1f(this.cameraYRotUniformLocation, params.cameraYRot);
        this.webGlCanvas.uniform1i(this.cloudMaxStepsUniformLocation, params.cloudMaxSteps);
        this.webGlCanvas.uniform1i(this.fbmMaxStepsUniformLocation, params.fbmMaxSteps);
        this.webGlCanvas.uniform1i(this.fbmMinStepsUniformLocation, params.fbmMinSteps);

        this.webGlCanvas.render();
    }
}