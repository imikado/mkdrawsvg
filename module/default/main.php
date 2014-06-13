<?php 
class module_default extends abstract_module{
	
	public function before(){
		$this->oLayout=new _layout('html5');
	}
	
	public function _add(){
		$oSchema=new row_schema;
		$oSchema->title='Nouveau shema';
		$oSchema->save();
		
		_root::redirect('default::index');
		
	}
	
	public function _index(){
		$tSchema=model_schema::getInstance()->findAll();
		
		$oView=new _view('default::list');
		$oView->tSchema=$tSchema;
		
		
		
		$this->oLayout->add('main',$oView);
	}
	
	public function _schema(){
		
		$tObject=null;
		$tMenuLayerObject=null;
		
		$oSchema=model_schema::getInstance()->findById(_root::getParam('id'));
		if($oSchema){
			$this->processSave($oSchema);
			
			$tObject=$oSchema->tObject;
			$tMenuLayerObject=$oSchema->tMenuLayerObject;
		}
		
		
	    $oView=new _view('default::index');
		$oView->tObject=html_entity_decode($tObject);
		$oView->tMenuLayerObject=html_entity_decode($tMenuLayerObject);
		
		$this->oLayout->add('main',$oView);
	}
	private function processSave($oSchema){
		if(!_root::getRequest()->isPost()){
			return;
		}
		
		$oSchema->tObject=_root::getParam('tObject');
		$oSchema->tMenuLayerObject=_root::getParam('tMenuLayerObject');
		$oSchema->save();
		
		//var_dump($oSchema);exit;
		
		_root::redirect('default::schema',array('id'=>$oSchema->id));
	}
	
	public function after(){
		$this->oLayout->show();
	}
}
