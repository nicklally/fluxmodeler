var boxes = []; 
var boxW = 100;
var boxH = 100;
var lock = false; 
var butAdd, butMove;
var mode = 0; //0 = 'ADD' mode, 1 = 'MOVE' mode


function setup() {
  createCanvas(900, 600);
  butAdd = createButton('ADD');
  butAdd.position(5,5);
  butAdd.mousePressed(mode0);
  butAdd.style('background-color', '#C3E4F6');
  
  butMove = createButton('MOVE');
  butMove.position(55,5);
  butMove.mousePressed(mode1);
  butMove.style('background-color', '#FFF');
}

function draw() {
	background(255);
	checkOver(mouseX,mouseY);
	if(mode == 0){
		for(var i = 0; i < boxes.length; i++){
			boxes[i].addLine(mouseX,mouseY);
		}
	}
	if(mode == 1){
		moveBox(mouseX,mouseY);
	}
	recalcBoxes();
}

function Box(bX, bY, bW, bH, name, mag, id){
	this.bX = bX - 0.5*bW;
	this.bY = bY - 0.5*bH;
	this.bW = bW;
	this.bH = bH;
	this.name = name; 
	this.mag = mag; 
	this.id = id; 
	this.fillC = 200;
	this.locked = false;
	this.over = false;
	this.difx = 0; //to calculate dragging
	this.dify = 0;
	this.lineMode = false;
	this.lineX1 = 0;
	this.lineY1 = 0;
	this.lineX2 = 0; 
	this.lineY2 = 0;
	this.lineLocked = false;
	
	this.display = function(){
		fill(this.fillC);
		rect(this.bX, this.bY, this.bW, this.bH);
		line(this.lineX1,this.lineY1,this.lineX2,this.lineY2);
	};
	
	this.checkOver = function(x,y){
		if(x > this.bX && x < this.bX+this.bW && y > this.bY && y < this.bY + this.bH){
			this.over = true;
		} else {
			this.over = false;
		}		
	}
	
	this.move = function(x,y){
		if(this.over){
			this.fillC = 255;
		} else {
			this.fillC = 200;
		}	
		//help from http://processingjs.org/learning/basic/mousefunctions/
		if(this.over && mouseIsPressed && !this.locked){
			this.locked = true;
			this.difx = x - this.bX;
			this.dify = y - this.bY;
			//console.log(this.difx + ' ' + this.dify);
		} 
		if(!mouseIsPressed) {
			this.locked = false;
		}	
	}
	
	this.addLine = function(x,y){
		if(this.over && !this.lineMode && mouseIsPressed){
			this.lineX1 = x;
			this.lineY1 = y; 
			this.lineLocked = true;
			this.lineMode = true;
		} 
		
		if(this.lineLocked && this.lineMode && mouseIsPressed){
			this.lineX2 = x; 
			this.lineY2 = y;
		}
		if(!mouseIsPressed){
			this.lineLocked = false;
			this.lineMode = false;
		}
		
	}
}

function moveBox(x,y){
	for(var i = 0; i < boxes.length; i++){
		boxes[i].move(x,y);
	}
}

function checkOver(x,y){
	for(var i = 0; i < boxes.length; i++){
		boxes[i].checkOver(x,y);
	}
}


function mouseReleased(){
	recalcBoxes();	
	/*for(var i = 0; i < boxes.length; i++){
		console.log(boxes[i].mag);
	}*/
}

function mouseDragged(){
	if(mode == 1){
		for(var i = 0; i < boxes.length; i++){
			if(boxes[i].locked){
				var nx = mouseX - boxes[i].difx;
				var ny = mouseY - boxes[i].dify;
				boxes[i].bX = nx;
				boxes[i].bY = ny;
				moveInputs(nx,ny,"#mag_" + i, "#label_" + i);
			}
		}
	}
	recalcBoxes();
}

function recalcBoxes(){
	background(255);
	for(var i = 0; i < boxes.length; i++){
		boxes[i].display();
	}
}

window.ondblclick=function(){
	if(mode == 0){
		makeBox(mouseX,mouseY);
	}	
};

function makeInputs(x,y,id){
	input = createInput();
	input.position(x-25,y);
    input.value(0);
    input.id("mag_" + id); 
    input.class("magnitude"); 
    input.attribute("onkeydown", "keypress(event, id)");
    
    input2 = createInput();
    input2.position(x-25,y-25);
    input2.value('box#' + id);
    input2.id("label_" + id);
    input2.class("label");
    input2.attribute("onkeydown","keypress2(event, id)");

}

function moveInputs(x,y,id1,id2){
	x = x + 0.5*boxW;
	y = y + 0.5*boxH;
	var inputFocus = select(id1);
	inputFocus.position(x-25,y);
	
	var inputFocus2 = select(id2);
	inputFocus2.position(x-25,y-25);
	
}

function makeBox(x,y){
	x = x - 0.5*boxW;
	y = y - 0.5*boxH;
		//check for overlap
		var overlap = false; 
		for(var i = 0; i < boxes.length; i++){
			if((x > boxes[i].bX - boxW) && (x < (boxes[i].bX + boxes[i].bW)) && 
			   (y > boxes[i].bY - boxH) && (y < (boxes[i].bY + boxes[i].bH))){
			   overlap = true; 
			}
		}
		//if no overlap, make new box
		if(!overlap){
			x = x+0.5*boxW;
			y = y+0.5*boxH;
			append(boxes, new Box(x, y,boxW,boxH,' ', 0, boxes.length));
			makeInputs(x,y,boxes.length - 1);
		}	
		
		recalcBoxes();
	
}

//keypress for mag input boxes
	function keypress(event, id){
		//var key = event.keyCode;
		//if (key == 13){ //trigger for enter key
			//console.log(id);
			var inputFocus = document.getElementById(id);
			var inVal = inputFocus.value; 
			var idNum = id.split("_");
			//console.log(idNum[1]);
			boxes[idNum[1]].mag = inVal;
			console.log(boxes[idNum[1]].mag); 
		//	}
}

//keypress for mag input boxes
	function keypress2(event, id){
		var key = event.keyCode;
		//if (key == 13){ //trigger for enter key
			//console.log(id);
			var inputFocus = document.getElementById(id);
			var inVal = inputFocus.value; 
			var idNum = id.split("_");
			//console.log(idNum[1]);
			boxes[idNum[1]].name = inVal;
			console.log(boxes[idNum[1]].name); 
		//	}
}

//'ADD' mode
function mode0(){
	mode = 0;
	butAdd.style('background-color', '#C3E4F6');
	butMove.style('background-color', '#FFF');
}
//'MOVE' mode
function mode1(){
	mode = 1;
	butMove.style('background-color', '#C3E4F6');
	butAdd.style('background-color', '#FFF');
}		
