/* KNOWN BUGS
- Lag as time goes on, potentially caused by the canvas text
- Pause menu can only be triggered once. This is an issue I have also seen in phaser's own pause/resume sample code, and with other students. 
I can only assume it's a phaser bug.

*/

/*
Basic idea:

Catnip as currency
Click catnip to manually get catnip
Buy cats to increase catnip production
Cats appear on screen when you buy them if we have time (i can draw them)
(maybe add meowing or purring side effect when buying. for whimsy)
Three tiers of cats
--Orange cat: increases production rate by 1 catnip a second
--Black cat: increases production rate by 3 catnip a second
--Tortie cat: increases production rate by 10 catnip a second
-profit

TO DO:

Create and shift around the UI
Implement Three tiers of cat instead of just one
Figure out price scaling with the cats
Find out how to calculate production rate
Cat balancing (cost and production)

*/


class Play extends Phaser.Scene{ //creating js class 'menu' that extends phaser's predef scene object
    constructor() // The constructor (a special method for creating and initializing an object) uses
    {             // the "super" keyword to call the constructor of the super class
        super("playScene");
    }

    preload() {
      // load images/tile sprites
        this.load.image('map', './assets/protobg.png'); // background
        this.load.image('catnipClickable', './assets/catnip.PNG'); // catnip
      }
      
    create(){


        // place background
        this.bgArt = this.add.tileSprite(0, 0, 1280, 1281, 'map').setOrigin(0, 0); // background set
        this.orangeCat = this.physics.add.group({ key: 'enemy', frame: 0, repeat: 90, setXY: { x: 100000, y: 100000,stepY: 40} }); // Set orangeCat
        this.blackCat = this.physics.add.group({ key: 'enemy', frame: 0, repeat: 90, setXY: { x: 100000, y: 100000,stepY: 40} }); // Set blackCat
        this.tortieCat = this.physics.add.group({ key: 'enemy', frame: 0, repeat: 90, setXY: { x: 100000, y: 100000,stepY: 40} }); // Set tortieCat
        // cats?



        // Money text-- catnip as currency
        this.moneyText = this.add.text(100, 100, "Catnip: " + Math.floor(this.money), { fill: '#0f0' });
        this.money = 0;

        // Click catnipClickable to get money
        this.catnipClickable = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height/2, 'catnipClickable');
        this.catnipClickable.setInteractive();
        this.catnipClickable.on('pointerdown', () => {this.money++});


        this.prodRate = 0; // Production rate
        this.catnipMultiplier = 1; // cat multiplier
        // will need to code a way to keep track of the production rate between three different kinds of cats

        //this.multiplierNeeded = 5; // Workers needed to sacrifice for multiplier to take effect
        //this.multiplierProgress = 0; // Current amount of multiplier needed
        this.prodRateText = this.add.text(800, 150, 'Production Rate: ' + this.prodRate + ' dollars per second', { fill: '#0f0' });


        this.workersOnBoard = 0; // orangeCats on screen

        // Buy and Sell Buttons, text
        this.buyButton = this.add.text(800, 100, 'Buy Cat for ' + this.workerCost,{ fill: '#0f0' });
        this.workerNumText = this.add.text(100, 150, '# Cats: ' + this.workersOnBoard, { fill: '#0f0' });
        this.buyButton.setInteractive();
        this.buyButton.on('pointerdown', () => this.spawnCat(this.orangeCat,Phaser.Math.Between(40, 1200),Phaser.Math.Between(40, 1200))); // has to be in create or it keeps stacking


        // Defining keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        

     }

     update() {

      if (Phaser.Input.Keyboard.JustDown(keyP)) { // Pause menu
        this.scene.launch("pauseScene");
        this.scene.pause();
      }
        
        this.moneyText.text =  "Catnip: " + Math.floor(this.money);
        this.buyButton.text = "Buy Cat for " + this.workerCost;
        this.workerNumText.text = '# Cats: ' + this.workersOnBoard;
        this.prodRateText.text = 'Production Rate: ' + this.prodRate + ' dollars per second';

        this.catnipClickable.x = this.sys.game.config.width / 2; // trying to get catnipClickable to appear on screeen
        this.catnipClickable.y = this.sys.game.config.height / 2;
        


        if(Phaser.Input.Keyboard.JustDown(keyR)) {
          this.scene.restart();
        }



        // for every member of the group
        this.onScreen = 0;
        for(var i = 0; i < this.orangeCat.getLength();i++)
        {
          //console.log(this.orangeCat.getChildren()[i].y);
          if(this.orangeCat.getChildren()[i].y <= 1200 && this.orangeCat.getChildren()[i].x <= 1200) // figure out how to stop using hardcoded magic numbers
          {
              this.money+=0.02 * this.catnipMultiplier;
              //console.log(Math.floor(this.money));
              this.onScreen+=1;
          }
        }
        this.prodRate = this.catnipMultiplier*this.onScreen; //calculating production rate
        // whoops, have to redo the multipler
          // if the cat is on the map
            // generate money every five seconds

      }


      // Spawns cat
      spawnCat(group,x,y){

        for(var i = 0; i < this.orangeCat.getLength();i++)
        {
          //console.log(this.orangeCat.getChildren()[i].y);

          if(group.getChildren()[i].y >= 1200 && group.getChildren()[i].x >= 1200 && this.money >= this.workerCost) // figure out how to stop using hardcoded magic numbers dude
          {
            group.getChildren()[i].y = y;
            group.getChildren()[i].x = x;
            this.money-=this.workerCost;
            this.workersOnBoard += 1;
            this.workerCost+=10;
            this.workerSell+=5; //find a formula for these later maybe, i want it to scale
            break;
          }
        }


      }


      
}