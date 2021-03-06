
  //const DIMS = 2; //2d
  const initialNumForces = 6;
  const forces = new Array(initialNumForces);
  const ROW=20;
  const COL=12;
  const numParticles = ROW*COL;
  const numParticleTypes = 9;
  const particles = [];
  
  const canvas = document.getElementById("theCanvas");
  const cx = canvas.getContext("2d");
  let trails = true, edgeCollision = true, mouseDown = false, randomAttraction = false;
  let mouseDownX, mouseDownY;
  window.addEventListener('keydown',this.keyMoveAllParticles,false);
  
  let count = 0;
  setInterval(interact, 50);
  
  function Force(name, magnitude, range, minRange, frequency, attractionType){
	this.name = name;
	this.mag = magnitude;
	this.range = range;
	this.minRange = minRange;
	this.freq = frequency;
	this.special = 0; //used for special properties, like downward gravity
	this.attractionType = attractionType; 
	//attractionType = 0 is universal attraction
	//attractionType = 1 is attraction to like, repulsion to opposite
	//attractionType = 2 is attraction to opposites, repulsion to like
	//attractionType = 3 is universal repulsion
  }
  
  function Particle(x, y, size, shape, color, interactions){
	//this.name = name;  //might use this later
	this.x = x;
	this.y = y;
	this.size = size;
	this.shape = shape;
	this.color = color;
	this.interactions = interactions; //e.g mass for gravity, charge for EM 
  }

  function initialize() {
  
	forces[0] = new Force('gravity', 0.03, 700, 0, 1, 0); 
	forces[1] = new Force('electromagnetism', 0.03, 80, 10, 1, 2); 
	forces[2] = new Force('strong nuclear', 0.15, 30, 3, 1, 0); 
	forces[3] = new Force('blueNpurple', 0.27, 50, 15, 1, 3); 
	forces[4] = new Force('force5', 0.1, 65, 10, 1, 5); 
	forces[5] = new Force('pureRepulsion', 0.575, 150, 0, 1, 1); 
	
	forces[0].special = 0.1; //downward gravity
	
    let p = 0;
	startingX = (canvas.width / 2) - 180;
	startingY = (canvas.height / 2) - 120;
    let xi = startingX;
    let yi = startingY;
    for(let i=0; i<COL; i++){
      xi = startingX;
      for(let j=0; j<ROW; j++){	
		let forceInteractions = [0, 0, 0, 0, 0, 0]; 
		switch (p % numParticleTypes) {
			case 0: 
				forceInteractions = [0.57, 0.21, 0.41, 0.02, 0.1, 0.1]; 
				particles.push(new Particle(xi, yi, 2, "circle", "#d30000", forceInteractions));//red
				break;
			case 1: 
				forceInteractions = [0.8, 0.81, 0.81, 0.81, -0.3, 0.13];
				particles.push(new Particle(xi, yi, 3, "square", "gray", forceInteractions));
				break;
			case 2: 
				forceInteractions = [0.15, -1, -0.3, -0.03, 0.1, 0.2];
				particles.push(new Particle(xi, yi, 2, "square", "#eeff3d", forceInteractions));
				break;
			case 3: 
				forceInteractions = [0.01, -1.35, -0.4, 0.03, 0.6, 0.4];
				particles.push(new Particle(xi, yi, 1, "square", "white", forceInteractions));
				break;
			case 4: 
				forceInteractions = [0.02, 0.20, 0.1, 1.2, -0.3, 0.1];
				particles.push(new Particle(xi, yi, 2, "circle", "#7a7aff", forceInteractions));
				break;
			case 5: 
				forceInteractions = [0.3, -0.40, 0.3, -1.2, -0.6, 0.1];
				particles.push(new Particle(xi, yi, 2, "circle", "purple", forceInteractions));
				break;
			case 6: 
				forceInteractions = [0.025, 0.05, 0, 0.2, 1.1, 0.2];
				particles.push(new Particle(xi, yi, 1, "circle", "gold", forceInteractions));
				break;
			case 7: 
				forceInteractions = [0.20, 0.05, 0, 0.1, -1.1, 0.1];
				particles.push(new Particle(xi, yi, 2, "circle", "#f442b9", forceInteractions));
				break;
			case 8: 
				forceInteractions = [0.8, 0.3, 0.0, 0.03,-0.4, 0.1];
				particles.push(new Particle(xi, yi, 2, "circle", "#000033", forceInteractions));
				break;
			default:
				forceInteractions = [0, 0, 0, 0]; //dead particle
				particles.push(new Particle(xi, yi, 10, "square", "white", forceInteractions)); 
		
		}
        p += 1;
        xi += 15; //Math.random() * 10;
      }
      yi += 15; //Math.random() * 10;
    }
	canvas.addEventListener( 'mousedown', onMouseDown, false );
 }
  
  

  
//add random particle to random location
const addRandomParticle = () => {
	
}
  
const removeRandomParticle = () => {
	
}

const addCustomForce = () => {
	const name = prompt("Name of force: ", "Force " + (forces.length + 1));
	const mag = (name == null) ? 0 : prompt("New force's strength", "10.5");
	const range = (mag == null) ? 0 : prompt("New force's range:", "75");
	const freq = (range == null) ? 1 :  prompt("New force's frequency (min. 1):", "1");
	const attractionType = (freq == null) ? 0 :  prompt("New force's attraction type (0 is pure attraction, 1 is opposite's attract, 2 is likes attract, 3 is pure repulsion): ", "1");
	if (attractionType != null) {
		forces.push(new Force(name, mag, range, 0, freq, attractionType));
		for (let i=0; i<particles.length; i++)
			particles[i].interactions.push(Math.random() - 1);//Math.random());
	}
	/*
	const newSlider = document.forceSliders.createElement("input");
    newSlider.setAttribute("type", "range");
	newSlider.setAttribute("min", "0");
	newSlider.setAttribute("max", "1");
	newSlider.setAttribute("step", "0.01");
	newSlider.setAttribute("value", mag);
	newSlider.setAttribute("class", "slider");
	newSlider.setAttribute("id", forces.length);
	newSlider.setAttribute("onchange", "sliderMove(this.id, this.value)");
    document.forceSliders.appendChild(newSlider);
	*/
}

const addCustomParticle = () => {
	//const name = prompt("New particle's name:", "New Particle");
	const quantity = prompt("How many:", "20");
	const size = (quantity == null) ? 0 : prompt("New particle's size (1-5):", "2");
	const color = (size == null) ? "white" : prompt("New particle's color:", "white");
	let forceInteractions = new Array(forces.length);
	if (color != null)
		for (let f=0; f<forces.length; f++){
			let inter = Math.random();
			if (Math.random() > 0.5)
				inter *= (-1);
			if (Math.random() > 0.5)
				inter /= 2;
			forceInteractions[f] = prompt("New particle's interaction with " + forces[f].name + ":", inter);
		}
	const sqrt = Math.sqrt(quantity);
	const xGap = Math.floor(canvas.width / sqrt);
	const yGap = Math.floor(canvas.height / sqrt);
	let xi = xGap;
    let yi = yGap;
	for (let i=0; i<Math.sqrt(quantity); i++){
		xi = xGap;
		for (let j=0; j<Math.sqrt(quantity); j++){
		debugger;
			particles.push(new Particle(100, 100, size, "circle", color, forceInteractions)); 
			xi += xGap;
		}
		yi += yGap;
	}
}

const keyMoveAllParticles = (event) => {
	const direction = [0,0];
    switch (event.keyCode) {
        case 37: direction[0] -= 2; //left key press
				 break; 
        case 38: direction[1] -= 2; //up key press
				 break; 
        case 39: direction[0] += 2; //right key press
				 break; 
        case 40: direction[1] += 2; //down key press
				 break; 
	}
	for (let i=0; i<particles.length; i++){
		particles[i].x += direction[0];
		particles[i].y += direction[1];
	}
}

const onMouseDown = (event) => {

	event.preventDefault();
	canvas.addEventListener( 'mousemove', onMouseMove, false );
	canvas.addEventListener( 'mouseup', onMouseUp, false );
	mouseDown = true;
	mouseDownX = event.pageX - canvas.offsetLeft;
	mouseDownY = event.pageY - canvas.offsetLeft; //>.<

	const forceInteractions = [80, 0, 0, 0, 0, 0];
	particles.push(new Particle(mouseDownX, mouseDownY, 20, "square", "black", forceInteractions)); 
}

const onMouseUp = (event) => {
	canvas.removeEventListener( 'mousemove', onMouseMove, false );
	canvas.removeEventListener( 'mouseup', onMouseUp, false );
	mouseDown = false;
	particles.pop();
}

const onMouseMove = (event) => {
	if (mouseDown){
		particles[particles.length-1].x = event.pageX - canvas.offsetLeft;
		particles[particles.length-1].y = event.pageY - canvas.offsetTop;
	}
}

const viewPaths = () => {
	const checkBox = document.getElementById("trailCheckbox");
	if (checkBox.checked == true)
		trails = true;
	else
		trails = false;
}

const edgeCollisionChange = () => {
	const checkBox = document.getElementById("edgeCollisionCheckbox");
	if (checkBox.checked == true)
		edgeCollision = true;
	else
		edgeCollision = false;
}

const randomAttractions = () => {
	const checkBox = document.getElementById("randomAttractionsCheckbox");
	if (checkBox.checked == true)
		randomAttraction = true;
	else
		randomAttraction = false;
}

const sliderMove = (id, value) => {
	forces[id].mag = value;
}

const setDownwardGravity = (value) => {
	forces[0].special = parseInt(value);
	//document.getElementById("output1").innerHTML = "Downward Gravity = " + forces[0].special;
}

function interact() { 
	count++;
	
	//trail effect at start
	if (count == 30)
		trails = false;
	
	if (!trails)
		cx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas each frame 
		
	repaint();
	 
	//copy coordinates into temp arrays
	const tempXCoordinates = new Array(particles.length), tempYCoordinates = new Array(particles.length);
	for (let i=0; i<particles.length; i++){
		tempXCoordinates[i] = particles[i].x;
		tempYCoordinates[i] = particles[i].y;
	}
	
	//noise generator
	if (count > 30) {
		const particleType = Math.floor(Math.random() * numParticleTypes);
		const affectedForce = Math.floor(Math.random() * forces.length);
		const forceChange = (Math.random() - 0.5) * 0.025;
		for (let i=0; i<particles.length; i++)
			if (i % particleType == 0)
				particles[i].interactions[affectedForce] += forceChange;
	}
	
	//random attractions if checkboxed
	if (randomAttraction){
		if (count % 20 == 0)
			forces[5].attractionType = Math.floor(Math.random() * 9);
		if (count % 48 == 0)
			forces[1].range = Math.floor(Math.random() *140);
		if (count % 48 == 0)
			forces[2].range = Math.floor(Math.random() *50);
		if (count % 90 == 0)
			forces[3].range = Math.floor(Math.random() *100);
		if (count % 60 == 0)
			forces[4].range = Math.floor(Math.random() * 100);
		if (count % 200 == 0)
			forces[5].range = Math.floor(Math.random() * 240);
		if (count % 40 == 0)
			forces[2].attractionType = Math.floor(Math.random() * 9);
		if (count % 30 == 0)
			forces[3].attractionType = Math.floor(Math.random() * 9);
		if (count % 100 == 0)
			forces[4].attractionType = Math.floor(Math.random() * 9);
		if (count % 72 == 0)
			forces[1].mag *= -1;
		if (count % 48 == 0)
			forces[2].mag *= -1;
		if (count % 110 == 0)
			forces[3].mag *= -1;
		if (count % 33 == 0)
			forces[4].mag *= -1; 
		if (count % 80 == 0)
			forces[5].minRange = Math.random() * forces[3].range;
		if (count % 80 == 0)
			forces[5].minRange = Math.random() * forces[4].range;
		if (count % 62 == 0)
			forces[5].minRange = Math.random() * forces[5].range;
	}
	
	//****************************************
    //******** Particle Interaction **********
    //****************************************  	
	for(let i=0; i<particles.length; i++){
		//special interactions go here
		tempYCoordinates[i] += forces[0].special; //downward gravity
		//disables moving the invisible particle created by the user's mouse click
		if (mouseDown && i == particles.length - 1){ 
				continue; 
		}
		//particle-particle interactions
        for(let j=0; j<particles.length; j++){
			const dX = particles[j].x - particles[i].x;
			const dY = particles[j].y - particles[i].y; 
			//const angle = Math.atan(dY, dX);
			distance = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));		
			//prevent particles from occupying exact same position
			if (distance <= particles[i].size) {
				switch (Math.floor(Math.random() * 2)){
					case 0:
						tempXCoordinates[i]++;
						tempYCoordinates[i]++;
						tempXCoordinates[j]--;
						tempYCoordinates[j]--;
						break;
					case 1:
						tempXCoordinates[i]++;
						tempYCoordinates[i]--;
						tempXCoordinates[j]--;	
						tempYCoordinates[j]++;		
				}
			} else {
				//main interactions
				for (let f=0; f<forces.length; f++){
					var fullInteraction;
					const interactionOfI = particles[i].interactions[f];
					const interactionOfJ = particles[j].interactions[f];
					let polarity = 0;
					if ((distance < forces[f].range && distance > forces[f].minRange) && (count % forces[f].freq == 0))			
						switch (forces[f].attractionType) {
							case 0: //Universal attraction
								fullInteraction = Math.abs(forces[f].mag * interactionOfI * interactionOfJ);
								break;
							case 1: //Universal repulsion
								fullInteraction = (-1) * Math.abs(forces[f].mag * interactionOfI * interactionOfJ);
								break;
							case 2:
								fullInteraction = forces[f].mag * (interactionOfI + interactionOfJ);
								break;
							case 3: //Attracted by opposite, repelled by like
								fullInteraction = (-1) * forces[f].mag * interactionOfI * interactionOfJ;
								break;
							case 4: //Attracted by like, repelled by opposite
								fullInteraction = forces[f].mag * interactionOfI * interactionOfJ;
								break;
							case 5: //Attracted by positive, repelled by negative
								polarity = (interactionOfJ < 0) ? -1 : 1;
								fullInteraction = polarity * forces[f].mag * interactionOfI * interactionOfJ;
								break;
							case 6: //Attracted by negative, repelled by positive
								polarity = (interactionOfJ < 0) ? 1 : -1;
								fullInteraction = polarity * forces[f].mag * interactionOfI * interactionOfJ;
								break;
							case 7: //Stronger particle determines full interaction
								let stronger = (interactionOfI >= interactionOfJ) ? interactionOfI : interactionOfJ;
								fullInteraction = forces[f].mag * stronger * stronger;
								break;
							case 8: //Weaker particle determines full interaction
								let weaker = (interactionOfI >= interactionOfJ) ? interactionOfI : interactionOfJ;
								fullInteraction = forces[f].mag * weaker * weaker;
								break;
							case 9: //Distance scaling
								fullInteraction = (forces[f].mag * interactionOfI * interactionOfJ) / distance;
						}
						tempXCoordinates[i] += dX * fullInteraction * 0.03;
						tempYCoordinates[i] += dY * fullInteraction * 0.03;
							
				}
			}			
		  }
		}
		
	//wall/ground collision
	if (edgeCollision && count % 50 != 0)
		for (let i=0; i<particles.length; i++){
			const deltaX = tempXCoordinates[i] - particles[i].x;
			const deltaY = tempYCoordinates[i] - particles[i].y;
			if (tempXCoordinates[i] > canvas.width)
				tempXCoordinates[i] = canvas.width - deltaX*0.9 - 1;
			if (tempYCoordinates[i] > canvas.height)
				tempYCoordinates[i] = canvas.height - deltaY*0.9 - 1;
			if (tempXCoordinates[i] < 0)
				tempXCoordinates[i] = 1 + deltaX*0.9;
			if (tempYCoordinates[i] < 0)
				tempYCoordinates[i] = 1 + deltaY*0.9;
		}
	else
		for (let i=0; i<particles.length; i++){
			if ((tempXCoordinates[i] > canvas.width || tempYCoordinates[i] > canvas.height) 
			     || (tempXCoordinates[i] < 0 || tempYCoordinates[i] < 0)
				 || (isNaN(tempXCoordinates[i])  || isNaN(tempYCoordinates[i]))){
				tempXCoordinates[i] = canvas.width / 2;
				tempYCoordinates[i] = canvas.height / 2; 
			}
		}
	
	//transfer new coordinates to particles	
	for (let i=0; i<particles.length; i++){
		particles[i].x = tempXCoordinates[i];
		particles[i].y = tempYCoordinates[i];
	}
	
	//repaint();
}

const repaint = () => {
	//paint the new situation
	for(let i=0; i<particles.length; i++){
		if (particles[i].shape == "circle"){
			cx.strokeStyle = particles[i].color;
			cx.beginPath();
			cx.arc(particles[i].x, particles[i].y,particles[i].size,0,2*Math.PI);
			cx.stroke();
		} else if (particles[i].shape == "square"){
			cx.fillStyle = particles[i].color;
			cx.fillRect(particles[i].x, particles[i].y, particles[i].size, particles[i].size);
		}
    }
}