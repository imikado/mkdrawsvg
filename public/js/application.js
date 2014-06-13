var oApplication;


function Application(){
	this.idLayer=1;
	this.idObject=1;
	this.tLayer=Array();
	this.idLayerSelected=-1;
	this.tData=Array();
	this.oCanvasTmp;
	this.processing=0;
	this.tmpX='';
	this.tmpY='';
	
	this.tObject=Array();
	
	this.tMenuLayer=Array();
	this.tMenuLayerObject=Array();
	
	this.pointIdSelected='';
}
Application.prototype={
	
	load:function(){
		this.oCanvasTmp=new Canvas('canvas_tmp');
	},
	buildLayer:function(idLayer){
		oApplication.tLayer[idLayer].clear();
		
		var iLength=this.tMenuLayerObject[idLayer].length-1;
		
		for(var i=iLength;i>=0;i--){
			var tmpObj=this.getObject(this.tMenuLayerObject[idLayer][i]);
			if(tmpObj && tmpObj.visible==1){
				tmpObj.build();
			}
		}
		/*
		for(var i=0;i< this.tObject.length;i++){
			if(this.tObject[i] && this.tObject[i].idLayer==idLayer && this.tObject[i].visible==1 ){
				this.tObject[i].build();
			}
		}*/
	},
	deleteIdObjectFromLayerObject:function(idObject,idLayer){
				
		this.clearMenuObject(idLayer);
		
		var tmpLayerObject=Array();
		
		for(var i=0;i<this.tMenuLayerObject[idLayer].length;i++){
			if(!this.tMenuLayerObject[idLayer][i]){ continue;}
			
			var tmpObject=this.getObject(this.tMenuLayerObject[idLayer][i]);
			
			if(idObject!= tmpObject.id){
				
				tmpLayerObject.push(this.tMenuLayerObject[idLayer][i]);
				
			}
		}
		
		this.tMenuLayerObject[idLayer]=tmpLayerObject;
		
		
		this.builListMenuLayerObject(idLayer);
		
	},
	moveObjetToLayer:function(idObject,idLayer){
		
		var oObject=this.getObject(idObject);
		
		//on supprime l'objet de la liste des layers object precendents
		this.deleteIdObjectFromLayerObject(oObject.id,oObject.idLayer);
		
		oObject.idLayer=idLayer;
		
		if(!oApplication.tMenuLayerObject[idLayer]){
			oApplication.tMenuLayerObject[idLayer]=Array();
		}
		
		oApplication.tMenuLayerObject[idLayer].unshift(idObject);
		
		this.clearMenuObject(idLayer);
		this.builListMenuLayerObject(idLayer);
	},
	showHideLayer:function(idLayer){
		var a=getById('checkbox_'+idLayer);
		if(a){
			var b=getById('canvas_'+idLayer);
			
			if(a.checked){
				b.style.visibility='visible';
			}else{
				b.style.visibility='hidden';
			}
		}
	},
	showHideObject:function(idObject){
		var a=getById('checkbox_object_'+idObject);
		if(a){
			var oObject=this.getObject(idObject);
			
			if(a.checked){
				oObject.visible=1;
			}else{
				oObject.visible=0;
			}
			
			this.buildLayer(oObject.idLayer);
		}
		
	},
	deselectLayer:function(){
		var a=getById('layer_'+this.idLayerSelected);
		if(a){
			a.className='layer';
		}
		this.idLayerSelected=-1;
	},
	selectLayer:function(idLayer){
		this.deselectLayer();
		this.deselectObject();
		this.clearForm();
		
		this.idLayerSelected=idLayer;
		var a=getById('layer_'+idLayer);
		if(a){
			a.className='layerSelected';
		}
		
		var a=getById('tEdit');
		if(a){
			a.innerHTML='';
		}
		for(var i=0;i<this.tObject.length;i++){
			if(!this.tObject[i]){ continue; }
			if(this.tObject[i].idLayer==idLayer && (this.tObject[i].type=="carre" || this.tObject[i].type=="bdd") ){
				
				this.tObject[i].enableEdit();
			}
			
		}
	},
	deselectObject:function(){
		var a=getById('layerObject_'+this.idObjectSelected);
		if(a){
			a.className='layerObject';
		}
		this.idObjectSelected=-1;
	},
	selectObject:function(idObject){
		var b=getById('edit_'+this.idObjectSelected);
		if(b){
			b.className='edit';
		}
		
		this.deselectLayer();
		this.deselectObject();
		this.clearForm();
		
		
		
		this.idObjectSelected=idObject;
		var a=getById('layerObject_'+idObject);
		if(a){
			a.className='layerObjectSelected';
		}
		
		this.loadForm(idObject);
		
		var b=getById('edit_'+idObject);
		if(b){
			b.className='editClicked';
		}
	},
	selectPoint:function(idPoint){
		this.pointIdSelected=idPoint;
		
		var oLink=this.getObject(this.idObjectSelected);
		oApplication.buildLayer(oLink.idLayer);
		
		oApplication.clearForm();
		this.pointIdSelected=idPoint;
		oApplication.loadForm(this.idObjectSelected);
	},
	deletePoint:function(idPoint){
		var oLink=this.getObject(this.idObjectSelected);
		var tPoint=oLink.points.split(';');
		tPoint[idPoint]='';
		oLink.points=tPoint.join(';');
		
		oApplication.buildLayer(oLink.idLayer);
		
		oApplication.clearForm();
		this.pointIdSelected=idPoint;
		oApplication.loadForm(this.idObjectSelected);
	},
	
	deselectPoint:function(){
		this.pointIdSelected='';
	},
	updateTexte:function(a){
		var sText=prompt('Choisir libelle',a.innerHTML);
		a.innerHTML='&nbsp;'+sText+'&nbsp;';
	},
	addLayer:function(){
		this.addMenuLayer(this.idLayer);
		
		var sCanvas='<div class="canvas" id="canvas_'+this.idLayer+'" style="visibility:visible" width="900px" height="800px"></div>';
		
		this.addContent('tCanvas',sCanvas);
		
		
		this.tLayer[this.idLayer]=new Canvas('canvas_'+this.idLayer);
		
		this.tLayer[this.idLayer].fillText(0,0,'Nouveau calque '+this.idLayer,'#000');
		
		this.selectLayer(this.idLayer);
		
		this.idLayer++;
	},
	addMenuLayer:function(idLayer){
		console.log('layer '+idLayer);
		
		var sLayer='<p class="layer" id="layer_'+idLayer+'" >';
		
		sLayer+='<a style="float:left;margin-right:4px;padding:2px" href="" onclick="oApplication.showHideMenuObject('+idLayer+');return false;" >[+]</a>';
		
		sLayer+='<input onclick="oApplication.showHideLayer('+idLayer+')" id="checkbox_'+idLayer+'" type="checkbox" checked="checked"/>';
		
		sLayer+='<a href="#" style="padding-right:37px" onclick="oApplication.selectLayer('+idLayer+');return false;" >Calque '+idLayer+'</a>';
		sLayer+=' : ';
		sLayer+='<a href="#" onclick="oApplication.updateTexte(this);return false">commentaire</a>';
		
		sLayer+='</p>';
		
		sLayer+='<div id="objectLayer_'+idLayer+'"></div>';
		
		this.addContent('menudrawContent',sLayer);
		
		
	},
	duplicateObject:function(idObject){
		//on recupere l'objet à dupliquer
		var oTmpData=this.getObject(idObject);
		
		//on cree un nouvel objet
		var oNewData=new Data(oTmpData.type,oTmpData.idLayer);
		//que l'on decale de 10, afin de le voir
		oNewData.x=oTmpData.x+10;
		
		//liste des propriétés à copier
		var tColumn=Array(
					'strokeStyle',
					'fillStyle',
					'width',
					'height',
					'from',
					'comment',
					'to',
					'lineWidth',
					'y',
					'x2',
					'y2',
					'texte',
					'size',
					'info',
					'relativeObject',
					'relativeX',
					'relativeY',
					'textAlign',
					'strokeStyleText',
					'fromPosition',
					'toPosition'
			
				);
		
		//on boucle sur ce tableau pour copier les propriétés
		//sur le nouvel objet
		for(var i=0;i<tColumn.length;i++){
			oNewData[tColumn[i] ]=oTmpData[tColumn[i] ];
		}
		//on demande à l'afficher.
		oNewData.build();
		
		this.addLayerObject(oTmpData.idLayer,oNewData);
		
		this.selectObject(oNewData.id);
		
	},
	showHideMenuObject:function(idLayer){
		var a=getById('objectLayer_'+idLayer);
		if(a){
			if(a.style.display=='none'){
				a.style.display='block';
			}else{
				a.style.display='none';
			}
			
		}
	}
	,
	clearMenuObject:function(idLayer){
		var a=getById('objectLayer_'+idLayer);
		if(a){
			a.innerHTML='';
		}
	},
	addLayerObject:function(idLayer){
		//this.addMenuLayerObject(idLayer,oObject);
		this.clearMenuObject(idLayer);
		this.builListMenuLayerObject(idLayer);
	},
	addMenuLayerObject:function(idLayer,oObject,i,iLength){
		
		var sName='layerObject';
		if(this.idObjectSelected==oObject.id){
			sName='layerObjectSelected';
		}
		
		var sHtml='<p class="'+sName+'" id="layerObject_'+oObject.id+'">';
		sHtml+='<input onclick="oApplication.showHideObject('+oObject.id+')" id="checkbox_object_'+oObject.id+'" type="checkbox" checked="checked"/>';
		
		sHtml+='<a href="#" onclick="oApplication.selectObject('+oObject.id+');return false;">&nbsp;'+oObject.type+' #'+oObject.id+'&nbsp;';
		
		sHtml+='&nbsp;';
		sHtml+=oObject.comment+'</a>';
		
		if(i!=0){
			sHtml+=' <a href="#"  style="float:right" onclick="oApplication.moveLayerObjectUp('+oObject.id+');return false;"><img src="css/images/up.png"/></a>';
		}else{
			sHtml+=' <a href="#" style="float:right" onclick="oApplication.moveLayerObjectUp('+oObject.id+');return false;"><img src="css/images/upOff.png"/></a>';
		}
		if(i!=iLength-1){
			sHtml+=' <a href="#" style="float:right" onclick="oApplication.moveLayerObjectDown('+oObject.id+');return false;"><img src="css/images/down.png"/></a>';
		}else{
			sHtml+=' <a href="#" style="float:right" onclick="oApplication.moveLayerObjectDown('+oObject.id+');return false;"><img src="css/images/downOff.png"/></a>';
		}
		sHtml+='</p>';
		
		this.addContent('objectLayer_'+idLayer,sHtml);
		
	},
	moveLayerObjectUp:function(idObject){
		this.selectObject(idObject);
		
		var oObject=this.getObject(idObject);
		
		this.clearMenuObject(oObject.idLayer);
		
		for(var i=0;i<this.tMenuLayerObject[oObject.idLayer].length;i++){
			if(!this.tMenuLayerObject[oObject.idLayer][i]){ continue;}
			
			var tmpObject=this.getObject(this.tMenuLayerObject[oObject.idLayer][i]);
			
			if(idObject== tmpObject.id){
				var twistId=this.tMenuLayerObject[oObject.idLayer][i-1];
				
				this.tMenuLayerObject[oObject.idLayer][i-1]=this.tMenuLayerObject[oObject.idLayer][i];
				this.tMenuLayerObject[oObject.idLayer][i]=twistId;
				
			}
		}
		
		this.builListMenuLayerObject(oObject.idLayer);
		
		
		
	},
	moveLayerObjectDown:function(idObject){
		this.selectObject(idObject);
		
		var oObject=this.getObject(idObject);
		
		this.clearMenuObject(oObject.idLayer);
		var process=0;
		for(var i=0;i<this.tMenuLayerObject[oObject.idLayer].length;i++){
			if(!this.tMenuLayerObject[oObject.idLayer][i]){ continue;}
			
			var tmpObject=this.getObject(this.tMenuLayerObject[oObject.idLayer][i]);
			
			if(idObject== tmpObject.id && process==0){
				var twistId=this.tMenuLayerObject[oObject.idLayer][i+1];
				
				this.tMenuLayerObject[oObject.idLayer][i+1]=this.tMenuLayerObject[oObject.idLayer][i];
				this.tMenuLayerObject[oObject.idLayer][i]=twistId;
				
				process=1;
			}
		}
		
		this.builListMenuLayerObject(oObject.idLayer);
		
		
		
	},
	builListMenuLayerObject:function(idLayer){
		
		var iLength=this.tMenuLayerObject[idLayer].length;
		
		for(var i=0;i<iLength;i++){
			if(!this.tMenuLayerObject[idLayer][i]){ continue;}
			var tmpObject=this.getObject(this.tMenuLayerObject[idLayer][i]);
			
			this.addMenuLayerObject(tmpObject.idLayer,tmpObject,i,iLength);
		}
		
		this.buildLayer(idLayer);

	},
	addContent:function(id,sText){
		var oTmp=document.createElement('div');
		oTmp.innerHTML=sText;
		
		var a=getById(id);
		if(a){
			a.appendChild(oTmp);
		}
	},
	setContent:function(id,sText){
		
		var a=getById(id);
		if(a){
			a.innerHTML=sText;
		}
	},
	click:function(e){
		var x=this.getXmouse(e);
		var y=this.getYmouse(e);
			console.log('clic');
		this.draw(x,y);
		
		
	},
	mousemove:function(e){
		var x=this.getXmouse(e);
		var y=this.getYmouse(e);
		
		var iWidth=(x-this.tmpX);
		var iHeight=(y-this.tmpY);
		
		
		if(this.processing){
			this.clearCanvasTmp();
			if(this.drawType=='carre'){
				this.oCanvasTmp.drawRectStroke(this.tmpX,this.tmpY,iWidth,iHeight,'green');
			}else if(this.drawType=='ligne'){
				this.oCanvasTmp.line(this.tmpX,this.tmpY,x,y,'green',2);
			}else if(this.drawType=='fleche'){
				this.oCanvasTmp.line(this.tmpX,this.tmpY,x,y,'green',2);
			}else if(this.drawType=='bdd'){
				this.oCanvasTmp.drawBdd(this.tmpX,this.tmpY,iWidth,iHeight,1,'green','#fff');
			}else if(this.drawType=='losange'){
				this.oCanvasTmp.drawLosange(this.tmpX,this.tmpY,iWidth,iHeight,1,'green','#fff');
			}
			
			
		}
	},
	clearCanvasTmp:function(){
		this.oCanvasTmp.clear();
	},
	getXmouse:function(e){
		if(e && e.x!=null && e.y!=null){
			return e.x +document.body.scrollLeft;
		}else{
			return e.clientX +document.body.scrollLeft;
		}
	},
	getYmouse:function(e){
		if(e && e.x!=null && e.y!=null){
			return e.y + document.body.scrollTop;
		}else{
			return e.clientY + document.body.scrollTop;
		}
	},
	draw:function(x,y){
		if(this.idObjectSelected > -1){
			this.drawType=this.getObject(this.idObjectSelected).type;
			if(this.drawType=='link'){
				var oLink=this.getObject(this.idObjectSelected);
				
				if(this.pointIdSelected===''){
					oLink.points+=x+':'+y+';';
				}else{
					
					var tPoints=oLink.points.split(';');
					tPoints[this.pointIdSelected]=x+':'+y+';';
					
					oLink.points=tPoints.join(';');
					
				}
				
				var tmpSelectedPointId=this.pointIdSelected;
				
				oApplication.buildLayer(oLink.idLayer);
				oApplication.clearForm();
				this.pointIdSelected=tmpSelectedPointId;
				oApplication.loadForm(oLink.id);
				return;
			}else if(this.processing==0){
				
				
				if(this.drawType=='texte'){
					this.getObject(this.idObjectSelected).updateCoord(x,y,0,0);
					
					this.clearCanvasTmp();
				
					this.clearType();
					return;
				}else if(this.drawType=='carre' || this.drawType=='bdd' || this.drawType=='losange'){
					var oCarre=this.getObject(this.idObjectSelected);
					oCarre.x=x
					oCarre.y=y;
					oApplication.buildLayer(oCarre.idLayer);
					
					oApplication.clearForm();
					oApplication.loadForm(oCarre.id);
					
					oCarre.enableEdit();
					
					this.clearCanvasTmp();
				
					this.clearType();
					return;
				}
				
				this.tmpX=x;
				this.tmpY=y;
				
				this.processing=1;
				
				return;
			}else{
				this.processing=0;
				this.getObject(this.idObjectSelected).updateCoord(this.tmpX,this.tmpY,x,y);
				
				this.clearCanvasTmp();
				
				this.clearType();
			}
			
			return;
		}else if(this.idLayerSelected==-1){
			alert('Selectionnez un calque pour dessiner');
			return;
		}
		
		if(this.drawType=='bdd' & this.processing==0){
			
			this.tmpX=x;
			this.tmpY=y;
			
			this.processing=1;
			
			return;
			
		}else if(this.drawType=='bdd' & this.processing==1){
			this.processing=0;
			
			var iWidth=(x-this.tmpX);
			var iHeight=(y-this.tmpY);
			
			var oData=new Data(this.drawType,this.idLayerSelected);
			oData.x=this.tmpX;
			oData.y=this.tmpY;
			oData.width=iWidth;
			oData.height=iHeight;
			
			oData.lineWidth=1;
			oData.fillStyle='#ffffff';
			oData.strokeStyle='#222222';
			
			oData.build();
			
			this.addLayerObject(this.idLayerSelected,oData);
			
			this.clearCanvasTmp();
		}else if(this.drawType=='carre' & this.processing==0){
			
			this.tmpX=x;
			this.tmpY=y;
			
			this.processing=1;
			
			return;
			
		}else if(this.drawType=='carre' & this.processing==1){
			this.processing=0;
			
			var iWidth=(x-this.tmpX);
			var iHeight=(y-this.tmpY);
			
			var oData=new Data(this.drawType,this.idLayerSelected);
			oData.x=this.tmpX;
			oData.y=this.tmpY;
			oData.width=iWidth;
			oData.height=iHeight;
			
			oData.lineWidth=1;
			oData.fillStyle='#ffffff';
			oData.strokeStyle='#222222';
			
			oData.build();
			
			this.addLayerObject(this.idLayerSelected,oData);
			
			this.clearCanvasTmp();
			
		}else if(this.drawType=='losange' & this.processing==0){
			
			this.tmpX=x;
			this.tmpY=y;
			
			this.processing=1;
			
			return;
			
		}else if(this.drawType=='losange' & this.processing==1){
			this.processing=0;
			
			var iWidth=(x-this.tmpX);
			var iHeight=(y-this.tmpY);
			
			var oData=new Data(this.drawType,this.idLayerSelected);
			oData.x=this.tmpX;
			oData.y=this.tmpY;
			oData.width=iWidth;
			oData.height=iHeight;
			
			oData.lineWidth=1;
			oData.fillStyle='#ffffff';
			oData.strokeStyle='#222222';
			
			oData.build();
			
			this.addLayerObject(this.idLayerSelected,oData);
			
			this.clearCanvasTmp();
		
		}else if( (this.drawType=='ligne' || this.drawType=='fleche' ) && this.processing==0){
			
			this.tmpX=x;
			this.tmpY=y;
			
			this.processing=1;
			
			return;
			
		}else if( (this.drawType=='ligne' || this.drawType=='fleche' ) && this.processing==1){
			this.processing=0;
			
			
			var oData=new Data(this.drawType,this.idLayerSelected);
			oData.x=this.tmpX;
			oData.y=this.tmpY;
			oData.x2=x;
			oData.y2=y;
			
			oData.lineWidth=1;
			oData.strokeStyle='#222222';
			
			oData.build();
			
			this.addLayerObject(this.idLayerSelected,oData);
			
			this.clearCanvasTmp();
			
		}else if(this.drawType=='texte'){
			var sText=prompt('Indiquez le texte');
			if(sText==''){
				return;
			}
			
			var oData=new Data(this.drawType,this.idLayerSelected);
			oData.x=x;
			oData.y=y;
			oData.strokeStyle='#222222';
			oData.texte=sText;
			oData.size=12;
			oData.build();
			
			this.addLayerObject(this.idLayerSelected,oData);
			
		}else if(this.drawType=='link'){
			var oData=new Data(this.drawType,this.idLayerSelected);
			oData.build();
			
			this.addLayerObject(this.idLayerSelected,oData);
			
			this.selectObject(oData.id);
		}else{
			this.clearType();
			return;
		}
		
		this.tData.push(oData);
		
		this.clearType();
	},
	getLayerSelected:function(){
		return this.tLayer[this.idLayerSelected];
	},
	chooseType:function(sType){
		if(this.idLayerSelected==-1){
			alert('Selectionnez un calque');
			return;
		}
		
		this.clearType();
		
		this.drawType=sType;
		
		var a=getById('btn_'+this.drawType);
		if(a){
			a.className='btnSelected';
		}
		
		
	},
	clearType:function(){
		var a=getById('btn_'+this.drawType);
		if(a){
			a.className='btn';
		}
		
		this.drawType='';
		
		
	},
	getObject:function(id){
		return oApplication.tObject[id];
	},
	clearForm:function(){
		this.pointIdSelected='';
		this.setContent('formEdit','');
	},
	loadForm:function(id){
		this.addContent('formEdit',this.getObject(id).getForm() );
	},
	reloadForm:function(id){
		this.clearForm();
		this.addContent('formEdit',this.getObject(id).getForm() );
	},
	updateObject:function(id,field,value){
		this.getObject(id).update(field,value);
		
		this.getObject(id).enableEdit();
	},
	updateInfo:function(id){
		this.getObject(id).updateInfo();
	},
	showHideFormPart:function(i){
		var a=getById('form_part_'+i);
		if(a){
			if(a.style.display=='none'){
				a.style.display='block';
			}else{
				a.style.display='none';
			}
			
		}
		
	}
	
}; 


oApplication=new Application;
