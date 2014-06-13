<?php
class module_webservice{
	
	public function _index(){
		ini_set("soap.wsdl_cache_enabled","0");

		$oPluginWsdl=new plugin_wsdl;
		$oPluginWsdl->setName('mkdraw');
		$oPluginWsdl->setUrl('http://localhost/mkf4builder/data/genere/mkdraw/public/webservice.php');
		$oPluginWsdl->addFunction('setContent');
			$oPluginWsdl->addParameter('id','int');
			$oPluginWsdl->addParameter('tObject','string');
			$oPluginWsdl->addParameter('tMenuLayerObject','string');
			$oPluginWsdl->addReturn('return','string');
			$oPluginWsdl->addReturn('ok','int');
			
		
		if(isset($_GET['WSDL'])) {
			
			
			$oPluginWsdl->show();
			
			
		}else {
			
			$oServer = new SoapServer( 'http://localhost/mkf4builder/data/genere/mkdraw/public/webservice.php?WSDL', array('cache_wsdl' => WSDL_CACHE_NONE));					
			$oServer->setClass('webservice');
			$oServer->handle();
			
			
		}
		exit;
	}
}
class webservice{
	public function setContent($id,$tObject,$tMenuLayerObject){
		 
		$oSchema=model_schema::getInstance()->findById($id);
		$oSchema->tObject=$tObject;
		$oSchema->tMenuLayerObject=$tMenuLayerObject;
		$oSchema->save();
		 
		return array('return'=>'test','ok'=>1);
		
	}
}


 
