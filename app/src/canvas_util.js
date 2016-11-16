module.exports = {
  clear(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  },
  blurClear(ctx) {
        // this.clear(ctx);
    ctx.fillStyle = 'rgba(140,140,140,0.05)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  },
};
