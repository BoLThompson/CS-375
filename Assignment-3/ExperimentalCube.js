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
        
        int i = indices[gl_InstanceID][gl_VertexID];
        vec4 v = vec4(i >> 2 & 1, i >> 1 & 1, i & 1, 1.0);
        vColor = v;
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

    // gl.cullFace(gl.BACK_FACE);
    // gl.enable(gl.CULL_FACE);

    this.draw = () => {
      program.use();
      
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 3, 12);
    };
  }
};