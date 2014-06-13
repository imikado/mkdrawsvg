<div style="background:white;width:1200px">
<table class="tb_list">
	<tr>
		
		<th>title</th>

		<th>tObject</th>
		
		<th>tMenuLayerObject</th>

		<th></th>
	</tr>
	<?php if($this->tSchema):?>
	<?php foreach($this->tSchema as $oSchema):?>
	<tr <?php echo plugin_tpl::alternate(array('','class="alt"'))?>>
		
		<td><?php echo $oSchema->title ?></td>

		<td><?php echo $oSchema->tObject ?></td>
		
		<td><?php echo $oSchema->tMenuLayerObject ?></td>

		<td>
			
			
<a href="<?php echo $this->getLink('schema::edit',array(
										'id'=>$oSchema->getId()
									) 
							)?>">Edit</a>
| 
<a href="<?php echo $this->getLink('schema::delete',array(
										'id'=>$oSchema->getId()
									) 
							)?>">Delete</a>
| 
<a href="<?php echo $this->getLink('schema::show',array(
										'id'=>$oSchema->getId()
									) 
							)?>">Show</a>

			
			
		</td>
	</tr>	
	<?php endforeach;?>
	<?php endif;?>
</table>

<p><a href="<?php echo $this->getLink('schema::new') ?>">New</a></p>


</div>
