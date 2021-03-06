
var mapObj = {
	container : 'mapContainer',
	map : null,
	arrayBounds : [],
	bounds : null,
	markersCluster : null,
	markerList : [],
	activeCluster : true,
	mapOpt : {
		dragging : true,
		center: [0, 0],
		zoom: 10
		// maxBounds: bounds,
		// minZoom: 8,
		// maxZoom: 16,
		
	},
	init : function(pInit = null){
		//Init variable
		mapObj.container =  ( (pInit != null && typeof pInit.container != "undefined") ? pInit.container : "mapContainer" );
		mapObj.arrayBounds =  [];
		mapObj.bounds =  null;
		mapObj.markersCluster =  null;
		mapObj.markerList =  [];
		mapObj.activeCluster =  ( (pInit != null && typeof pInit.activeCluster != "undefined") ? pInit.activeCluster : true );
		
		mapObj.mapOpt.dragging =  ( (pInit != null && typeof pInit.dragging != "undefined") ? pInit.dragging : true );
		mapObj.mapOpt.latLon = ( (pInit != null && typeof pInit.latLon != "undefined") ? pInit.latLon : [0, 0] );
		mapObj.mapOpt.zoom = ( (pInit != null && typeof pInit.zoom != "undefined") ? pInit.zoom : 10 );
		//creation de la carte 
		mapObj.map = L.map(mapObj.container, mapObj.mapOpt);
		// création tpl
		mapObj.setTile();

		if(mapObj.activeCluster === true){
			mapObj.markersCluster = new L.markerClusterGroup({
				iconCreateFunction: function(cluster) {
					return mapCustom.clusters.default(cluster);
				}
			});
		}

		setTimeout(function(){ mapObj.map.invalidateSize()}, 400);

	},
	setTile : function(){
		//Noir et Blanc 
		L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
			attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>', //'Map tiles by <a href="http://stamen.com">Stamen Design</a>',
			zIndex:1,
			minZoom: 3,
			maxZoom: 17
		}).addTo(mapObj.map);

		//Noir et Blanc Lite
		// L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
		// 	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>', //'Map tiles by <a href="http://stamen.com">Stamen Design</a>',
		// 	zIndex:1,
		// 	minZoom: 3,
		// 	maxZoom: 17
		// }).addTo(mapObj.map);

		//OSM
		//L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar'}).addTo(mapObj.map);

		//MAPBOX
		// var accessToken = 'pk.eyJ1IjoiY29tbXVuZWN0ZXIiLCJhIjoiY2l6eTIyNTYzMDAxbTJ3bng1YTBsa3d0aCJ9.elyGqovHs-mrji3ttn_Yjw';
		// // Replace 'mapbox.streets' with your map id.
		// var mapboxTiles = L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + accessToken, {
		// 	attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		// });
		// mapObj.map.addLayer(mapboxTiles);


		//SATELITE
		//L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {}).addTo(mapObj.map);


	},
	addElts : function (data, addPopUp = false){
		$.each(data, function(k,v){
			mapObj.addMarker({ elt : v, addPopUp : addPopUp });
		});

		if(mapObj.arrayBounds.length > 0){
			mapObj.bounds = L.bounds(mapObj.arrayBounds);
			var point = mapObj.bounds.getCenter();
			console.log("POINT", point);

			if( !isNaN(point.x) && !isNaN(point.y)){
				console.log("POINT here", point);
				mapObj.map.panTo([point.x, point.y]);
			}
		}

		if(mapObj.activeCluster === true)
			mapObj.map.addLayer(mapObj.markersCluster);
	},
	clearMap : function(){
		// Supprime les markers
		$.each(mapObj.markerList, function(){
			mapObj.map.removeLayer(this);
		});
		mapObj.markerList = [];
		if(mapObj.markersCluster != null)
			mapObj.markersCluster.clearLayers();
	},
	addMarker : function(params){
		//params elt, addPopUp, center=true opt = {}{
		//console.log("addMarker", elt, params.addPopUp);

		if( typeof params.elt != "undefined" && params.elt != null &&
			typeof params.elt.geo != "undefined" && params.elt.geo != null && 
			typeof params.elt.geo.latitude != "undefined" && params.elt.geo.latitude != null && 
			typeof params.elt.geo.longitude != "undefined" && params.elt.geo.longitude != null ){

			var myIcon = L.icon({
				iconUrl: mapCustom.markers.getMarker(params.elt),
				iconSize: [45, 55],
				iconAnchor: [22, 94],
				popupAnchor: [-3, -76],
				shadowUrl: '',
				shadowSize: [68, 95],
				shadowAnchor: [22, 94],
			});
			console.log("addMarker myIcon", myIcon);

			if(typeof params.opt == "undefined" || params.opt == null)
				params.opt = {} ;

			params.opt.icon = myIcon ;
			var latLon = [ params.elt.geo.latitude, params.elt.geo.longitude ] ;


			var marker = L.marker(latLon, params.opt );
			mapObj.markerList.push(marker);
			if(typeof params.addPopUp != "undefined" && params.addPopUp === true)
				mapObj.addPopUp(marker, params.elt);

			mapObj.arrayBounds.push(latLon);
			if(mapObj.activeCluster === true)
				mapObj.markersCluster.addLayer(marker);
			else{
				marker.addTo(mapObj.map);
				if(typeof params.center == "undefined" || params.center === true)
					mapObj.map.panTo(latLon);
			}
			
		}
		console.log("addMarker end", marker);
	},
	addPolygon: function(){
		var polygon = L.polygon([
			[51.509, -0.08],
			[51.503, -0.06],
			[51.51, -0.047]
		]).addTo(mapObj.map);
		mapObj.addPopUp(polygon);
	},
	addCircle: function(){
		var circle = L.circle([51.508, -0.11], {
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0.5,
			radius: 500
		}).addTo(mapObj.map);
		mapObj.addPopUp(circle, true);
	},
	addPopUp : function(marker, elt = null, open = false){
		marker.bindPopup(mapObj.getPopupSimple(elt), 
						{
							width: "300px"
						}).openPopup();
		if(open === true)
			marker.openPopup();
	},
	getPopupSimple : function(data){
		return mapCustom.popup.default(data);
	},
	setLatLng : function(latLon, marker){
		mapObj.markerList[marker].setLatLng(latLon);
		mapObj.map.panTo(latLon);
	},
	getLatLng : function(marker){
		return mapObj.markerList[marker].getLatLng();
	},
	addFct : function (marker, event, fct){
		// expmle : event == 'dragend'
		mapObj.markerList[marker].on('dragend', fct);


	}
}

var mapCustom = {
	css : [
	],
	markers : {
		default : modules.map.assets+'/images/markers/citizen-marker-default.png',
		organization : modules.map.assets+'/images/markers/ngo-marker-default.png',
		project : modules.map.assets+'/images/markers/project-marker-default.png',
		event : modules.map.assets+'/images/markers/event-marker-default.png',
		getMarker : function(data){
			mylog.log("getMarker", jQuery.inArray( data.type, ["project", "projects"] ) , data.profilMarkerImageUrl);
			
			if(typeof data != "undefined" && data == null)
				return mapCustom.markers.default;
			else if(typeof data.profilMarkerImageUrl !== "undefined" && data.profilMarkerImageUrl != "")
				return baseUrl + data.profilMarkerImageUrl;
			else if(typeof data.type != "undefined" && data.type == null)
				return mapCustom.markers.default;
			else if(jQuery.inArray( data.type, ["organization", "organizations", "NGO"] ) != -1  ){
				return mapCustom.markers.organization;
			}else if(jQuery.inArray( data.type, ["project", "projects"] ) != -1  ){
				return mapCustom.markers.project;
			}else if(jQuery.inArray( data.type, ["event", "events"] ) != -1  ){
				return mapCustom.markers.event;
			}
			else
				return mapCustom.markers.default;
		}
	},
	custom : {
		getThumbProfil : function (data){ 

			var imgProfilPath = modules.map.assets + "/images/thumb/default.png";

			if(typeof data.profilThumbImageUrl !== "undefined" && data.profilThumbImageUrl != "") 
				imgProfilPath =  baseUrl + data.profilThumbImageUrl;
			else
				imgProfilPath = modules.map.assets + "/images/thumb/default_"+data.type+".png";

			return imgProfilPath;
		}
		
	},
	clusters : {
		default : function(cluster) {
			var childCount = cluster.getChildCount();
			var c = ' marker-cluster-';
			if (childCount < 10) {
				c += 'small';
			} else if (childCount < 100) {
				c += 'medium';
			} else {
				c += 'large';
			}
			return L.divIcon({ html: '<div>' + childCount + '</div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
		}
	},
	popup : {
		default : function(data){
			mylog.log("mapCustom.popup.default", data);
			
			// CODE A SUPPRIMER
			//data.profilThumbImageUrl = "/ph/assets/753062fa/images/filtres/Loisir.png";
			//var icons = '<i class="fa fa-user text-'+ headerParams[data.type].color +'"></i>';
			// END CODE A SUPPRIMER
			var id = (typeof data.id != "undefined") ? data.id :  data._id.$id ;

			var imgProfil = mapCustom.custom.getThumbProfil(data) ;

			var popup = "";
			popup += "<div class='' id='popup"+id+"'>";
				popup += "<img src='" + imgProfil + "' height='30' width='30' class='' style='display: inline; vertical-align: middle; border-radius:100%;'>";
				popup += "<span style='margin-left : 5px; font-size:18px'>" + data['name'] + "</span>";
				
				if(typeof data.tags != "undefined" && data.tags != null && data.tags.length > 0){
					popup += "<div style='margin-top : 5px;'>";
					var totalTags = 0;
					$.each(data.tags, function(index, value){ 
						totalTags++;
						if(totalTags<3){
							popup += "<div class='popup-tags'>#" + value + " </div>";
						}
					});
					popup += "</div>";
				}

				if (typeof data.shortDescription != "undefined" && 
					data.shortDescription != "" && 
					data.shortDescription != null) {
					popup += "<div class='popup-section'>";
						popup += "<div class='popup-subtitle'>Description</div>";
						popup += "<div class=''>" + data.shortDescription + "</div>";
					popup += "</div>";
				}

				if ( 	(typeof data.url != "undefined" && data.url != null) || 
						(typeof data.email != "undefined" && data.email != null ) ){
					popup += "<div id='pop-contacts' class='popup-section'>";
						popup += "<div class='popup-subtitle'>Contacts</div>";

						if (typeof data.url != "undefined" && data.url != null){
							popup += "<div class='popup-info-profil'>";
								popup += "<i class='fa fa fa-desktop fa_url'></i> ";
								popup += "<a href='"+data.url+"' target='_blank'>"+ data.url + "</a>";
							popup += "</div>";
						}

						if (typeof data.email != "undefined" && data.email != null){
							popup += "<div class='popup-info-profil'>";
								popup += "<i class='fa fa-envelope fa_email'></i> " + data.email;
							popup += "</div>";
						}

						popup += "</div>";
					popup += "</div>";
				}
			var url = baseUrl+'#page.type.'+data.type+'.id.'+id;

			// if (data.type.substr(0,11) == "poi.interop") {
			// 	url = data.url;
			// 	popup += "<a href='"+url+"' target='_blank' class='item_map_list popup-marker' id='popup"+id+"'>";
			// }else if (typeof TPL_IFRAME != "undefined" && TPL_IFRAME==true){
			// 	url = "https://www.communecter.org/"+url;
			// 	popup += "<a href='"+url+"' target='_blank' class='item_map_list popup-marker' id='popup"+id+"'>";
			// }else if (typeof networkJson != "undefined" && notNull(networkJson) && notNull(networkJson.dataSrc) && notNull(data.source)){
			// 	popup += "<a href='"+data.source+"' target='_blank' class='item_map_list popup-marker' id='popup"+id+"'>";
			// }else{
			// 	onclick = 'urlCtrl.loadByHash("'+url+'");';					
			// 	popup += "<a href='"+url+"' onclick='"+onclick+"' class='item_map_list popup-marker lbh' id='popup"+id+"'>";
			// }
				popup += "<div class='popup-section'>";
					popup += "<a href='"+url+"' target='_blank' class='item_map_list popup-marker' id='popup"+id+"'>";
						popup += '<div class="btn btn-sm btn-more col-md-12">';
						popup += '<i class="fa fa-hand-pointer-o"></i>trad.knowmore';
					popup += '</div></a>';
				popup += '</div>';
			popup += '</div>';
			return popup;
		}
	}
}
	