/////////////////////////////////////////////////////////////////////////////
//
//  IndexedCube.js
//
//  A cube defined of 12 triangles using vertex indices.
//

class IndexedCube {
    constructor(gl, vertexShader, fragmentShader) {
      

    vertexShader ||= `
    uniform mat4 P;  // Projection transformation
    uniform mat4 MV; // Model-view transformation

    in vec4 aPosition;
    in vec4 aColor;
    out vec4 vColor;

    void main() {
      vColor = aColor;
      vec4 pos = aPosition;
      pos.xyz -= 0.5;
      // pos.xyz *= -1.0;
      gl_Position = P * MV * pos;
    }
  `;

  fragmentShader ||= `
    out vec4 fColor;
    in vec4 vColor;

    void main() {
      fColor = vColor;
    }
  `;

  let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);

  
  let positions = new Float32Array([
    0,  0,  0,  //0
    0,  0,  1,  //1
    0,  1,  0,  //2
    0,  1,  1,  //3
    1,  0,  0,  //4
    1,  0,  1,  //5
    1,  1,  0,  //6
    1,  1,  1,  //7
  ]);

  let indexes = new Uint8Array([
    0,    2,    6,
    0,    6,    4,
    1,    7,    3,
    1,    5,    7,
    0,    3,    2,
    0,    1,    3,
    4,    6,    7,
    4,    7,    5,
    0,    5,    1,
    0,    4,    5,
    2,    3,    7,
    2,    7,    6,
  ]);

  let colors = new Uint8Array([
    0x00, 0x00, 0x00,  //0
    0x00, 0x00, 0x01,  //1
    0x00, 0x01, 0x00,  //2
    0x00, 0x01, 0x01,  //3
    0x01, 0x00, 0x00,  //4
    0x01, 0x00, 0x01,  //5
    0x01, 0x01, 0x00,  //6
    0x01, 0x01, 0x01,  //7
  ]);
  
  // gl.cullFace(gl.BACK_FACE);
  gl.enable(gl.CULL_FACE);

  let aPosition = new Attribute(gl, program, "aPosition", positions, 3, gl.FLOAT);
  let aColor = new Attribute(gl, program, "aColor", colors, 3, gl.UNSIGNED_BYTE);
  let aIndices = new Indices(gl, indexes);

  this.draw = () => {
    program.use();

    aPosition.enable();
    aColor.enable();
    aIndices.enable();
    gl.drawElements(gl.TRIANGLES, aIndices.count, aIndices.type, 0);
    aIndices.disable();
    aPosition.disable();
    aColor.disable();
  };
    }
};
