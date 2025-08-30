class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }

    preload() {
        this.load.image("logo", "assets/logo.png");
        this.load.audio("menuMusic", "../assets/menu.mp3"); // un nivel arriba
        this.load.audio("announcer", "../assets/announcer.wav"); // voz del presentador
    }

    create() {
        this.cameras.main.setBackgroundColor("#8f43f9");
        // paleta de colores: #f9e943 amarillo  #43adf9 celeste  #8f43f9 morado

        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2 - 100;

        // música al inicio
        this.menuMusic = this.sound.add("menuMusic", {
            loop: true,
            volume: 0.5
        });
        this.menuMusic.play();

        const logo = this.add.image(centerX, -200, "logo");
        logo.setOrigin(0.5);
        logo.setScale(1.5);

        this.tweens.add({
            targets: logo,
            y: centerY,
            duration: 326,
            ease: "Bounce.easeOut",
            onComplete: () => {
                // reproducir la voz del presentador cuando cae el logo
                this.sound.play("announcer", { volume: 1 });

                // animación de balanceo del logo
                this.tweens.add({
                    targets: logo,
                    angle: { from: -5, to: 5 },
                    duration: 326,
                    yoyo: true,
                    repeat: -1,
                    ease: "Sine.easeInOut"
                });

                // texto START
                const jugarText = this.add.text(
                    centerX,
                    this.scale.height / 2 + 400,
                    "START",
                    {
                        fontFamily: '"Press Start 2P"',
                        fontSize: "32px",
                        color: "#000"
                    }
                );
                jugarText.setOrigin(0.5);

                // parpadeo del texto START
                this.tweens.add({
                    targets: jugarText,
                    alpha: { from: 1, to: 0 },
                    duration: 600,
                    yoyo: true,
                    repeat: -1
                });

                // interacción del click/tap para iniciar el juego
                this.input.once("pointerdown", () => {
                    this.tweens.killTweensOf(logo);
                    this.tweens.killTweensOf(jugarText);

                    this.tweens.add({
                        targets: jugarText,
                        alpha: 0,
                        duration: 300,
                        onComplete: () => {
                            jugarText.destroy();
                        }
                    });

                    const flash = this.add
                        .rectangle(
                            0,
                            0,
                            this.scale.width,
                            this.scale.height,
                            0xffffff
                        )
                        .setOrigin(0)
                        .setAlpha(0);

                    this.tweens.add({
                        targets: flash,
                        alpha: { from: 0, to: 1 },
                        duration: 200,
                        yoyo: true,
                        onComplete: () => {
                            this.time.delayedCall(500, () => {
                                this.scene.start("MapScene");
                            });
                        }
                    });
                });
            }
        });
    }
}