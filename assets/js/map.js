var mapObject = {
	container : 'mapid',
	map : null,
	arrayBounds : [],
	bounds : null,
	markersCluster : null,
	custom : {
		citoyen : {
			img : assetPath+'/images/markers/citoyen_A.svg',
		}
	},
	init : function(idMap = 'mapid'){

		//Init variable
		mapObject.container =  idMap;
		mapObject.arrayBounds =  [];
		mapObject.bounds =  null;
		//creation de la carte 
		mapObject.map = L.map(mapObject.container).setView([51.508, -0.11], 12);
		// création tpl
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar'}).addTo(mapObject.map);

		mapObject.markersCluster = new L.markerClusterGroup({
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
	addMarker : function(elt){
		var myIcon = L.icon({
			iconUrl: mapObject.custom.citoyen.img,
			iconSize: [38, 95],
			iconAnchor: [22, 94],
			popupAnchor: [-3, -76],
			shadowUrl: '',
			shadowSize: [68, 95],
			shadowAnchor: [22, 94]
		});
		var latLon = [ elt.geo.latitude, elt.geo.longitude ] ;
		var marker = L.marker(latLon, {icon: myIcon}).addTo(mapObject.map);
		//var marker = L.marker(latLon, {icon: myIcon});
		mapObject.addPopUp(marker);
		mapObject.arrayBounds.push(latLon);
		mapObject.markersCluster.addLayer(marker);


	},
	addPolygon: function(){
		var polygon = L.polygon([
			[51.509, -0.08],
			[51.503, -0.06],
			[51.51, -0.047]
		]).addTo(mapObject.map);

		mapObject.addPopUp(polygon);
	},
	addCircle: function(){
		var circle = L.circle([51.508, -0.11], {
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0.5,
			radius: 500
		}).addTo(mapObject.map);
		mapObject.addPopUp(circle, true);
	},
	addPopUp : function(element, open = false){
		element.bindPopup(mapObject.getPopupSimple(element, "hehe")).openPopup();
		if(open === true)
			element.openPopup();
	},
	getPopupSimple : function(data, id){
		mylog.log("getPopupSimple", data);
		
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