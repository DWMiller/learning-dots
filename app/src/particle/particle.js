import stampit from 'stampit';

module.exports = stampit().props({
  x: 0,
  y: 0,
  type: 'particle',
  color: '#000',
  destroyed: false,
}).methods({
  setDestroyed() {
    this.destroyed = true;
  },
  draw(ctx, config) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, config.scale, config.scale);
    ctx.stroke();
  },
}).init(function ({ x, y, color }) {
  this.x = x || this.x;
  this.y = y || this.y;
  this.color = color || this.color;
});
