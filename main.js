const config = {
  type: Phaser.AUTO,
  width: 720,
  height: 1280,
  backgroundColor: '#fff',
  scene: [MenuScene, MapScene, GameScene]
};

const game = new Phaser.Game(config);