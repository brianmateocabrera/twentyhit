class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }

    preload() {
        this.load.image("logo", "assets/logo.png");
        this.load.audio("menuMusic", "assets/menu.mp3");
        this.load.audio("announcer", "assets/announcer.wav");
    }

    create() {
        this.cameras.main.setBackgroundColor("#8f43f9");

        const centerX = this.scale.width / 2;
        const line1 = this.scale.height / 3;      // primer tercio: logo
        const line2 = 2 * this.scale.height / 3;  // segundo tercio: START

        // logo
        const logo = this.add.image(centerX, -200, "logo").setOrigin(0.5).setScale(1.5);

        // reproducir música y voz del presentador
        this.menuMusic = this.sound.add("menuMusic", { loop: true, volume: 0.5 });
        this.menuMusic.play();
        this.sound.play("announcer", { volume: 1 });

        // animación caída del logo
        this.tweens.add({
            targets: logo,
            y: line1,
            duration: 326,
            ease: "Bounce.easeOut",
            onComplete: () => {
                // balanceo del logo
                this.tweens.add({
                    targets: logo,
                    angle: { from: -5, to: 5 },
                    duration: 326,
                    yoyo: true,
                    repeat: -1,
                    ease: "Sine.easeInOut"
                });

                // texto START
                const jugarText = this.add.text(centerX, line2, "START", {
                    fontFamily: '"Press Start 2P"',
                    fontSize: "32px",
                    color: "#000"
                }).setOrigin(0.5);

                // parpadeo del texto START
                this.tweens.add({
                    targets: jugarText,
                    alpha: { from: 1, to: 0 },
                    duration: 600,
                    yoyo: true,
                    repeat: -1
                });

                // click/tap para iniciar GameScene
                this.input.once("pointerdown", () => {
                    this.scene.start("GameScene");
                });
            }
        });
    }
}
