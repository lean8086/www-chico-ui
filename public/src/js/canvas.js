(function () {
	
/*
*	Canvas Element creation
*/	
	// Create canvas element
	var canvas = document.createElement("canvas"),
	
	// Get canvas context
		ctx = canvas.getContext("2d");
	
	// Set canvas size
	canvas.height = 390;
	
	// Add canvas to DOM
	document.getElementById("home-description").appendChild(canvas);

/*
*	Rays creation
*/

	var draw = function () {
		
		// Work only if size is acceptable
		if (ch.viewport.width < 1000) { return; }
		
		// Refresh canvas width
		canvas.width = ch.viewport.width;
		
		// Set rgba color to stripes
		ctx.fillStyle = "rgba(255, 255, 255, 0.015)";
		
		// Rays length
		var len = canvas.width * 1.5,
		
		// Layout width
			layout = 1000,
		
		// Point X where stripe inits
			fromX = ((canvas.width - layout) / 2) + layout - 250,
		
		// Point Y where stripe inits
			fromY = canvas.height,
			
		// Rotation angle of each line
			angle = 0;
		
		// Amount of rays
			divisions = 12,
		
		// Half og weight of each ray
			halfRay = divisions / 75,
		
		// Calculation of each stripe
			getXY = function (x, y, rotation) {
				return {
					"x": x + len * Math.cos(rotation),
					"y": y + len * Math.sin(rotation)
				};
			}
		
		// Rotation in radians
			radians = Math.PI * 2 / divisions,
		
		// Index to iterate
			i = divisions;
		
		// Iteration of each ray
		while (i) {
			
			// Angle recalculation
			angle = radians * i;
			
			// Move context to "from" point
			ctx.moveTo(fromX, fromY);
			
			// Get stripe from calculation
			var c1 = getXY(fromX, fromY, angle + halfRay);
				c2 = getXY(fromX, fromY, angle - halfRay);
			
			// Line to of context with calculated stripes
			ctx.lineTo(c1.x, c1.y);
			ctx.lineTo(c2.x, c2.y);
			ctx.lineTo(fromX, fromY);
			ctx.fill();
			
			// Next iteration
			i -= 1;
			
		};
	};

/*
*	Resizing
*/
	var resizing = false;
	
	window.addEventListener("resize", function () { resizing = true }, false);
	
	setInterval(function () { if (resizing) { draw(); } }, 350);
	
	draw();

}());