/////////////////////////////////////////////////////////////////////////////
//
//  BasicCube.js
//
//  A cube defined of 12 triangles
//

class BasicCube {
  constructor(gl, vertexShader, fragmentShader) {

    let positions = new Float32Array ([
       1,	 1,	 1,	
       1,	 1,	-1,	
       1,	-1,	 1,	
       1,	-1,	-1,	
      -1,	 1,	 1,	
      -1,	 1,	-1,	
      -1,	-1,	 1,	
      -1,	-1,	-1,	
    ]);

    vertexShader ||= `
      in vec4 aPosition;

      uniform mat4 P;
      uniform mat4 MV;

      void main() {
        gl_Position = P * MV * aPosition;
      }
    `;

    fragmentShader ||= `
      uniform vec4 color;
      out vec4 fColor;

      void main() {
        fColor = color;
      }
    `;

    let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);

    let aPosition = new Attribute(gl, program, "aPosition", positions, 3, gl.FLOAT);
    let indices = new Uint16Array([]);
    indices = new Indices(gl, indices);

    this.draw = () => {
      program.use();

      aPosition.enable();
      indices.enable();
      gl.drawElements(gl.TRIANGLES, indices.count, indices.type, 0);
      indices.disable();
      aPosition.disable();

    };
  }
};