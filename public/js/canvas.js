//CANVAS
function Canvas(id){
   // this.canvas = document.getElementById(id);
    //if(!this.canvas){
	//	alert('cannot find "'+id+'"');
	//}
	 
    //this.ctx = this.canvas.getContext('2d');
    this.width = 900;
    this.height = 800;
    this.fill_color = "#FFF";
    this.stroke_color = "#000";
    
    this.sObject=''
    this.visible=1;
}
Canvas.prototype={
	
	addObject:function(sObject){
		
		this.sObject+=sObject;
		
		var sSvg='<svg style="position:absolute;" width="'+this.width+'px" height="'+this.height+'px">  ';
		
		var tCanvas=getById('tCanvas');
		if(tCanvas){
			
			for(var i=1;i<oApplication.idLayer;i++){
				
				if(oApplication.tLayer[i].visible){
					sSvg+=oApplication.tLayer[i].sObject;
				}
			}
			
		}
		
		
		sSvg+='</svg>';
		
		tCanvas.innerHTML=sSvg;
		
		 
	},
	
	isInside: function(pos) {
		return true;
		//return (pos.x >= 0 && pos.x<=this.width && pos.y>=0 && pos.y<=this.height);
	},

	clear: function(){
		//this.canvas.innerHTML='';
		this.sObject='';
		
		//this.ctx.clearRect(0, 0, this.width, this.height);
	},
	clearRect: function(x,y,width,height){
		return;
	},
	circle: function(x,y,width,lineWidth,strokeStyle,fill){
		
		var sSvg='<circle  onclick="oApplication.selectObject('+oApplication.dataIdDrawed+')"  cx="'+x+'" cy="'+y+'" r="'+width+'" stroke="'+strokeStyle+'" stroke-width="'+lineWidth+'" fill="'+fill+'" />';
		this.addObject(sSvg);
	},
	line: function(x1,y1,x2,y2,color,border){
		
		var sSvg='<line  onclick="oApplication.selectObject('+oApplication.dataIdDrawed+')"  x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" style="cursor:pointer;stroke:'+color+';stroke-width:'+border+'" />';
		
		this.addObject(sSvg);
		
	}
	,
	multiline:function(sPoints,color,border){
		var sSvg='<polyline  onclick="oApplication.selectObject('+oApplication.dataIdDrawed+')"  points="'+sPoints+'"  style="cursor:pointer;fill:none;stroke:'+color+';stroke-width:'+border+'" />';
		
		this.addObject(sSvg);
	}
	,
	getXByPosition:function(object,position){
		var x1;
		var y1;
		if(position=='left-top'){
			x1=object.x;
			y1=object.y;
		}else if(position=='top'){
			x1=object.x+(object.width/2);
			y1=object.y;
		}else if(position=='right-top'){
			x1=object.x+(object.width);
			y1=object.y;
		}else if(position=='left-center'){
			x1=object.x;
			y1=object.y+(object.height/2);
		}else if(position=='center'){
			x1=object.x+(object.width/2);
			y1=object.y+(object.height/2);
		}else if(position=='right-center'){
			x1=object.x+(object.width);
			y1=object.y+(object.height/2);
		}else if(position=='left-bottom'){
			x1=object.x;
			y1=object.y+(object.height);
		}else if(position=='bottom'){
			x1=object.x+(object.width/2);
			y1=object.y+(object.height);
		}else if(position=='right-bottom'){
			x1=object.x+(object.width);
			y1=object.y+(object.height);
		}
		
		//console.log(object.x+' :'+x1);
		
		return x1;
	}
	,
	getYByPosition:function(object,position){
		var x1;
		var y1;
		if(position=='left-top'){
			x1=object.x;
			y1=object.y;
		}else if(position=='top'){
			x1=object.x+(object.width/2);
			y1=object.y;
		}else if(position=='right-top'){
			x1=object.x+(object.width);
			y1=object.y;
		}else if(position=='left-center'){
			x1=object.x;
			y1=object.y+(object.height/2);
		}else if(position=='center'){
			x1=object.x+(object.width/2);
			y1=object.y+(object.height/2);
		}else if(position=='right-center'){
			x1=object.x+(object.width);
			y1=object.y+(object.height/2);
		}else if(position=='left-bottom'){
			x1=object.x;
			y1=object.y+(object.height);
		}else if(position=='bottom'){
			x1=object.x+(object.width/2);
			y1=object.y+(object.height);
		}else if(position=='right-bottom'){
			x1=object.x+(object.width);
			y1=object.y+(object.height);
		}
		
		return y1;
	}
	,
	link:function(oFrom,oTo,fromPosition,toPosition,color,border){
		
		var x1=this.getXByPosition(oFrom,fromPosition);
		var y1=this.getYByPosition(oFrom,fromPosition);
		
		var x2=this.getXByPosition(oTo,toPosition);
		var y2=this.getYByPosition(oTo,toPosition);
		
		var sPointsLine=x1+','+y1;
		
		if(
				(fromPosition.indexOf('right')>-1 && toPosition.indexOf('top')>-1 )
				||
				(fromPosition.indexOf('right')>-1 && toPosition.indexOf('bottom')>-1 )
				||
				(fromPosition.indexOf('left')>-1 && toPosition.indexOf('top')>-1 )
				||
				(fromPosition.indexOf('left')>-1 && toPosition.indexOf('bottom')>-1 )
				
				
		){
			//console.log('cas 1');
			
			sPointsLine+=' '+x2+','+y1;
			sPointsLine+=' '+x2+','+y2;			
			 
		}else{
			//console.log('cas 2');
			//calcul centre
			var xCenter=x1+((x2-x1)/2);
			
			sPointsLine+=' '+xCenter+','+y1;
			sPointsLine+=' '+xCenter+','+y2;
			sPointsLine+=' '+x2+','+y2;
			
		}
		console.log('186:'+sPointsLine);
		this.multiline(sPointsLine,color,border);
		
	},
	linkPoint:function(oFrom,oTo,fromPosition,toPosition,sPoints,color,border){
		
		var x1=this.getXByPosition(oFrom,fromPosition);
		var y1=this.getYByPosition(oFrom,fromPosition);
		
		var x2=this.getXByPosition(oTo,toPosition);
		var y2=this.getYByPosition(oTo,toPosition);
		
		var sPointsLine=x1+','+y1;
		
		if(sPoints!=''){
			
			var tPoints=sPoints.split(';');
			for(var i=0;i<tPoints.length;i++){
				var tPoint=tPoints[i].split(':');
				var xPoint=tPoint[0];
				var yPoint=tPoint[1];
				
				sPointsLine+=' '+xPoint+','+yPoint;
			}
			
		}
		sPointsLine+=' '+x2+','+y2;
		console.log('213:'+sPointsLine);
		this.multiline(sPointsLine,color,border);
		
		
	},
	linkPointWithSelected:function(oFrom,oTo,fromPosition,toPosition,sPoints,iSelectedPointId,color,border){
		
		var x1=this.getXByPosition(oFrom,fromPosition);
		var y1=this.getYByPosition(oFrom,fromPosition);
		
		var x2=this.getXByPosition(oTo,toPosition);
		var y2=this.getYByPosition(oTo,toPosition);
		
		var sPointsLine=x1+','+y1;
		if(sPoints!=''){
			
			var tPoints=sPoints.split(';');
			for(var i=0;i<tPoints.length;i++){
				var tPoint=tPoints[i].split(':');
				var xPoint=tPoint[0];
				var yPoint=tPoint[1];
				
				sPointsLine+=' '+xPoint+','+yPoint;
				
				if(i==iSelectedPointId){
					this.fillRect(xPoint-5,yPoint-5,10,10,'#880000');
					
				}
			}
			
		}
		
		sPointsLine+=' '+x2+','+y2;
		console.log('246:'+sPointsLine);
		this.multiline(sPointsLine,color,border);
		
	},
	arrow: function(x1,y1,x2,y2,strokeStyle,lineWidth){
		
		var sSvg='<line  onclick="oApplication.selectObject('+oApplication.dataIdDrawed+')"  x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" style="stroke:'+strokeStyle+';stroke-width:'+lineWidth+'" />';
		//sSvg+='<rect class="chartRect" id="rect'+x2+''+y2+'" x="'+(x2-3)+'" y="'+(y2-3)+'" width="6" height="6" style="fill:'+strokeStyle+'"></rect>';
		sSvg+='<circle cx="'+x2+'" cy="'+y2+'" r="3" stroke="'+strokeStyle+'" stroke-width="'+lineWidth+'" fill="'+strokeStyle+'" />';
		
		this.addObject(sSvg);
		
		
	}
	,
	drawRect : function(x,y,ilargeur,ihauteur,lineWidth,strokeStyle,fillStyle){

		var sSvg='<rect onMouseDown="oApplication.startDrag('+oApplication.dataIdDrawed+');oApplication.selectObject('+oApplication.dataIdDrawed+')" onMouseUp="oApplication.endDrag()" class="chartRect" id="obj'+oApplication.dataIdDrawed+'" x="'+x+'" y="'+y+'" width="'+ilargeur+'" height="'+ihauteur+'" style="cursor:pointer;fill:'+fillStyle+';stroke-width:'+lineWidth+';stroke:'+strokeStyle+'"></rect>';
			
		this.addObject(sSvg);


	},
	fillRect : function(x,y,ilargeur,ihauteur,fond){

		var sSvg='<rect onMouseDown="oApplication.startDrag('+oApplication.dataIdDrawed+');oApplication.selectObject('+oApplication.dataIdDrawed+')" onMouseUp="oApplication.endDrag()" class="chartRect" id="rect'+x+''+y+'" x="'+x+'" y="'+y+'" width="'+ilargeur+'" height="'+ihauteur+'" style="cursor:pointer;fill:'+fond+'"></rect>';
			
		this.addObject(sSvg);

		

	},
	fillTextAlign:function(x,y,texte,textAlign,width,height,strokeStyle,size){
		
		sAnchor='start';
		if(textAlign!='left' & textAlign!='center' & textAlign!='right' ){
			textAlign='left';
		}
		
		if(textAlign=='left'){
			x1=x;
			y1=y;
		}else if(textAlign=='center'){
			x1=x+(width/2);
			y1=y;
			sAnchor='middle';
		}else if(textAlign=='right'){
			x1=x+(width);
			y1=y;
			sAnchor='end';
		}
		
		var sSvg='<text x="'+x1+'" y="'+y1+'" width="'+width+'" text-anchor="'+sAnchor+'" fill="'+strokeStyle+'">'+texte+'</text>';
		
		this.addObject(sSvg);
		
	},
	drawRectStroke : function(x,y,ilargeur,ihauteur,contour,width){
		//console.log('draw rect str');

		var sSvg='<rect class="chartRect" id="rect'+x+''+y+'" x="'+x+'" y="'+y+'" width="'+ilargeur+'" height="'+ihauteur+'" style="stroke-width:'+width+';stroke:'+contour+'"></rect>';
			
		this.addObject(sSvg);

	}
	,
	drawBdd:function(x,y,ilargeur,ihauteur,lineWidth,strokeStyle,fillStyle){
		
		
		var sSvg='<g onMouseDown="oApplication.startDrag('+oApplication.dataIdDrawed+');oApplication.selectObject('+oApplication.dataIdDrawed+')" onMouseUp="oApplication.endDrag()" style="cursor:pointer;">'; 
		sSvg+='<rect id="rect'+x+''+y+'" x="'+x+'" y="'+y+'" width="'+ilargeur+'" height="'+ihauteur+'" style="fill:'+fillStyle+';stroke-width:'+lineWidth+';stroke:'+strokeStyle+'"></rect>';
		sSvg+='<ellipse cx="'+(x+(ilargeur/2))+'" cy="'+y+'" rx="'+ilargeur/2+'" ry="10" style="fill:'+fillStyle+';stroke:'+strokeStyle+';stroke-width:'+lineWidth+'" />';
		sSvg+='<ellipse cx="'+(x+(ilargeur/2))+'" cy="'+(y+ihauteur)+'" rx="'+ilargeur/2+'" ry="10" style="fill:'+fillStyle+';stroke:'+strokeStyle+';stroke-width:'+lineWidth+'" />';
		sSvg+='</g>';
		
		
		
		
		this.addObject(sSvg);
		
 		
		  
 	}
	
	,
	fillText:function(x,y,texte,couleur,size){
		//console.log('txt:'+couleur);
		if(!couleur){
			couleur='#000000';
		}
		
		var sSvg='<text x="'+x+'" y="'+y+'" fill="'+couleur+'">'+texte+'</text>';
		
		this.addObject(sSvg);
		
	}
	,
	drawPolygon:function(sPoints,lineWidth,strokeStyle,fillStyle){
		var sSvg='<polygon  onclick="oApplication.selectObject('+oApplication.dataIdDrawed+')"  points="'+sPoints+'" style="fill:'+fillStyle+';stroke:'+strokeStyle+';stroke-width:'+lineWidth+'" />';
		this.addObject(sSvg);
	}
	,
	drawLosange: function (x,y,ilargeur,ihauteur,lineWidth,strokeStyle,fillStyle) {
		
		var sPoints='';
		
		sPoints+=' '+(x+(ilargeur/2))+','+y;
		
		sPoints+=' '+(x+(ilargeur/1))+','+(y+(ihauteur/2));
		
		sPoints+=' '+(x+(ilargeur/2))+','+(y+(ihauteur/1));
		
		sPoints+=' '+(x)+','+(y+(ihauteur/2));
		
		
		this.drawPolygon(sPoints,lineWidth,strokeStyle,fillStyle);

	}
	,
	isInThisLosange: function(x,y){

	},
	
};
function Point(){
	this.x=0;
	this.y=0;
}
Point.prototype={
	
};
