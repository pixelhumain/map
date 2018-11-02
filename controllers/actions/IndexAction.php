<?php
class IndexAction extends CAction
{
    public function run(){
    	//echo "Hello there"; exit;
  //     	CO2Stat::incNbLoad("co2-map");
		// if(Yii::app()->request->isAjaxRequest)
		$ctrl = $this->getController();
     	$ctrl->layout = "//layouts/empty";
		echo $ctrl->render("map.views.co.index");
		// else {
		// 	//$this->getController()->layout = "//layouts/empty";
		// 	echo $this->getController()->render("index");
		// }

    }
}