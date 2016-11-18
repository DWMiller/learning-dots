module.exports = {
  clear(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  },
  blurClear(ctx) {
    const originalColour = ctx.fillStyle;
    ctx.fillStyle = 'rgba(22, 31, 40,0.05)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = originalColour;
  },
  setCanvasSize(ctx, { w, h }) {
    ctx.canvas.width = w;
    ctx.canvas.height = h;
  },
  fillBackground(ctx, color) {
    const originalColour = ctx.fillStyle;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.stroke();
    ctx.fillStyle = originalColour;
  },

};
