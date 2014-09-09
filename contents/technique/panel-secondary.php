  <div class="panel-heading">
	<h3 class="panel-title">
	<div class="btn-group navbar-right">
		<a id="close-btn" class="btn btn-default btn-lg "role="button">
			<span class="glyphicon glyphicon-remove"></span>
		</a>
	</div>
		<div class="panel-title-text-container"><span class="panel-title-text"><?php echo $_GET["title"]; ?></span></div>
	</h3>
  </div>
  <div class="panel-body">
  	<?php echo file_get_contents($_GET["id"].".html"); ?>
  </div>
