/////////////////////////////////////////////////////////////////////////////
//
//  ExperimentalCube.js
//
//  A cube defined ???
//

class ExperimentalCube {
  constructor(gl, vertexShader, fragmentShader) {
    vertexShader ||= `
      uniform mat4 P;  // Projection transformation
      uniform mat4 MV; // Model-view transformation

      out vec4 vColor;

      void main() {
        const vec3 vertices[] = vec3[8](
          vec3(0, 0, 0),  //0
          vec3(0, 0, 1),  //1
          vec3(0, 1, 0),  //2
          vec3(0, 1, 1),  //3
          vec3(1, 0, 0),  //4
          vec3(1, 0, 1),  //5
          vec3(1, 1, 0),  //6
          vec3(1, 1, 1)   //7
        );

        const ivec3 indices[] = ivec3[12](
          ivec3(0, 2, 6),
          ivec3(0, 6, 4),
          ivec3(1, 7, 3),
          ivec3(1, 5, 7),
          ivec3(0, 3, 2),
          ivec3(0, 1, 3),
          ivec3(4, 6, 7),
          ivec3(4, 7, 5),
          ivec3(0, 5, 1),
          ivec3(0, 4, 5),
          ivec3(2, 3, 7),
          ivec3(2, 7, 6)
        );

        vColor = vec4(1.0,1.0,1.0,1.0);
        vec4 v = vec4(vertices[indices[gl_InstanceID][gl_VertexID]], 1.0);
        v.xyz -= 0.5;
        gl_Position = P * MV * v;
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
      6,7,4,
      5,
      1,
      7,
      3,
      6,
      2,
      4,
      0,
      1,
      2,
      3,
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

    let aIndices = new Indices(gl, indexes);

    this.draw = () => {
      program.use();
      
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 3, 12);
    };
  }
};