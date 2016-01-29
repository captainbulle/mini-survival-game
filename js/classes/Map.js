function Map(name) {
	
	// AJAX
	//var xhr = new XMLHttpRequest();
	// List of the characters on the field
	this.characters = new Array();

	this.tileset = null;
	this.field = new Array();
    
    /*
	xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var mapData = JSON.parse(xhr.responseText);
            
            this.tileset = new Tileset(mapData.tileset);
            this.field = mapData.field;
            
            this.width = this.field[0].length;
            this.height = this.field.length;
        }
    };//*/
	
	this.field = eval(name);
	//tilesetImage.onload = drawImage;
	this.tileSize = 32;       // The size of a tile (32×32)
	this.rowTileCount = 20;   // The number of tiles in a row of our background
	this.colTileCount = 32;   // The number of tiles in a column of our background
	this.imageNumTiles = 16;  // The number of tiles per row in the tileset image
	this.tileset = new Tileset('lost_garden.png');
}

// To recuperate the size (in tile) of the map
Map.prototype.getHeight = function() {
	return this.rowTileCount;
};

Map.prototype.getWidth = function() {
	return this.colTileCount;
};

Map.prototype.drawMap = function(context) {
	/*
	for(var i = 0, l = this.field.length ; i < l ; i++) {
		var line = this.field[i];
		var y = i * 32;
		for(var j = 0, k = line.length ; j < k ; j++) {
			this.tileset.drawTile(line[j], context, j * 32, y);
		}
	}//*/
	// Map
	for (var r = 0; r < this.rowTileCount; r++) {
		for (var c = 0; c < this.colTileCount; c++) {
			var tile = this.field[ r ][ c ];
			var tileRow = (tile / this.imageNumTiles) | 0; // Bitwise OR operation
			var tileCol = (tile % this.imageNumTiles) | 0;
			context.drawImage(this.tileset.getImage(), (tileCol * this.tileSize), (tileRow * this.tileSize), this.tileSize, this.tileSize, (c * this.tileSize), (r * this.tileSize), this.tileSize, this.tileSize);
		}
	}
	
	// Characters
	/*
	for(var i = 0, l = this.characters.length ; i < l ; i++) {
		this.characters[i].drawCharacter(context);
	}*/
};

// To add a character
Map.prototype.addCharacter = function(character) {
	this.characters.push(character);
};
