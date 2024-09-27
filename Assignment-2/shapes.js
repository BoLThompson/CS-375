
let gl = undefined;
let ms;
let cylinder;
let sphere;
let time = 0;
let segs = 8;
let armLen = 0.25;
let jointSize = 0.03;
let gapSize = 0.1;

function init() {
    let canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");
    if (!gl) { alert("Your Web browser doesn't support WebGL 2\nPlease contact Dave"); }

    // Add initialization code here
	
	gl.clearColor(0.2, 0.2, 0.2, 1.0);
	gl.enable(gl.DEPTH_TEST);

	cylinder = new Cylinder(gl, 36);
	
	sphere = new Sphere(gl,36,18);
	
	ms = new MatrixStack();
	
	render();
}

//I'm not ashamed to admit that I took this code from stackoverflow
//Simply not in the mood to resolve this problem
function HSVtoRGB(h, s, v) {
	var r, g, b, i, f, p, q, t;
	if (arguments.length === 1) {
			s = h.s, v = h.v, h = h.h;
	}
	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
			case 0: r = v, g = t, b = p; break;
			case 1: r = q, g = v, b = p; break;
			case 2: r = p, g = v, b = t; break;
			case 3: r = p, g = q, b = v; break;
			case 4: r = t, g = p, b = v; break;
			case 5: r = v, g = p, b = q; break;
	}
	return vec4(r, g, b, 1);
}

function render() {
    // Add rendering code here
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	time = (time + 0.01) % 1;


	//overall level
	ms.push();
	
	//move origin to the top
	ms.translate(0,1,0);
	
	//This probably rotates z to be down and y to be towards the viewer
	ms.rotate(90, [1, 0, 0]);
	
	//scooch it a tiny bit higher to make room at the bottom
	ms.translate(0,0,-gapSize/3);
	
	let anglePerSeg = Math.sin(time*3.14*2)*45/segs;
	
	myTime = time;

	for (let i = 0; i < segs; ++i) {
		//sway
		ms.rotate(anglePerSeg, [0,1,0]);
		
		//get ready for arm specific stuff
		ms.push()
		//start the tube a little lower
		ms.translate(0,0,gapSize/2);
		//tubular tube
		ms.scale(0.015,0.015,armLen-jointSize-gapSize*3/4);
		//do it
		cylinder.MV = ms.current();
		cylinder.color = HSVtoRGB(myTime,1,1);
		myTime += 0.1;
		cylinder.draw();
		ms.pop();
		
		//meanwhile, at the end of said tube
		ms.translate(0,0,armLen);
		
		//get ready for joint specific stuff
		ms.push();
		//real tiny
		ms.scale(jointSize,jointSize,jointSize);
		//do it
		sphere.color = HSVtoRGB(myTime,1,1);
		myTime += 0.1;

		sphere.MV = ms.current();
		sphere.draw();
		ms.pop();

	}
	
	ms.pop();

	requestAnimationFrame(render);
}

window.onload = init;

