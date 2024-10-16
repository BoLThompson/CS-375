/////////////////////////////////////////////////////////////////////////////
//
//  BasicCube.js
//
//  A cube defined of 12 triangles
//

class BasicCube {
  constructor(gl, vertexShader, fragmentShader) {

    vertexShader ||= `
      in vec4 aPosition;

      uniform mat4 P;
      uniform mat4 MV;

      void main() {
          gl_PointSize = 0.25;
          gl_Position = aPosition;
      }
    `;

    fragmentShader ||= `
      out vec4 fColor;

      void main() {
          fColor = vec4(1.0, 1.0, 0.0, 1.0);
      }
    `;

    let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);

    let positions = new Float32Array([
      0, 0, 0,
      1, 1, 1,
      0, 1, 1,
    ]);

    let aPosition = new Attribute(gl, program, "aPosition", positions, 3, gl.FLOAT);

    this.draw = () => {
      program.use();

      aPosition.enable();

      gl.drawElements(gl.TRIANGLES, 1, gl.UNSIGNED_BYTE, 0);

      aPosition.disable();
    };
  }
};