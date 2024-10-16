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
      0,  1,  0,  //2
      1,  1,  0,  //6
      0,  0,  0,  //0
      1,  1,  0,  //6
      1,  0,  0,  //4
      0,  0,  1,  //1
      1,  1,  1,  //7
      0,  1,  1,  //3
      0,  0,  1,  //1
      1,  0,  1,  //5
      1,  1,  1,  //7
      0,  0,  0,  //0
      0,  1,  1,  //3
      0,  1,  0,  //2
      0,  0,  0,  //0
      0,  0,  1,  //1
      0,  1,  1,  //3
      1,  0,  0,  //4
      1,  1,  0,  //6
      1,  1,  1,  //7
      1,  0,  0,  //4
      1,  1,  1,  //7
      1,  0,  1,  //5
      0,  0,  0,  //0
      1,  0,  1,  //5
      0,  0,  1,  //1
      0,  0,  0,  //0
      1,  0,  0,  //4
      1,  0,  1,  //5
      0,  1,  0,  //2
      0,  1,  1,  //3
      1,  1,  1,  //7
      0,  1,  0,  //2
      1,  1,  1,  //7
      1,  1,  0,  //6
    ]);

    let colors = new Uint8Array([
      0x00, 0x00, 0x00,  //0
      0x00, 0xff, 0x00,  //2
      0xff, 0xff, 0x00,  //6
      0x00, 0x00, 0x00,  //0
      0xff, 0xff, 0x00,  //6
      0xff, 0x00, 0x00,  //4
      0x00, 0x00, 0xff,  //1
      0xff, 0xff, 0xff,  //7
      0x00, 0xff, 0xff,  //3
      0x00, 0x00, 0xff,  //1
      0xff, 0x00, 0xff,  //5
      0xff, 0xff, 0xff,  //7
      0x00, 0x00, 0x00,  //0
      0x00, 0xff, 0xff,  //3
      0x00, 0xff, 0x00,  //2
      0x00, 0x00, 0x00,  //0
      0x00, 0x00, 0xff,  //1
      0x00, 0xff, 0xff,  //3
      0xff, 0x00, 0x00,  //4
      0xff, 0xff, 0x00,  //6
      0xff, 0xff, 0xff,  //7
      0xff, 0x00, 0x00,  //4
      0xff, 0xff, 0xff,  //7
      0xff, 0x00, 0xff,  //5
      0x00, 0x00, 0x00,  //0
      0xff, 0x00, 0xff,  //5
      0x00, 0x00, 0xff,  //1
      0x00, 0x00, 0x00,  //0
      0xff, 0x00, 0x00,  //4
      0xff, 0x00, 0xff,  //5
      0x00, 0xff, 0x00,  //2
      0x00, 0xff, 0xff,  //3
      0xff, 0xff, 0xff,  //7
      0x00, 0xff, 0x00,  //2
      0xff, 0xff, 0xff,  //7
      0xff, 0xff, 0x00,  //6
    ]);
    
    // gl.cullFace(gl.BACK_FACE);
    gl.enable(gl.CULL_FACE);

    let aPosition = new Attribute(gl, program, "aPosition", positions, 3, gl.FLOAT);
    let aColor = new Attribute(gl, program, "aColor", colors, 3, gl.UNSIGNED_BYTE);

    this.draw = () => {
      program.use();

      aPosition.enable();
      aColor.enable();

      gl.drawArrays(gl.TRIANGLES, 0, aPosition.count);

      aPosition.disable();
      aColor.disable();
    };
  }
};