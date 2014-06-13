<?php 
class module_schema extends abstract_module{
	
	public function before(){
		$this->oLayout=new _layout('template1');
		
		//$this->oLayout->addModule('menu','menu::index');
	}
	
	
	
	public function _index(){
	    //on considere que la page par defaut est la page de listage
	    $this->_list();
	}
	
	
	public function _list(){
		
		$tSchema=model_schema::getInstance()->findAll();
		
		$oView=new _view('schema::list');
		$oView->tSchema=$tSchema;
		
		
		
		$this->oLayout->add('main',$oView);
		 
	}

	
	
	public function _new(){
		$tMessage=$this->processSave();
	
		$oSchema=new row_schema;
		$oSchema=$this->fillRow($oSchema);
		
		$oView=new _view('schema::new');
		$oView->oSchema=$oSchema;
		
		
		
		$oPluginXsrf=new plugin_xsrf();
		$oView->token=$oPluginXsrf->getToken();
		$oView->tMessage=$tMessage;
		
		$this->oLayout->add('main',$oView);
	}

	
	
	public function _edit(){
		$tMessage=$this->processSave();
		
		$oSchema=model_schema::getInstance()->findById( _root::getParam('id') );
		$oSchema=$this->fillRow($oSchema);
		
		$oView=new _view('schema::edit');
		$oView->oSchema=$oSchema;
		$oView->tId=model_schema::getInstance()->getIdTab();
		
		
		
		$oPluginXsrf=new plugin_xsrf();
		$oView->token=$oPluginXsrf->getToken();
		$oView->tMessage=$tMessage;
		
		$this->oLayout->add('main',$oView);
	}

	
	
	public function _show(){
		$oSchema=model_schema::getInstance()->findById( _root::getParam('id') );
		
		$oView=new _view('schema::show');
		$oView->oSchema=$oSchema;
		
		
		$this->oLayout->add('main',$oView);
	}

	
	
	public function _delete(){
		$tMessage=$this->processDelete();

		$oSchema=model_schema::getInstance()->findById( _root::getParam('id') );
		
		$oView=new _view('schema::delete');
		$oView->oSchema=$oSchema;
		
		

		$oPluginXsrf=new plugin_xsrf();
		$oView->token=$oPluginXsrf->getToken();
		$oView->tMessage=$tMessage;
		
		$this->oLayout->add('main',$oView);
	}

	
	
	private function fillRow($oSchema){
		if(!_root::getRequest()->isPost() ){ //si ce n'est pas une requete POST on ne soumet pas
			return $oSchema;
		}
		
		$tId=model_schema::getInstance()->getIdTab();
		$tColumn=model_schema::getInstance()->getListColumn();
		foreach($tColumn as $sColumn){
			if( _root::getParam($sColumn,null) === null ){ 
				continue;
			}else if( in_array($sColumn,$tId)){
				 continue;
			}
			
			$oSchema->$sColumn=_root::getParam($sColumn,null) ;
		}
		return $oSchema;
	}

	private function processSave(){
		if(!_root::getRequest()->isPost() ){ //si ce n'est pas une requete POST on ne soumet pas
			return null;
		}
		
		$oPluginXsrf=new plugin_xsrf();
		if(!$oPluginXsrf->checkToken( _root::getParam('token') ) ){ //on verifie que le token est valide
			return array('token'=>$oPluginXsrf->getMessage() );
		}
	
		$iId=_root::getParam('id',null);
		if($iId==null){
			$oSchema=new row_schema;	
		}else{
			$oSchema=model_schema::getInstance()->findById( _root::getParam('id',null) );
		}
		
		$tId=model_schema::getInstance()->getIdTab();
		$tColumn=array('title');
		foreach($tColumn as $sColumn){
			 $oPluginUpload=new plugin_upload($sColumn);
			if($oPluginUpload->isValid()){
				$sNewFileName=_root::getConfigVar('path.upload').$sColumn.'_'.date('Ymdhis');

				$oPluginUpload->saveAs($sNewFileName);
				$oSchema->$sColumn=$oPluginUpload->getPath();
				continue;	
			}else  if( _root::getParam($sColumn,null) === null ){ 
				continue;
			}else if( in_array($sColumn,$tId)){
				 continue;
			}
			
			$oSchema->$sColumn=_root::getParam($sColumn,null) ;
		}
		
		if($oSchema->save()){
			//une fois enregistre on redirige (vers la page liste)
			_root::redirect('schema::list');
		}else{
			return $oSchema->getListError();
		}
		
	}
	
	
	public function processDelete(){
		if(!_root::getRequest()->isPost() ){ //si ce n'est pas une requete POST on ne soumet pas
			return null;
		}
		
		$oPluginXsrf=new plugin_xsrf();
		if(!$oPluginXsrf->checkToken( _root::getParam('token') ) ){ //on verifie que le token est valide
			return array('token'=>$oPluginXsrf->getMessage() );
		}
	
		$oSchema=model_schema::getInstance()->findById( _root::getParam('id',null) );
				
		$oSchema->delete();
		//une fois enregistre on redirige (vers la page liste)
		_root::redirect('schema::list');
		
	}


	
	public function after(){
		$this->oLayout->show();
	}
	
	
}

/*variables
#select		$oView->tJoinschema=schema::getInstance()->getSelect();#fin_select
#uploadsave $oPluginUpload=new plugin_upload($sColumn);
			if($oPluginUpload->isValid()){
				$sNewFileName=_root::getConfigVar('path.upload').$sColumn.'_'.date('Ymdhis');

				$oPluginUpload->saveAs($sNewFileName);
				$oSchema->$sColumn=$oPluginUpload->getPath();
				continue;	
			}else #fin_uploadsave

#methodList
	public function _list(){
		
		$tSchema=model_schema::getInstance()->findAll();
		
		$oView=new _view('schema::list');
		$oView->tSchema=$tSchema;
		
		
		
		$this->oLayout->add('main',$oView);
		 
	}
methodList#

#methodPaginationList
	public function _list(){
		
		$tSchema=model_schema::getInstance()->findAll();
		
		$oView=new _view('schema::list');
		$oView->tSchema=$tSchema;
		
		
		
		$oModulePagination=new module_pagination;
		$oModulePagination->setModuleAction('schema::list');
		$oModulePagination->setParamPage('page');
		$oModulePagination->setLimit(5);
		$oModulePagination->setPage( _root::getParam('page') );
		$oModulePagination->setTab( $tSchema );
		
		$oView->tSchema=$oModulePagination->getPageElement();
		
		$this->oLayout->add('main',$oView);
		
		
		$oViewPagination=$oModulePagination->build();
		
		$this->oLayout->add('main',$oViewPagination);
		 
	}
methodPaginationList#
			
#methodNew
	public function _new(){
		$tMessage=$this->processSave();
	
		$oSchema=new row_schema;
		$oSchema=$this->fillRow($oSchema);
		
		$oView=new _view('schema::new');
		$oView->oSchema=$oSchema;
		
		
		
		$oPluginXsrf=new plugin_xsrf();
		$oView->token=$oPluginXsrf->getToken();
		$oView->tMessage=$tMessage;
		
		$this->oLayout->add('main',$oView);
	}
methodNew#
	
#methodEdit
	public function _edit(){
		$tMessage=$this->processSave();
		
		$oSchema=model_schema::getInstance()->findById( _root::getParam('id') );
		$oSchema=$this->fillRow($oSchema);
		
		$oView=new _view('schema::edit');
		$oView->oSchema=$oSchema;
		$oView->tId=model_schema::getInstance()->getIdTab();
		
		
		
		$oPluginXsrf=new plugin_xsrf();
		$oView->token=$oPluginXsrf->getToken();
		$oView->tMessage=$tMessage;
		
		$this->oLayout->add('main',$oView);
	}
methodEdit#

#methodShow
	public function _show(){
		$oSchema=model_schema::getInstance()->findById( _root::getParam('id') );
		
		$oView=new _view('schema::show');
		$oView->oSchema=$oSchema;
		
		
		$this->oLayout->add('main',$oView);
	}
methodShow#
	
#methodDelete
	public function _delete(){
		$tMessage=$this->processDelete();

		$oSchema=model_schema::getInstance()->findById( _root::getParam('id') );
		
		$oView=new _view('schema::delete');
		$oView->oSchema=$oSchema;
		
		

		$oPluginXsrf=new plugin_xsrf();
		$oView->token=$oPluginXsrf->getToken();
		$oView->tMessage=$tMessage;
		
		$this->oLayout->add('main',$oView);
	}
methodDelete#	

#methodProcessDelete
	public function processDelete(){
		if(!_root::getRequest()->isPost() ){ //si ce n'est pas une requete POST on ne soumet pas
			return null;
		}
		
		$oPluginXsrf=new plugin_xsrf();
		if(!$oPluginXsrf->checkToken( _root::getParam('token') ) ){ //on verifie que le token est valide
			return array('token'=>$oPluginXsrf->getMessage() );
		}
	
		$oSchema=model_schema::getInstance()->findById( _root::getParam('id',null) );
				
		$oSchema->delete();
		//une fois enregistre on redirige (vers la page liste)
		_root::redirect('schema::list');
		
	}
methodProcessDelete#	
			
variables*/

