class MapScene extends Phaser.Scene {
  constructor() {
    super('MapScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#fff');

    // Título
    const title = this.add.text(
      this.scale.width / 2,
      60,
      'SELECCIONA NIVEL',
      {
        fontFamily: '"Press Start 2P"',
        fontSize: '24px',
        color: '#000'
      }
    );
    title.setOrigin(0.5);

    // Configuración del grid
    const cols = 5;
    const rows = 4;
    const totalLevels = 20;

    const startX = 200;   // margen izquierdo
    const startY = 150;   // margen superior
    const cellW = 180;    // ancho entre nodos
    const cellH = 120;    // alto entre nodos

    let level = 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (level > totalLevels) break;

        // Dibujar círculo como nodo de nivel
        const x = startX + c * cellW;
        const y = startY + r * cellH;

        const circle = this.add.circle(x, y, 40, 0xffffff);
        circle.setStrokeStyle(4, 0x000000);

        // Texto del número de nivel
        const text = this.add.text(x, y, level.toString(), {
          fontFamily: '"Press Start 2P"',
          fontSize: '16px',
          color: '#000000'
        });
        text.setOrigin(0.5);

        // Interacción → entrar al juego
        circle.setInteractive({ useHandCursor: true });
        circle.on('pointerdown', () => {
          this.scene.start('GameScene', { level: level });
        });

        level++;
      }
    }

    // Botón volver al menú
    const backText = this.add.text(
      this.scale.width / 2,
      this.scale.height - 60,
      'VOLVER',
      {
        fontFamily: '"Press Start 2P"',
        fontSize: '20px',
        color: '#ff0000'
      }
    );
    backText.setOrigin(0.5);
    backText.setInteractive({ useHandCursor: true });
    backText.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}