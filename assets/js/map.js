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
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar'}).addTo(mapObj.map);

		if(mapObj.activeCluster === true){
			mapObj.markersCluster = new L.markerClusterGroup({
				iconCreateFunction: function(cluster) {
					return mapCustom.clusters.default(cluster);
				}
			});
		}

		setTimeout(function(){ mapObj.map.invalidateSize()}, 400);

	},
	addElts : function (data, addPopUp = false){
		$.each(data, function(k,v){
			mapObj.addMarker({ elt : v });
		});

		if(mapObj.arrayBounds.length > 0){
			mapObj.bounds = L.bounds(mapObj.arrayBounds);
			var point = mapObj.bounds.getCenter()
			//mapObj.map.panTo([point.x, point.y]);
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
	//addMarker : function(elt, params.addPopUp = false, center=true, opt = {}){
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
				if(typeof params.center != "undefined" && params.center === true)
					mapObj.map.panTo(latLon);
			}
		}
		//console.log("addMarker end", marker);
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
		mapObj.markerList[marker].getLatLng();
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
			mylog.log("getMarker", jQuery.inArray( data.type, ["project", "projects"] ) , data);
			if(typeof data != "undefined" && data == null)
				return mapCustom.markers.default;
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
			data.profilThumbImageUrl = "/ph/assets/753062fa/images/filtres/Loisir.png";
			var icons = '<i class="fa fa-user text-'+ headerParams[data.type].color +'"></i>';
			// END CODE A SUPPRIMER
			
			var popup = "";
			popup += "<div class='' id='popup"+data.id+"'>";
				popup += "<img src='" + data.profilThumbImageUrl + "' height='30' width='30' class='' style='display: inline; vertical-align: middle; border-radius:100%;'>";
				popup += "<span style='font-size:18px'>" + data['name'] + "</span>";
				
				if(typeof data.tags != "undefined" && data.tags != null && data.tags.length > 0){
					popup += "<div class=''>";
					var totalTags = 0;
					$.each(data.tags, function(index, value){ 
						totalTags++;
						if(totalTags<4){
							popup += "<div class='popup-tags'>#" + value + " </div>";
						}
					});
					popup += "</div>";
				}

				if (typeof data.shortDescription != "undefined" && 
					data.shortDescription != "" && 
					data.shortDescription != null) {
					popup += "<div class='popup-div-desc'>"
						popup += "<div class='popup-desc'>Description</div>"
						popup += "<div class=''>" + data.shortDescription + "</div>"
					popup += "</div>";
				}

				popup += "<div id='pop-contacts' class='popup-section'>"
					popup += "<div class='popup-subtitle'>Contacts</div>"

					if (typeof data.url != "undefined" && data.url != null){
						popup += "<div class='popup-info-profil'>";
							popup += "<i class='fa fa fa-desktop fa_url'></i>";
							popup += "<a href='"+data.url+"' target='_blank'>"+ data.url + "</a>";
						popup += "</div>";
					}

					if (typeof data.email != "undefined" && data.email != null){
						popup += "<div class='popup-info-profil'>";
							popup += "<i class='fa fa-envelope fa_email'></i>" + data.email;
						popup += "</div>";
					}

					popup += "</div>";
				popup += "</div>";
			popup += '</div>';
			return popup;
		}
	}
}
	