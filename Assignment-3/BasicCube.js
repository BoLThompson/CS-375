/////////////////////////////////////////////////////////////////////////////
//
//  BasicCube.js
//
//  A cube defined of 12 triangles
//

class BasicCube {
  constructor(gl, vertexShader, fragmentShader) {

    vertexShader ||= `
      uniform mat4 P;  // Projection transformation
      uniform mat4 MV; // Model-view transformation

      in vec4 aPosition;

      void main() {
        gl_PointSize = 0.25;
        vec4 pos = aPosition;
        pos.xyz -= 0.5;
        gl_Position = P * MV * pos;
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
      0,  0,  0,
      0,  1,  0,
      1,  1,  0,
      0,  0,  0,
      1,  1,  0,
      1,  0,  0,
      0,  0,  1,
      1,  1,  1,
      0,  1,  1,
      0,  0,  1,
      1,  0,  1,
      1,  1,  1,
      0,  0,  0,
      0,  1,  1,
      0,  1,  0,
      0,  0,  0,
      0,  0,  1,
      0,  1,  1,
      1,  0,  0,
      1,  1,  0,
      1,  1,  1,
      1,  0,  0,
      1,  1,  1,
      1,  0,  1,
      0,  0,  0,
      1,  0,  1,
      0,  0,  1,
      0,  0,  0,
      1,  0,  0,
      1,  0,  1,
      0,  1,  0,
      0,  1,  1,
      1,  1,  1,
      0,  1,  0,
      1,  1,  1,
      1,  1,  0,
    ]);
    
    gl.cullFace(gl.BACK_FACE);
    gl.enable(gl.CULL_FACE);

    let aPosition = new Attribute(gl, program, "aPosition", positions, 3, gl.FLOAT);

    this.draw = () => {
      program.use();

      aPosition.enable();

      gl.drawArrays(gl.TRIANGLES, 0, aPosition.count);

      aPosition.disable();
    };
  }
};