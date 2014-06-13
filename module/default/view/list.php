<style>
	.bloc{
		width:800px;
		margin:auto;
		padding:10px;
	}
	.bloc a{
		color:#333;
		display:block;
		background:#fff;
		padding:8px;
		margin-bottom:8px;
		text-decoration:none;
	}
</style>
<div class="bloc">
<?php if($this->tSchema):?>
<?php foreach($this->tSchema as $oSchema):?>
	<a href="<?php echo $this->getLink('default::schema',array(
									'id'=>$oSchema->getId()
								) 
						)?>"><?php echo $oSchema->title ?></a>
<?php endforeach;?>
<?php endif;?>

<a style="margin-top:20px;width:120px;" href="<?php echo _root::getLink('default::add')?>">Ajouter</a>
</div>