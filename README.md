# map




#TODO

[ ] Init css avec map 

#DOC

`mapObj` sera l'objet qui va contenir tout les variables et toutes les méthodes pour instancier une map

## pré-requis

Il faut charger les librairies suivant :

Leaflet : permet de charger le framework de carte
```
'/leaflet/leaflet.css',
'/leaflet/leaflet.js',
```

Permet de crée un cluster sur la carte
```
'/markercluster/MarkerCluster.css',
'/markercluster/MarkerCluster.Default.css',
'/markercluster/leaflet.markercluster.js',
```


## variable 

`container` : va contenir l'id de la balise qui contiendra la map. 
    - Valeur par defaut :'mapContainer',
`map` : Va contenir la carte généré par Leaflet, valeur par : null,
`arrayBounds` : [],
`bounds` : null,
`markersCluster` : null,
`markerList` : [],


## Fonction

### init
### addElts
### clearMap
### addMarker
`addMarker(params)` : Ajoute un marker sur la map
##### Parametre
- `elt` : Objet contenant les informations sur l'icône
    - `elt.geo.latitude` : la latitude de l'objet  
    - `elt.geo.longitude` : la longitude de l'objet
- `addPopUp` : Définie si oui on non on ajoute une popUp à l'icône. Prend deux valeurs `true` ou `false`. Par default `false`.
- `center` : Définie si oui on non on soite centrer la carte sur l'icône. Prend deux valeurs `true` ou `false`. Par default `false`.
- `opt` : Objet contenant les informations sur l'icon
### addPolygon 
### addCircle 
### addPopUp
### activeCluster