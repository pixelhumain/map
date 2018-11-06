var mapObj = {
	container : 'mapContainer',
	map : null,
	arrayBounds : [],
	bounds : null,
	markersCluster : null,
	markerList : [],
	custom : {
		citoyen : {
			img : assetPath+'/images/markers/citoyen_A.svg',
		}
	},
	init : function(pInit = null){

		//Init variable
		mapObj.container =  ( (pInit != null && typeof pInit.container != "undefined") ? pInit.container : "mapContainer" );
		mapObj.arrayBounds =  [];
		mapObj.bounds =  null;
		mapObj.markersCluster =  null;
		mapObj.markerList =  [];
		


		var latLon = ( (pInit != null && typeof pInit.latLon != "undefined") ? pInit.latLon : [0, 0] );
		var zoom = ( (pInit != null && typeof pInit.zoom != "undefined") ? pInit.zoom : 10 );
		//creation de la carte 
		mapObj.map = L.map(mapObj.container).setView(latLon, zoom);
		// création tpl
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar'}).addTo(mapObj.map);

		mapObj.markersCluster = new L.markerClusterGroup({
			iconCreateFunction: function(cluster) {

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
		});

	},
	addElts : function (data, cluster = true){
		$.each(data, function(k,v){
			mapObj.addMarker(v, cluster);
		});

		if(mapObj.arrayBounds.length > 0){
			mapObj.bounds = L.bounds(mapObj.arrayBounds);
			var point = mapObj.bounds.getCenter()
			mapObj.map.panTo([point.x, point.y]);
		}

		if(cluster=== true)
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
	addMarker : function(elt, cluster = true){
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
		mapObj.addPopUp(marker);
		mapObj.arrayBounds.push(latLon);
		if(cluster === true)
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
	addPopUp : function(element, open = false){
		element.bindPopup(mapObj.getPopupSimple(element, "hehe")).openPopup();
		if(open === true)
			element.openPopup();
	},
	getPopupSimple : function(data, id){
		//mylog.log("getPopupSimple", data);
		
		var popupContent = "<div class='popup-marker'>";

		var ico = "";
		var color = "green";
		var imgProfilPath =  "";
		var icons = '<i class="fa fa-'+ ico + ' text-'+ color +'"></i>';
		

		var type = "organizations";
		var typeElement = "organizations";
		if(type == "event") 		typeElement = "events";
		if(type == "project") 		typeElement = "projects";
		
		var icon = 'fa-'+ ico;

		var onclick = "";
		var url = '#page.type.'+typeElement+'.id.'+id;
		if(type == "entry") 		url = "#survey.entry.id."+id;
		if(type == "action") 		url = "#rooms.action.id."+id;


		
		
		
		popupContent += "<div class='item_map_list popup-marker' id='popup"+id+"'> <div class='main-panel'>"
						+   "<div class='left-col'>"
						+ 	   "<div class='thumbnail-profil'><img src='" + imgProfilPath + "' height=50 width=50 class='popup-info-profil-thumb'></div>"						
						+ 	   "<div class='ico-type-account'>"+icons+"</div>"					
						+   "</div>"
						+   "<div class='right-col'>";
				
		if("undefined" != typeof data['name'])
			popupContent	+= 	"<div class='info_item pseudo_item_map_list'>!" + data['name'] + "</div>";
		
		if("undefined" != typeof data['tags'] && data['tags'] != null){
			popupContent	+= 	"<div class='info_item items_map_list'>";
			var totalTags = 0;
			if(data['tags'].length > 0){
				$.each(data['tags'], function(index, value){ 
					totalTags++;
					if(totalTags<4){
						var t = typeof tradCategory[value] != "undefined" ? tradCategory[value] : value;
						popupContent	+= 	"<div class='tag_item_map_list'>#" + t + " </div>";
					}
				});
			}
			popupContent	+= 	"</div>";
		}
		popupContent += "</div>";
		//Short description
		if ("undefined" != typeof data['shortDescription'] && data['shortDescription'] != "" && data['shortDescription'] != null) {
			popupContent += "<div id='pop-description' class='popup-section'>"
							+ "<div class='popup-subtitle'>Description</div>"
							+ "<div class='popup-info-profil'>" + data['shortDescription'] + "</div>"
						+ "</div>";
		}
		//Contacts information
		//popupContent += this.getPopupContactsInformation(data);
		//address
		//popupContent += this.getPopupAddressInformation(data);

		popupContent += '</div>';

		var dataType = ("undefined" != typeof data['typeSig']) ? data['typeSig'] : "";

		if(dataType == "event" || dataType == "events"){				
			popupContent += displayStartAndEndDate(data);
		}

		if (type.substr(0,11) == "poi.interop") {
			url = data.url;
			popupContent += "<a href='"+url+"' target='_blank' class='item_map_list popup-marker' id='popup"+id+"'>";
		}else if (typeof TPL_IFRAME != "undefined" && TPL_IFRAME==true){
			url = "https://www.communecter.org/"+url;
			popupContent += "<a href='"+url+"' target='_blank' class='item_map_list popup-marker' id='popup"+id+"'>";
		}else if (typeof networkJson != "undefined" && notNull(networkJson) && notNull(networkJson.dataSrc) && notNull(data.source)){
			popupContent += "<a href='"+data.source+"' target='_blank' class='item_map_list popup-marker' id='popup"+id+"'>";
		}else{
			onclick = 'urlCtrl.loadByHash("'+url+'");';					
			popupContent += "<a href='"+url+"' onclick='"+onclick+"' class='item_map_list popup-marker lbh' id='popup"+id+"'>";
		}

		popupContent += '<div class="btn btn-sm btn-more col-md-12"><i class="fa fa-hand-pointer-o"></i>'+trad.knowmore+'</div>';
		popupContent += '</a></div>';

		return popupContent;
	}
}

var mapCustom = {
	markers : {
		//default : assetPath+'/images/markers/citoyen_A.svg'
		default : '/ph/assets/3e93f017/images/markers/citoyen_A.svg'
	},
	clusters : {
		default : '/ph/assets/3e93f017/images/markers/citoyen_A.svg'
	}
}
	