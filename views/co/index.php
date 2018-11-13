<?php
// gettting asstes from parent module repo
$cssAnsScriptFilesModule = array( 
	'/leaflet/leaflet.css',
	'/leaflet/leaflet.js',

	'/css/map.css',

	'/markercluster/MarkerCluster.css',
	'/markercluster/MarkerCluster.Default.css',
	'/markercluster/leaflet.markercluster.js',

	'/js/map.js',
);
HtmlHelper::registerCssAndScriptsFiles($cssAnsScriptFilesModule, Yii::app()->getModule( Map::MODULE )->getAssetsUrl() );


?>
<style type="text/css">


.header-map{
	position: absolute;
	top:0px;
	width:100%;
	height:60px;
	background: rgba(41, 41, 41, 0.85) !important;
	color:white;
	display: inline;
	-moz-box-shadow: 0px 5px 6px -3px rgba(0, 0, 0, 0.68);
	-webkit-box-shadow: 0px 5px 6px -3px rgba(0, 0, 0, 0.68);
	-o-box-shadow: 0px 5px 6px -3px rgba(0, 0, 0, 0.68);
	box-shadow: 0px 5px 6px -3px rgba(0, 0, 0, 0.68);
}

.index2{
	z-index: 2;
}


</style>

<div id="mapContainer" style="z-index: 1; width: 100%; height: 600px;"></div>
<div style="">
	<nav class="header-map index2">
	    <div class="container">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header page-scroll pull-left">
            <a href="#" class="lbh">
                <img src="<?php echo Yii::app()->theme->baseUrl; ?>/assets/img/LOGOS/<?php echo Yii::app()->params["CO2DomainName"]; ?>/logo-min.png" style="padding-right:20px;" class="logo-menutop pull-left" height=30>
            </a>
        </div>
       
        <div class="hidden-xs col-sm-5 col-md-4 col-lg-4 no-padding">
            <input type="text" class="form-control" id="input-search-map" placeholder="<?php echo Yii::t('common', 'Search on map'); ?>">
        </div>

        <button class="btn btn-default hidden-xs" id="menu-map-btn-start-search">
            <i class="fa fa-search"></i>
        </button>
        <span id="map-loading-data">Chargement en cours...</span>
        <button class="btn-show-map"  data-toggle="tooltip" data-placement="bottom" title="Fermer la carte">
            <i class="fa fa-times"></i>
        </button>
        
        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="pull-right">
            <ul class="nav navbar-nav navbar-right">
                <?php 
                    if( isset( Yii::app()->session['userId']) ){
                      //$profilThumbImageUrl = Element::getImgProfil($me, "profilThumbImageUrl", $this->module->assetsUrl);
                ?> 
                      <a class="menu-name-profil text-dark lbh" 
                              data-toggle="dropdown" href="#page.type.citoyens.id.<?php echo Yii::app()->session['userId']; ?>">
                                <small class="hidden-xs"><?php echo @$me["name"]; ?></small> 
                                <img class="img-circle" id="menu-thumb-profil" 
                                     width="40" height="40" src="<?php echo ''; ?>" alt="image" >
                      </a>

                <?php } else { ?>
                    <!-- <li class="page-scroll">
                        <button class="text-red font-montserrat" data-toggle="modal" data-target="#modalLogin"><i class="fa fa-sign-in"></i> SE CONNECTER</button>
                    </li> -->
                <?php } ?>
            </ul>
        </div>

        <!-- /.navbar-collapse -->
    </div>
	</nav>

</div>

<script type="text/javascript">	

jQuery(document).ready(function() {


    var paramsMap = {
        dragging : false,
        zoom : 8
    };

	mapObj.init(paramsMap);


    
	$("body").addClass("inSig");
	$.ajax({
		type: "POST",
		url: baseUrl+"/api/organization/get/level4/597b1c186ff992f0038b45c4",
		dataType: "json",
		success: function(data){
			console.log("HERE", data);

			mapObj.addElts(data.entities);

		}
	});

});



</script>