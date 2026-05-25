class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 650; //400
        this.NOJETACCELERATION = 900;
        this.JETACCELERATION = 280; //320
        this.velocityCap = 450; //idk how itll be implemented yet

        this.DRAG = 500;    // DRAG < ACCELERATION = icy slide //500
        this.NOJETDRAG = 500;
        this.JETDRAG = 500;
        this.physics.world.gravity.y = 1500; //1500, alt 1200

        this.JUMP_VELOCITY = -310; //-600
        this.NOJETJUMP_VELOCITY = -380; //-310
        this.JETJUMP_VELOCITY = -700; //-700

        this.PARTICLE_VELOCITY = 50;
        this.NOJETPARTICLE_VELOCITY = 50;
        this.JETPARTICLE_VELOCITY = 50;

        this.SCALE = 2.0;
    }

    create() {
        //very important go to section thurs in order to get code for completing section
        //added audio
        //this.load.audio('jetpackJump', 'explosionCrunch_000.ogg');
        //this.load.audio('hover', 'assets/spaceEngineLow_000.ogg');


        //State machine variables
        this.state = Object ({
            Idle: 'Idle',
            Running: 'Running',
            Jumping: 'Jumping',
            Falling: 'Falling',
            Hovering: 'Hovering'
            //hovering? //yes cause jumping off jetpack will be annoying
        });

        this.playerState = this.state.Idle;

        this.hasJetpack = false;

        this.label = this.add.text(100, 100, this.hasJetpack, {  //this.playerState
        fontFamily: 'Arial', 
        fontSize: '12px', 
        color: '#ffffff' 
        });

        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 45, 25);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        // TODO: Add createFromObjects here //for coins
        
        

        // TODO: Add turn into Arcade Physics here //for coins also
        

        // add jetpack sprite
        my.sprite.jetpack = this.add.sprite(50, 350, 'jetpack');
        my.sprite.jetpack.setDepth(1);
        my.sprite.jetpack.scale *= 1.25;

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(30, 345, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.player.setDepth(2);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // TODO: Add coin collision handler
        

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');
        this.cKey = this.input.keyboard.addKey('C');

        this.wKey = this.input.keyboard.addKey('W');
        this.aKey = this.input.keyboard.addKey('A');
        this.sKey = this.input.keyboard.addKey('S');
        this.dKey = this.input.keyboard.addKey('D');

        // debug key listener (assigned to D key)
        //this.input.keyboard.on('keydown-C', () => {
        //    this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
        //    this.physics.world.debugGraphic.clear()
        //}, this);
        this.physics.world.drawDebug = false;
        this.physics.world.debugGraphic.clear();

        //this.input.keyboard.on('keydown-S', () => {
        //    this.hasJetpack = this.hasJetpack ? false : true
        //}, this);

        // TODO: Add movement vfx here
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            // TODO: Try: add random: true
            //random: true,
            scale: {start: 0.03, end: 0.1}, //0.03, 0.1
            // TODO: Try: maxAliveParticles: 8,
            //maxAliveParticles: 8,
            lifespan: 250, //350
            // TODO: Try: gravityY: -400,
            gravityY: -50,
            frequency: 75,
            alpha: {start: 1, end: 0.1}, 
        });
        my.vfx.walking.setDepth(-1);

        my.vfx.walking.stop();
        //        my.vfx.flame = this.add.particles(0, 0, "kenny-particles", {

        my.vfx.flame = this.add.particles(0, 0, 'flame1', {
            //frame: ['smoke_04.png', 'smoke_05.png'], //4 5
            scale: {start: 0.03, end: 0.1},
            lifespan: 250,
            gravityY: 50, //50
            frequency: 55, //55
            alpha: {start: 1, end: 0.1},
            speedY: 120 //100

        });

        my.vfx.flameWash = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_04.png', 'smoke_05.png'],
            scale: {start: 0.03, end: 0.1},
            lifespan: 250,
            //speed: { min: 50, max: 100 },
            speedX: {min: -200, max: 200 },
            speedY: {min: -20, max: -5},
            //angle: { min: 160, max: 380 },
            gravityY: -250,
            frequency: 55, //75
            alpha: {start: 1, end: 0.1}
        });

        my.vfx.hover = this.add.particles (0, 0, 'flame1', {
            scale: {start: 0.04, end: 0.08},
            lifespan: 70,
            gravityY: 500,
            frequency: 110, //75
            alpha: {start: 1, end: 0.1},
            angle: {min: 80, max: 100},
            speedY: 900
        })

        // TODO: add camera code here
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

        this.facingLeft = false;
        this.dropped = true;

        //this.playerAndJetpack.add([my.sprite.player, my.sprite.jetpack]) //(for moving both without delay)


        this.events.on('prerender', this.preRender, this); //used for syncing jetpack and player
                                                            //https://phaser.io/sandbox/XuEw4pCW

                            
    }
    //for water, add a water property to water tiles in tiled

    update(time, delta) {
        this.label.x = my.sprite.player.x + 15;
        this.label.y = my.sprite.player.y - 30;
        this.label.setText(this.playerState);

        
        //when player dies, launch sprite in opposite direction, rotate sprite similar to minecraft death anim


        if (my.sprite.player.body.blocked.down) {
            if (my.sprite.player.flipX == true) { //was my.sprite.player.body.velocity.x > 0
                this.facingLeft = true;
            } else if (my.sprite.player.flipX == false) {
                this.facingLeft = false;
            }
        }
        if ((!my.sprite.player.body.blocked.down) && (this.hasJetpack == true)) {
            my.sprite.player.body.velocity.x = Phaser.Math.Clamp(my.sprite.player.body.velocity.x, -300, 300);
        } else {
            my.sprite.player.body.velocity.x = Phaser.Math.Clamp(my.sprite.player.body.velocity.x, -this.velocityCap, this.velocityCap);
        }

        //if player is next to jetpack (and on ground), allow sKey press switch jetpack
        //if player is on ground and has jetpack, allow sKey press switch jetpack
            //place jetpack object on players location
        if ((Phaser.Input.Keyboard.JustDown(this.sKey)) && (my.sprite.player.body.blocked.down) ){
            if (this.collides(my.sprite.player, my.sprite.jetpack)) {
                this.hasJetpack = this.hasJetpack ? false : true
            }
        }


        //if jetpack true make jump available at any time
        //hovering only available when jumping state or falling when previous state is jumping
        if (this.hasJetpack == true) {
            
            this.ACCELERATION = this.JETACCELERATION;
            this.JUMP_VELOCITY = this.JETJUMP_VELOCITY;
            this.PARTICLE_VELOCITY = this.JETPARTICLE_VELOCITY;
            my.sprite.player.angle = my.sprite.player.body.velocity.x * 0.1;
            //...angle += my... causes a very funny effect, player rolls around
            my.vfx.walking.frequency = 200;
            this.dropped = false;

        } else if (this.hasJetpack == false) {
            this.ACCELERATION = this.NOJETACCELERATION;
            this.JUMP_VELOCITY = this.NOJETJUMP_VELOCITY;
            this.PARTICLE_VELOCITY = this.NOJETPARTICLE_VELOCITY;
            my.sprite.player.angle = 0;
            my.sprite.jetpack.angle = 0;
            if (this.dropped == false) {
                this.dropped = true;
                my.sprite.jetpack.y += 5;
            }
            my.vfx.walking.frequency = 75;
        }

        if ((cursors.left.isDown) || (this.aKey.isDown)) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION * delta / 17);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            my.sprite.player.anims.timeScale = 1;
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground
            //if (this.hasJetpack == false) {
             //   if (my.sprite.player.body.blocked.down) {
            //        my.vfx.walking.start();
            //    } else {
             //       my.vfx.walking.stop();
            //    }
            //}

            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            } else {
                my.vfx.walking.stop();
            }
        } else if ((cursors.right.isDown) || (this.dKey.isDown)) {
            my.sprite.player.setAccelerationX(this.ACCELERATION * delta / 17);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            my.sprite.player.anims.timeScale = 1;
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            } else {
                my.vfx.walking.stop();
            }

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            if (my.sprite.player.body.velocity.x == 0) {
                my.sprite.player.anims.play('idle');
                if(my.sprite.player.body.blocked.down) {
                    this.playerState = this.state.Idle;
                }
                //this.playerState = this.state.Idle;
            }
            // TODO: have the vfx stop playing
            my.sprite.player.anims.timeScale = 0.5;
            my.vfx.walking.stop();
        }

        if (my.sprite.player.body.velocity.y > 0) {
            this.playerState = this.state.Falling;
        }
        if ((my.sprite.player.body.velocity.y > -40) && (this.playerState != this.state.Hovering)){
            my.vfx.flame.stop();
        }

        //rework animations so that if player is on floor and velocity x is not 0, play run anim
        if((my.sprite.player.body.blocked.down) && (my.sprite.player.body.velocity.x != 0)){
            this.playerState = this.state.Running;
            my.sprite.player.anims.play('walk', true);
        }
        
        //


        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && ((Phaser.Input.Keyboard.JustDown(cursors.up)) || (Phaser.Input.Keyboard.JustDown(this.wKey)))) {
            if (this.playerState != this.state.Hovering) { //doesnt work
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY * delta / 17);
                this.playerState = this.state.Jumping;
                if (this.hasJetpack == true) {
                    my.vfx.flame.startFollow(my.sprite.jetpack, my.sprite.jetpack.displayWidth/2-10, my.sprite.jetpack.displayHeight/2-5, false);
                    my.vfx.flame.start();
                    //my.vfx.flameWash.explode(3);
                }
                my.vfx.walking.explode(3);
            }
        }

        if ((!my.sprite.player.body.blocked.down) && (my.sprite.player.body.velocity.y > 0) && (this.hasJetpack == true) && (this.wKey.isDown)) {
            //my.sprite.player.body.velocity.y = 0;
            this.physics.world.gravity.y *= 0.5;
            this.playerState = this.state.Hovering;
        } else {
            this.physics.world.gravity.y = 1500;
        }


        if ((this.hasJetpack == true) && (my.sprite.player.body.velocity.y > 0) && (this.wKey.isDown)) {
            let lineX = my.sprite.player.x;
            let lineY = my.sprite.player.y;
            let groundY = this.sys.game.config.height;
            for (let checkY = lineY; checkY < 900; checkY += 10) {
                let tile = this.groundLayer.getTileAtWorldXY(lineX, checkY);
    
                // Check if tile exists and has collision enabled
                if (tile && tile.properties && tile.properties.collides === true) { 
                    groundY = tile.getTop(); 
                    break; 
                } 
            }
            let relativeOffsetY = groundY - my.sprite.jetpack.y;
            let relativeOffsetX = (my.sprite.jetpack.displayWidth / 2) - 10;

            // Follow the jetpack X, but dynamically push the Y position down to the ground level
            my.vfx.flameWash.startFollow(my.sprite.jetpack, relativeOffsetX, relativeOffsetY, false);
    
            // Only call start() if the particle manager isn't already emitting to save CPU cycles
            //this.label.setText(groundY- my.sprite.player.y);
            if ((groundY - my.sprite.player.y) < 110) {
                if (!my.vfx.flameWash.emitting) {
                    my.vfx.flameWash.start(); 
                }
            } else {
                my.vfx.flameWash.stop();
            }

            my.vfx.hover.startFollow(my.sprite.jetpack, my.sprite.jetpack.displayWidth/2-10, my.sprite.jetpack.displayHeight/2-5, false)

            if ((groundY - my.sprite.player.y) > 55) { //60
                if (!my.vfx.hover.emitting) {
                    my.vfx.hover.start();
                }
            } else {
                my.vfx.hover.stop();
            }
            
        } else {
            my.vfx.flameWash.stop();
            my.vfx.hover.stop();
        }
        

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
    }
    preRender(){
        if (this.hasJetpack == true) {
            if (this.facingLeft == true) {
                my.sprite.jetpack.x = my.sprite.player.x - 5;
            } else if (this.facingLeft == false) {
                my.sprite.jetpack.x = my.sprite.player.x + 5;
            }
            my.sprite.jetpack.y = my.sprite.player.y - 5;
            my.sprite.jetpack.angle = my.sprite.player.body.velocity.x * 0.1;
        }
    }
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }
}