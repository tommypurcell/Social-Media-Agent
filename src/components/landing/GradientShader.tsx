import { useRef, useEffect } from 'react';

export const GradientShader = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl');
        if (!gl) return;

        // Vertex shader
        const vsSource = `
            attribute vec4 aVertexPosition;
            void main() {
                gl_Position = aVertexPosition;
            }
        `;

        // Fragment shader - Colorful, slowly moving gradients
        const fsSource = `
            precision mediump float;
            uniform vec2 u_resolution;
            uniform float u_time;

            vec3 colorA = vec3(0.5, 0.5, 0.9); // Indigo/Purpleish
            vec3 colorB = vec3(0.9, 0.5, 0.5); // Warm pink
            vec3 colorC = vec3(0.1, 0.8, 0.7); // Teal

            void main() {
                vec2 st = gl_FragCoord.xy / u_resolution.xy;
                float t = u_time * 0.1; // Slow movement

                vec3 color = vec3(0.0);
                
                // Create gentle waves
                float f = sin(st.x * 5.0 + t) * 0.1 + cos(st.y * 3.0 + t * 0.5) * 0.1;
                
                // Mix colors based on position and time
                vec3 mixedColor = mix(colorA, colorB, st.x + f);
                mixedColor = mix(mixedColor, colorC, st.y + f);
                
                // Soft gradient overlay
                color = mixedColor + f * 0.2;

                gl_FragColor = vec4(color, 0.6); // Slightly transparent
            }
        `;

        const initShaderProgram = (gl: WebGLRenderingContext, vsSource: string, fsSource: string) => {
            const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
            const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
            if (!vertexShader || !fragmentShader) return null;

            const shaderProgram = gl.createProgram();
            if (!shaderProgram) return null;

            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                return null;
            }

            return shaderProgram;
        };

        const loadShader = (gl: WebGLRenderingContext, type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;

            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                gl.deleteShader(shader);
                return null;
            }

            return shader;
        };

        const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
        if (!shaderProgram) return;

        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            },
            uniformLocations: {
                resolution: gl.getUniformLocation(shaderProgram, 'u_resolution'),
                time: gl.getUniformLocation(shaderProgram, 'u_time'),
            },
        };

        const buffers = initBuffers(gl);

        let animationFrameId: number;

        function render(now: number) {
            now *= 0.001;


            if (canvas && gl) {
                resizeCanvasToDisplaySize(canvas);
                gl.viewport(0, 0, canvas.width, canvas.height);

                gl.clearColor(0.0, 0.0, 0.0, 0.0);
                gl.clear(gl.COLOR_BUFFER_BIT);

                gl.useProgram(programInfo.program);

                gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
                gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

                gl.uniform2f(programInfo.uniformLocations.resolution, canvas.width, canvas.height);
                gl.uniform1f(programInfo.uniformLocations.time, now);

                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            }

            animationFrameId = requestAnimationFrame(render);
        }

        requestAnimationFrame(render);

        return () => cancelAnimationFrame(animationFrameId);

    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-20 opacity-40 pointer-events-none" />;
};

function initBuffers(gl: WebGLRenderingContext) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        -1.0, -1.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
    };
}

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}
