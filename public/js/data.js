function Data(type,idLayer){
	this.type=type;
	this.idLayer=idLayer;
	this.x;
	this.y;
	this.x2;
	this.y2;
	
	this.texte='';
	this.textAlign='left';
	this.id=oApplication.idObject;
	this.size=11;
	this.visible=1;
	
	this.fillStyle='#ffffff';
	this.lineWidth=2;
	this.strokeStyle='#000000';
	this.strokeStyleText='#000000';
	
	
	this.from;
	this.to;
	
	this.fromPosition='center';
	this.toPosition='center';
	
	this.comment='comment';
	
	this.info='';
	
	this.relativeObject='';
	
	this.relativeX=0;
	this.relativeY=0;
	
	this.points='';
	
	oApplication.tObject[this.id]=this;
	
	oApplication.idObject++;
	
	if(!oApplication.tMenuLayerObject[idLayer]){
		oApplication.tMenuLayerObject[idLayer]=Array();
	}
	
	
	oApplication.tMenuLayerObject[idLayer].unshift(this.id);
	 
	
}
Data.prototype={
	build:function(){
		
		if(this.relativeObject!=''){
			var tmpRelativeObject=oApplication.getObject(this.relativeObject);
			if(tmpRelativeObject){
				this.x=this.relativeX+tmpRelativeObject.x;
				this.y=this.relativeY+tmpRelativeObject.y;
			}
		}
		
		if(this.type=='carre'){
			oApplication.tLayer[this.idLayer].drawRect(this.x,this.y,this.width,this.height,this.lineWidth,this.strokeStyle,this.fillStyle);
			oApplication.tLayer[this.idLayer].fillTextAlign(this.x,this.y+10,this.texte,this.textAlign,this.width,this.height,this.strokeStyleText,this.size);
		}else if(this.type=='texte'){
			oApplication.tLayer[this.idLayer].fillText(this.x,this.y,this.texte,this.strokeStyle,this.size);
		}else if(this.type=='ligne'){
			oApplication.tLayer[this.idLayer].line(this.x,this.y,this.x2,this.y2,this.strokeStyle,this.lineWidth);
		}else if(this.type=='fleche'){
			oApplication.tLayer[this.idLayer].arrow(this.x,this.y,this.x2,this.y2,this.strokeStyle,this.lineWidth);
		}else if(this.type=='bdd'){
			oApplication.tLayer[this.idLayer].drawBdd(this.x,this.y,this.width,this.height,this.lineWidth,this.strokeStyle,this.fillStyle);
			oApplication.tLayer[this.idLayer].fillTextAlign(this.x,this.y+10,this.texte,this.textAlign,this.width,this.height,this.strokeStyleText,this.size);
		}else if(this.type=='losange'){
			oApplication.tLayer[this.idLayer].drawLosange(this.x,this.y,this.width,this.height,this.lineWidth,this.strokeStyle,this.fillStyle);
			oApplication.tLayer[this.idLayer].fillTextAlign(this.x,this.y+(this.height/2)-10,this.texte,this.textAlign,this.width,this.height,this.strokeStyle,this.size);
		}else if(this.type=='link'){
			
			var oFrom=oApplication.getObject(this.from);
			var oTo=oApplication.getObject(this.to);
			console.log('build link from:'+this.from+' to:'+this.to);
			
			if(!oFrom || !oTo){
			}else if(this.points!=''){
				if(oApplication.pointIdSelected!==''){
					oApplication.tLayer[this.idLayer].linkPointWithSelected(oFrom,oTo,this.fromPosition,this.toPosition,this.points,oApplication.pointIdSelected,this.strokeStyle,this.lineWidth);
				}else{
					oApplication.tLayer[this.idLayer].linkPoint(oFrom,oTo,this.fromPosition,this.toPosition,this.points,this.strokeStyle,this.lineWidth);
				}
			}else{
				console.log('oFrom et oTo'+oFrom+' '+oTo);
				oApplication.tLayer[this.idLayer].link(oFrom,oTo,this.fromPosition,this.toPosition,this.strokeStyle,this.lineWidth);
				
			}
		}
		
		this.updateInfo();
	},
	update:function(field,value){
		this[field]=value;
		
		if(field=='relativeObject' && value!=''){
			var tmpRelativeObject=oApplication.getObject(value);
			this.relativeX=this.x-tmpRelativeObject.x;
			this.relativeY=this.y-tmpRelativeObject.y;
			
		}
		
		oApplication.buildLayer(this.idLayer);
	},
	updateCoord:function(lastX,lastY,x,y){
		if(this.type=='carre'){
			this.width=x-lastX;
			this.height=y-lastY;
			this.x=lastX;
			this.y=lastY;
			oApplication.buildLayer(this.idLayer);
		}else if(this.type=='bdd'){
		 
			this.x=lastX;
			this.y=lastY;
			oApplication.buildLayer(this.idLayer);
		}else if(this.type=='ligne'){
			this.x=lastX;
			this.y=lastY;
			this.x2=x;
			this.y2=y;
			oApplication.buildLayer(this.idLayer);
		}else if(this.type=='fleche'){
			this.x=lastX;
			this.y=lastY;
			this.x2=x;
			this.y2=y;
			oApplication.buildLayer(this.idLayer);
		}else if(this.type=='texte'){
			this.x=lastX;
			this.y=lastY;
			oApplication.buildLayer(this.idLayer);
		}
	},
	
	getForm:function(){
		var sHtml='';
		sHtml+='<p><strong>Commentaire</strong><input type="text" onKeyUp="oApplication.updateObject('+this.id+',\'comment\',this.value);oApplication.addLayerObject('+this.idLayer+');" value="'+this.comment+'"/>';
			sHtml+='<select onChange="oApplication.moveObjetToLayer('+this.id+',this.value)" >';
				for(var i=0;i< oApplication.tLayer.length;i++){
					if(!oApplication.tLayer[i]){ continue ; }
					sHtml+='<option ';
					if(i==this.idLayer){
						sHtml+='selected="selected" ';
					}
					sHtml+='value="'+i+'">Layer '+i+'</option>';
				}
			sHtml+='</select>';
		sHtml+='</p>';
		
		if(this.type=='carre' || this.type=='bdd' || this.type=='losange'){
			
			sHtml+='<p class="formPart"><a href="#" onclick="oApplication.showHideFormPart(1);return false;">Position</a></p>';
			
			
			sHtml+='<div id="form_part_1" style="display:none">';
				
				sHtml+='<table>';
				sHtml+='<tr>';
					sHtml+='<th>Width</th>';
					sHtml+='<td><input class="number" type="text" onKeyUp="oApplication.updateObject('+this.id+',\'width\',this.value)" value="'+this.width+'"/></td>';

					sHtml+='<th>Height</th>';
					sHtml+='<td><input class="number" type="text" onKeyUp="oApplication.updateObject('+this.id+',\'height\',this.value)" value="'+this.height+'"/></td>';
				sHtml+='</tr>';
				sHtml+='<tr>';
					sHtml+='<th>X</th>';
					sHtml+='<td><input class="number" type="text" onKeyUp="oApplication.updateObject('+this.id+',\'x\',this.value)" value="'+this.x+'"/></td>';

					sHtml+='<th>Y</th>';
					sHtml+='<td><input class="number" type="text" onKeyUp="oApplication.updateObject('+this.id+',\'y\',this.value)" value="'+this.y+'"/></td>';
				sHtml+='</tr>';

				sHtml+='<tr>';
					sHtml+='<th>Position</th>';
					sHtml+='<td colspan="3">';

						sHtml+='<select onchange="oApplication.updateObject('+this.id+',\'relativeObject\',this.value)">';
							sHtml+='<option value="">Fixe</option>';
							for(var i=0;i< oApplication.tObject.length;i++){
								if(!oApplication.tObject[i]){ continue; }
								if(oApplication.tObject[i].type=='carre' || oApplication.tObject[i].type=='bdd'){
									sHtml+='<option ';
									if(this.relativeObject==oApplication.tObject[i].id){
										sHtml+=' selected="selected"';
									}
									sHtml+=' value="'+oApplication.tObject[i].id+'">Relatif &agrave; '+oApplication.tObject[i].type+' #'+oApplication.tObject[i].id+' '+oApplication.tObject[i].comment+'</option>';
								}
							}
						sHtml+='</select>';

					sHtml+='</td>';
				sHtml+='</tr>';
				sHtml+='</table>';
			sHtml+='</div>';
			
			sHtml+='<p class="formPart"><a href="#" onclick="oApplication.showHideFormPart(2);return false;">Couleurs</a></p>';
			
			
			sHtml+='<div id="form_part_2" style="display:none">';
			
				sHtml+='<table>';
				sHtml+='<tr>';
					sHtml+='<th>couleur bord</th>';
					sHtml+='<td><input class="number" type="color" onChange="oApplication.updateObject('+this.id+',\'strokeStyle\',this.value)" value="'+this.strokeStyle+'"/></td>';

					sHtml+='<th>epaisseur</th>';
					sHtml+='<td><input class="number" type="text" onKeyUp="oApplication.updateObject('+this.id+',\'lineWidth\',this.value)" value="'+this.lineWidth+'"/></td>';
				sHtml+='</tr>';

				sHtml+='<tr>';
					sHtml+='<th>couleur fond</th>';
					sHtml+='<td><input class="number" type="color" onChange="oApplication.updateObject('+this.id+',\'fillStyle\',this.value)" value="'+this.fillStyle+'"/></td>';
				sHtml+='</tr>';

				sHtml+='</table>';
			sHtml+='</div>';
			
			sHtml+='<p class="formPart"><a href="#" onclick="oApplication.showHideFormPart(3);return false;">Texte</a></p>';
			
			sHtml+='<div id="form_part_3" style="display:none">';
			
				sHtml+='<table>';

				sHtml+='<tr>';
					sHtml+='<th>Texte</th>';
					sHtml+='<td colspan="3"><input class="texte" type="text" onKeyUp="oApplication.updateObject('+this.id+',\'texte\',this.value)" value="'+this.texte+'"/></td>';
				sHtml+='</tr>';

				sHtml+='<tr>';
					sHtml+='<th>couleur</th>';
					sHtml+='<td><input class="number" type="color" onChange="oApplication.updateObject('+this.id+',\'strokeStyleText\',this.value)" value="'+this.strokeStyleText+'"/></td>';


					sHtml+='<th>taille</th>';
					sHtml+='<td><input class="number" type="text" onKeyUp="oApplication.updateObject('+this.id+',\'size\',this.value)" value="'+this.size+'"/></td>';

				sHtml+='</tr>';

				sHtml+='<tr>';
					sHtml+='<th>Alignement</th>';
					sHtml+='<td>';
						sHtml+='<select onchange="oApplication.updateObject('+this.id+',\'textAlign\',this.value)">';
							sHtml+='<option '; if(this.textAlign=='left'){ sHtml+='selected="selected"'; } sHtml+=' value="left">Left</option>';
							sHtml+='<option '; if(this.textAlign=='center'){ sHtml+='selected="selected"'; } sHtml+='  value="center">Center</option>';
							sHtml+='<option '; if(this.textAlign=='right'){ sHtml+='selected="selected"'; } sHtml+='  value="right">right</option>';
						sHtml+='</select>';

					sHtml+='</td>';


				sHtml+='</tr>';

				sHtml+='</table>';
			sHtml+='</div>';
			
			sHtml+='<p class="formPart"><a href="#" onclick="oApplication.showHideFormPart(4);return false;">Information</a></p>';
			
			sHtml+='<div id="form_part_4" style="display:none">';
			
				sHtml+='<table>';
				sHtml+='<tr>';
				sHtml+='<td><textarea style="width:280px;height:80px" onKeyUp="oApplication.updateObject('+this.id+',\'info\',this.value);oApplication.updateInfo('+this.id+');">'+this.info+'</textarea></td>';
				sHtml+='</tr>';
				sHtml+='</table>';
			sHtml+='</div>';
			
		}else if(this.type=="texte"){
			sHtml+='<table>';
				sHtml+='<tr>';
					sHtml+='<th>X</th>';
					sHtml+='<td><input class="number" type="text" onKeyUp="oApplication.updateObject('+this.id+',\'x\',this.value)" value="'+this.x+'"/></td>';
				
					sHtml+='<th>Y</th>';
					sHtml+='<td><input class="number" type="text" onKeyUp="oApplication.updateObject('+this.id+',\'y\',this.value)" value="'+this.y+'"/></td>';
				sHtml+='</tr>';
				
				sHtml+='<tr>';
					sHtml+='<th>Texte</th>';
					sHtml+='<td colspan="3"><input class="texte" type="text" onKeyUp="oApplication.updateObject('+this.id+',\'texte\',this.value)" value="'+this.texte+'"/></td>';
				sHtml+='</tr>';
				
				sHtml+='<tr>';
					sHtml+='<th>couleur</th>';
					sHtml+='<td><input class="number" type="color" onChange="oApplication.updateObject('+this.id+',\'strokeStyle\',this.value)" value="'+this.strokeStyle+'"/></td>';
					
					
					sHtml+='<th>taille</th>';
					sHtml+='<td><input class="number" type="text" onKeyUp="oApplication.updateObject('+this.id+',\'size\',this.value)" value="'+this.size+'"/></td>';
				
				sHtml+='</tr>';
				
				
			sHtml+='</table>';
		}else if(this.type=='ligne' || this.type=='fleche'){
			sHtml+='<table>';
				sHtml+='<tr>';
					sHtml+='<th>X</th>';
					sHtml+='<td><input class="number" type="text" onKeyUp="oApplication.updateObject('+this.id+',\'x\',this.value)" value="'+this.x+'"/></td>';
				
					sHtml+='<th>Y</th>';
					sHtml+='<td><input class="number" type="text" onKeyUp="oApplication.updateObject('+this.id+',\'y\',this.value)" value="'+this.y+'"/></td>';
				sHtml+='</tr>';
				
				sHtml+='<tr>';
					sHtml+='<th>X2</th>';
					sHtml+='<td><input class="number" type="text" onKeyUp="oApplication.updateObject('+this.id+',\'x2\',this.value)" value="'+this.x2+'"/></td>';
				
					sHtml+='<th>Y2</th>';
					sHtml+='<td><input class="number" type="text" onKeyUp="oApplication.updateObject('+this.id+',\'y2\',this.value)" value="'+this.y2+'"/></td>';
				sHtml+='</tr>';
				
				sHtml+='<tr>';
					sHtml+='<th>couleur bord</th>';
					sHtml+='<td><input class="number" type="color" onChange="oApplication.updateObject('+this.id+',\'strokeStyle\',this.value)" value="'+this.strokeStyle+'"/></td>';
				
					sHtml+='<th>epaisseur</th>';
					sHtml+='<td><input class="number" type="text" onKeyUp="oApplication.updateObject('+this.id+',\'lineWidth\',this.value)" value="'+this.lineWidth+'"/></td>';
				sHtml+='</tr>';
			sHtml+='</table>';
		}else if(this.type=='link'){
			sHtml+='<table>';
				sHtml+='<tr>';
					sHtml+='<th>From </th>';
					sHtml+='<td>';
						sHtml+='<select onchange="oApplication.updateObject('+this.id+',\'from\',this.value)">';
							sHtml+='<option></option>';
							for(var i=0;i< oApplication.tObject.length;i++){
								if(!oApplication.tObject[i]){ continue; }
								if(oApplication.tObject[i].type=='carre' || oApplication.tObject[i].type=='bdd' || oApplication.tObject[i].type=='losange'){
									sHtml+='<option ';
									if(this.from==oApplication.tObject[i].id){
										sHtml+=' selected="selected"';
									}
									sHtml+=' value="'+oApplication.tObject[i].id+'">'+oApplication.tObject[i].type+' #'+oApplication.tObject[i].id+' '+oApplication.tObject[i].comment+'</option>';
								}
							}
						sHtml+='</select>';
						
					sHtml+='</td><td colspan="2">'
					
						var tPosition=[
							["left-top","top","right-top"],
							["left-center","center","right-center"],
							["left-bottom","bottom","right-bottom"],
						];
						
						for(var i=0;i<3;i++){
							for(var j=0;j<3;j++){
								sHtml+='<input type="radio" onclick="oApplication.updateObject('+this.id+',\'fromPosition\',this.value)" ';
								if(this.fromPosition==tPosition[i][j]){
									sHtml+='checked="checked"';
								}
								sHtml+='name="fromPosition" value="'+tPosition[i][j]+'"/>';
							}
							sHtml+='<br/>';
						}
					
					 
					sHtml+='</td>';
				sHtml+='</tr>';
				sHtml+='<tr>';
					sHtml+='<th>To </th>';
					sHtml+='<td>';
						sHtml+='<select onchange="oApplication.updateObject('+this.id+',\'to\',this.value)">';
							sHtml+='<option></option>';
							for(var i=0;i< oApplication.tObject.length;i++){
								if(!oApplication.tObject[i]){ continue; }
								if(oApplication.tObject[i].type=='carre' || oApplication.tObject[i].type=='bdd' || oApplication.tObject[i].type=='losange'){
									sHtml+='<option ';
									if(this.to==oApplication.tObject[i].id){
										sHtml+=' selected="selected"';
									}
									sHtml+=' value="'+oApplication.tObject[i].id+'">'+oApplication.tObject[i].type+' #'+oApplication.tObject[i].id+' '+oApplication.tObject[i].comment+'</option>';
								}
							}
						sHtml+='</select>';
						sHtml+='</td><td colspan="2">'
						var tPosition=[
							["left-top","top","right-top"],
							["left-center","center","right-center"],
							["left-bottom","bottom","right-bottom"],
						];
						
						for(var i=0;i<3;i++){
							for(var j=0;j<3;j++){
								sHtml+='<input type="radio" onclick="oApplication.updateObject('+this.id+',\'toPosition\',this.value)" ';
								if(this.toPosition==tPosition[i][j]){
									sHtml+='checked="checked"';
								}
								sHtml+='name="toPosition" value="'+tPosition[i][j]+'"/>';
							}
							sHtml+='<br/>';
						}
					sHtml+='</td>';
				sHtml+='</tr>';
				
				sHtml+='<tr>';
					sHtml+='<th>couleur bord</th>';
					sHtml+='<td><input class="number" type="color" onChange="oApplication.updateObject('+this.id+',\'strokeStyle\',this.value)" value="'+this.strokeStyle+'"/></td>';
				
					sHtml+='<th>epaisseur</th>';
					sHtml+='<td><input class="number" type="text" onKeyUp="oApplication.updateObject('+this.id+',\'lineWidth\',this.value)" value="'+this.lineWidth+'"/></td>';
				sHtml+='</tr>';
				
				sHtml+='<tr>';
					sHtml+='<th>Actions</th>';
					sHtml+='<td>';
						sHtml+='<input type="button" onclick="oApplication.updateObject('+this.id+',\'points\',\'\');oApplication.reloadForm('+this.id+');" value="Refresh link"/>';
					sHtml+='</td>';
				sHtml+='</tr>';
				
				if(this.points!=''){
				sHtml+='<tr>';
					sHtml+='<th>Points</th>';
					sHtml+='<td>';
					
					var tPoint=this.points.split(';');
					var j=1;
					for(var i=0;i<tPoint.length;i++){
						if(tPoint[i]==''){ continue; }
						sHtml+='<a ';
						if(oApplication.pointIdSelected===i){
							sHtml+='style="font-weight:bold" ';
						}
						sHtml+='href="#" onclick="oApplication.selectPoint('+i+');return false;">Point '+(j)+'</a> <a href="#" onclick="oApplication.deletePoint('+i+')">[remove]</a><br/>';
						j++;
					}
					
					sHtml+='</td>';
				sHtml+='</tr>';
				}
				
				
			sHtml+='</table>';
			
		}
		
		if(this.type=='carre' || this.type=='bdd' || this.type=='losange'){
			
			sHtml+='<p><input type="button" value="Dupliquer" onclick="oApplication.duplicateObject('+this.id+')" /></p>';
		}
		
	 
		return sHtml;
	},
	enableEdit:function(){
		
		var divEdit=getById('edit_'+this.id);
		if(divEdit){
			divEdit.style.top=(this.y-5)+'px';
			divEdit.style.left=(this.x+10)+'px';
			
		}else{
		
			var sHtml='';
			sHtml+='<div id="edit_'+this.id+'" onclick="oApplication.selectObject('+this.id+')"  class="edit" style="left:'+(this.x+10)+'px;top:'+(this.y-5)+'px;">';

			sHtml+='&nbsp;';

			sHtml+='</div>';

			oApplication.addContent('tEdit',sHtml);
		}
	},
	updateInfo:function(){
		
		
		if(this.info){
			var sDiv='';
			sDiv+='<div class="contenu">';
			sDiv+=this.info;
			sDiv+='</div>';

			var div=getById('bulleInfo_'+this.id);
			if(!div){
				console.log('creation div "bulleInfo_'+this.id+'" ');

				var sHtml='';
				sHtml+='<div id="bulleInfo_'+this.id+'" class="bulleInfo" style="left:'+(this.x-5)+'px;top:'+(this.y-5)+'px;">?';
				sHtml+=sDiv;
				sHtml+='</div>';

				oApplication.addContent('tInfo',sHtml);

				console.log('sHtml:'+sHtml);
			}else{
				div.style.top=(this.y-5)+'px';
				div.style.left=(this.x-5)+'px';
				div.innerHTML=sDiv;
			}
		}
		
		
	}
};
