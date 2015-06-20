let obstacle = stampit({
    color: '#FFF',
    type: 'obstacle',
    draw: function draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, config.cellSize, config.cellSize);
        ctx.stroke();
    }
});
