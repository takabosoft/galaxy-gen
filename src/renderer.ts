import { WebGLCanvas } from "./common/webGLCanvas";
import { buildFragmentShader } from "./shader/build";

export interface RendererParams {
    readonly cameraYRot: number;
}

export class Renderer {
    readonly webGlCanvas: WebGLCanvas;
    private cameraYRotUniformLocation!: WebGLUniformLocation | null;

    constructor(
        width: number, 
        height: number,
    ) {
        this.webGlCanvas = new WebGLCanvas(width, height, buildFragmentShader());
        this.setupUniformLocations();
    }

    private setupUniformLocations() {
        this.cameraYRotUniformLocation = this.webGlCanvas.getUniformLocation("u_cameraYRot");
    }

    render(params: RendererParams, renderYOffset = 0): void {
        if (this.webGlCanvas.isContextLost) {
            this.webGlCanvas.setupWebGL();
            this.setupUniformLocations();
        }

        this.webGlCanvas.uniform1f(this.cameraYRotUniformLocation, params.cameraYRot);

        this.webGlCanvas.render();
    }
}