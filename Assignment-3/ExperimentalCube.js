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

        const vec3 colors[] = vec3[8](
          vec3(0, 0, 0),  //0
          vec3(0, 0, 1),  //1
          vec3(0, 1, 0),  //2
          vec3(0, 1, 1),  //3
          vec3(1, 0, 0),  //4
          vec3(1, 0, 1),  //5
          vec3(1, 1, 0),  //6
          vec3(1, 1, 1)   //7
        );

        vColor = vec4(colors[indices[gl_InstanceID][gl_VertexID]], 1.0);
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

    // gl.cullFace(gl.BACK_FACE);
    gl.enable(gl.CULL_FACE);

    this.draw = () => {
      program.use();
      
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 3, 12);
    };
  }
};