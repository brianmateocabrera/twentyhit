class StartScene extends Phaser.Scene {
    constructor() {
        super("StartScene");
    }

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        const startText = this.add.text(centerX, centerY, "TOCA LA PANTALLA PARA COMENZAR", {
            fontFamily: '"Press Start 2P"',
            fontSize: "20px",
            color: "#ffffff"
        });
        startText.setOrigin(0.5);

        this.input.once("pointerdown", () => {
            this.scene.start("MenuScene");
        });
    }
}
