# Module MAP

## URL


### TileLayer 
Différents url ou on peut trouver des designs pour les cartes
- http://maps.stamen.com/#toner/12/37.7706/-122.3782
- https://stamen.com/work/maps-stamen-com/
- http://www.thunderforest.com/maps/


## TODO
- [ ] Pouvoir afficher plusieurs carte en meme temps
- [ ] Init css et js avec map
    - [x] Faire sur FormInMAP
    - [ ] De maniere générale
    - [ ] Parametrable a l'init 
    - [ ] Le faire en synchrone
- [ ] Intégration des GeoShape
- [ ] Faire en sort de changer de TileLayer 
    - [x] Test différent Tile
    - [ ] Réutileser différent Tile en fct du parametre
    - [ ] Changer de fond a tout moment
    - [ ] Géré Mapbox quand c'est en prod
- [ ] En fct des points sur la carte, géré le zoom , plus les points sont éloigner plus on dezoom sur la carte
- [ ] Afficher les informations sur le coté de la map et non plus en popup
    - [ ] Rendre ça parametrable
- [ ] 

## DOC

`mapObj` sera l'objet qui va contenir tout les variables et toutes les méthodes pour instancier une map

### pré-requis

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


### variable 

`container` : va contenir l'id de la balise qui contiendra la map. 
    - Valeur par defaut :'mapContainer',
`map` : Va contenir la carte généré par Leaflet, valeur par : null,
`arrayBounds` : [],
`bounds` : null,
`markersCluster` : null,
`markerList` : [],


### Fonction

#### init
#### setTile
`setTile()` : Défini le fond de carte
#### addElts
#### clearMap
#### addMarker
`addMarker(params)` : Ajoute un marker sur la map
###### Parametre
- `elt` : Objet contenant les informations sur l'icône
    - `elt.geo.latitude` : la latitude de l'objet  
    - `elt.geo.longitude` : la longitude de l'objet
- `addPopUp` : Définie si oui on non on ajoute une popUp à l'icône. Prend deux valeurs `true` ou `false`. Par default `false`.
- `center` : Définie si oui on non on soite centrer la carte sur l'icône. Prend deux valeurs `true` ou `false`. Par default `false`.
- `opt` : Objet contenant les informations sur l'icon

#### addPolygon 
#### addCircle 
#### addPopUp
#### activeCluster
