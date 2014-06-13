//CANVAS
function Canvas(id){
    this.canvas = document.getElementById(id);
    if(!this.canvas){
		alert('cannot find "'+id+'"');
	}
	 
    //this.ctx = this.canvas.getContext('2d');
    this.width = 900;
    this.height = 800;
    this.fill_color = "#FFF";
    this.stroke_color = "#000";
}
Canvas.prototype={
	
	addObject:function(sObject){
		var sSvg='<svg style="position:absolute;" width="'+this.width+'px" height="'+this.height+'px">  ';
		
		sSvg+=sObject;
		
		sSvg+='</svg>';
		
		var sPrevious=this.canvas.innerHTML;
		
		this.canvas.innerHTML=sPrevious+sSvg;
	},
	
	isInside: function(pos) {
		return true;
		//return (pos.x >= 0 && pos.x<=this.width && pos.y>=0 && pos.y<=this.height);
	},

	clear: function(){
		this.canvas.innerHTML='';
		
		//this.ctx.clearRect(0, 0, this.width, this.height);
	},
	clearRect: function(x,y,width,height){
		this.ctx.clearRect(x, y,  width, height);
	},
	circle: function(p,r){
		x = p.x*this.width;
		y = p.y*this.height;
		//this.ctx.save();
		this.ctx.beginPath();
		this.ctx.strokeStyle = this.stroke_color;
		this.ctx.moveTo(x+r,y);
		this.ctx.arc(x,y,r,0,TWO_PI,false);
		this.ctx.fill();
		//this.ctx.restore();
	},
	line: function(x1,y1,x2,y2,color,border){
		
		var sSvg='<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" style="stroke:'+color+';stroke-width:'+border+'" />';
		
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
		
		console.log(object.x+' :'+x1);
		
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
		
		if(
				(fromPosition.indexOf('right')>-1 && toPosition.indexOf('top')>-1 )
				||
				(fromPosition.indexOf('right')>-1 && toPosition.indexOf('bottom')>-1 )
				||
				(fromPosition.indexOf('left')>-1 && toPosition.indexOf('top')>-1 )
				||
				(fromPosition.indexOf('left')>-1 && toPosition.indexOf('bottom')>-1 )
				
				
		){
			console.log('cas 1');
			this.line(x1,y1,x2,y1,color,border);
			this.line(x2,y1,x2,y2,color,border);
			
			 
			
		}else{
			console.log('cas 2');
			//calcul centre
			var xCenter=x1+((x2-x1)/2);
			
			this.line(x1,y1,xCenter,y1,color,border);
			this.line(xCenter,y1,xCenter,y2,color,border);
			this.line(xCenter,y2,x2,y2,color,border);

			
		}
		
	},
	linkPoint:function(oFrom,oTo,fromPosition,toPosition,sPoints,color,border){
		
		var x1=this.getXByPosition(oFrom,fromPosition);
		var y1=this.getYByPosition(oFrom,fromPosition);
		
		var x2=this.getXByPosition(oTo,toPosition);
		var y2=this.getYByPosition(oTo,toPosition);
		
		this.ctx.beginPath();
		this.ctx.lineWidth=border;
		this.ctx.strokeStyle = color;
		this.ctx.moveTo(x1,y1);
		
		if(sPoints!=''){
			
			var tPoints=sPoints.split(';');
			for(var i=0;i<tPoints.length;i++){
				var tPoint=tPoints[i].split(':');
				var xPoint=tPoint[0];
				var yPoint=tPoint[1];
				
				this.ctx.lineTo(xPoint,yPoint);
			}
			
		}
		
		this.ctx.lineTo(x2,y2);
		this.ctx.stroke();
	},
	linkPointWithSelected:function(oFrom,oTo,fromPosition,toPosition,sPoints,iSelectedPointId,color,border){
		
		var x1=this.getXByPosition(oFrom,fromPosition);
		var y1=this.getYByPosition(oFrom,fromPosition);
		
		var x2=this.getXByPosition(oTo,toPosition);
		var y2=this.getYByPosition(oTo,toPosition);
		
		this.ctx.beginPath();
		this.ctx.lineWidth=border;
		this.ctx.strokeStyle = color;
		this.ctx.moveTo(x1,y1);
		
		if(sPoints!=''){
			
			var tPoints=sPoints.split(';');
			for(var i=0;i<tPoints.length;i++){
				var tPoint=tPoints[i].split(':');
				var xPoint=tPoint[0];
				var yPoint=tPoint[1];
				
				this.ctx.lineTo(xPoint,yPoint);
				
				if(i==iSelectedPointId){
					this.ctx.fillRect(xPoint-5,yPoint-5,10,10,'#880000');
					
				}
			}
			
		}
		
		this.ctx.lineTo(x2,y2);
		this.ctx.stroke();
	},
	arrow: function(x1,y1,x2,y2,strokeStyle,lineWidth){
		
		this.ctx.beginPath();
		this.ctx.lineWidth=lineWidth;
		this.ctx.strokeStyle = strokeStyle;
		this.ctx.moveTo(x1,y1);
		this.ctx.lineTo(x2,y2);
		
		this.ctx.stroke();
		
		this.fillRect(x2-3,y2-3,6,6,strokeStyle);
	}
	,
	drawRect : function(x,y,ilargeur,ihauteur,lineWidth,strokeStyle,fillStyle){

		var sSvg='<rect class="chartRect" id="rect'+x+''+y+'" x="'+x+'" y="'+y+'" width="'+ilargeur+'" height="'+ihauteur+'" style="fill:'+fillStyle+';stroke-width:'+lineWidth+';stroke:'+strokeStyle+'"></rect>';
			
		this.addObject(sSvg);


	},
	fillRect : function(x,y,ilargeur,ihauteur,fond){

		var sSvg='<rect class="chartRect" id="rect'+x+''+y+'" x="'+x+'" y="'+y+'" width="'+ilargeur+'" height="'+ihauteur+'" style="fill:'+fond+'"></rect>';
			
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


		var sSvg='<rect class="chartRect" id="rect'+x+''+y+'" x="'+x+'" y="'+y+'" width="'+ilargeur+'" height="'+ihauteur+'" style="stroke-width:'+width+';stroke:'+contour+'"></rect>';
			
		this.addObject(sSvg);

	}
	,
	drawBdd:function(x,y,ilargeur,ihauteur,lineWidth,strokeStyle,fillStyle){
		
		
		var sSvg=''; 
		sSvg+='<rect class="chartRect" id="rect'+x+''+y+'" x="'+x+'" y="'+y+'" width="'+ilargeur+'" height="'+ihauteur+'" style="fill:'+fillStyle+';stroke-width:'+lineWidth+';stroke:'+strokeStyle+'"></rect>';
		sSvg+='<ellipse cx="'+(x+(ilargeur/2))+'" cy="'+y+'" rx="'+ilargeur/2+'" ry="10" style="fill:'+fillStyle+';stroke:'+strokeStyle+';stroke-width:'+lineWidth+'" />';
		sSvg+='<ellipse cx="'+(x+(ilargeur/2))+'" cy="'+(y+ihauteur)+'" rx="'+ilargeur/2+'" ry="10" style="fill:'+fillStyle+';stroke:'+strokeStyle+';stroke-width:'+lineWidth+'" />';
		
		
		
		
		this.addObject(sSvg);
		return;
		
		this.ctx.lineWidth=lineWidth;
		this.ctx.strokeStyle=strokeStyle;
		this.ctx.fillStyle=fillStyle;
		
		var hauteurEllipse=10;
		 
		//this.line(x,y,x,y+ihauteur);
		//this.line(x+ilargeur,y,x+ilargeur,y+ihauteur);
				
		var centerX=x+(ilargeur/2);
		var centerY=y;
		
		var width=ilargeur;
		var height=5;
		
		x=parseFloat(x);
		y=parseFloat(y);
		ilargeur=parseFloat(ilargeur);
		ihauteur=parseFloat(ihauteur);
				
		//fond
		this.ctx.beginPath();
		
			this.ctx.moveTo(x,y);
			this.ctx.bezierCurveTo(
							x,y-hauteurEllipse,
							x+ilargeur,y-hauteurEllipse,
							x+ilargeur,y
			);
									
			this.ctx.moveTo(x+ilargeur,y);
			this.ctx.lineTo(x+ilargeur,y+ihauteur);
			
			this.ctx.moveTo(x,y);
			this.ctx.lineTo(x,y+ihauteur);
			
			this.ctx.moveTo(x+ilargeur,y);
			this.ctx.lineTo(x+ilargeur,y+ihauteur);
			
			this.ctx.moveTo(x+ilargeur,y+ihauteur	);
			this.ctx.bezierCurveTo(
							x+ilargeur,y+ihauteur+hauteurEllipse,
							x,y+hauteurEllipse+ihauteur,
							x,y+ihauteur
			);					
								
			this.ctx.moveTo(x,y+ihauteur);
									
			this.ctx.lineTo(x,y+ihauteur);
			this.ctx.moveTo(x,y);
		
			this.ctx.fillRect(x,y,ilargeur,ihauteur);
			
			this.ctx.fill();
		
		this.ctx.closePath();
		
		//trait
		
		this.ctx.beginPath();
			this.ctx.moveTo(x,y);
			this.ctx.bezierCurveTo(
									x,y+hauteurEllipse,
									x+ilargeur,y+hauteurEllipse,
									x+ilargeur,y
									);
			this.ctx.moveTo(x,y);
			this.ctx.bezierCurveTo(
									x,y-hauteurEllipse,
									x+ilargeur,y-hauteurEllipse,
									x+ilargeur,y
									);
			
			this.ctx.moveTo(x,y+ihauteur);
			this.ctx.bezierCurveTo(
									x,y+hauteurEllipse+ihauteur,
									x+ilargeur,y+hauteurEllipse+ihauteur,
									x+ilargeur,y+ihauteur
									);
									
			this.ctx.moveTo(x,y);
			this.ctx.lineTo(x,y+ihauteur);
			
			this.ctx.moveTo(x+ilargeur,y);
			this.ctx.lineTo(x+ilargeur,y+ihauteur);
			
			this.ctx.stroke();
		
		this.ctx.closePath();
 		
 		
		  
 	}
	
	,
	fillText:function(x,y,texte,couleur,size){
		console.log('txt:'+couleur);
		if(!couleur){
			couleur='#000000';
		}
		
		var sSvg='<text x="'+x+'" y="'+y+'" fill="'+couleur+'">'+texte+'</text>';
		
		this.addObject(sSvg);
		
		return;
		
		this.ctx.font=size+"px Arial";
		this.ctx.textBaseline = 'top';
		this.ctx.fillStyle=couleur;
		this.ctx.fillText(texte,x,y);
	}
	,
	drawLosange: function (x,y,ilargeur,ihauteur,lineWidth,strokeStyle,fillStyle) {

		// fond='#222222';

		this.ctx.lineWidth=lineWidth;
		
		this.ctx.beginPath();
		this.ctx.moveTo(x,y+(ihauteur/2) );

		//_context.closePath();
		this.ctx.lineTo(x+(ilargeur/2),y);
		this.ctx.lineTo(x+(ilargeur/1),y+(ihauteur/2));
		this.ctx.lineTo(x+(ilargeur/2),y+(ihauteur/1));
		this.ctx.lineTo(x,y+(ihauteur/2));


		this.ctx.strokeStyle = strokeStyle;
		this.ctx.stroke();

		this.ctx.fillStyle=fillStyle;
		this.ctx.fill();

		this.ctx.closePath();


	}
	,
	drawImage: function (img,x,y,width,height){
		this.ctx.drawImage(img,x,y ,width,height  );
	}
	,
	drawImage2: function (img,x,y,width,height,x2,y2,width2,height2){
		this.ctx.drawImage(img,x,y ,width,height,x2,y2,width2,height2  );
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
