let particle = stampit({
    x: 0,
    y: 0,
    color: '#000',
    destroyed: false,
    draw: function draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, config.cellSize, config.cellSize);
        ctx.stroke();
    }
});
