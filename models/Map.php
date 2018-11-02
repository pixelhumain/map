<?php

class Map {
	const COLLECTION = "map";
	const CONTROLLER = "map";
	const MODULE = "map";
	const ICON = "fa-cubes";

	public static function getConfig(){
		return array(
			"collection"    => self::COLLECTION,
            "controller"   	=> self::CONTROLLER,
            "module"   		=> self::MODULE,
            "assets"   		=> Yii::app()->getModule( self::MODULE )->assetsUrl,
			"init"   		=> Yii::app()->getModule( self::MODULE )->assetsUrl."/js/init.js" ,
			"form"   		=> Yii::app()->getModule( self::MODULE )->assetsUrl."/js/dynForm.js" ,
            //"categories" 	=> CO2::getModuleContextList(self::MODULE,"categories"),
            "lbhp"			=> true
		);
	}

}
?>