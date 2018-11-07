var mapObj = {
	container : 'mapContainer',
	map : null,
	arrayBounds : [],
	bounds : null,
	markersCluster : null,
	markerList : [],
	activeCluster : true,
	init : function(pInit = null){

		//Init variable
		mapObj.container =  ( (pInit != null && typeof pInit.container != "undefined") ? pInit.container : "mapContainer" );
		mapObj.arrayBounds =  [];
		mapObj.bounds =  null;
		mapObj.markersCluster =  null;
		mapObj.markerList =  [];
		mapObj.activeCluster =  ( (pInit != null && typeof pInit.activeCluster != "undefined") ? pInit.activeCluster : true );

		var latLon = ( (pInit != null && typeof pInit.latLon != "undefined") ? pInit.latLon : [0, 0] );
		var zoom = ( (pInit != null && typeof pInit.zoom != "undefined") ? pInit.zoom : 10 );
		//creation de la carte 
		mapObj.map = L.map(mapObj.container).setView(latLon, zoom);
		// création tpl
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar'}).addTo(mapObj.map);

		if(mapObj.activeCluster === true){
			mapObj.markersCluster = new L.markerClusterGroup({
				iconCreateFunction: function(cluster) {
					return mapCustom.clusters.default(cluster);
				}
			});
		}
	},
	addElts : function (data){
		$.each(data, function(k,v){
			mapObj.addMarker(v);
		});

		if(mapObj.arrayBounds.length > 0){
			mapObj.bounds = L.bounds(mapObj.arrayBounds);
			var point = mapObj.bounds.getCenter()
			mapObj.map.panTo([point.x, point.y]);
		}

		if(mapObj.activeCluster === true)
			mapObj.map.addLayer(mapObj.markersCluster);
	},
	clearMap : function(){
		// Supprime les markers
		$.each(mapObj.markerList, function(){
			console.log("removeLayer", this);
			mapObj.map.removeLayer(this);
		});
		mapObj.markerList = [];
		if(mapObj.markersCluster != null)
			mapObj.markersCluster.clearLayers();
	},
	addMarker : function(elt){
		var myIcon = L.icon({
			iconUrl: mapCustom.markers.default,
			iconSize: [38, 95],
			iconAnchor: [22, 94],
			popupAnchor: [-3, -76],
			shadowUrl: '',
			shadowSize: [68, 95],
			shadowAnchor: [22, 94]
		});
		var latLon = [ elt.geo.latitude, elt.geo.longitude ] ;
		var marker = L.marker(latLon, {icon: myIcon});
		mapObj.markerList.push(marker);
		mapObj.addPopUp(marker, elt);
		mapObj.arrayBounds.push(latLon);
		if(mapObj.activeCluster === true)
			mapObj.markersCluster.addLayer(marker);
		else
			marker.addTo(mapObj.map);
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
		marker.bindPopup(mapObj.getPopupSimple(elt)).openPopup();
		if(open === true)
			marker.openPopup();
	},
	getPopupSimple : function(data){
		return mapCustom.popup.default(data);
	}
}

var mapCustom = {
	css : [
	],
	markers : {
		//default : assetPath+'/images/markers/citoyen_A.svg'
		default : '/ph/assets/3e93f017/images/markers/citoyen_A.svg'
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

			return L.divIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
		}
	},
	popup : {
		default : function(data){
			mylog.log("mapCustom.popup.default", data);
			
			// CODE A SUPPRIMER

			data.profilThumbImageUrl = "/ph/assets/753062fa/images/filtres/Loisir.png";
			var icons = '<i class="fa fa-user text-'+ headerParams[data.typeCommunecter].color +'"></i>';
			// END CODE A SUPPRIMER
			

			//var icons = '<i class="fa fa-user text-'+ headerParams[data.type].color +'"></i>';


			var popup = "<div class='popup-marker'>";
			//popup += data.name;


			popup += "<div class='item_map_list popup-marker' id='popup"+data.id+"'>";
				popup += "<div class='main-panel'>"
					popup += "<div class='left-col'>";
						popup += "<div class='thumbnail-profil'>"
							popup += "<img src='" + data.profilThumbImageUrl + "' height=50 width=50 class='popup-info-profil-thumb'>";
						popup += "</div>"	;					
						popup += "<div class='ico-type-account'>"+icons+"</div>";
					popup += "</div>";
					popup += "<div class='right-col'>";
						popup += "<div class='info_item pseudo_item_map_list'>" + data['name'] + "</div>";
					popup += "</div>";
				popup += "</div>";
			popup += '</div>';
			return popup;
		}
	}
}
	