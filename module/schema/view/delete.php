<table class="tb_delete">
	
	<tr>
		<th>title</th>
		<td><?php echo $this->oSchema->title ?></td>
	</tr>

	<tr>
		<th>content</th>
		<td><?php echo $this->oSchema->content ?></td>
	</tr>

</table>

<form action="" method="POST">
<input type="hidden" name="token" value="<?php echo $this->token?>" />
<?php if($this->tMessage and isset($this->tMessage['token'])): echo $this->tMessage['token']; endif;?>

<input type="submit" value="Confirmer la suppression" /> <a href="<?php echo $this->getLink('schema::list')?>">Annuler</a>
</form>

