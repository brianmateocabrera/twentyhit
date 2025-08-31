const config = {
  type: Phaser.AUTO,
  width: 720,
  height: 1280,
  backgroundColor: '#000',
  scene: [StartScene, MenuScene, GameScene]
};

const game = new Phaser.Game(config);
