$(document).ready(function() {
    
    //Character Variable and Attributes
    //================================================================
    var characters ={
        "Archer": {
            name: "Archer",
            health: 140,
            attack: 18,
            imageUrl: "assets/images/archer.jpeg",
            enemyAttackBack: 30,
        },
        "Pam": {
            name: "Pam",
            health: 100,
            attack: 120,
            imageUrl: "assets/images/pam.jpeg",
            enemyAttackBack: 45,
        },
        "Barry": {
            name: "Barry",
            health: 160,
            attack: 15,
            imageUrl: "assets/images/barry.jpeg",
            enemyAttackBack: 1,
        },
        "Lana": {
            name: "Lana",
            health: 150,
            attack: 20,
            imageUrl: "assets/images/lana.jpeg",
            enemyAttackBack: 30,
        },
        "Mallory": {
            name: "Mallory",
            health: 150,
            attack: 20,
            imageUrl: "assets/images/mallory.jpeg",
            enemyAttackBack: 35,
        }
    
    };
    //Populated when character selected
    var currSelectedCharacter;
    //Populated with characters not selected
    var combatants = [];
    //Populated by character user selects
    var currDefender;
    //Keeps count of turns
    var turnCounter = 1;
    //Tracks defeated opponents
    var killCount = 0;

    console.log(characters);
    // Functions
    //================================================================
    
    
    //This function will render a charater card to the page
    //The character render and the area they are rendered to
    var renderOne = function(character, renderArea, charStatus) {
        var charDiv = $("<div class='character' data-name='" + character.name + "'>" );
        var charName = $("<div class ='character-name'>").text(character.name);
        var charImage =$("<img alt ='image' class='character-image'>").attr("src", character.imageUrl);
        var charHealth =$("<div class ='character-health'>").text(character.health);
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderArea).append(charDiv);

        // If the character is an enermy or defender
        if (charStatus === "enemy") {
            $(charDiv).addClass("enemy");
        }
        else if(charStatus === "defender"){
            currDefender = character;
            $(charDiv).addClass("target-enemy");
        }
    }

    //Function to handle rendering game messages
    var renderMessage = function(message) {
        
        //builds the message
        var gameMessageSet = $("#game-message");
        var newMessage = $("<div>").text(message);
        gameMessageSet.append(newMessage);

        //If we this specific message passed in and cleared
        if(message === "clearMessage"){
            gameMessageSet.text("");
        }
    }

    //This function handles the rendering of characters based on which area they are to rendered
    var renderCharacters = function(charObj, areaRender){
        if (areaRender === "#character-section"){
            $(areaRender).empty();
            for(var key in charObj){
                if(charObj.hasOwnProperty(key)) {
                    renderOne(charObj[key], areaRender, "");
                }
            }
        }

        if (areaRender === "#selected-character") {
            renderOne(charObj, areaRender, "");
        }

        if (areaRender === "#available-to-attack-section"){

            for(var i = 0; i < charObj.length; i++){
                renderOne(charObj[i], areaRender,"enemy");
            }

            //Creates an onclick event for each enemy
            $(document).on("click", ".enemy", function(){
                var name = ($(this).attr("data-name"));

                if($("#defender").children().length === 0) {
                    renderCharacters(name, "#defender");
                    $(this).hide();
                    renderMessage("clearMessage");
                }
            });

        }

        if( areaRender === "#defender") {
            $(areaRender).empty();
            for (var i=0; i<combatants.length; i++){
                if(combatants[i].name === charObj){
                    renderOne(combatants[i], areaRender, "defender");
                }
            }
        }

        //Re-rendering health stat after attack
        if (areaRender === "playerDamage"){
            $("#defender").empty();
            renderOne(charObj, "#defender", "defender");
        }

        //Re-render selected character after attack
        if (areaRender === "enemyDamage"){
            $("#selected-character").empty();
            renderOne(charObj, "#selected-character", "");
        }

        //Remove defeated enemy
        if (areaRender === "enemyDefeated") {
            $("#defender").empty();
            var gameStateMessage = "You Have Defeateed " + charObj.name + ", select a new patron to fight!!";
            renderMessage(gameStateMessage);
        }
       
    };

    //Function which handles the game restarting after victory or defeat
    var restartGame = function(inputEndGame){

        //When the restart button is clicked game restarts
        var restart = $("<button>Restart</button>").click(function(){
            location.reload();
        })

        //builds div that will display messages
        var gameState = $("<div>").text(inputEndGame);

        //Renders the restart button and end game messages
        $("body").append(gameState);
        $("body").append(restart);

    }


    
    //Render all characters to the page when game begins
    renderCharacters(characters, "#character-section");

    //On click event to select character
    $(document).on("click", ".character", function() {
        //Saves clicked character name
        var name = $(this).attr("data-name");
        

        //If a player has not yet been chosen...
        if (!currSelectedCharacter) {

            currSelectedCharacter = characters[name];
            
            //We then loop through remaining characters...
            for (var key in characters) {
                if (key !== name) {
                    combatants.push(characters[key]);
                }
            }
            console.log(combatants);

            $("#character-section").hide();

            renderCharacters(currSelectedCharacter, "#selected-character");
            renderCharacters(combatants, "#available-to-attack-section");
            
        }
    });

    //When you click the attack button run the following function
    $("#attack-button").on("click", function(){

        if($("#defender").children().length !== 0){

            //creates message for our attack and our opponents counter
            var attackMessage = "You attacked " + currDefender.name + "for " + (currSelectedCharacter.attack * turnCounter) + " damage.";
            renderMessage("clearMessage");
            
            //Creates message for our attack and counter attack
            var counterAttackMessage = currDefender.name + " responded to your attack " + currDefender.enemyAttackBack + "damage.";
            renderMessage("clearMessage");
            
            //reduce defender's health by your attack value
            currDefender.health -= (currSelectedCharacter.attack * turnCounter);
            

            //if the enemy still has health...
            if(currDefender.health > 0){

                //render the enemy's updated health stats
                renderCharacters(currDefender, "playerDamage");

                //Render Combat Message
                renderMessage(attackMessage);
                renderMessage(counterAttackMessage);

                //reduce your health by enemey attack
                currSelectedCharacter.health -= currDefender.enemyAttackBack;

                //Update selected player's health after attack
                renderCharacters(currSelectedCharacter, "enemyDamage");

                if(currSelectedCharacter.health <= 0){
                    renderMessage("clearMessage");
                    restartGame("You have been defeated!!! GAME OVER!!!");
                    $("#attack-button").unbind("click");

                } 

            }
            
            else{
                //Remove enemy character card...
                renderCharacters(currDefender, "enemyDefeated");

                //Increment killCount
                killCount++;
                if(killCount >= 4){
                renderMessage("clearMessage");
                restartGame("You Won!!!! Phrasing!!!")
            }

        }
        }
        //If the enemy health reaches less than equal to 0
        

        turnCounter++; 
    });

});