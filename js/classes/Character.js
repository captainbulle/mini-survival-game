var DIRECTION = {
	"DOWN"  : 0,
	"LEFT"  : 1,
	"RIGHT" : 2,
	"UP"    : 3
};
var DUREE_ANIMATION = 4;
var DUREE_DEPLACEMENT = 15;

function Character(url, x, y, direction) {
	this.x = x; // (en cases)
	this.y = y; // (en cases)
	this.direction = direction;
	this.etatAnimation = -1;
	this.dead = false;
	
	// Chargement de l'image dans l'attribut image
	this.image = new Image();
	this.image.characterReference = this;
	this.image.onload = function() {
		if(!this.complete) 
			throw "Erreur de chargement du sprite \"" + url + "\".";
		
		// Taille du personnage
		console.log("player width " + this.width);console.log("player height" + this.height);
		this.characterReference.width = this.width / 4;
		this.characterReference.height = this.height / 4;
	};
	this.image.src = "sprites/" + url;
}

Character.prototype.getDead = function(){
	return this.dead;
};

Character.prototype.setDead = function(dead){
	this.dead = dead;
};

Character.prototype.getWidth = function(){
	return this.width;
}

Character.prototype.getHeight = function(){
	return this.height;
}

Character.prototype.drawCharacter = function(context) {
	var frame = 0; // Numéro de l'image à prendre pour l'animation
	var decalageX = 0, decalageY = 0; // Décalage à appliquer à la position du personnage
	
	if(this.etatAnimation >= DUREE_DEPLACEMENT) {
		// Si le déplacement a atteint ou dépassé le temps nécessaire pour s'effectuer, on le termine
		this.etatAnimation = -1;
	} else if (this.etatAnimation >= 0) {
		// On calcule l'image (frame) de l'animation à afficher
		frame = Math.floor(this.etatAnimation / DUREE_ANIMATION);
		if(frame > 3) {
			frame %= 4;
		}
		
		// Nombre de pixels restant à parcourir entre les deux cases
		var pixelsAParcourir = 32 - (32 * (this.etatAnimation / DUREE_DEPLACEMENT));
		
		// À partir de ce nombre, on définit le décalage en x et y.
		if(this.direction == DIRECTION.UP) {
			decalageY = pixelsAParcourir;
		} else if(this.direction == DIRECTION.DOWN) {
			decalageY = -pixelsAParcourir;
		} else if(this.direction == DIRECTION.LEFT) {
			decalageX = pixelsAParcourir;
		} else if(this.direction == DIRECTION.RIGHT) {
			decalageX = -pixelsAParcourir;
		}
		
		this.etatAnimation++;
	}
	/*
	 * Si aucune des deux conditions n'est vraie, c'est qu'on est immobile, 
	 * donc il nous suffit de garder les valeurs 0 pour les variables 
	 * frame, decalageX et decalageY
	 */

	context.drawImage(
		this.image, 
		this.width * frame, this.direction * this.height, // Point d'origine du rectangle source à prendre dans notre image
		this.width, this.height, // Taille du rectangle source (c'est la taille du personnage)
		(this.x * 32) - (this.width / 2) + 16 + decalageX, (this.y * 32) - this.height + 24 + decalageY, // Point de destination (dépend de la taille du personnage)
		this.width, this.height // Taille du rectangle destination (c'est la taille du personnage)
	);
};

Character.prototype.getCoordonneesAdjacentes = function(direction)  {
	var coord = {'x' : this.x, 'y' : this.y};
	switch(direction) {
		case DIRECTION.DOWN : 
			coord.y++;
			break;
		case DIRECTION.LEFT : 
			coord.x--;
			break;
		case DIRECTION.RIGHT : 
			coord.x++;
			break;
		case DIRECTION.UP : 
			coord.y--;
			break;
	}
	return coord;
};
	
Character.prototype.move = function(direction, map) {

	// On ne peut pas se déplacer si un mouvement est déjà en cours !
	if(this.etatAnimation >= 0) {
		return false;
	}

	// On change la direction du personnage
	this.direction = direction;
		
	// On vérifie que la case demandée est bien située dans la carte
	var nextSquare = this.getCoordonneesAdjacentes(direction);
	if(nextSquare.x < 0 || nextSquare.y < 0 || nextSquare.x >= map.getWidth() || nextSquare.y >= map.getHeight()) {
		// On retourne un booléen indiquant que le déplacement ne s'est pas fait, 
		// Ça ne coute pas cher et ca peut toujours servir
		return false;
	}

	// On commence l'animation
	this.etatAnimation = 1;
	// On effectue le déplacement
	this.x = nextSquare.x;
	this.y = nextSquare.y;
		
	return true;
};
