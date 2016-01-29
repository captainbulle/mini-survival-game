function Tileset(url) {
	this.image = new Image();
	this.image.tilesetReference = this;
	
	this.image.onload = function() {
		if(!this.complete) {
			throw new Error("Erreur de chargement du tileset \"" + url + "\".");
		}
		
		// Largeur du tileset en tiles
		this.tilesetReference.width = this.width / 32;
	};
	this.image.src = "tilesets/" + url;
}

Tileset.prototype.getImage = function(){
	return this.image;
}
