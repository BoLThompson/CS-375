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

in vec4 aColor; //this should just be a uniform
//and you should switch the value of it between the calls
//for gl.LINE_STRIP and for gl.POINTS
//but I have never set up a uniform before
//and I think that might not even be possible with the
//current version of MV.js because ShaderProgram abstracts
//away the mysterious return value of initShaders
//which btw I just learned is not part of webGL but instead
//is in its own script, and the webGL call is createShader.
//I feel like I have no idea how to actually use webGL and
//I'm really sad about it.

in vec4 aPosition;
out vec4 vColor;

void main() {
  vColor = aColor;
  vec4 pos = aPosition;
  gl_Position = P * MV * pos;
  gl_PointSize = 5.0;
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


    let positions = [];
    const pointCount = 10;
    for (let i = 0; i < pointCount; ++i) {
      let x = -1 + 2 * (i/(pointCount-1));
      let y = 1 * Math.sin((i/(pointCount-1))*2*Math.PI);
      positions.push(x);
      positions.push(y);
    }
    console.log(positions)
    positions = new Float32Array(positions);

    let aPosition = new Attribute(gl, program, "aPosition", positions, 2, gl.FLOAT);
    let lineColor = new Attribute(gl, program, "aColor", new Float32Array([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]), 3, gl.FLOAT);
    let pointColor = new Attribute(gl, program, "aColor", new Float32Array([1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0]), 3, gl.FLOAT);


    this.draw = () => {
      program.use();

      aPosition.enable();
      lineColor.enable();
      gl.drawArrays(gl.LINE_STRIP, 0, aPosition.count);
      lineColor.disable();
      pointColor.enable();
      gl.drawArrays(gl.POINTS, 0, aPosition.count);
      pointColor.disable();
      aPosition.disable();
    };
  }
};
